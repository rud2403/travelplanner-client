import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { TravelPlan, Route, TravelLocation } from '@/data/travelPlanData';

interface TravelState {
  destination: string;
  startDate: string;
  endDate: string;
  dateLocations: TravelPlan[];
  selectedDate: number | null;
  focusedLocation: TravelLocation | null;
  focusedRoute: Route | null;
  colors: string[];
  setDestination: (destination: string) => void;
  setStartDate: (startDate: string) => void;
  setEndDate: (endDate: string) => void;
  setDateLocations: (dateLocations: TravelPlan[]) => void;
  setSelectedDate: (date: number | null) => void;
  setFocusedLocation: (location: TravelLocation | null) => void;
  setFocusedRoute: (route: Route | null) => void;
  resetState: () => void;
}

export const useTravelStore = create<TravelState>()(
  devtools((set) => ({
    destination: '',
    startDate: '',
    endDate: '',
    dateLocations: [],
    selectedDate: null,
    focusedLocation: null,
    focusedRoute: null,
    colors: ['#FF5733', '#33C1FF', '#33FF57', '#FFC133', '#C133FF', '#FF33A6', '#33FFD1', '#FF8F33', '#33FF8F', '#8F33FF'],
    setDestination: (destination) => set({ destination }),
    setStartDate: (startDate) => set({ startDate }),
    setEndDate: (endDate) => set({ endDate }),
    setDateLocations: (dateLocations) => set({ dateLocations }),
    setSelectedDate: (date) => set({ selectedDate: date }),
    setFocusedLocation: (location) => set({ focusedLocation: location }),
    setFocusedRoute: (route) => set({ focusedRoute: route }),
    resetState: () =>
      set({
        destination: '',
        startDate: '',
        endDate: '',
        dateLocations: [],
        selectedDate: null,
        focusedLocation: null,
        focusedRoute: null,
        colors: ['#FF5733', '#33C1FF', '#33FF57', '#FFC133', '#C133FF', '#FF33A6', '#33FFD1', '#FF8F33', '#33FF8F', '#8F33FF'],
      }),
  }))
);
