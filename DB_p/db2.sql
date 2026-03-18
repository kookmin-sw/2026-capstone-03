-- 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS stamp_tour;
USE stamp_tour;

-- 유저 정보를 담을 테이블 생성
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100),
    avatar TEXT,
    login_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
-- 랜드마크 테이블
CREATE TABLE IF NOT EXISTS landmarks (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    lat float,
    lng float,
    region VARCHAR(50)
);

INSERT INTO landmarks (id, name, lat, lng, region) VALUES
(3, '경복궁', 37.5796, 126.9770, '서울특별시'),
(4, '롯데월드타워', 37.5125, 127.1025, '서울특별시'),
(5, '수원 화성', 37.2884, 127.0142, '경기도'),
(6, '강릉 경포대', 37.7950, 128.8961, '강원도'),
(7, '경주 불국사', 35.7900, 129.3321, '경상도'),
(8, '안동 하회마을', 36.5393, 128.5173, '경상도'),
(9, '전주 한옥마을', 35.8147, 127.1526, '전라도'),
(10, '부산 광안대교', 35.1478, 129.1301, '경상도'),
(11, '제주 성산일출봉', 33.4585, 126.9424, '제주도'),
(12, '여수 돌산대교', 34.7296, 127.7303, '전라도');

select * from landmarks;