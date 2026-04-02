import React, { useEffect, useState, useMemo } from 'react';
import { Map, MapMarker, Polygon } from 'react-kakao-maps-sdk';

// 랜드마크 정의
export interface Landmark {
  id: string;
  name: string;
  lat: number;
  lng: number;
  region: string;
  image_url: string;
  stampCollected: boolean;
}
// 전달받을 컴포넌트
interface MapBoardProps {
  landmarks: Landmark[];
  onStampSuccess: (id: string) => void;
  currentUserId: string;
}

// 볼록껍질 알고리즘(O(n)) 점들을 모두 포함하는 가장 바깥쪽 테두리 좌표만 추출
function getConvexHull(points: { lat: number; lng: number }[]) {
  // 점이 3개 미만이면 다각형이 성립안함
  if (points.length < 3) 
    return points;
  // X축 기준 오름차순 동일 시 Y축 기준
  const sorted = [...points].sort((a, b) => a.lng !== b.lng ? a.lng - b.lng : a.lat - b.lat);
  // 외적
  const crossProduct = (a: any, b: any, c: any) => {
    return (b.lng - a.lng) * (c.lat - a.lat) - (b.lat - a.lat) * (c.lng - a.lng);
  };
  // 아래 껍질
  const lower: { lat: number; lng: number }[] = [];
  for (let p of sorted) {
    while (lower.length >= 2 && crossProduct(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) {
      lower.pop();
    }
    lower.push(p);
  }
  // 위 껍질
  const upper: { lat: number; lng: number }[] = [];
  for (let i = sorted.length - 1; i >= 0; i--) {
    let p = sorted[i];
    while (upper.length >= 2 && crossProduct(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) {
      upper.pop();
    }
    upper.push(p);
  }

  lower.pop();
  upper.pop();
  return lower.concat(upper);
}
// 컴포넌트 전달
export default function MapBoard({ landmarks, onStampSuccess, currentUserId }: MapBoardProps) {
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(null);
  // 지도 중심 위도/경도
  const [myLocation, setMyLocation] = useState({ lat: 37.5665, lng: 126.9780 });
  // 스탬프를 얻은 장소만 추출/좌표 그룹화(도 기준)-> 볼록껍질 알고리즘 용
  const groupedPathByRegion = useMemo(() => {
    return landmarks
      
      .filter(lm => lm.stampCollected)
      .reduce((acc, lm) => {
        if (!acc[lm.region]) acc[lm.region] = [];
        acc[lm.region].push({ lat: lm.lat, lng: lm.lng });
        return acc;
      }, {} as Record<string, { lat: number; lng: number }[]>);
  }, [landmarks]);
  // 각 지역 별 전체 랜드마크 수와 획득 스탬프 수 
  const regionStats = useMemo(() => {
    const stats: Record<string, { total: number; collected: number }> = {};
    landmarks.forEach(lm => {
      if (!stats[lm.region]) stats[lm.region] = { total: 0, collected: 0 };
      stats[lm.region].total += 1;
      if (lm.stampCollected) stats[lm.region].collected += 1;
    });
    return stats;
  }, [landmarks]);

  const currentRegionStat = selectedLandmark ? regionStats[selectedLandmark.region] : null;

  // 스탬프 버튼 이벤트
  const handleStamp = async (landmark: Landmark) => {
    if (!currentUserId) return alert('로그인이 필요합니다.');
    try {
      const response = await fetch('http://localhost:5000/api/stamps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId, landmarkId: landmark.id }),
      });
      //성공 시
      if (response.ok) {
        alert(`${landmark.name} 스탬프 획득! 🏆`);
        onStampSuccess(landmark.id);
        setSelectedLandmark(prev => prev ? { ...prev, stampCollected: true } : null);
      }
    } catch (e) { console.error(e); }
  };
  // 전체 화면
  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#f9f9f9', fontFamily: 'sans-serif' }}>
      
      {/* 지도 DIV 현재 66% */}
      <div style={{ width: '100%', height: '66vh', position: 'relative', overflow: 'hidden' }}>
        <Map center={myLocation} style={{ width: '100%', height: '100%' }} level={11}>
          
          {/* 볼록 껍질 다각형 (색 조정가능) */}
          {Object.entries(groupedPathByRegion).map(([region, paths]) => (
            paths.length >= 3 && (
              <Polygon
                key={region}
                path={getConvexHull(paths)}
                strokeWeight={3}
                strokeColor={'#FF5E00'}
                fillColor={'#FF9500'}
                fillOpacity={0.4}
              />
            )
          ))}

          {/* 마커 */}
          {landmarks.map((landmark) => (
            <MapMarker
              key={landmark.id}
              position={{ lat: landmark.lat, lng: landmark.lng }}
              onClick={() => setSelectedLandmark(landmark)}
              image={{
                src: landmark.stampCollected 
                  ? "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png" 
                  : "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png",
                size: { width: 24, height: 35 }
              }}
            />
          ))}
        </Map>

        {/* 정보창 (지도 하단 배치) */}
        {selectedLandmark && (
          <div style={combinedContainerStyle}>
            {/* 지역 진척도 */}
            {currentRegionStat && (
              <div style={compactDashboardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '5px' }}>
                  <span style={{ fontWeight: 'bold' }}>📍 {selectedLandmark.region}</span>
                  <span style={{ color: '#FF5E00', fontWeight: 'bold' }}>{currentRegionStat.collected}/{currentRegionStat.total} 완수</span>
                </div>
                <div style={progressBgStyle}>
                  <div style={{ 
                    ...progressFillStyle, 
                    width: `${(currentRegionStat.collected / currentRegionStat.total) * 100}%`,
                    backgroundColor: currentRegionStat.collected >= 3 ? '#FF5E00' : '#A9E2F3' 
                  }} />
                </div>
              </div>
            )}

            {/* 랜드마크 상세 */}
            <div style={compactModalStyle}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <img src={selectedLandmark.image_url} alt={selectedLandmark.name} style={imageStyle} />
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '1rem', letterSpacing: '-0.5px' }}>{selectedLandmark.name}</h3>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button style={miniBtnStyle} onClick={() => window.open(`https://map.kakao.com/link/to/${selectedLandmark.name},${selectedLandmark.lat},${selectedLandmark.lng}`)}>📍 길찾기</button>
                    <button style={miniBtnStyle} onClick={() => window.open(`https://map.kakao.com/link/search/${selectedLandmark.name} 맛집`)}>🍜 맛집</button>
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                {selectedLandmark.stampCollected ? (
                  <button style={{ ...actionBtnStyle, backgroundColor: '#eee', color: '#888', flex: 2 }} disabled>⭐ 수집 완료</button>
                ) : (
                  <button style={{ ...actionBtnStyle, backgroundColor: '#FF5E00', color: '#fff', flex: 2 }} onClick={() => handleStamp(selectedLandmark)}>🏆 스탬프 찍기</button>
                )}
                <button style={{ ...actionBtnStyle, flex: 1, background: '#fff', border: '1px solid #ddd' }} onClick={() => setSelectedLandmark(null)}>닫기</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: '25px', textAlign: 'center', color: '#999', fontSize: '0.85rem' }}>
        랜드마크를 방문해 스탬프를 얻어 영역을 넓혀보세요!
      </div>
    </div>
  );
}

