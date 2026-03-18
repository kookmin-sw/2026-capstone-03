import { collectedStamps, culturalSites } from '../data/mockData';
import { Card, CardContent } from '../components/ui/card';
import { Star, Calendar, Award } from 'lucide-react';
import { Badge } from '../components/ui/badge';

export function StampCollection() {
  const totalSites = culturalSites.length;
  const collectedCount = collectedStamps.length;
  const completionRate = Math.round((collectedCount / totalSites) * 100);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6">
        <h1 className="text-2xl font-bold mb-2">스탬프 컬렉션</h1>
        <p className="text-purple-100">내가 모은 문화재 스탬프</p>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Star className="w-5 h-5 mx-auto mb-1 fill-current" />
            <div className="text-xl font-bold">{collectedCount}</div>
            <div className="text-xs text-purple-100">수집</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Award className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{completionRate}%</div>
            <div className="text-xs text-purple-100">달성률</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <Calendar className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xl font-bold">{totalSites - collectedCount}</div>
            <div className="text-xs text-purple-100">남은 스탬프</div>
          </div>
        </div>
      </div>

      {/* Stamp Grid */}
      <div className="p-4">
        <h2 className="font-bold text-lg mb-4">수집한 스탬프 ({collectedCount})</h2>
        <div className="grid grid-cols-2 gap-4 mb-8">
          {collectedStamps.map((stamp) => (
            <Card key={stamp.id} className="overflow-hidden">
              <div className="relative">
                <img
                  src={stamp.image}
                  alt={stamp.siteName}
                  className="w-full h-32 object-cover"
                />
                <Badge className="absolute top-2 right-2 bg-purple-600">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  수집완료
                </Badge>
              </div>
              <CardContent className="p-3">
                <h3 className="font-bold text-sm mb-1">{stamp.siteName}</h3>
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(stamp.collectedAt).toLocaleDateString('ko-KR')}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Uncollected Stamps */}
        <h2 className="font-bold text-lg mb-4">미수집 스탬프</h2>
        <div className="grid grid-cols-2 gap-4">
          {culturalSites
            .filter(site => !site.stampCollected)
            .map((site) => (
              <Card key={site.id} className="overflow-hidden opacity-60">
                <div className="relative">
                  <img
                    src={site.image}
                    alt={site.name}
                    className="w-full h-32 object-cover grayscale"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="text-white text-center">
                      <Star className="w-8 h-8 mx-auto mb-1" />
                      <div className="text-xs">미수집</div>
                    </div>
                  </div>
                </div>
                <CardContent className="p-3">
                  <h3 className="font-bold text-sm mb-1">{site.name}</h3>
                  <div className="text-xs text-gray-500">
                    {site.distance}km 거리
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
