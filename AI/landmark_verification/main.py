import torch
import torch.nn.functional as F
from transformers import CLIPProcessor, CLIPModel
from PIL import Image


model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

model.eval()


def normalize_l2(v):
    return v / v.norm(dim=-1, keepdim=True)


def get_ref_embedding(path):
    #idk how it works but from DB the argument wil be passed,
    #my job is to make it portable with DB
    return ref_embedding

def get_frames(path):
    #an input
    #same as get_ref_embedding
    return frames

def verify_image(frames, ref_embedding, threshold=0.8):
    #assuming the image is a batch, stacked with frames

    inputs = processor(images=frames, return_tensors="pt")

    with torch.no_grad():
        input_embedding = model.get_image_features(**inputs)

    input_embedding = normalize_l2(input_embedding)

    score = (input_embedding @ ref_embedding.T).item()

    result = score > threshold

    return result, score


def main():

    # compute reference embedding once
    ref_embedding = get_ref_embedding()
    frames = get_frames()

    # now verify another image
    result, score = verify_image(frames, ref_embedding)

    #for threshold testing
    print("Similarity score:", score)

    return {
    "score": score,
    "match": result
    }


if __name__ == "__main__":
    main()
