/**
 * 위치 정보 이벤트를 처리하기 위한 타입과 함수 정의
 */

// 위치 정보 업데이트 이벤트 상세 정보 타입
export interface LocationUpdateEvent {
  lat: number;
  lng: number;
  selectedDate: number | null;
}

// 이벤트 이름 상수
export const LOCATION_UPDATE_EVENT = 'locationUpdateCompleted';

/**
 * 위치 업데이트 이벤트 발생시키기
 */
export const dispatchLocationUpdateEvent = (lat: number, lng: number, selectedDate: number | null) => {
  const event = new CustomEvent<LocationUpdateEvent>(LOCATION_UPDATE_EVENT, {
    detail: { lat, lng, selectedDate }
  });
  
  window.dispatchEvent(event);
  console.log('위치 업데이트 이벤트 발생:', { lat, lng, selectedDate });
};

/**
 * 위치 업데이트 이벤트 리스너 추가
 */
export const addLocationUpdateListener = (
  callback: (event: CustomEvent<LocationUpdateEvent>) => void
) => {
  window.addEventListener(LOCATION_UPDATE_EVENT, callback as EventListener);
  console.log('위치 업데이트 이벤트 리스너 등록됨');
  
  // 정리 함수 반환
  return () => {
    window.removeEventListener(LOCATION_UPDATE_EVENT, callback as EventListener);
    console.log('위치 업데이트 이벤트 리스너 제거됨');
  };
};
