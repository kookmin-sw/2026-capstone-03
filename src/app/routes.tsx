import { createBrowserRouter } from 'react-router';
import { Root } from './pages/Root';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { StampCollection } from './pages/StampCollection';
import { SiteDetail } from './pages/SiteDetail';
import { GiftExchange } from './pages/GiftExchange';


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
    ],
  },
]);