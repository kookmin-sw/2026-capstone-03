import { useEffect, useRef } from 'react';

export default function CameraPage() {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        let stream: MediaStream;

        const start = async () => {
            stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false,
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }

            // 3초 후 quiz 이동
            setTimeout(() => {
                window.location.href = '/quiz';
            }, 3000);
        };

        start();

        return () => {
            if (stream) {
                stream.getTracks().forEach((t) => t.stop());
            }
        };
    }, []);

    return (
        <div>
            <h1>카메라 인증</h1>
            <video ref={videoRef} autoPlay playsInline />
        </div>
    );
}