import React, { useEffect, useState } from 'react';
import { Map, MapMarker, Polygon } from 'react-kakao-maps-sdk';

// 💡 1. 부모(Home)와 동일한 타입 정의
export interface Landmark {
  id: string;
  name: string;
  lat: number;
  lng: number;
  region: string;
  image_url: string;
  stampCollected: boolean;
}

interface RegionStampData {
  total: number;
  collected: number;
}

type RegionStamps = Record<string, RegionStampData>;

// 💡 2. 부모(Home)에게서 받을 데이터(Props) 타입 정의
interface MapBoardProps {
  landmarks: Landmark[];
  onStampSuccess: (id: string) => void;
  currentUserId: string;
}

const GYEONGGI_POLYGON_PATH = [
  { lat: 37.3, lng: 126.8 },
  { lat: 37.4, lng: 127.1 },
  { lat: 37.2, lng: 127.2 }
];

// 💡 3. 매개변수(Props)로 landmarks, onStampSuccess, currentUserId 받아오기
export default function MapBoard({ landmarks, onStampSuccess, currentUserId }: MapBoardProps) {
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(null);
  const [myLocation, setMyLocation] = useState({ lat: 37.5665, lng: 126.9780 });

  const [regionStamps, setRegionStamps] = useState<RegionStamps>({
    '경기도': { total: 10, collected: 6 },
    '서울특별시': { total: 5, collected: 1 },
  });

  // URL 파라미터 확인 후 획득 알림 띄우기 (카메라 찍고 돌아왔을 때 등)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const stampEarned = params.get('stampEarned');
    const landmarkName = params.get('name');

    if (stampEarned === '1') {
      alert(`${landmarkName ?? '문화재'} 스탬프 획득 성공! 🏆`);

      params.delete('stampEarned');
      params.delete('name');

      const newQuery = params.toString();
      const newUrl = `${window.location.pathname}${newQuery ? `?${newQuery}` : ''}`;
      window.history.replaceState({}, '', newUrl);
    }
  }, []);

  // 💡 4. 스탬프 찍기 함수 (API 호출 후 부모에게 알림)
  const handleStamp = async (landmark: Landmark) => {
    const isNear = true; // 나중에 GPS 로직 연동

    if (!isNear) {
      alert('랜드마크 근처로 더 이동해주세요!');
      return;
    }

    if (!currentUserId) {
      alert('로그인 정보가 없습니다.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/stamps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId, landmarkId: landmark.id }),
      });

      if (response.ok) {
        alert('스탬프 정보가 DB에 저장되었습니다!');

        onStampSuccess(landmark.id);

        // 현재 열려있는 모달창의 상태도 '수집완료'로 변경
        setSelectedLandmark(prev => prev ? { ...prev, stampCollected: true } : null);

      } else if (response.status === 409) {
        alert('이미 획득한 스탬프입니다!');
      } else {
        alert('스탬프 저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('스탬프 저장 통신 에러:', error);
    }
  };

  const handleDirections = (landmark: Landmark) => {
    const url = `https://map.kakao.com/link/to/${landmark.name},${landmark.lat},${landmark.lng}`;
    window.open(url, '_blank');
  };

  const handleNearbyFood = (landmark: Landmark) => {
    alert(`${landmark.name} 주변 1km 맛집을 검색합니다.`);
  };

  const getPolygonColor = (regionName: string): string => {
    const data = regionStamps[regionName];
    if (!data) return '#888888';

    const percent = (data.collected / data.total) * 100;
    if (percent >= 50) return '#FF5E00';
    return '#A9E2F3';
  };

  return (
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <Map
            center={myLocation}
            style={{ width: '100%', height: '100%' }}
            level={10}
        >
          <Polygon
              path={GYEONGGI_POLYGON_PATH}
              strokeWeight={2}
              strokeColor={'#004c80'}
              strokeOpacity={0.8}
              fillColor={getPolygonColor('경기도')}
              fillOpacity={0.6}
          />

          {/* 부모에게서 받은 landmarks 배열을 순회하며 마커 찍기 */}
          {landmarks.map((landmark) => (
              <MapMarker
                  key={landmark.id}
                  position={{ lat: landmark.lat, lng: landmark.lng }}
                  onClick={() => setSelectedLandmark(landmark)}
              />
          ))}
        </Map>

        {selectedLandmark && (
            <div style={modalStyle}>
              <img
                  src={selectedLandmark.image_url}
                  alt={selectedLandmark.name}
                  style={imageStyle}
              />
              <h3>{selectedLandmark.name}</h3>
              <p>지역: {selectedLandmark.region}</p>

              <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <button onClick={() => handleDirections(selectedLandmark)}>📍 길찾기</button>
                {/* 이미 획득한 스탬프면 버튼을 비활성화하고 텍스트 변경 */}
                {selectedLandmark.stampCollected ? (
                    <button disabled style={{ backgroundColor: '#ccc', cursor: 'not-allowed' }}>⭐ 수집완료</button>
                ) : (
                    <button onClick={() => handleStamp(selectedLandmark)}>🏆 스탬프</button>
                )}
                <button onClick={() => handleNearbyFood(selectedLandmark)}>🍜 맛집</button>
              </div>

              <button
                  style={{ marginTop: '10px', width: '100%' }}
                  onClick={() => setSelectedLandmark(null)}
              >
                닫기
              </button>
            </div>
        )}
      </div>
  );
}

const modalStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: '50px',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  zIndex: 10,
  width: '300px',
};
const imageStyle: React.CSSProperties = {
  width: '100%',
  height: '180px',
  objectFit: 'cover',
  borderRadius: '8px',
  marginBottom: '15px',
};