const express = require('express');
const cors = require('cors');
const mysql = require('mysql2'); // 1. MySQL 패키지 불러오기
const axios = require('axios'); // (수정) 카카오 서버와 연결용
require('dotenv').config();

const app = express();
const PORT = 5000;

// 미들웨어 설정
app.use(cors());
app.use(express.json());

// 2. MySQL 연결 설정 (환경 변수 사용)
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME || 'stamp_tour'
});

// 3. DB 연결 실행 및 확인
db.connect((err) => {
  if (err) {
    console.error('❌ MySQL 연결 실패:', err.message);
    return;
  }
  console.log('🐬 MySQL 데이터베이스 연결 성공!');
});

// 테스트용 경로
app.get('/', (req, res) => {
  res.send('서버와 DB가 연결되었습니다!');
});

// 🚀 로그인 API: 데이터를 받아서 DB에 저장(INSERT) 함
app.post('/api/login', (req, res) => {
  const { id, name, email, avatar } = req.body;
  
  console.log('로그인 요청 받음:', name);

  // SQL: 이미 있으면 업데이트, 없으면 새로 저장하는 쿼리
  const sql = `
    INSERT INTO users (id, name, email, avatar, login_at) 
    VALUES (?, ?, ?, ?, NOW())
    ON DUPLICATE KEY UPDATE name = ?, email = ?, avatar = ?, login_at = NOW()
  `;

  const values = [id, name, email, avatar, name, email, avatar];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('❌ DB 저장 에러:', err);
      return res.status(500).json({ error: 'DB 저장 실패' });
    }
    
    console.log('✅ DB 저장 완료:', result.affectedRows > 0 ? '성공' : '변화없음');
    res.status(200).json({
      message: '서버와 DB에 유저 정보가 저장되었습니다.',
      user: { id, name }
    });
  });
});

// (수정) 카카오 소셜 로그인용
app.post('/api/auth/kakao', async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ message: '카카오 인가 코드가 없습니다.' });
  }

  try {
    // 카카오 서버에서 액세스 토큰 받아오기
    const tokenResponse = await axios.post('https://kauth.kakao.com/oauth/token', null, {
      params: {
        grant_type: 'authorization_code',
        client_id: process.env.KAKAO_REST_API_KEY,
        redirect_uri: process.env.KAKAO_REDIRECT_URI,
        code: code,
      },
      headers: { 'Content-type': 'application/x-www-form-urlencoded;charset=utf-8' },
    });

    const accessToken = tokenResponse.data.access_token;

    // 카카오 유저 정보 가져오기
    const userResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    });

    const kakaoData = userResponse.data;

    // DB에 넣기 좋게 데이터 예쁘게 다듬기
    const user = {
      id: `kakao_${kakaoData.id}`, // 기존 id 규격과 맞춤 (예: kakao_12345678)
      name: kakaoData.kakao_account?.profile?.nickname || '카카오유저',
      email: kakaoData.kakao_account?.email || '이메일없음',
      avatar: kakaoData.kakao_account?.profile?.profile_image_url || 'https://via.placeholder.com/150',
    };

    console.log('🟡 카카오 유저 정보 획득:', user.name);

    // ④ 다듬은 정보를 기존과 똑같이 DB에 저장! (기존 로직 완벽 재사용)
    const sql = `
      INSERT INTO users (id, name, email, avatar, login_at) 
      VALUES (?, ?, ?, ?, NOW())
      ON DUPLICATE KEY UPDATE name = ?, email = ?, avatar = ?, login_at = NOW()
    `;

    db.query(sql, [user.id, user.name, user.email, user.avatar, user.name, user.email, user.avatar], (err, result) => {
      if (err) {
        console.error('❌ 카카오 유저 DB 저장 에러:', err);
        return res.status(500).json({ error: 'DB 저장 실패' });
      }

      console.log('✅ 카카오 유저 DB 저장/업데이트 완료!');

      // ⑤ 프론트엔드(KakaoCallback.tsx)로 유저 정보 보내주기
      res.status(200).json({ message: '카카오 로그인 성공', user });
    });

  } catch (error) {
    console.error('❌ 카카오 API 통신 에러:', error.response?.data || error.message);
    res.status(500).json({ error: '카카오 서버 통신 실패' });
  }
});

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});