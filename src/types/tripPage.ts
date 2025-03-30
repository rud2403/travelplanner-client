import { Trip } from './trip';

export interface TripPageData {
  content: Trip[];        // 현재 페이지의 여행 목록
  pageNumber: number;     // 현재 페이지 번호 (0부터 시작)
  pageSize: number;       // 페이지당 항목 수
  totalPages: number;     // 전체 페이지 수
  totalElements: number;  // 전체 여행 수
  first: boolean;         // 첫 페이지인지 여부
  last: boolean;          // 마지막 페이지인지 여부
}
