import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface TravelState {
  departure: string;
  arrival: string;
  startDate: string;
  endDate: string;
  numberOfPeople: number;
  budget: number;
  setDeparture: (departure: string) => void;
  setArrival: (arrival: string) => void;
  setStartDate: (startDate: string) => void;
  setEndDate: (endDate: string) => void;
  setNumberOfPeople: (numberOfPeople: number) => void;
  setBudget: (budget: number) => void;
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
    setDeparture: (departure) => set({ departure }),
    setArrival: (arrival) => set({ arrival }),
    setStartDate: (startDate) => set({ startDate }),
    setEndDate: (endDate) => set({ endDate }),
    setNumberOfPeople: (numberOfPeople) => set({ numberOfPeople }),
    setBudget: (budget) => set({ budget }),
    resetState: () =>
      set({
        departure: '',
        arrival: '',
        startDate: '',
        endDate: '',
        numberOfPeople: 1,
        budget: 0,
      }),
  }))
);
