import { useState } from 'react';
import { Link } from 'react-router'; 
import { MapPin, Star, Navigation as NavigationIcon, ChevronRight, List, Map as MapIcon } from 'lucide-react'; 
import { culturalSites } from '../data/mockData';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import MapBoard from './MapBoard.tsx'; 


export function Home() {
  const [sortBy, setSortBy] = useState<'distance' | 'rating'>('distance');
  
  // 현재 화면이 '목록(list)'인지 '지도(map)'인지 기억 초기값은 'map'!
  const [viewMode, setViewMode] = useState<'list' | 'map'>('map'); 
  
  const sortedSites = [...culturalSites].sort((a, b) => {
    if (sortBy === 'distance') return a.distance - b.distance;
    return b.rating - a.rating;
  });

  const stampCount = culturalSites.filter(s => s.stampCollected).length;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header (스탬프 진행률 - 기존과 동일) */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
        <h1 className="text-2xl font-bold mb-2">문화재 스탬프 투어</h1>
        <p className="text-blue-100">주변 문화재를 방문하고 스탬프를 모으세요</p>
        
        <div className="mt-4 bg-white/20 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm">수집한 스탬프</span>
            <span className="font-bold">{stampCount} / {culturalSites.length}</span>
          </div>
          <div className="w-full bg-white/30 rounded-full h-2">
            <div 
              className="bg-white rounded-full h-2 transition-all"
              style={{ width: `${(stampCount / culturalSites.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* 💡 컨트롤 바 (정렬 버튼 & 화면 전환 버튼) */}
      <div className="bg-white border-b px-4 py-3 flex justify-between items-center">
        
        {/* 왼쪽: 정렬 버튼 (목록 보기일 때만 보이게 처리) */}
        <div className="flex gap-2">
          {viewMode === 'list' && (
            <>
              <Button
                variant={sortBy === 'distance' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('distance')}
              >
                <MapPin className="w-4 h-4 mr-1" />
                거리순
              </Button>
              <Button
                variant={sortBy === 'rating' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('rating')}
              >
                <Star className="w-4 h-4 mr-1" />
                평점순
              </Button>
            </>
          )}
        </div>

        {/* 오른쪽: 지도/목록 토글 버튼 */}
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4 mr-1" />
            목록
          </Button>
          <Button
            variant={viewMode === 'map' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('map')}
          >
            <MapIcon className="w-4 h-4 mr-1" />
            지도
          </Button>
        </div>
      </div>

      {/* 💡 메인 컨텐츠 영역 (viewMode에 따라 다르게 렌더링!) */}
      {viewMode === 'map' ? (
        
        // --- 🗺️ [지도 뷰] ---
        // 화면 아래쪽을 꽉 채우도록 높이를 계산했어 (100vh - 헤더 높이 대략)
        <div className="w-full h-[calc(100vh-280px)]">
          <MapBoard />
        </div>

      ) : (

        // --- 📋 [목록 뷰] (기존 리스트 코드와 100% 동일) ---
        <div className="p-4 space-y-4">
          {sortedSites.map((site) => (
            <Link key={site.id} to={`/site/${site.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <img
                    src={site.image}
                    alt={site.name}
                    className="w-full h-full object-cover"
                  />
                  {site.stampCollected && (
                    <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <Star className="w-4 h-4 fill-current" />
                      수집완료
                    </div>
                  )}
                  <Badge className="absolute bottom-3 left-3 bg-white/90 text-gray-800">
                    {site.category}
                  </Badge>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-2">{site.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {site.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-gray-600">
                        <NavigationIcon className="w-4 h-4" />
                        <span>{site.distance}km</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span>{site.rating}</span>
                        <span className="text-gray-400">({site.reviewCount})</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}