import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppStore } from "@/store/appStore";
import { ArrowRight, Check } from "lucide-react";

interface ChangeContextModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const COURSES = [
  { id: "btech", name: "B.Tech", icon: "school" },
  { id: "medical", name: "Medical", icon: "stethoscope" },
  { id: "bsc", name: "B.Sc", icon: "science" },
  { id: "arts", name: "Arts", icon: "palette" },
];

const SEMESTERS = Array.from({ length: 8 }, (_, i) => ({
  id: `sem${i + 1}`,
  name: `Sem ${i + 1}`,
}));

const SUBJECTS = [
  {
    id: "cs301",
    code: "CS-301",
    name: "Operating Systems",
    icon: "terminal",
    color: "blue",
  },
  {
    id: "cs302",
    code: "CS-302",
    name: "Database Systems",
    icon: "storage",
    color: "emerald",
  },
  {
    id: "cs303",
    code: "CS-303",
    name: "Computer Networks",
    icon: "hub",
    color: "orange",
  },
  {
    id: "cs304",
    code: "CS-304",
    name: "Software Eng.",
    icon: "code",
    color: "purple",
  },
  {
    id: "ma301",
    code: "MA-301",
    name: "Mathematics III",
    icon: "functions",
    color: "pink",
  },
];

export function ChangeContextModal({
  open,
  onOpenChange,
}: ChangeContextModalProps) {
  const { setCourse, setClass, selectedCourse, selectedClass } = useAppStore();
  const [selectedCourseId, setSelectedCourseId] = useState("btech");
  const [selectedSemesterId, setSelectedSemesterId] = useState("sem3");
  const [selectedSubjectId, setSelectedSubjectId] = useState("cs301");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSubjects = SUBJECTS.filter((subject) =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContinue = () => {
    const course = COURSES.find((c) => c.id === selectedCourseId);
    const semester = SEMESTERS.find((s) => s.id === selectedSemesterId);
    const subject = SUBJECTS.find((s) => s.id === selectedSubjectId);

    if (course && semester && subject) {
      setCourse(course.name);
      setClass(semester.name);
      // You can also set the subject here if needed
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[960px] p-0 gap-0 overflow-hidden">
        {/* Background Pattern */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-40 dark:opacity-20 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-blue-100 via-transparent to-transparent dark:from-blue-900" />

        {/* Header */}
        <div className="px-6 py-8 md:px-10 md:py-8 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-card sticky top-0 z-20">
          <DialogHeader>
            <DialogTitle className="text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
              Change Learning Context
            </DialogTitle>
            <DialogDescription className="text-base max-w-xl">
              Select your academic path to customize your learning experience.
              Your feed will be updated instantly.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto max-h-[60vh] md:max-h-[65vh] p-6 md:p-10 space-y-10 custom-scrollbar">
          {/* Step 1: Course */}
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#135bec] text-white text-sm font-bold shadow-sm">
                1
              </span>
              <h3 className="text-lg font-bold leading-tight tracking-[-0.015em]">
                Choose Course
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {COURSES.map((course) => (
                <label key={course.id} className="group relative cursor-pointer">
                  <input
                    type="radio"
                    name="course"
                    checked={selectedCourseId === course.id}
                    onChange={() => setSelectedCourseId(course.id)}
                    className="peer invisible absolute"
                  />
                  <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-white dark:bg-card p-4 h-32 transition-all duration-200 hover:border-[#135bec]/50 hover:bg-gray-50 dark:hover:bg-gray-800 peer-checked:border-[3px] peer-checked:border-[#135bec] peer-checked:bg-[#135bec]/5 dark:peer-checked:bg-[#135bec]/10 peer-checked:shadow-md">
                    <span className="material-symbols-outlined text-4xl text-gray-400 dark:text-gray-500 group-hover:text-[#135bec] transition-colors peer-checked:text-[#135bec]">
                      {course.icon}
                    </span>
                    <span className="text-base font-semibold group-hover:text-[#135bec]">
                      {course.name}
                    </span>
                  </div>
                  {selectedCourseId === course.id && (
                    <div className="absolute top-3 right-3 text-[#135bec]">
                      <Check className="w-5 h-5" />
                    </div>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Step 2: Semester */}
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#135bec] text-white text-sm font-bold shadow-sm">
                2
              </span>
              <h3 className="text-lg font-bold leading-tight tracking-[-0.015em]">
                Select Semester
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {SEMESTERS.map((semester) => (
                <label key={semester.id} className="cursor-pointer group">
                  <input
                    type="radio"
                    name="semester"
                    checked={selectedSemesterId === semester.id}
                    onChange={() => setSelectedSemesterId(semester.id)}
                    className="peer invisible absolute"
                  />
                  <div className="flex items-center justify-center rounded-lg border border-border bg-white dark:bg-card h-12 text-sm font-medium transition-all hover:border-[#135bec] hover:text-[#135bec] peer-checked:border-2 peer-checked:border-[#135bec] peer-checked:bg-[#135bec] peer-checked:text-white peer-checked:shadow-md">
                    {semester.name}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Step 3: Subject */}
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#135bec] text-white text-sm font-bold shadow-sm">
                  3
                </span>
                <h3 className="text-lg font-bold leading-tight tracking-[-0.015em]">
                  Select Subject
                </h3>
              </div>
              <div className="hidden sm:block relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-lg">
                  search
                </span>
                <input
                  className="pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#135bec]/20 focus:border-[#135bec] w-48 transition-all hover:w-64"
                  placeholder="Search subjects..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSubjects.map((subject) => (
                <label
                  key={subject.id}
                  className="group relative cursor-pointer"
                >
                  <input
                    type="radio"
                    name="subject"
                    checked={selectedSubjectId === subject.id}
                    onChange={() => setSelectedSubjectId(subject.id)}
                    className="peer invisible absolute"
                  />
                  <div className="flex items-start gap-4 rounded-xl border border-border bg-white dark:bg-card p-4 transition-all duration-200 hover:border-[#135bec]/50 hover:shadow-sm peer-checked:border-2 peer-checked:border-[#135bec] peer-checked:bg-[#135bec]/5 dark:peer-checked:bg-[#135bec]/10 peer-checked:shadow-md">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-${subject.color}-100 dark:bg-${subject.color}-900/30 text-${subject.color}-600`}
                    >
                      <span className="material-symbols-outlined">
                        {subject.icon}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {subject.code}
                      </span>
                      <span className="text-base font-bold group-hover:text-[#135bec]">
                        {subject.name}
                      </span>
                    </div>
                    {selectedSubjectId === subject.id && (
                      <div className="absolute top-4 right-4 h-5 w-5 rounded-full border-2 border-[#135bec] bg-[#135bec] flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 md:px-10 md:py-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-card/50 flex flex-col sm:flex-row justify-between items-center gap-4 z-20">
          <div className="text-sm text-gray-500 dark:text-gray-400 font-medium hidden sm:block">
            Step 3 of 3 completed
          </div>
          <div className="flex w-full sm:w-auto gap-3">
            <button
              onClick={() => onOpenChange(false)}
              className="flex-1 sm:flex-none px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleContinue}
              className="flex-1 sm:flex-none px-8 py-3 rounded-xl font-bold bg-[#135bec] text-white shadow-lg shadow-[#135bec]/30 hover:bg-[#135bec]/90 hover:shadow-[#135bec]/40 active:scale-95 transition-all flex items-center justify-center gap-2 group"
            >
              Continue
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Custom Scrollbar Styles */}
        <style>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #cbd5e1;
            border-radius: 20px;
          }
          .dark .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #475569;
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}
