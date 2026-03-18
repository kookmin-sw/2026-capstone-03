import React, { useState } from 'react';
import { Map, MapMarker, Polygon } from 'react-kakao-maps-sdk';

// ----------------------------------------------------
// 1. 타입(Type) 설계도 정의하기 (여기가 TS의 핵심!)
// ----------------------------------------------------

// 랜드마크 데이터 모양
interface Landmark {
  id: number;
  name: string;
  lat: number;
  lng: number;
  region: string;
}

// 스탬프 달성률 데이터 모양
interface RegionStampData {
  total: number;
  collected: number;
}

// 지역별 스탬프 모음 데이터 모양 (예: { "경기도": { total: 10, collected: 6 } })
type RegionStamps = Record<string, RegionStampData>;


// ----------------------------------------------------
// 2. 가짜 데이터 세팅 (나중에 백엔드/DB에서 가져올 부분)
// ----------------------------------------------------
const DUMMY_LANDMARKS: Landmark[] = [
  { id: 1, name: '남산서울타워', lat: 37.5511, lng: 126.9882, region: '서울특별시' },
  { id: 2, name: '수원화성', lat: 37.2884, lng: 127.0142, region: '경기도' },
];

const GYEONGGI_POLYGON_PATH = [
  { lat: 37.3, lng: 126.8 }, { lat: 37.4, lng: 127.1 }, { lat: 37.2, lng: 127.2 }
];

// ----------------------------------------------------
// 3. 메인 컴포넌트
// ----------------------------------------------------
export default function MapBoard() {
  // useState에 타입(<Landmark | null>)을 지정해 줌!
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(null);
  const [myLocation, setMyLocation] = useState({ lat: 37.5665, lng: 126.9780 });
  
  const [regionStamps, setRegionStamps] = useState<RegionStamps>({
    '경기도': { total: 10, collected: 6 },
    '서울특별시': { total: 5, collected: 1 },
  });

  // 매개변수 landmark에도 타입을 지정 (landmark: Landmark)
  const handleStamp = (landmark: Landmark) => {
    const isNear = true; // 임시 거리 조건
    if (isNear) {
      alert(`${landmark.name} 스탬프 획득 성공!`);
      // TODO: 스탬프 +1 업데이트 로직 추가
    } else {
      alert('랜드마크 근처로 더 이동해주세요!');
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

        {DUMMY_LANDMARKS.map((landmark) => (
          <MapMarker
            key={landmark.id}
            position={{ lat: landmark.lat, lng: landmark.lng }}
            onClick={() => setSelectedLandmark(landmark)}
          />
        ))}
      </Map>

      {selectedLandmark && (
        <div style={modalStyle}>
          <h3>{selectedLandmark.name}</h3>
          <p>지역: {selectedLandmark.region}</p>
          
          <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
            <button onClick={() => handleDirections(selectedLandmark)}>📍 길찾기</button>
            <button onClick={() => handleStamp(selectedLandmark)}>🏆 스탬프</button>
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

// 모달 스타일 (CSS-in-JS 방식)
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