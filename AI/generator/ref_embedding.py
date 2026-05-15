import os
import csv
import torch
import torchvision.transforms as T
from PIL import Image
from wrn import *
from huggingface_hub import hf_hub_download

# Configuration
REPO_ID = "SoftwareJun/wrn-cifar-100-sam"
FILENAME = "ckpt.pth" 

device = "cuda" if torch.cuda.is_available() else "cpu"

transform = T.Compose([
    T.Resize(32),
    T.ToTensor(),
    T.Normalize(mean=[0.5071, 0.4867, 0.4408],
                std=[0.2675, 0.2565, 0.2761]),
])

class Identity(torch.nn.Module):
    def forward(self, x):
        return x


CSV_PATH = "./ref_img.csv"
EMBEDDING_DIR = "./reference_embeddings"


def load_data(csv_path):
    data_list = []
    id_list = []

    with open(csv_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            data_list.append(row["img"])   # make sure column name matches CSV
            id_list.append(row["ID"])

    return data_list, id_list


def save_embedding(emb_dir, img_id, embedding):
    os.makedirs(emb_dir, exist_ok=True)

    if not torch.is_tensor(embedding):
        print(f"❌ Error: {img_id} is not a tensor → {type(embedding)}")
        return

    save_path = os.path.join(emb_dir, f"{img_id}.pt")
    torch.save(embedding.cpu(), save_path)   # move to cpu before saving
    print(f"✅ Saved → {save_path}")


def forward(model, img):
    crop_size = min(img.size)  
    x = T.Compose([
        T.CenterCrop(crop_size),
        transform,
    ])(img).unsqueeze(0).to(device)  
    out = model(x).squeeze(0)
    out = out / out.norm()                        
    return out


def main():

    model = wideresnet()
    model_path = hf_hub_download(repo_id=REPO_ID, filename=FILENAME)
    checkpoint = torch.load(model_path, map_location=device)
    state_dict = checkpoint['net']

    # Strip the 'module.' prefix added by DataParallel
    state_dict = {k.replace('module.', ''): v for k, v in state_dict.items()}

    model.load_state_dict(state_dict)  
    model.fc = Identity()
    model.to(device)
    model.eval()

    data_list, id_list = load_data(CSV_PATH)

    for img_path, img_id in zip(data_list, id_list):
        with torch.no_grad():
            embedding = forward(model, img_path)

        if embedding is None:
            continue

        save_embedding(EMBEDDING_DIR, img_id, embedding)

    print("\n🎉 Done.")


if __name__ == "__main__":
    main()