// CSS
const combinedContainerStyle: React.CSSProperties = { 
  position: 'absolute', 
  bottom: '15px', left: '50%', 
  transform: 'translateX(-50%)', 
  width: '92%', maxWidth: '360px', 
  zIndex: 10, display: 'flex', flexDirection: 'column', gap: '8px' 
};
const compactDashboardStyle: React.CSSProperties = { 
  backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '10px 12px', 
  borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.3)' 
};
const compactModalStyle: React.CSSProperties = { 
  backgroundColor: 'white', padding: '12px', 
  borderRadius: '18px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' 
};
const imageStyle: React.CSSProperties = { 
  width: '75px', height: '75px', 
  objectFit: 'cover', borderRadius: '10px' 
};
const progressBgStyle: React.CSSProperties = {
  width: '100%', height: '5px', 
  background: '#e0e0e0', borderRadius: '3px', overflow: 'hidden' 
};
const progressFillStyle: React.CSSProperties = {
   height: '100%', 
   transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)' 
  };
const actionBtnStyle: React.CSSProperties = { 
  padding: '11px', border: 'none', 
  borderRadius: '10px', cursor: 'pointer', 
  fontWeight: 'bold', fontSize: '0.8rem' 
};
const miniBtnStyle: React.CSSProperties = {
  padding: '6px 10px', border: '1px solid #eee', borderRadius: '6px', 
  background: '#f8f9fa', cursor: 'pointer',
   fontWeight: '500', fontSize: '0.7rem'
};