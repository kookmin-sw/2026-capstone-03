
CREATE DATABASE IF NOT EXISTS stamp_tour DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE stamp_tour;

DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS stamps;
DROP TABLE IF EXISTS gifts;
DROP TABLE IF EXISTS landmarks;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
                       id VARCHAR(255) PRIMARY KEY,
                       name VARCHAR(100) NOT NULL,
                       email VARCHAR(255),
                       avatar VARCHAR(255),
                       provider VARCHAR(50),
                       login_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE landmarks (
                           id VARCHAR(50) PRIMARY KEY,
                           name VARCHAR(100) NOT NULL,
                           image_url VARCHAR(500),
                           lat DOUBLE NOT NULL,
                           lng DOUBLE NOT NULL,
                           region VARCHAR(50)
);

CREATE TABLE stamps (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        user_id VARCHAR(255) NOT NULL,
                        landmark_id VARCHAR(50) NOT NULL,
                        collected_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                        FOREIGN KEY (landmark_id) REFERENCES landmarks(id) ON DELETE CASCADE,
                        UNIQUE KEY unique_user_landmark (user_id, landmark_id) 
);

CREATE TABLE gifts (
                       id INT AUTO_INCREMENT PRIMARY KEY,
                       name VARCHAR(100) NOT NULL,
                       required_stamps INT NOT NULL,
                       image_url VARCHAR(500), 
                       is_available BOOLEAN DEFAULT TRUE
);




