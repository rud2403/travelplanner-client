import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { DayLocations, Route, TravelLocation } from '@/services/dayLocations';

interface TravelState {
  destination: string;
  startDate: string;
  endDate: string;
  dayLocations: DayLocations[];
  selectedDay: number | null;
  focusedLocation: TravelLocation | null;
  focusedRoute: Route | null;
  setDestination: (destination: string) => void;
  setStartDate: (startDate: string) => void;
  setEndDate: (endDate: string) => void;
  setDayLocations: (dayLocations: DayLocations[]) => void;
  setSelectedDay: (day: number | null) => void;
  setFocusedLocation: (location: TravelLocation | null) => void;
  setFocusedRoute: (route: Route | null) => void;
  resetState: () => void;
}

export const useTravelStore = create<TravelState>()(
  devtools((set) => ({
    destination: '',
    startDate: '',
    endDate: '',
    dayLocations: [],
    selectedDay: null,
    focusedLocation: null,
    focusedRoute: null,
    setDestination: (destination) => set({ destination }),
    setStartDate: (startDate) => set({ startDate }),
    setEndDate: (endDate) => set({ endDate }),
    setDayLocations: (dayLocations) => set({ dayLocations }),
    setSelectedDay: (day) => set({ selectedDay: day }),
    setFocusedLocation: (location) => set({ focusedLocation: location }),
    setFocusedRoute: (route) => set({ focusedRoute: route }),
    resetState: () =>
      set({
        destination: '',
        startDate: '',
        endDate: '',
        dayLocations: [],
        selectedDay: null,
        focusedLocation: null,
        focusedRoute: null,
      }),
  }))
);
