import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router'; 

export default function CameraPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const landmarkId = searchParams.get('id');
    const landmarkName = searchParams.get('name');
    
    
    // 테스트를 위해 임시로 'user123'을 사용
    const currentUserId = "user123"; 

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const socketRef = useRef<WebSocket | null>(null);
    
    const [status, setStatus] = useState("AI 서버 연결 중...");
    const [score, setScore] = useState(0);
    const [isSaving, setIsSaving] = useState(false); 

    useEffect(() => {
        let stream: MediaStream;
        let intervalId: number;

        socketRef.current = new WebSocket('ws://localhost:5000/ws/python');

        socketRef.current.onmessage = async (event) => {
            if (isSaving) return;

            const data = JSON.parse(event.data);
            setScore(data.score);
            setStatus(data.status); // Searching, Holding, Success

            if (data.status === "Success") {
                setIsSaving(true); 
                
                try {
                    const response = await fetch('http://localhost:5000/api/stamps', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            userId: currentUserId, 
                            landmarkId: landmarkId 
                        }),
                    });

                    if (response.ok) {
                        alert(`✨ 인증 성공! ${landmarkName} 스탬프를 획득했습니다.`);
                        navigate('/stamps'); 
                    } else {
                        alert("서버 저장에 실패했습니다.");
                        setIsSaving(false);
                    }
                } catch (e) {
                    console.error("서버 저장 에러:", e);
                    setIsSaving(false);
                }
            }
        };

        const startCamera = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment' }, 
                    audio: false,
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }


                intervalId = window.setInterval(() => {
                    if (videoRef.current && canvasRef.current && socketRef.current?.readyState === WebSocket.OPEN) {
                        const canvas = canvasRef.current;
                        const ctx = canvas.getContext('2d');
                        if (ctx) {
                            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        
                            const imageData = canvas.toDataURL('image/jpeg', 0.5);
                            socketRef.current.send(JSON.stringify({ image: imageData }));
                        }
                    }
                //프레임당 초
                }, 100);
            } catch (err) {
                console.error("카메라를 켤 수 없습니다:", err);
                setStatus("카메라 오류");
            }
        };

        startCamera();

        // 페이지를 나갈 때 카메라와 웹소켓 종료
        return () => {
            if (stream) stream.getTracks().forEach(t => t.stop());
            if (intervalId) window.clearInterval(intervalId);
            if (socketRef.current) socketRef.current.close();
        };
    }, [landmarkId, navigate, isSaving, currentUserId, landmarkName]);

    return (
        <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#000', minHeight: '100vh', color: '#fff' }}>
            <h2 style={{ margin: '10px 0' }}>{landmarkName} 인증 중</h2>
            
            <div style={{ marginBottom: '15px' }}>
                <span style={{ 
                    padding: '5px 15px', 
                    borderRadius: '20px', 
                    backgroundColor: status === 'Holding' ? '#FF5E00' : (status === 'Success' ? '#00FF00' : '#444'),
                    fontWeight: 'bold'
                }}>
                    {status}
                </span>
            </div>

            <p style={{ fontSize: '0.9rem' }}>일치율: <span style={{ color: '#FF5E00' }}>{(score * 100).toFixed(1)}%</span></p>
            
            <div style={{ position: 'relative', display: 'inline-block', width: '100%', maxWidth: '500px', aspectRatio: '3/4', overflow: 'hidden', borderRadius: '15px', border: '2px solid #333' }}>
                <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <canvas ref={canvasRef} width="480" height="640" style={{ display: 'none' }} />
                
                {/* 화면에 투명한 가이드라인 박스 표시 */}
                <div style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '70%', height: '70%',
                    border: '2px dashed rgba(255,255,255,0.5)',
                    borderRadius: '10px',
                    pointerEvents: 'none'
                }}></div>
            </div>

            <div style={{ marginTop: '20px' }}>
                <button 
                    onClick={() => navigate('/stamps')}
                    style={{ padding: '10px 25px', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                >
                    취소하고 돌아가기
                </button>
            </div>
        </div>
    );
}