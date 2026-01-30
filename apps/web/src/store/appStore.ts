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
}

export const useAppStore = create<AppState>((set) => ({
    selectedCourse: null,
    selectedClass: null,
    selectedSubject: null,
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
}));
