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

CSV_PATH = "./ref_img.csv"
EMBEDDING_DIR = "./reference_embedding"


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


def process_single_image(img_path):
    print(f"🖼️ Processing: {img_path}")

    if not os.path.exists(img_path):
        print(f"❌ File not found: {img_path}")
        return None

    # load + background removal
    raw_img = Image.open(img_path).convert("RGBA")
    subject_img = remove(raw_img).convert("RGB")

    # preprocess
    inputs = processor(images=subject_img, return_tensors="pt").to(device)

    # inference
    with torch.no_grad():
        outputs = model.get_image_features(**inputs)

    # normalize
    outputs = outputs.pooler_output

    outputs = outputs / outputs.norm(dim=-1, keepdim=True)

    return outputs.squeeze(0)


def main():
    data_list, id_list = load_data(CSV_PATH)

    for img_path, img_id in zip(data_list, id_list):
        embedding = process_single_image(img_path)

        if embedding is None:
            continue

        save_embedding(EMBEDDING_DIR, img_id, embedding)

    print("\n🎉 Done.")


if __name__ == "__main__":
    main()
