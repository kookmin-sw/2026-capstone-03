import { useState } from 'react';
import { Gift, Star, Lock, Check, Sparkles } from 'lucide-react';
import { gifts, collectedStamps } from '../data/mockData';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { toast } from 'sonner';

export function GiftExchange() {
  const [selectedGift, setSelectedGift] = useState<typeof gifts[0] | null>(null);
  const [exchangedGifts, setExchangedGifts] = useState<string[]>([]);
  const stampCount = collectedStamps.length;

  const handleExchange = () => {
    if (!selectedGift) return;

    setExchangedGifts([...exchangedGifts, selectedGift.id]);
    toast.success('교환 완료!', {
      description: `${selectedGift.name}를 획득했습니다!`,
      icon: '🎉'
    });
    setSelectedGift(null);
  };

  const canExchange = (gift: typeof gifts[0]) => {
    return stampCount >= gift.requiredStamps && !exchangedGifts.includes(gift.id);
  };

  const sortedGifts = [...gifts].sort((a, b) => a.requiredStamps - b.requiredStamps);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-pink-700 text-white p-6">
        <h1 className="text-2xl font-bold mb-2">선물 교환</h1>
        <p className="text-pink-100">스탬프를 모아서 멋진 선물을 받으세요</p>
        
        {/* Stamp Count */}
        <div className="mt-4 bg-white/20 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-current" />
              <span>보유 스탬프</span>
            </span>
            <span className="text-2xl font-bold">{stampCount}개</span>
          </div>
        </div>
      </div>

      <div className="p-4 max-w-2xl mx-auto">
        {/* Progress */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h2 className="font-bold">다음 선물까지</h2>
            </div>
            
            {(() => {
              const nextGift = sortedGifts.find(g => 
                g.requiredStamps > stampCount && !exchangedGifts.includes(g.id)
              );
              
              if (!nextGift) {
                return (
                  <p className="text-green-600 font-medium">
                    🎉 모든 선물을 교환할 수 있습니다!
                  </p>
                );
              }
              
              const remaining = nextGift.requiredStamps - stampCount;
              const progress = (stampCount / nextGift.requiredStamps) * 100;
              
              return (
                <>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span>{nextGift.name}</span>
                    <span className="font-bold">
                      {remaining}개 더 필요
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-pink-600 rounded-full h-2 transition-all"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </>
              );
            })()}
          </CardContent>
        </Card>

        {/* Gifts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedGifts.map((gift) => {
            const isExchanged = exchangedGifts.includes(gift.id);
            const isAvailable = canExchange(gift);
            const isLocked = stampCount < gift.requiredStamps;

            return (
              <Card
                key={gift.id}
                className={`overflow-hidden transition-all ${
                  isExchanged
                    ? 'opacity-50 bg-gray-50'
                    : isAvailable
                    ? 'border-pink-500 shadow-lg'
                    : ''
                }`}
              >
                <CardContent className="p-4">
                  {/* Gift Icon/Image */}
                  <div className={`text-6xl mb-3 text-center ${
                    isLocked ? 'grayscale opacity-40' : ''
                  }`}>
                    {gift.image}
                  </div>

                  {/* Gift Info */}
                  <div className="mb-3">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold">{gift.name}</h3>
                      {isExchanged && (
                        <Badge className="bg-green-600">
                          <Check className="w-3 h-3 mr-1" />
                          교환완료
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">
                      {gift.description}
                    </p>

                    <Badge variant="outline" className="text-xs">
                      {gift.category}
                    </Badge>
                  </div>

                  {/* Required Stamps */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-3">
                    <span className="text-sm text-gray-600">필요 스탬프</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-500 fill-current" />
                      <span className="font-bold">{gift.requiredStamps}개</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  {isExchanged ? (
                    <Button className="w-full" disabled variant="secondary">
                      <Check className="w-4 h-4 mr-2" />
                      교환완료
                    </Button>
                  ) : isAvailable ? (
                    <Button
                      className="w-full bg-pink-600 hover:bg-pink-700"
                      onClick={() => setSelectedGift(gift)}
                    >
                      <Gift className="w-4 h-4 mr-2" />
                      교환하기
                    </Button>
                  ) : (
                    <Button className="w-full" disabled variant="outline">
                      <Lock className="w-4 h-4 mr-2" />
                      스탬프 {gift.requiredStamps - stampCount}개 더 필요
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Info Box */}
        <Card className="mt-6 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <h3 className="font-bold text-blue-900 mb-2">💡 안내사항</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 스탬프를 모아서 다양한 선물을 교환할 수 있습니다</li>
              <li>• 각 선물은 1회만 교환 가능합니다</li>
              <li>• 교환한 선물은 마이페이지에서 확인할 수 있습니다</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Exchange Confirmation Dialog */}
      <Dialog open={!!selectedGift} onOpenChange={() => setSelectedGift(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>선물 교환 확인</DialogTitle>
            <DialogDescription>
              정말로 이 선물과 교환하시겠습니까?
            </DialogDescription>
          </DialogHeader>
          
          {selectedGift && (
            <div className="py-4">
              <div className="text-6xl text-center mb-4">
                {selectedGift.image}
              </div>
              <h3 className="font-bold text-center text-lg mb-2">
                {selectedGift.name}
              </h3>
              <p className="text-sm text-gray-600 text-center mb-4">
                {selectedGift.description}
              </p>
              
              <div className="bg-gray-50 rounded-lg p-3 mb-4 text-center">
                <Star className="w-5 h-5 text-amber-500 fill-current inline mr-2" />
                <span className="font-bold">{selectedGift.requiredStamps}개 스탬프</span>
                <span className="text-gray-600"> 사용</span>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setSelectedGift(null)}
                >
                  취소
                </Button>
                <Button
                  className="flex-1 bg-pink-600 hover:bg-pink-700"
                  onClick={handleExchange}
                >
                  교환하기
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
