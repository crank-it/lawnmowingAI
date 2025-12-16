import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface TourStep {
  id: string;
  target: string; // CSS selector for the element to highlight
  title: string;
  content: string;
  position: "top" | "bottom" | "left" | "right";
  page?: string; // Optional: which page this step belongs to
}

interface TourState {
  isActive: boolean;
  currentStep: number;
  hasCompletedTour: boolean;
  // Actions
  startTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  endTour: () => void;
  resetTour: () => void;
  goToStep: (step: number) => void;
}

export const tourSteps: TourStep[] = [
  {
    id: "welcome",
    target: "[data-tour='header']",
    title: "Welcome to LawnMowing.ai Admin! 🎉",
    content:
      "This is your command center for managing lawn mowing jobs. Let's take a quick tour of the key features.",
    position: "bottom",
  },
  {
    id: "earnings",
    target: "[data-tour='earnings']",
    title: "Today's Earnings 💰",
    content:
      "Track your daily earnings progress here. The progress bar shows how close you are to your daily target.",
    position: "right",
  },
  {
    id: "navigation",
    target: "[data-tour='nav']",
    title: "Navigation Menu 📋",
    content:
      "Quick access to all sections: Today's Jobs, Customers, Weekly Schedule, Earnings reports, and Settings.",
    position: "right",
  },
  {
    id: "route-header",
    target: "[data-tour='route-header']",
    title: "Today's Route Overview 🗓️",
    content:
      "See your daily job count and progress at a glance. The date and completion stats are always visible.",
    position: "bottom",
  },
  {
    id: "action-buttons",
    target: "[data-tour='action-buttons']",
    title: "Quick Actions 🚀",
    content:
      "Use the Map button to view all jobs on a map, or Navigate to get directions to your next job.",
    position: "bottom",
  },
  {
    id: "job-cards",
    target: "[data-tour='job-cards']",
    title: "Job Cards 📝",
    content:
      "Each card shows a job with customer name, address, services, and price. The number indicates route order. Tap any card to see full details and mark it complete.",
    position: "top",
  },
  {
    id: "week-summary",
    target: "[data-tour='week-summary']",
    title: "Weekly Stats 📊",
    content:
      "Keep track of your weekly and monthly performance. Jobs completed, earnings, and running totals are updated in real-time.",
    position: "left",
  },
  {
    id: "tour-button",
    target: "[data-tour='restart-tour']",
    title: "Restart Tour Anytime 🎓",
    content:
      "Click this graduation cap icon whenever you want to revisit this tour. You're all set to start managing your lawn care business!",
    position: "bottom",
  },
];

export const useTourStore = create<TourState>()(
  persist(
    (set, get) => ({
      isActive: false,
      currentStep: 0,
      hasCompletedTour: false,

      startTour: () => {
        set({ isActive: true, currentStep: 0 });
      },

      nextStep: () => {
        const { currentStep } = get();
        if (currentStep < tourSteps.length - 1) {
          set({ currentStep: currentStep + 1 });
        } else {
          // End of tour
          set({ isActive: false, hasCompletedTour: true });
        }
      },

      prevStep: () => {
        const { currentStep } = get();
        if (currentStep > 0) {
          set({ currentStep: currentStep - 1 });
        }
      },

      endTour: () => {
        set({ isActive: false, hasCompletedTour: true });
      },

      resetTour: () => {
        set({ hasCompletedTour: false, currentStep: 0 });
      },

      goToStep: (step: number) => {
        if (step >= 0 && step < tourSteps.length) {
          set({ currentStep: step });
        }
      },
    }),
    {
      name: "lawn-tour-storage",
      partialize: (state) => ({ hasCompletedTour: state.hasCompletedTour }),
    }
  )
);
