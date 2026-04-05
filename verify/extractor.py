import torch
import torch.nn as nn
from torchvision import models
from transformers import CLIPModel, CLIPProcessor

def normalize_l2(v: torch.Tensor) -> torch.Tensor:
    return v / v.norm(dim=-1, keepdim=True)


class CLIPExtractor(nn.Module):
    def __init__(self, device: str):
        super().__init__()
        self.model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32").to(device)
        self.processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
        self.device = device

    def forward(self, pil_image) -> torch.Tensor:
        inputs = self.processor(images=pil_image, return_tensors="pt")
        inputs = {k: v.to(self.device) for k, v in inputs.items()}
        with torch.no_grad():
            emb = self.model.get_image_features(**inputs)
        return normalize_l2(emb)


class ResNetExtractor(nn.Module):
    def __init__(self, device: str):
        super().__init__()
        backbone = models.resnet50(weights=models.ResNet50_Weights.DEFAULT)
        # drop the classification head — we want the 2048-d embedding
        self.model = nn.Sequential(*list(backbone.children())[:-1]).to(device)
        self.device = device

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        with torch.no_grad():
            emb = self.model(x).squeeze(-1).squeeze(-1)
        return normalize_l2(emb)
