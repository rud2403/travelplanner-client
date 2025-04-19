/**
 * 여행 장소 유형 매핑
 */
export const LOCATION_TYPE_MAP = {
  1: '관광지',
  2: '식당',
  3: '숙소',
  4: '쇼핑',
};

/**
 * 이동 방법 매핑
 */
export const TRANSPORT_TYPE_MAP = {
  1: '자동차',
  2: '대중교통',
  3: '도보',
};

/**
 * 위치 유형별 스타일 정의
 */
export const LOCATION_TYPE_STYLES = {
  backgroundColor: {
    1: '#EBF5FF', // 관광지
    2: '#FEF3C7', // 식당
    3: '#DCFCE7', // 숙소
    4: '#F3E8FF', // 쇼핑
  },
  textColor: {
    1: '#1E40AF', // 관광지
    2: '#92400E', // 식당
    3: '#166534', // 숙소
    4: '#6B21A8', // 쇼핑
  },
  label: {
    1: '관광지',
    2: '식당',
    3: '숙소',
    4: '쇼핑',
  }
};

/**
 * 이동 방법 아이콘 SVG 경로
 */
export const TRANSPORT_ICON_PATHS = {
  1: {
    path: "M13 10V3L4 14h7v7l9-11h-7z",
    label: "자동차"
  },
  2: {
    path: "M12 19l9 2-9-18-9 18 9-2zm0 0v-8",
    label: "대중교통"
  },
  3: {
    path: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1",
    label: "도보"
  },
};