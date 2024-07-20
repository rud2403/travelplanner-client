// useTravelStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { DayLocations, Route, TravelLocation } from '@/services/dayLocations';

interface TravelState {
  destination: string;
  startDate: string;
  endDate: string;
  numberOfPeople: number;
  budget: number;
  dayLocations: DayLocations[];
  focusedLocation: TravelLocation | null;
  focusedRoute: Route | null;
  setDestination: (destination: string) => void; // 여행지 설정 함수
  setStartDate: (startDate: string) => void;
  setEndDate: (endDate: string) => void;
  setNumberOfPeople: (numberOfPeople: number) => void;
  setBudget: (budget: number) => void;
  setDayLocations: (dayLocations: DayLocations[]) => void;
  setFocusedLocation: (location: TravelLocation | null) => void;
  setFocusedRoute: (route: Route | null) => void;
  resetState: () => void;
}

export const useTravelStore = create<TravelState>()(
  devtools((set) => ({
    destination: '',
    startDate: '',
    endDate: '',
    numberOfPeople: 1,
    budget: 0,
    dayLocations: [],
    focusedLocation: null,
    focusedRoute: null,
    setDestination: (destination) => set({ destination }), // 여행지 설정
    setStartDate: (startDate) => set({ startDate }),
    setEndDate: (endDate) => set({ endDate }),
    setNumberOfPeople: (numberOfPeople) => set({ numberOfPeople }),
    setBudget: (budget) => set({ budget }),
    setDayLocations: (dayLocations) => set({ dayLocations }),
    setFocusedLocation: (location) => set({ focusedLocation: location }),
    setFocusedRoute: (route) => set({ focusedRoute: route }),
    resetState: () =>
      set({
        destination: '',
        startDate: '',
        endDate: '',
        numberOfPeople: 1,
        budget: 0,
        dayLocations: [],
        focusedLocation: null,
        focusedRoute: null,
      }),
  }))
);
