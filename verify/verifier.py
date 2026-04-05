import cv2
import torch
import torch.nn as nn
from model import CLIPExtractor, ResNetExtractor, EfficientNetExtractor

EXTRACTORS = {
    "CLIP"         : CLIPExtractor,
    "resnet50"     : ResNetExtractor,
    "efficientnet" : EfficientNetExtractor,
}

class Verifier(nn.Module):
    def __init__(self, feature: str, emb_path: str, threshold: float, device: str = None):
        super().__init__()
        self.device = device or ("cuda" if torch.cuda.is_available() else "cpu")
        self.threshold = threshold

        if feature not in EXTRACTORS:
            raise ValueError(f"Unknown feature '{feature}'. Choose from: {list(EXTRACTORS)}")

        self.extractor = EXTRACTORS[feature](self.device)
        self.extractor.eval()

        self.ref_embedding = torch.load(emb_path, map_location=self.device, weights_only=True)

    def forward(self, x) -> tuple[bool, float]:
        emb   = self.extractor(x)
        score = (emb @ self.ref_embedding.T).item()
        return score > self.threshold, score
