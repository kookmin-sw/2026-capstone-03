import { useNavigate } from 'react-router';
import { Stamp, MapPin } from 'lucide-react';
import { toast } from 'sonner';

// kakao 로그인 설정을 위한 수정(apikey는 .env 만들어서 넣는게 나을지도)
const KAKAO_REST_API_KEY = 'f03731266c0fae4f844f404a0ffc1e10';
const REDIRECT_URI = 'http://localhost:5173/kakaologin';
const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

export function Login() {
  const navigate = useNavigate();

// Login.tsx

const handleLogin = async (user: { id: string; name: string; email: string; avatar: string }) => {
  try {
    // 🌐 1. 백엔드 서버로 로그인 정보 전송 (API 호출)
    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user), // 유저 정보를 JSON으로 변환해서 보냄
    });

    if (!response.ok) {
      throw new Error('서버 응답 에러!');
    }

    const data = await response.json();
    console.log('서버로부터 받은 응답:', data);

    // 💾 2. 기존처럼 로컬 스토리지에도 저장 (성공 시)
    localStorage.setItem('user', JSON.stringify({
      ...user,
      loginAt: new Date().toISOString()
    }));
    
    toast.success('로그인 성공!', {
      description: `${user.name}님, 서버 연결도 완료되었습니다!`
    });

    // 🏠 3. 홈으로 이동
    navigate('/');

  } catch (error) {
    console.error('로그인 실패:', error);
    toast.error('서버 연결 실패', {
      description: '백엔드 서버가 켜져 있는지 확인해 주세요.'
    });
  }
};

  const handleGoogleLogin = () => {
    // Mock Google SSO login
    const mockUser = {
      id: 'google_1',
      name: '홍길동',
      email: 'hong@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop'
    };
    handleLogin(mockUser);
  };

  const handleNaverLogin = () => {
    // Mock Naver SSO login
    const mockUser = {
      id: 'naver_2',
      name: '김민수',
      email: 'kim@naver.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop'
    };
    handleLogin(mockUser);
  };

  const handleKakaoLogin = () => {
    // (수정부분) 바로 카카오 로그인 url로 이동
    window.location.href = KAKAO_AUTH_URL;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4">
              <Stamp className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl mb-2">문화재 스탬프 투어</h1>
            <p className="text-gray-600 flex items-center justify-center gap-2">
              <MapPin className="w-4 h-4" />
              문화재를 방문하고 스탬프를 모으세요
            </p>
          </div>

          <div className="space-y-3 mb-4">
            <button
              onClick={handleKakaoLogin}
              className="w-full bg-[#FEE500] text-[#000000] py-3 px-4 rounded-lg flex items-center justify-center gap-3 hover:bg-[#FDDC3F] transition-colors"
            >
              <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.586 1.793 4.848 4.5 6.364-.196.722-.726 2.667-.833 3.093-.127.506.186.5.39.363.146-.098 2.348-1.613 3.26-2.234C10.127 18.27 11.053 18.5 12 18.5c5.523 0 10-3.477 10-7.5S17.523 3 12 3z"/>
              </svg>
              <span>카카오톡으로 계속하기</span>
            </button>

            <button
              onClick={handleNaverLogin}
              className="w-full bg-[#03C75A] text-white py-3 px-4 rounded-lg flex items-center justify-center gap-3 hover:bg-[#02B350] transition-colors"
            >
              <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.273 12.845L7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z"/>
              </svg>
              <span>네이버로 계속하기</span>
            </button>

            <button
              onClick={handleGoogleLogin}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-lg border border-gray-300 flex items-center justify-center gap-3 transition-colors"
            >
              <svg className="size-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Google로 계속하기</span>
            </button>
          </div>

          {/* Features */}
          
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-xs mt-6">
          로그인하면 서비스 이용약관 및 개인정보 처리방침에 동의하게 됩니다.
        </p>
      </div>
    </div>
  );
}