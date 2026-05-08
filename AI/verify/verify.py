import cv2
import time
import threading
import numpy as np
from PIL import Image
from dataclasses import dataclass
from verifier import Verifier


@dataclass
class MatchState:
    REQUIRED_DURATION : float = 3.0
    score             : float = 0.0
    is_match          : bool  = False
    is_success        : bool  = False
    start_time        : float = None


def load_guide(guide_path: str) -> np.ndarray | None:
    img = cv2.imread(guide_path, cv2.IMREAD_UNCHANGED)
    if img is None:
        print(f"Warning: guide image not found at {guide_path}, skipping overlay.")
    return img


def apply_overlay(frame: np.ndarray, guide_img: np.ndarray | None, progress: float) -> np.ndarray:
    if guide_img is None:
        return frame.copy()
    h, w = frame.shape[:2]
    guide = cv2.resize(guide_img, (w, h), interpolation=cv2.INTER_AREA)
    alpha = (guide[:, :, 3] / 255.0) * (0.25 + 0.55 * progress)
    out   = frame.copy().astype(float)
    for c in range(3):
        out[:, :, c] = frame[:, :, c] * (1.0 - alpha) + guide[:, :, c] * alpha
    return out.astype(frame.dtype)


def load_verifier_async(cfg: dict, container: list, ready_flag: threading.Event) -> None:
    verifier = Verifier(
        feature   = cfg["feature"],
        emb_path  = cfg["emb_path"],
        threshold = cfg["threshold"],
    )
    container.append(verifier)
    ready_flag.set()


def main():
    #이거 argument를 직접 받을 수 있게 바꿔야댐.
    #나머지는 똑같음
    cfg = {
        "feature"    : "CLIP",
        "emb_path"   : "ref/emb/target_emb.pt",
        "guide_path" : "ref/guide/guide_overlay.png",
        "threshold"  : 0.75,
        "infer_every": 5,
    }

    verifier_box = []
    model_ready  = threading.Event()
    threading.Thread(target=load_verifier_async, args=(cfg, verifier_box, model_ready), daemon=True).start()

    guide_img = load_guide(cfg["guide_path"])
    state     = MatchState()

    cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
    if not cap.isOpened():
        raise RuntimeError("Cannot open camera.")

    print("q: quit   r: reset")
    frame_idx = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame_idx += 1
        now = time.time()

        # ── inference ─────────────────────────────────────────────────────────
        if model_ready.is_set() and frame_idx % cfg["infer_every"] == 0:
            pil = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
            state.is_match, state.score = verifier_box[0](pil)

        # ── state ─────────────────────────────────────────────────────────────
        if state.is_success:
            progress = 1.0
            label, color = "SUCCESS", (255, 180, 0)

        elif state.is_match:
            if state.start_time is None:
                state.start_time = now
            elapsed  = now - state.start_time
            progress = min(elapsed / state.REQUIRED_DURATION, 1.0)
            label, color = f"Holding ({elapsed:.1f}s)", (0, 255, 255)
            if elapsed >= state.REQUIRED_DURATION:
                state.is_success = True
                state.start_time = None

        else:
            state.start_time = None
            progress = 0.0
            label, color = "Searching", (0, 0, 255)

        # ── display ───────────────────────────────────────────────────────────
        display = apply_overlay(frame, guide_img, progress)

        if not model_ready.is_set():
            label, color = "Loading...", (0, 255, 255)

        cv2.putText(display, f"{label} ({state.score * 100:.1f}%)", (30, 50),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, color, 2, cv2.LINE_AA)
        cv2.imshow("Verifier", display)

        # ── keys ──────────────────────────────────────────────────────────────
        key = cv2.waitKey(1) & 0xFF
        if key == ord("q"):
            break
        if key == ord("r"):
            state = MatchState()

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
