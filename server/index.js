const express = require('express');
const cors = require('cors');
const mysql = require('mysql2'); // 1. MySQL 패키지 불러오기
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

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});