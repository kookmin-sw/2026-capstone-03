CREATE DATABASE IF NOT EXISTS stamp_tour DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE stamp_tour;

-- 2. 기존 테이블 삭제 (🚨 외래키 충돌 방지를 위해 의존성이 있는 자식 테이블부터 삭제)
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS stamps;
DROP TABLE IF EXISTS gifts;
DROP TABLE IF EXISTS landmarks;
DROP TABLE IF EXISTS users;

-- ==============================================================================
-- 🏗️ 테이블 생성 (Table Creation)
-- ==============================================================================

-- 👤 users 테이블
CREATE TABLE users (
                       id VARCHAR(255) PRIMARY KEY,
                       name VARCHAR(100) NOT NULL,
                       email VARCHAR(255),
                       avatar VARCHAR(255),
                       provider VARCHAR(50),
                       login_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 🗺️ landmarks 테이블
CREATE TABLE landmarks (
                           id VARCHAR(50) PRIMARY KEY,
                           name VARCHAR(100) NOT NULL,
                           description TEXT,
                           image_url VARCHAR(500),
                           lat DOUBLE NOT NULL,
                           lng DOUBLE NOT NULL,
                           region VARCHAR(50),
                           category VARCHAR(50)
);

-- 💮 stamps 테이블 (유저-랜드마크 다대다 연결 및 획득 기록)
CREATE TABLE stamps (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        user_id VARCHAR(255) NOT NULL,
                        landmark_id VARCHAR(50) NOT NULL,
                        collected_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                        FOREIGN KEY (landmark_id) REFERENCES landmarks(id) ON DELETE CASCADE,
                        UNIQUE KEY unique_user_landmark (user_id, landmark_id) -- 💡 중복 스탬프 방지!
);

-- 📝 reviews 테이블
CREATE TABLE reviews (
                         id INT AUTO_INCREMENT PRIMARY KEY,
                         user_id VARCHAR(255) NOT NULL,
                         landmark_id VARCHAR(50) NOT NULL,
                         rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
                         comment TEXT,
                         created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                         FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                         FOREIGN KEY (landmark_id) REFERENCES landmarks(id) ON DELETE CASCADE
);

-- 🎁 gifts 테이블 (보상)
CREATE TABLE gifts (
                       id INT AUTO_INCREMENT PRIMARY KEY,
                       name VARCHAR(100) NOT NULL,
                       description TEXT,
                       required_stamps INT NOT NULL,
                       image_url VARCHAR(500), -- 이모지도 저장 가능
                       is_available BOOLEAN DEFAULT TRUE,
                       category VARCHAR(50)
);

-- ==============================================================================
-- 📥 초기 목업 데이터 삽입 (Mock Data Insertion)
-- ==============================================================================

-- 👤 1. 테스트 유저 3명 삽입
INSERT INTO users (id, name, avatar, provider) VALUES
                                                   ('test_user_1', '김민수', '👤', 'kakao'),
                                                   ('test_user_2', '이지은', '👤', 'naver'),
                                                   ('test_user_3', '박서준', '👤', 'google');

-- 🗺️ 2. 랜드마크 30개 삽입
INSERT INTO landmarks (id, name, description, image_url, lat, lng, region, category) VALUES
                                                                                         ('1', '경복궁', '조선왕조의 정궁으로 1395년에 창건된 궁궐', 'https://images.unsplash.com/photo-1644380031300-2af18adec01c?q=80&w=1080', 37.5788, 126.9770, '서울특별시', '궁궐'),
                                                                                         ('2', '조계사', '대한불교조계종의 총본산으로 도심 속 전통 사찰', 'https://images.unsplash.com/photo-1662527982815-1f2d12d183aa?q=80&w=1080', 37.5717, 126.9816, '서울특별시', '사찰'),
                                                                                         ('3', '숭례문', '서울의 남대문으로 국보 제1호', 'https://images.unsplash.com/photo-1655212055884-1e785700d10f?q=80&w=1080', 37.5596, 126.9752, '서울특별시', '문루'),
                                                                                         ('4', '한양도성', '조선시대 한양을 둘러싼 성곽', 'https://images.unsplash.com/photo-1767715517955-903149d3e6d0?q=80&w=1080', 37.5834, 126.9845, '서울특별시', '성곽'),
                                                                                         ('5', '창덕궁', '유네스코 세계문화유산에 등재된 조선의 궁궐', 'https://images.unsplash.com/photo-1644380031300-2af18adec01c?q=80&w=1080', 37.5794, 126.9910, '서울특별시', '궁궐'),
                                                                                         ('6', 'N서울타워', '서울의 전경을 한눈에 볼 수 있는 남산의 상징적 랜드마크', 'https://images.unsplash.com/photo-1590632349780-e32049e78263?q=80&w=1080', 37.5511, 126.9882, '서울특별시', '전망대'),
                                                                                         ('7', '수원 화성', '조선 정조 시대의 성곽 건축의 꽃, 유네스코 세계문화유산', 'https://images.unsplash.com/photo-1599659067134-8c46433290b3?q=80&w=1080', 37.2826, 127.0142, '경기도', '성곽'),
                                                                                         ('8', '낙산사', '동해가 한눈에 내려다보이는 관음성지 사찰', 'https://images.unsplash.com/photo-1621258169145-2b4772658c2c?q=80&w=1080', 38.1251, 128.6293, '강원도', '사찰'),
                                                                                         ('9', '불국사', '신라 불교 문화의 정수, 다보탑과 석가탑이 있는 곳', 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?q=80&w=1080', 35.7901, 129.3321, '경상북도', '사찰'),
                                                                                         ('10', '첨성대', '동양에서 가장 오래된 천문 관측대', 'https://images.unsplash.com/photo-1624505298165-220050e80456?q=80&w=1080', 35.8347, 129.2190, '경상북도', '유적지'),
                                                                                         ('11', '해동용궁사', '바다 위에 지어진 한국에서 가장 아름다운 사찰', 'https://images.unsplash.com/photo-1614066060010-3882f073d74c?q=80&w=1080', 35.1885, 129.2234, '부산광역시', '사찰'),
                                                                                         ('12', '여수 돌산대교', '밤바다가 아름다운 여수의 상징적인 대교', 'https://images.unsplash.com/photo-1540960351744-8846be068417?q=80&w=1080', 34.7298, 127.7303, '전라남도', '교량'),
                                                                                         ('13', '성산일출봉', '바다 위에 솟아오른 거대한 성채 모양의 화산체', 'https://images.unsplash.com/photo-1612977437034-483a02fa5531?q=80&w=1080', 33.4585, 126.9423, '제주도', '자연'),
                                                                                         ('14', '공주 공산성', '백제 시대의 도읍지를 지키던 산성', 'https://images.unsplash.com/photo-1632733796839-84724a275e7a?q=80&w=1080', 36.4608, 127.1215, '충청남도', '성곽'),
                                                                                         ('15', '진주성', '임진왜란 3대 대첩 중 하나인 진주대첩의 현장', 'https://images.unsplash.com/photo-1601618361822-19e346513361?q=80&w=1080', 35.1881, 128.0772, '경상남도', '성곽'),
                                                                                         ('16', '독도', '대한민국 최동단, 명백한 우리 고유의 영토', 'https://images.unsplash.com/photo-1610912170881-22e37996c5c0?q=80&w=800', 37.2447, 131.8696, '경상북도', '섬/자연'),
                                                                                         ('17', '안동 하회마을', '풍산 류씨가 600여 년간 대대로 살아온 전통 마을', 'https://images.unsplash.com/photo-1623916298285-b88934571ac3?q=80&w=800', 36.5392, 128.5186, '경상북도', '민속마을'),
                                                                                         ('18', '롯데월드타워', '대한민국 최고층 빌딩이자 서울의 마천루', 'https://images.unsplash.com/photo-1596404988775-6900f9547d95?q=80&w=800', 37.5126, 127.1025, '서울특별시', '전망대/복합시설'),
                                                                                         ('19', '명동성당', '한국 가톨릭교회의 상징이자 대표적인 고딕 양식 건축물', 'https://images.unsplash.com/photo-1616782410631-6e8d11d13f57?q=80&w=800', 37.5632, 126.9874, '서울특별시', '성당/건축'),
                                                                                         ('20', '감천문화마을', '산자락을 따라 들어선 파스텔톤 집들이 이루는 정경', 'https://images.unsplash.com/photo-1649232812046-6819548bd2d0?q=80&w=800', 35.0975, 129.0105, '부산광역시', '벽화마을'),
                                                                                         ('21', '한국민속촌', '조선시대 후기의 생활상을 재현한 전통문화 테마파크', 'https://images.unsplash.com/photo-1632733796839-84724a275e7a?q=80&w=800', 37.2586, 127.1166, '경기도', '테마파크/민속'),
                                                                                         ('22', '송도 센트럴파크', '대한민국 최초로 바닷물을 이용한 해수 공원', 'https://images.unsplash.com/photo-1601618361822-19e346513361?q=80&w=800', 37.3917, 126.6385, '인천광역시', '도시공원'),
                                                                                         ('23', '남이섬', '메타세쿼이아 길과 문화예술 행사가 열리는 동화 같은 섬', 'https://images.unsplash.com/photo-1621258169145-2b4772658c2c?q=80&w=800', 37.7911, 127.5255, '강원도', '섬/자연'),
                                                                                         ('24', '전주 한옥마을', '700여 채의 한옥이 군락을 이루는 한옥 주거지', 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?q=80&w=800', 35.8146, 127.1528, '전라북도', '한옥마을'),
                                                                                         ('25', '순천만국가정원', '세계 5대 연안습지인 순천만을 보호하기 위한 국가정원', 'https://images.unsplash.com/photo-1614066060010-3882f073d74c?q=80&w=800', 34.9312, 127.5103, '전라남도', '정원/자연'),
                                                                                         ('26', '단양 도담삼봉', '남한강 상류 한가운데 솟은 세 개의 기암봉우리', 'https://images.unsplash.com/photo-1540960351744-8846be068417?q=80&w=800', 36.9926, 128.3491, '충청북도', '자연명승'),
                                                                                         ('27', '태안 꽃지해수욕장', '서해안 대표 해수욕장, 낙조가 아름다운 곳', 'https://images.unsplash.com/photo-1612977437034-483a02fa5531?q=80&w=800', 36.5023, 126.3312, '충청남도', '해수욕장'),
                                                                                         ('28', '엑스포과학공원 (한빛탑)', '대전 엑스포의 상징이자 대전의 랜드마크', 'https://images.unsplash.com/photo-1644380031300-2af18adec01c?q=80&w=800', 36.3761, 127.3871, '대전광역시', '테마공원'),
                                                                                         ('29', '김광석 다시그리기길', '고 김광석의 삶과 음악을 만나는 벽화 거리', 'https://images.unsplash.com/photo-1662527982815-1f2d12d183aa?q=80&w=800', 35.8608, 128.6074, '대구광역시', '벽화거리'),
                                                                                         ('30', '국립아시아문화전당(ACC)', '아시아의 문화 교류를 위한 세계적 규모의 복합 문화 공간', 'https://images.unsplash.com/photo-1655212055884-1e785700d10f?q=80&w=800', 35.1471, 126.9201, '광주광역시', '복합공간');

-- 📝 3. 리뷰 3개 삽입 (외래키 제약조건 때문에 users와 landmarks가 먼저 있어야 함)
INSERT INTO reviews (user_id, landmark_id, rating, comment) VALUES
                                                                ('test_user_1', '1', 5, '정말 아름다운 궁궐입니다. 특히 경회루의 야경이 멋있어요!'),
                                                                ('test_user_2', '1', 4, '관람객이 많아서 조금 복잡했지만 볼거리가 정말 많습니다.'),
                                                                ('test_user_3', '2', 5, '도심 속에서 평화로운 시간을 보낼 수 있었어요.');

-- 🎁 4. 보상(Gift) 5개 삽입
INSERT INTO gifts (name, description, required_stamps, image_url, is_available, category) VALUES
                                                                                              ('전통 부채', '한국 전통 문양이 그려진 수공예 부채', 3, '🪭', TRUE, '전통공예'),
                                                                                              ('문화상품권', '1만원 문화상품권', 5, '🎫', TRUE, '상품권'),
                                                                                              ('전통 찻잔 세트', '청자 문양의 전통 찻잔 세트', 7, '🍵', FALSE, '전통공예'),
                                                                                              ('궁중 한과 세트', '전통 방식으로 만든 궁중 한과 선물 세트', 10, '🍪', FALSE, '음식'),
                                                                                              ('한복 체험권', '전통 한복 대여 및 촬영 체험권 (1일)', 15, '👘', FALSE, '체험');

-- ==============================================================================
-- ✅ 완료!
-- ==============================================================================