-- landmark
INSERT INTO landmarks (id, name, image_url, lat, lng, region) VALUES
                                                                                         -- 서울특별시 (1001~)
                                                                                        ('1001', '경복궁', 'https://images.unsplash.com/photo-1644380031300-2af18adec01c?q=80&w=1080', 37.5788, 126.9770, '서울특별시'),
                                                                                        ('1002', '조계사', 'https://images.unsplash.com/photo-1662527982815-1f2d12d183aa?q=80&w=1080', 37.5717, 126.9816, '서울특별시'),
                                                                                        ('1003', '숭례문', 'https://images.unsplash.com/photo-1655212055884-1e785700d10f?q=80&w=1080', 37.5596, 126.9752, '서울특별시'),
                                                                                        ('1004', '한양도성', 'https://images.unsplash.com/photo-1767715517955-903149d3e6d0?q=80&w=1080', 37.5834, 126.9845, '서울특별시'),
                                                                                        ('1005', '창덕궁', 'https://images.unsplash.com/photo-1644380031300-2af18adec01c?q=80&w=1080', 37.5794, 126.9910, '서울특별시'),
                                                                                        ('1006', 'N서울타워', 'https://images.unsplash.com/photo-1590632349780-e32049e78263?q=80&w=1080', 37.5511, 126.9882, '서울특별시'),
                                                                                        ('1007', '롯데월드타워', 'https://images.unsplash.com/photo-1596404988775-6900f9547d95?q=80&w=800', 37.5126, 127.1025, '서울특별시'),
                                                                                        ('1008', '명동성당', 'https://images.unsplash.com/photo-1616782410631-6e8d11d13f57?q=80&w=800', 37.5632, 126.9874, '서울특별시'),
                                                                                        ('1009', '북촌 한옥마을', 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?q=80&w=1080', 37.5826, 126.9836, '서울특별시'),
                                                                                        ('1010', '이화여대 앞 거리', 'https://images.unsplash.com/photo-1590632349780-e32049e78263?q=80&w=1080', 37.5585, 126.9446, '서울특별시'),
                                                                                        ('1011', '광장시장', 'https://images.unsplash.com/photo-1616782410631-6e8d11d13f57?q=80&w=1080', 37.5701, 126.9995, '서울특별시'),
                                                                                        ('1012', '서울 강남역 십자가로', 'https://images.unsplash.com/photo-1596404988775-6900f9547d95?q=80&w=1080', 37.4979, 127.0276, '서울특별시'),
                                                                                        ('1013', '상암 월드컵경기장', 'https://images.unsplash.com/photo-1644380031300-2af18adec01c?q=80&w=1080', 37.5682, 126.8973, '서울특별시'),
                                                                                        ('1014', '여의도 한강공원', 'https://images.unsplash.com/photo-1590632349780-e32049e78263?q=80&w=1080', 37.5284, 126.9345, '서울특별시'),
                                                                                        ('1015', '세종대왕 동상', '/assets/landmarks/statue_sejong.jpg', 37.5728, 126.9768, '서울특별시'),

                                                                                        -- 경기도 (2001~)
                                                                                        ('2001', '수원 화성', 'https://images.unsplash.com/photo-1599659067134-8c46433290b3?q=80&w=1080', 37.2826, 127.0142, '경기도'),
                                                                                        ('2002', '한국민속촌', 'https://images.unsplash.com/photo-1632733796839-84724a275e7a?q=80&w=800', 37.2586, 127.1166, '경기도'),
                                                                                        ('2003', '오이도 빨간등대', 'https://images.unsplash.com/photo-1612977437034-483a02fa5531?q=80&w=1080', 37.3458, 126.6876, '경기도'),
                                                                                        ('2004', '두물머리', 'https://images.unsplash.com/photo-1621258169145-2b4772658c2c?q=80&w=1080', 37.5451, 127.3142, '경기도'),
                                                                                        ('2005', '파주 임진각', 'https://images.unsplash.com/photo-1540960351744-8846be068417?q=80&w=1080', 37.8895, 126.7412, '경기도'),
                                                                                        ('2006', '부천 상동호수공원', 'https://images.unsplash.com/photo-1601618361822-19e346513361?q=80&w=1080', 37.5012, 126.7523, '경기도'),

                                                                                        -- 강원도 (3001~)
                                                                                        ('3001', '낙산사', 'https://images.unsplash.com/photo-1621258169145-2b4772658c2c?q=80&w=1080', 38.1251, 128.6293, '강원도'),
                                                                                        ('3002', '남이섬', 'https://images.unsplash.com/photo-1621258169145-2b4772658c2c?q=80&w=800', 37.7911, 127.5255, '강원도'),
                                                                                        ('3003', '속초 영금정', 'https://images.unsplash.com/photo-1540960351744-8846be068417?q=80&w=1080', 38.2119, 128.6015, '강원도'),
                                                                                        ('3004', '강릉 오죽헌', 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?q=80&w=1080', 37.7792, 128.8785, '강원도'),
                                                                                        ('3005', '대관령 양떼목장', 'https://images.unsplash.com/photo-1632733796839-84724a275e7a?q=80&w=1080', 37.6914, 128.7478, '강원도'),
                                                                                        ('3006', '정동진역', 'https://images.unsplash.com/photo-1614066060010-3882f073d74c?q=80&w=1080', 37.6915, 129.0348, '강원도'),
                                                                                        ('3007', '춘천 소양강 스카이워크', 'https://images.unsplash.com/photo-1601618361822-19e346513361?q=80&w=1080', 37.8936, 127.7214, '강원도'),

                                                                                        -- 경상북도 (4001~)
                                                                                        ('4001', '불국사', 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?q=80&w=1080', 35.7901, 129.3321, '경상북도'),
                                                                                        ('4002', '첨성대', 'https://images.unsplash.com/photo-1624505298165-220050e80456?q=80&w=1080', 35.8347, 129.2190, '경상북도'),
                                                                                        ('4003', '안동 하회마을', 'https://images.unsplash.com/photo-1623916298285-b88934571ac3?q=80&w=800', 36.5392, 128.5186, '경상북도'),
                                                                                        ('4004', '포항 호미곶', 'https://images.unsplash.com/photo-1612977437034-483a02fa5531?q=80&w=1080', 36.0772, 129.5694, '경상북도'),
                                                                                        ('4005', '경주 동궁과 월지', 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?q=80&w=1080', 35.8342, 129.2266, '경상북도'),
                                                                                        ('4006', '영덕 강구항', 'https://images.unsplash.com/photo-1540960351744-8846be068417?q=80&w=1080', 36.3625, 129.3876, '경상북도'),
                                                                                        ('4007', '문경새재 도립공원', 'https://images.unsplash.com/photo-1632733796839-84724a275e7a?q=80&w=1080', 36.7654, 128.0765, '경상북도'),

                                                                                        -- 부산광역시 (5001~)
                                                                                        ('5001', '해동용궁사', 'https://images.unsplash.com/photo-1614066060010-3882f073d74c?q=80&w=1080', 35.1885, 129.2234, '부산광역시'),
                                                                                        ('5002', '감천문화마을', 'https://images.unsplash.com/photo-1649232812046-6819548bd2d0?q=80&w=800', 35.0975, 129.0105, '부산광역시'),
                                                                                        ('5003', '해운대 해수욕장', 'https://images.unsplash.com/photo-1614066060010-3882f073d74c?q=80&w=1080', 35.1587, 129.1604, '부산광역시'),
                                                                                        ('5004', '태종대', 'https://images.unsplash.com/photo-1601618361822-19e346513361?q=80&w=1080', 35.0524, 129.0877, '부산광역시'),

                                                                                        -- 전라남도 (6001~)
                                                                                        ('6001', '여수 돌산대교', 'https://images.unsplash.com/photo-1540960351744-8846be068417?q=80&w=1080', 34.7298, 127.7303, '전라남도'),
                                                                                        ('6002', '순천만국가정원', 'https://images.unsplash.com/photo-1614066060010-3882f073d74c?q=80&w=800', 34.9312, 127.5103, '전라남도'),
                                                                                        ('6003', '목포 갓바위', 'https://images.unsplash.com/photo-1612977437034-483a02fa5531?q=80&w=1080', 34.7934, 126.4254, '전라남도'),
                                                                                        ('6004', '담양 죽녹원', 'https://images.unsplash.com/photo-1621258169145-2b4772658c2c?q=80&w=1080', 35.3285, 126.9854, '전라남도'),
                                                                                        ('6005', '보성 녹차밭', 'https://images.unsplash.com/photo-1632733796839-84724a275e7a?q=80&w=1080', 34.7124, 127.0854, '전라남도'),
                                                                                        ('6006', '진도 신비의 바닷길', 'https://images.unsplash.com/photo-1612977437034-483a02fa5531?q=80&w=1080', 34.4254, 126.3542, '전라남도'),
                                                                                        ('6007', '해남 땅끝마을', 'https://images.unsplash.com/photo-1614066060010-3882f073d74c?q=80&w=1080', 34.3012, 126.5245, '전라남도'),

                                                                                        -- 제주도 (7001~)
                                                                                        ('7001', '성산일출봉', 'https://images.unsplash.com/photo-1612977437034-483a02fa5531?q=80&w=1080', 33.4585, 126.9423, '제주도'),
                                                                                        ('7002', '제주 한라산 백록담', 'https://images.unsplash.com/photo-1612977437034-483a02fa5531?q=80&w=1080', 33.3617, 126.5332, '제주도'),
                                                                                        ('7003', '제주 협재해수욕장', 'https://images.unsplash.com/photo-1614066060010-3882f073d74c?q=80&w=1080', 33.3938, 126.2394, '제주도'),
                                                                                        ('7004', '만장굴', 'https://images.unsplash.com/photo-1540960351744-8846be068417?q=80&w=1080', 33.5284, 126.7712, '제주도'),
                                                                                        ('7005', '서귀포 천지연폭포', 'https://images.unsplash.com/photo-1612977437034-483a02fa5531?q=80&w=1080', 33.2456, 126.5543, '제주도'),

                                                                                        -- 충청남도 (8001~)
                                                                                        ('8001', '공주 공산성', 'https://images.unsplash.com/photo-1632733796839-84724a275e7a?q=80&w=1080', 36.4608, 127.1215, '충청남도'),
                                                                                        ('8002', '태안 꽃지해수욕장', 'https://images.unsplash.com/photo-1612977437034-483a02fa5531?q=80&w=800', 36.5023, 126.3312, '충청남도'),
                                                                                        ('8003', '독립기념관', 'https://images.unsplash.com/photo-1644380031300-2af18adec01c?q=80&w=1080', 36.7836, 127.2231, '충청남도'),
                                                                                        ('8004', '안면도 꽃지할미할아비바위', 'https://images.unsplash.com/photo-1612977437034-483a02fa5531?q=80&w=1080', 36.5024, 126.3315, '충청남도'),
                                                                                        ('8005', '부여 궁남지', 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?q=80&w=1080', 36.2743, 126.9112, '충청남도'),
                                                                                        ('8006', '아산 외암민속마을', 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?q=80&w=1080', 36.7212, 127.0123, '충청남도'),
                                                                                        ('8007', '서천 국립생태원', 'https://images.unsplash.com/photo-1621258169145-2b4772658c2c?q=80&w=1080', 36.0321, 126.7123, '충청남도'),

                                                                                        -- 경상남도 (9001~)
                                                                                        ('9001', '진주성', 'https://images.unsplash.com/photo-1601618361822-19e346513361?q=80&w=1080', 35.1881, 128.0772, '경상남도'),
                                                                                        ('9002', '통영 강구안', 'https://images.unsplash.com/photo-1614066060010-3882f073d74c?q=80&w=1080', 34.8436, 128.4234, '경상남도'),
                                                                                        ('9003', '거제 바람의 언덕', 'https://images.unsplash.com/photo-1601618361822-19e346513361?q=80&w=1080', 34.7936, 128.6754, '경상남도'),
                                                                                        ('9004', '합천 해인사 팔만대장경', 'https://images.unsplash.com/photo-1540960351744-8846be068417?q=80&w=1080', 35.8012, 128.0987, '경상남도'),
                                                                                        ('9005', '남해 독일마을', 'https://images.unsplash.com/photo-1596404988775-6900f9547d95?q=80&w=1080', 34.8012, 128.0123, '경상남도'),

                                                                                        -- 인천광역시 (10001~)
                                                                                        ('10001', '송도 센트럴파크', 'https://images.unsplash.com/photo-1601618361822-19e346513361?q=80&w=800', 37.3917, 126.6385, '인천광역시'),
                                                                                        ('10002', '인천 차이나타운', 'https://images.unsplash.com/photo-1616782410631-6e8d11d13f57?q=80&w=1080', 37.4752, 126.6185, '인천광역시'),
                                                                                        ('10003', '강화도 고인돌공원', 'https://images.unsplash.com/photo-1632733796839-84724a275e7a?q=80&w=1080', 37.7812, 126.4452, '인천광역시'),

                                                                                        -- 전라북도 (11001~)
                                                                                        ('11001', '전주 한옥마을', 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?q=80&w=800', 35.8146, 127.1528, '전라북도'),
                                                                                        ('11002', '군산 근대화거리', 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?q=80&w=1080', 35.9876, 126.7123, '전라북도'),
                                                                                        ('11003', '고창 고인돌유적', 'https://images.unsplash.com/photo-1644380031300-2af18adec01c?q=80&w=1080', 35.4485, 126.6452, '전라북도'),

                                                                                        -- 충청북도 (12001~)
                                                                                        ('12001', '단양 도담삼봉', 'https://images.unsplash.com/photo-1540960351744-8846be068417?q=80&w=800', 36.9926, 128.3491, '충청북도'),
                                                                                        ('12002', '청주 상당산성', 'https://images.unsplash.com/photo-1632733796839-84724a275e7a?q=80&w=1080', 36.6548, 127.5215, '충청북도'),
                                                                                        ('12003', '단양 고수동굴', 'https://images.unsplash.com/photo-1540960351744-8846be068417?q=80&w=1080', 36.9924, 128.3792, '충청북도'),

                                                                                        -- 대전광역시 (13001~)
                                                                                        ('13001', '엑스포과학공원 (한빛탑)', 'https://images.unsplash.com/photo-1644380031300-2af18adec01c?q=80&w=800', 36.3761, 127.3871, '대전광역시'),
                                                                                        ('13002', '대전 계족산 황톳길', 'https://images.unsplash.com/photo-1621258169145-2b4772658c2c?q=80&w=1080', 36.3876, 127.4523, '대전광역시'),

                                                                                        -- 대구광역시 (14001~)
                                                                                        ('14001', '김광석 다시그리기길', 'https://images.unsplash.com/photo-1662527982815-1f2d12d183aa?q=80&w=800', 35.8608, 128.6074, '대구광역시'),
                                                                                        ('14002', '대구 83타워', 'https://images.unsplash.com/photo-1590632349780-e32049e78263?q=80&w=1080', 35.8533, 128.5645, '대구광역시'),

                                                                                        -- 광주광역시 (15001~)
                                                                                        ('15001', '국립아시아문화전당(ACC)', 'https://images.unsplash.com/photo-1655212055884-1e785700d10f?q=80&w=800', 35.1471, 126.9201, '광주광역시'),
                                                                                        ('15002', '광주 무등산 입석대', 'https://images.unsplash.com/photo-1601618361822-19e346513361?q=80&w=1080', 35.1324, 126.9876, '광주광역시'),

                                                                                        -- 울산광역시 (16001~)
                                                                                        ('16001', '울산 간절곶', 'https://images.unsplash.com/photo-1612977437034-483a02fa5531?q=80&w=1080', 35.3621, 129.3582, '울산광역시'),

                                                                                        -- 울릉도 (17001~)
                                                                                        ('17001', '울릉도 성불사', 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?q=80&w=1080', 37.5024, 130.8654, '울릉도'),

                                                                                        -- 독도 (18001~)
                                                                                        ('18001', '독도', 'https://images.unsplash.com/photo-1610912170881-22e37996c5c0?q=80&w=800', 37.2447, 131.8696, '독도');
                                                         
INSERT INTO gifts (name, required_stamps, image_url, is_available) VALUES
                                                                                              ('전통 부채', 3, '🪭', TRUE),
                                                                                              ('문화상품권', 5, '🎫', TRUE)
                                                                                              ('전통 찻잔 세트', 7, '🍵', FALSE),
                                                                                              ('궁중 한과 세트', 10, '🍪', FALSE),
                                                                                              ('한복 체험권', 15, '👘', FALSE);
