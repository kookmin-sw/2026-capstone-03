import cv2
import torch
from PIL import Image
from transformers import CLIPProcessor, CLIPModel
from rembg import remove 
import os

# 디바이스 
device = "cuda" if torch.cuda.is_available() else "cpu"
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32").to(device)
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
model.eval()

# 타겟경로
IMG_DIR = "img"
TARGET_IMG_PATH = os.path.join(IMG_DIR, "tar.png")      
GUIDE_OVL_PATH = os.path.join(IMG_DIR, "guide_overlay.png") 

def setup_reference(img_path):
    print(f"\n기준 이미지 처리 시작: {img_path}")
    if not os.path.exists(img_path):
        raise FileNotFoundError(f"파일 없음: {img_path}")

    original_img = Image.open(img_path)
    print("배경 제거")
    subjects_only_img = remove(original_img)
    subjects_only_img.save(os.path.join(IMG_DIR, "tar_no_bg.png"))
    inputs = processor(images=subjects_only_img.convert("RGB"), return_tensors="pt").to(device)
    
    with torch.no_grad():
        target_features = model.get_image_features(**inputs)
    
    target_embedding = target_features / target_features.norm(dim=-1, keepdim=True)
    print("이미지 처리 끝")
    return target_embedding

def create_guided_frame(camera_frame, guide_img):
    h, w, _ = camera_frame.shape
    #가이드라인 설정
    resized_guide = cv2.resize(guide_img, (w, h), interpolation=cv2.INTER_AREA)
    guide_rgb = resized_guide[:, :, :3]
    alpha_channel = resized_guide[:, :, 3] / 255.0 
    #불투명도
    global_alpha = 0.25
    adjusted_alpha = alpha_channel * global_alpha

    result_frame = camera_frame.copy()
    for c in range(0, 3):
        result_frame[:, :, c] = (camera_frame[:, :, c] * (1.0 - adjusted_alpha) + 
                                guide_rgb[:, :, c] * adjusted_alpha)
        
    return result_frame


def main():
    try:
        target_emb = setup_reference(TARGET_IMG_PATH)
  
        if not os.path.exists(GUIDE_OVL_PATH):
            print(f"경고: 가이드 이미지가 없어 가이드 없이 실행")
            guide_img = None
        else:
            guide_img = cv2.imread(GUIDE_OVL_PATH, cv2.IMREAD_UNCHANGED)

        cap = cv2.VideoCapture(0)
        if not cap.isOpened():
            raise Exception("카메라 없음")

        print("\n실시간 카메라 시작")
        print("'q'를 누르면 종료")

        frame_count = 0
        score = 0.0
        is_match = False

        while True:
            ret, frame = cap.read()
            if not ret: break
            frame_count += 1
            if guide_img is not None:
                display_frame = create_guided_frame(frame, guide_img)
            else:
                display_frame = frame.copy()
            # 유사도 체크
            if frame_count % 5 == 0:
                img_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                pil_img = Image.fromarray(img_rgb)

                inputs = processor(images=pil_img, return_tensors="pt").to(device)
                with torch.no_grad():
                    curr_features = model.get_image_features(**inputs)
                    curr_features /= curr_features.norm(dim=-1, keepdim=True)
                
                score = (curr_features @ target_emb.T).item()
                is_match = score > 0.75

            status_text = "-good!-" if is_match else "-checking-"
            color = (0, 255, 0) if is_match else (0, 0, 255)

            
            cv2.putText(display_frame, f"{status_text} ({score:.2f})%", (30, 50), 
                        cv2.FONT_HERSHEY_SIMPLEX, 1, color, 2)
            
            h, w, _ = frame.shape

            cv2.imshow("Camera", display_frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

    except Exception as e:
        print(f"\n오류 발생: {e}")
    finally:
        if 'cap' in locals() and cap.isOpened():
            cap.release()
        cv2.destroyAllWindows()
        print("\n프로그램 종료.")

if __name__ == "__main__":
    main()