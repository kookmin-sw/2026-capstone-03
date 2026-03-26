import os
import csv
import torch
from PIL import Image
from transformers import CLIPProcessor, CLIPModel
from rembg import remove

device = "cuda" if torch.cuda.is_available() else "cpu"
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32").to(device)
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
model.eval()

CSV_PATH = "./data.csv"          # single CSV file:  id, name, path
EMBEDDING_DIR = "./reference_embedding"


def load_data(csv_path):
    """
    Reads one CSV file whose columns are: id, name, path
    For each row, records the image path and its id.

    Returns:
        data_list : list of image file paths
        id_list   : list of corresponding ids  e.g. ['id_10', 'id_25']
    """
    data_list = []
    id_list = []

    with open(csv_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)          # expects header: id, name, path
        for row in reader:
            data_list.append(row["path"])
            id_list.append(row["id"])

    return data_list, id_list


def save_embedding(emb_dir, id_list, embeddings):
    """
    Saves each embedding as <emb_dir>/<id>.pt
    id_list   : list of id strings  e.g. ['id_10', 'id_25']
    embeddings: 2-D tensor of shape (N, embedding_dim)
    """
    os.makedirs(emb_dir, exist_ok=True)

    for img_id, emb in zip(id_list, embeddings):
        save_path = os.path.join(emb_dir, f"{img_id}.pt")
        torch.save(emb, save_path)          # saves a 1-D tensor
        print(f"  saved → {save_path}")


def main():
    data_list, id_list = load_data(CSV_PATH)
    print(f"Found {len(data_list)} images.\n")

    batch_size = 32

    for batch_start in range(0, len(data_list), batch_size):
        batch_paths = data_list[batch_start : batch_start + batch_size]
        batch_ids   = id_list  [batch_start : batch_start + batch_size]

        images = []
        for img_path in batch_paths:
            print(f"  배경 제거 중... {img_path}")
            raw_img     = Image.open(img_path).convert("RGBA")
            subject_img = remove(raw_img).convert("RGB")
            images.append(subject_img)

        inputs = processor(images=images, return_tensors="pt").to(device)
        with torch.no_grad():
            features = model.get_image_features(**inputs)

        embeddings = features / features.norm(dim=-1, keepdim=True)  # (N, dim)

        save_embedding(EMBEDDING_DIR, batch_ids, embeddings)

    print("\nDone.")


if __name__ == "__main__":
    main()
