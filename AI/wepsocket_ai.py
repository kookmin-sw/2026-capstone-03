import asyncio
import websockets
import json
import base64
import torch
import io
import time
import os
from PIL import Image
from transformers import CLIPProcessor, CLIPModel

class PersistentMatcher:
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"

        print(f"[{time.strftime('%H:%M:%S')}] 모델 로드 중")

        self.model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32").to(self.device)
        self.processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
        
        base_dir = os.path.dirname(os.path.abspath(__file__))
        self.img_dir = os.path.join(base_dir, "img") 
        self.emb_path = os.path.join(self.img_dir, "target_emb.pt")
        self.target_emb = torch.load(self.emb_path, map_location=self.device)
        self.match_threshold = 0.75

        print(f"[{time.strftime('%H:%M:%S')}] AI 서버 준비 완료")

    async def run_forever(self):
        uri = "ws://localhost:5000/ws/python"
        
        while True: # 연결이 끊겨도 다시 시도
            try:
                async with websockets.connect(uri, ping_interval=20, ping_timeout=20) as websocket:
                    print("스프링 서버와 연결됨")


                    await websocket.send(json.dumps({
                        "status": "Searching",
                        "score": 0,
                        "is_match": False
                    }))
                    
                    self.match_start_time = None
                    while True:
                        message = await websocket.recv()
                        data = json.loads(message)
                        
                        # 영상 분석 
                        img_data = base64.b64decode(data['image'].split(',')[1])
                        pil_img = Image.open(io.BytesIO(img_data)).convert("RGB")
                        
                        inputs = self.processor(images=pil_img, return_tensors="pt").to(self.device)
                        with torch.no_grad():
                            features = self.model.get_image_features(**inputs)
                            features = features / features.norm(dim=-1, keepdim=True)
                        
                        score = (features @ self.target_emb.T).item()
                        
                        # 결과 전송
                        await websocket.send(json.dumps({
                            "score": score,
                            "is_match": score > self.match_threshold
                        }))

            except Exception as e:
                print(f" 연결 오류: {e}. 5초 후 재시도...")
                await asyncio.sleep(5)

if __name__ == "__main__":
    matcher = PersistentMatcher()
    asyncio.run(matcher.run_forever())