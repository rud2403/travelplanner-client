// useTravelStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { DayLocations, Route, TravelLocation } from '@/services/dayLocations';

interface TravelState {
  departure: string;
  arrival: string;
  startDate: string;
  endDate: string;
  numberOfPeople: number;
  budget: number;
  dayLocations: DayLocations[];
  focusedLocation: TravelLocation | null;
  focusedRoute: Route | null;
  setDeparture: (departure: string) => void;
  setArrival: (arrival: string) => void;
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
    departure: '',
    arrival: '',
    startDate: '',
    endDate: '',
    numberOfPeople: 1,
    budget: 0,
    dayLocations: [],
    focusedLocation: null,
    focusedRoute: null,
    setDeparture: (departure) => set({ departure }),
    setArrival: (arrival) => set({ arrival }),
    setStartDate: (startDate) => set({ startDate }),
    setEndDate: (endDate) => set({ endDate }),
    setNumberOfPeople: (numberOfPeople) => set({ numberOfPeople }),
    setBudget: (budget) => set({ budget }),
    setDayLocations: (dayLocations) => set({ dayLocations }),
    setFocusedLocation: (location) => set({ focusedLocation: location }),
    setFocusedRoute: (route) => set({ focusedRoute: route }),
    resetState: () =>
      set({
        departure: '',
        arrival: '',
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
