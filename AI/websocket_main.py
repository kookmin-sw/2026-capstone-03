import asyncio, json, base64, websockets, torch, io, os, time
from PIL import Image

import torchvision.transforms as T
from modeltest_v2.models.wrn import *
from huggingface_hub import hf_hub_download
REPO_ID = "SoftwareJun/wrn-cifar-100-sam"
FILENAME = "ckpt.pth" 

transform = T.Compose([
    T.Resize(32),
    T.ToTensor(),
    T.Normalize(mean=[0.5071, 0.4867, 0.4408],
                std=[0.2675, 0.2565, 0.2761]),
])

class Identity(torch.nn.Module):
    def forward(self, x):
        return x
    

class PersistentMatcher:
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        print(f"[{time.strftime('%H:%M:%S')}] 모델 로드 중)")

        self.model = wideresnet()
        model_path = hf_hub_download(repo_id=REPO_ID, filename=FILENAME)
        checkpoint = torch.load(model_path, map_location=self.device)
        state_dict = checkpoint['net']

        # Strip the 'module.' prefix added by DataParallel
        state_dict = {k.replace('module.', ''): v for k, v in state_dict.items()}

        self.model.load_state_dict(state_dict)  
        self.model.fc = Identity()
        self.model.to(self.device)
        self.model.eval()

        base_dir = os.path.dirname(os.path.abspath(__file__))
        self.img_dir = os.path.join(base_dir, "img") 
        self.emb_path = os.path.join(self.img_dir, "tar1.pt")
        self.target_emb = torch.load(self.emb_path, map_location=self.device)
        self.match_threshold = 0.80

        print(f"[{time.strftime('%H:%M:%S')}] 서버 준비 완료")

    async def run_forever(self):
        uri = "ws://localhost:5000/ws/python"
        while True:
            try:
                async with websockets.connect(uri, ping_interval=None, max_size=10 * 1024 * 1024) as websocket:
                    print(f"[{time.strftime('%H:%M:%S')}] 백엔드 서버와 연결됨")

                    await websocket.send(json.dumps({
                        "status": "서버연결 성공",
                        "score": 0,
                        "is_match": False
                    }))
                    
                    while True:
                        # 큐에 쌓인 메시지 중 가장 최신 것만 가져옴
                        message = await websocket.recv()
                        
                        try:
                            while True:
                                message = await asyncio.wait_for(websocket.recv(), timeout=0.01)
                        except asyncio.TimeoutError:
                            pass 

                        data = json.loads(message)
                        if 'image' not in data: continue
                        
                        # 영상 분석
                        img_data = base64.b64decode(data['image'].split(',')[1])
                        pil_img = Image.open(io.BytesIO(img_data)).convert("RGB")
                        
                        with torch.no_grad():
                                crop_size = min(pil_img.size)  
                                x = T.Compose([
                                    T.CenterCrop(crop_size),
                                    transform,
                                ])(pil_img).unsqueeze(0).to(self.device)  
                                features = self.model(x).squeeze(0)
                                features = features / features.norm()
                        
                        score = (features @ self.target_emb).item()
                        is_match = score > self.match_threshold

                        result = {
                            "score": float(score),
                            "status": "Holding" if is_match else "Searching", 
                            "is_match": is_match
                        }
                        await websocket.send(json.dumps(result))
                        
                        print(f"[{time.strftime('%H:%M:%S')}] Score: {score:.4f} | Match: {is_match}")
                        await asyncio.sleep(0.5)
            except Exception as e:
                print(f"[{time.strftime('%H:%M:%S')}] 연결 오류: {e} 재시도중")
                await asyncio.sleep(5)

if __name__ == "__main__":
    matcher = PersistentMatcher()
    asyncio.run(matcher.run_forever())
