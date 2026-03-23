import React, { useEffect, useState } from 'react';
import { Map, MapMarker, Polygon } from 'react-kakao-maps-sdk';
import {culturalSites} from '../data/mockData';


interface Landmark {
  id: number;
  name: string;
  lat: number;
  lng: number;
  region: string;
  img: string;
}

interface RegionStampData {
  total: number;
  collected: number;
}

type RegionStamps = Record<string, RegionStampData>;


export const landmarks: Landmark[] = culturalSites.map((site) => ({
  id: Number(site.id), 
  name: site.name,
  lat: site.lat,
  lng: site.lng,
  region: site.region,
  img: site.image
}));
const GYEONGGI_POLYGON_PATH = [
  { lat: 37.3, lng: 126.8 },
  { lat: 37.4, lng: 127.1 },
  { lat: 37.2, lng: 127.2 }
];

export default function MapBoard() {
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(null);
  const [myLocation, setMyLocation] = useState({ lat: 37.5665, lng: 126.9780 });
  
  const [regionStamps, setRegionStamps] = useState<RegionStamps>({
    '경기도': { total: 10, collected: 6 },
    '서울특별시': { total: 5, collected: 1 },
  });

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

  const handleStamp = (landmark: Landmark) => {
    const isNear = true;

    if (!isNear) {
      alert('랜드마크 근처로 더 이동해주세요!');
      return;
    }
    window.location.href = `/camera?name=${encodeURIComponent(landmark.name)}&region=${encodeURIComponent(landmark.region)}&lat=${landmark.lat}&lng=${landmark.lng}`;
    // window.location.href = `/quiz?name=${encodeURIComponent(landmark.name)}&region=${encodeURIComponent(landmark.region)}&lat=${landmark.lat}&lng=${landmark.lng}`;
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
          {/* ✨ 추가: 이미지 표시 */}
          <img 
            src={selectedLandmark.img} 
            alt={selectedLandmark.name} 
            style={imageStyle} 
          />
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
  objectFit: 'cover', // 이미지가 비율 유지하며 꽉 차게
  borderRadius: '8px',
  marginBottom: '15px',
};
