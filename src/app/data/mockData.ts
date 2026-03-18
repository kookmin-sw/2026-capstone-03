// Mock data for the cultural heritage stamp tour app

export interface CulturalSite {
  id: string;
  name: string;
  description: string;
  image: string;
  location: string;
  category: string;
  distance: number; // in km
  lat: number;
  lng: number;
  stampCollected: boolean;
  rating: number;
  reviewCount: number;
}

export interface Stamp {
  id: string;
  siteId: string;
  siteName: string;
  collectedAt: Date;
  image: string;
}

export interface Review {
  id: string;
  siteId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  createdAt: Date;
  photos?: string[];
}

export interface Gift {
  id: string;
  name: string;
  description: string;
  requiredStamps: number;
  image: string;
  available: boolean;
  category: string;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  distance: number;
  image: string;
  priceRange: string;
  address: string;
}

export const culturalSites: CulturalSite[] = [
  {
    id: '1',
    name: '경복궁',
    description: '조선왕조의 정궁으로 1395년에 창건된 궁궐',
    image: 'https://images.unsplash.com/photo-1644380031300-2af18adec01c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjB0cmFkaXRpb25hbCUyMHBhbGFjZSUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NzMzODY1MDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    location: '서울특별시 종로구',
    category: '궁궐',
    distance: 0.5,
    lat: 37.5788,
    lng: 126.9770,
    stampCollected: true,
    rating: 4.7,
    reviewCount: 1523
  },
  {
    id: '2',
    name: '조계사',
    description: '대한불교조계종의 총본산으로 도심 속 전통 사찰',
    image: 'https://images.unsplash.com/photo-1662527982815-1f2d12d183aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjB0ZW1wbGUlMjBidWRkaGlzdHxlbnwxfHx8fDE3NzMzODY1MDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    location: '서울특별시 종로구',
    category: '사찰',
    distance: 1.2,
    lat: 37.5717,
    lng: 126.9816,
    stampCollected: true,
    rating: 4.5,
    reviewCount: 892
  },
  {
    id: '3',
    name: '숭례문',
    description: '서울의 남대문으로 국보 제1호',
    image: 'https://images.unsplash.com/photo-1655212055884-1e785700d10f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjB0cmFkaXRpb25hbCUyMGdhdGV8ZW58MXx8fHwxNzczMzg2NTA4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    location: '서울특별시 중구',
    category: '문루',
    distance: 2.3,
    lat: 37.5596,
    lng: 126.9752,
    stampCollected: false,
    rating: 4.6,
    reviewCount: 1104
  },
  {
    id: '4',
    name: '한양도성',
    description: '조선시대 한양을 둘러싼 성곽',
    image: 'https://images.unsplash.com/photo-1767715517955-903149d3e6d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBmb3J0cmVzcyUyMHdhbGx8ZW58MXx8fHwxNzczMzg2NTA5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    location: '서울특별시 종로구',
    category: '성곽',
    distance: 1.8,
    lat: 37.5834,
    lng: 126.9845,
    stampCollected: false,
    rating: 4.8,
    reviewCount: 756
  },
  {
    id: '5',
    name: '창덕궁',
    description: '유네스코 세계문화유산에 등재된 조선의 궁궐',
    image: 'https://images.unsplash.com/photo-1644380031300-2af18adec01c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjB0cmFkaXRpb25hbCUyMHBhbGFjZSUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NzMzODY1MDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    location: '서울특별시 종로구',
    category: '궁궐',
    distance: 1.5,
    lat: 37.5794,
    lng: 126.9910,
    stampCollected: true,
    rating: 4.9,
    reviewCount: 2341
  }
];

export const collectedStamps: Stamp[] = [
  {
    id: 's1',
    siteId: '1',
    siteName: '경복궁',
    collectedAt: new Date('2026-03-10T10:30:00'),
    image: 'https://images.unsplash.com/photo-1644380031300-2af18adec01c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjB0cmFkaXRpb25hbCUyMHBhbGFjZSUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NzMzODY1MDh8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 's2',
    siteId: '2',
    siteName: '조계사',
    collectedAt: new Date('2026-03-11T14:20:00'),
    image: 'https://images.unsplash.com/photo-1662527982815-1f2d12d183aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjB0ZW1wbGUlMjBidWRkaGlzdHxlbnwxfHx8fDE3NzMzODY1MDh8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 's3',
    siteId: '5',
    siteName: '창덕궁',
    collectedAt: new Date('2026-03-12T11:00:00'),
    image: 'https://images.unsplash.com/photo-1644380031300-2af18adec01c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjB0cmFkaXRpb25hbCUyMHBhbGFjZSUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NzMzODY1MDh8MA&ixlib=rb-4.1.0&q=80&w=1080'
  }
];

