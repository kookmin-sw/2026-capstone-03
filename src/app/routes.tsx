import { createBrowserRouter } from 'react-router';
import { Root } from './pages/Root';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { StampCollection } from './pages/StampCollection';
import { SiteDetail } from './pages/SiteDetail';
import { GiftExchange } from './pages/GiftExchange';
// (수정부분)
import { KakaoCallback } from './pages/KakaoCallback';
import { NaverCallback } from './pages/NaverCallback';
import { GoogleCallback } from './pages/GoogleCallback';


export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'stamps', element: <StampCollection /> },
      { index: true, element: <Home /> },
      { path: 'site/:id', element: <SiteDetail /> },
      { path: 'gifts', element: <GiftExchange /> },
      // (수정부분) 로그인 추가
      { path: 'kakaologin', element: <KakaoCallback /> },
      { path: 'naverlogin', element: <NaverCallback /> },
      { path: 'googlelogin', element: <GoogleCallback /> },
    ],
  },
]);