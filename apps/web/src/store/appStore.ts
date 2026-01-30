import { create } from 'zustand';
import type { Subject, Topic } from '@/lib/types';

interface AppState {
    // Selection
    selectedCourse: string | null;
    selectedClass: string | null;
    selectedSubject: Subject | null;

    // Topic focus
    selectedTopic: Topic | null;

    // Actions
    setCourse: (course: string) => void;
    setClass: (cls: string) => void;
    setSubject: (subject: Subject | null) => void;
    setTopic: (topic: Topic | null) => void;
    clearSelection: () => void;
    initializeDefaults: () => void;
}

// Default physics subject for demo purposes
const defaultPhysicsSubject: Subject = {
    id: "physics-12-cbse",
    name: "Physics",
    course: "CBSE",
    class: "12",
    topics: [], // Will be populated from API
};

export const useAppStore = create<AppState>((set, get) => ({
    selectedCourse: "CBSE",
    selectedClass: "12", 
    selectedSubject: defaultPhysicsSubject,
    selectedTopic: null,

    setCourse: (course) => set({ selectedCourse: course }),
    setClass: (cls) => set({ selectedClass: cls }),
    setSubject: (subject) => set({ selectedSubject: subject }),
    setTopic: (topic) => set({ selectedTopic: topic }),
    clearSelection: () => set({
        selectedCourse: null,
        selectedClass: null,
        selectedSubject: null,
        selectedTopic: null,
    }),
    initializeDefaults: () => {
        const state = get();
        if (!state.selectedSubject) {
            set({
                selectedCourse: "CBSE",
                selectedClass: "12",
                selectedSubject: defaultPhysicsSubject,
            });
        }
    },
}));