export const reviews: Review[] = [
  {
    id: 'r1',
    siteId: '1',
    userName: '김민수',
    userAvatar: '👤',
    rating: 5,
    comment: '정말 아름다운 궁궐입니다. 특히 경회루의 야경이 멋있어요!',
    createdAt: new Date('2026-03-09T15:30:00')
  },
  {
    id: 'r2',
    siteId: '1',
    userName: '이지은',
    userAvatar: '👤',
    rating: 4,
    comment: '관람객이 많아서 조금 복잡했지만 볼거리가 정말 많습니다.',
    createdAt: new Date('2026-03-08T11:20:00')
  },
  {
    id: 'r3',
    siteId: '2',
    userName: '박서준',
    userAvatar: '👤',
    rating: 5,
    comment: '도심 속에서 평화로운 시간을 보낼 수 있었어요.',
    createdAt: new Date('2026-03-11T16:45:00')
  }
];

export const gifts: Gift[] = [
  {
    id: 'g1',
    name: '전통 부채',
    description: '한국 전통 문양이 그려진 수공예 부채',
    requiredStamps: 3,
    image: '🪭',
    available: true,
    category: '전통공예'
  },
  {
    id: 'g2',
    name: '문화상품권',
    description: '1만원 문화상품권',
    requiredStamps: 5,
    image: '🎫',
    available: true,
    category: '상품권'
  },
  {
    id: 'g3',
    name: '전통 찻잔 세트',
    description: '청자 문양의 전통 찻잔 세트',
    requiredStamps: 7,
    image: '🍵',
    available: false,
    category: '전통공예'
  },
  {
    id: 'g4',
    name: '궁중 한과 세트',
    description: '전통 방식으로 만든 궁중 한과 선물 세트',
    requiredStamps: 10,
    image: '🍪',
    available: false,
    category: '음식'
  },
  {
    id: 'g5',
    name: '한복 체험권',
    description: '전통 한복 대여 및 촬영 체험권 (1일)',
    requiredStamps: 15,
    image: '👘',
    available: false,
    category: '체험'
  }
];

export const restaurants: Restaurant[] = [
  {
    id: 'rest1',
    name: '경복궁 한정식',
    cuisine: '한정식',
    rating: 4.5,
    distance: 0.3,
    image: 'https://images.unsplash.com/photo-1629642621587-9947ce328799?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjByZXN0YXVyYW50JTIwZm9vZHxlbnwxfHx8fDE3NzMzMDk1NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    priceRange: '₩₩₩',
    address: '서울 종로구 사직로 161'
  },
  {
    id: 'rest2',
    name: '북촌 비빔밥',
    cuisine: '한식',
    rating: 4.3,
    distance: 0.6,
    image: 'https://images.unsplash.com/photo-1713047203705-44dd7d762d0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBiaWJpbWJhcCUyMGZvb2R8ZW58MXx8fHwxNzczMzcxNTgzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    priceRange: '₩₩',
    address: '서울 종로구 북촌로 42'
  },
  {
    id: 'rest3',
    name: '삼청동 칼국수',
    cuisine: '한식',
    rating: 4.6,
    distance: 0.8,
    image: 'https://images.unsplash.com/photo-1629642621587-9947ce328799?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjByZXN0YXVyYW50JTIwZm9vZHxlbnwxfHx8fDE3NzMzMDk1NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    priceRange: '₩',
    address: '서울 종로구 삼청로 30'
  },
  {
    id: 'rest4',
    name: '인사동 전통찻집',
    cuisine: '찻집/디저트',
    rating: 4.4,
    distance: 1.1,
    image: 'https://images.unsplash.com/photo-1629642621587-9947ce328799?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjByZXN0YXVyYW50JTIwZm9vZHxlbnwxfHx8fDE3NzMzMDk1NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    priceRange: '₩₩',
    address: '서울 종로구 인사동길 62'
  }
];
