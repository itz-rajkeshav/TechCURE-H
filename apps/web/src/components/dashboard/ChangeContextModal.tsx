import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/appStore";
import { useSubjects } from "@/lib/api/hooks";
import { ArrowRight, Check, Loader2 } from "lucide-react";

interface ChangeContextModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Comprehensive course configurations for both school and college
const COURSE_CONFIGS = [
  // School Courses
  { 
    code: "cbse", 
    name: "CBSE Board", 
    icon: "school", 
    type: "school",
    classes: ["10", "11", "12"] 
  },
  { 
    code: "jee", 
    name: "JEE", 
    icon: "functions", 
    type: "school",
    classes: ["11", "12"] 
  },
  { 
    code: "neet", 
    name: "NEET", 
    icon: "biotech", 
    type: "school",
    classes: ["11", "12"] 
  },
  
  // Engineering Courses
  { 
    code: "btech-cse", 
    name: "B.Tech Computer Science", 
    icon: "computer", 
    type: "college",
    classes: ["1", "2", "3", "4"] 
  },
  { 
    code: "btech-ece", 
    name: "B.Tech Electronics", 
    icon: "memory", 
    type: "college",
    classes: ["1", "2", "3", "4"] 
  },
  { 
    code: "btech-mech", 
    name: "B.Tech Mechanical", 
    icon: "precision_manufacturing", 
    type: "college",
    classes: ["1", "2", "3", "4"] 
  },
  { 
    code: "btech-civil", 
    name: "B.Tech Civil", 
    icon: "domain", 
    type: "college",
    classes: ["1", "2", "3", "4"] 
  },
  { 
    code: "btech-eee", 
    name: "B.Tech Electrical", 
    icon: "electric_bolt", 
    type: "college",
    classes: ["1", "2", "3", "4"] 
  },
  
  // Computer Applications
  { 
    code: "bca", 
    name: "BCA (Computer Applications)", 
    icon: "laptop_mac", 
    type: "college",
    classes: ["1", "2", "3"] 
  },
  { 
    code: "mca", 
    name: "MCA (Master of Computer Applications)", 
    icon: "developer_mode", 
    type: "college",
    classes: ["1", "2"] 
  },
  
  // Science Courses
  { 
    code: "bsc-cs", 
    name: "B.Sc Computer Science", 
    icon: "science", 
    type: "college",
    classes: ["1", "2", "3"] 
  },
  { 
    code: "bsc-physics", 
    name: "B.Sc Physics", 
    icon: "scatter_plot", 
    type: "college",
    classes: ["1", "2", "3"] 
  },
  { 
    code: "bsc-chemistry", 
    name: "B.Sc Chemistry", 
    icon: "test_tube", 
    type: "college",
    classes: ["1", "2", "3"] 
  },
  { 
    code: "bsc-math", 
    name: "B.Sc Mathematics", 
    icon: "calculate", 
    type: "college",
    classes: ["1", "2", "3"] 
  },
  
  // Commerce Courses
  { 
    code: "bcom", 
    name: "B.Com (Commerce)", 
    icon: "account_balance", 
    type: "college",
    classes: ["1", "2", "3"] 
  },
  { 
    code: "bba", 
    name: "BBA (Business Administration)", 
    icon: "business_center", 
    type: "college",
    classes: ["1", "2", "3"] 
  },
  { 
    code: "mba", 
    name: "MBA (Master of Business Administration)", 
    icon: "corporate_fare", 
    type: "college",
    classes: ["1", "2"] 
  },
  
  // Arts & Humanities
  { 
    code: "ba-english", 
    name: "BA English", 
    icon: "menu_book", 
    type: "college",
    classes: ["1", "2", "3"] 
  },
  { 
    code: "ba-history", 
    name: "BA History", 
    icon: "history_edu", 
    type: "college",
    classes: ["1", "2", "3"] 
  },
  { 
    code: "ba-psychology", 
    name: "BA Psychology", 
    icon: "psychology", 
    type: "college",
    classes: ["1", "2", "3"] 
  },
  
  // Medical Courses
  { 
    code: "mbbs", 
    name: "MBBS (Medical)", 
    icon: "local_hospital", 
    type: "college",
    classes: ["1", "2", "3", "4", "5"] 
  },
  { 
    code: "bds", 
    name: "BDS (Dental)", 
    icon: "dentistry", 
    type: "college",
    classes: ["1", "2", "3", "4"] 
  },
  { 
    code: "bpharma", 
    name: "B.Pharma (Pharmacy)", 
    icon: "medication", 
    type: "college",
    classes: ["1", "2", "3", "4"] 
  },
  
  // Law Courses
  { 
    code: "llb", 
    name: "LLB (Law)", 
    icon: "gavel", 
    type: "college",
    classes: ["1", "2", "3"] 
  },
  
  // Diploma Courses
  { 
    code: "diploma-cse", 
    name: "Diploma Computer Science", 
    icon: "terminal", 
    type: "college",
    classes: ["1", "2", "3"] 
  },
  { 
    code: "diploma-ece", 
    name: "Diploma Electronics", 
    icon: "electrical_services", 
    type: "college",
    classes: ["1", "2", "3"] 
  },
  { 
    code: "diploma-mech", 
    name: "Diploma Mechanical", 
    icon: "build", 
    type: "college",
    classes: ["1", "2", "3"] 
  },
];

export function ChangeContextModal({
  open,
  onOpenChange,
}: ChangeContextModalProps) {
  const { setCourse, setClass, setSubject, selectedCourse, selectedClass, selectedSubject } = useAppStore();
  const [selectedCourseCode, setSelectedCourseCode] = useState("cbse");
  const [selectedClassValue, setSelectedClassValue] = useState("12");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [courseType, setCourseType] = useState<"school" | "college">("school");

  // Filter courses by type
  const availableCourses = COURSE_CONFIGS.filter(course => course.type === courseType);
  
  // Update selected course when switching between school/college
  const handleCourseTypeChange = (type: "school" | "college") => {
    setCourseType(type);
    const firstCourse = COURSE_CONFIGS.find(c => c.type === type);
    if (firstCourse) {
      setSelectedCourseCode(firstCourse.code);
      setSelectedClassValue(firstCourse.classes[0]);
      setSelectedSubjectId(null);
    }
  };

  // Fetch real subjects from API
  const { data: subjectsResponse, isLoading: subjectsLoading, error: subjectsError } = useSubjects({ 
    course: selectedCourseCode, 
    class: selectedClassValue 
  });

  const subjects = subjectsResponse?.success ? subjectsResponse.data : [];

  const handleContinue = () => {
    const courseConfig = COURSE_CONFIGS.find((c) => c.code === selectedCourseCode);
    const selectedSubjectData = subjects.find((s: any) => s._id === selectedSubjectId);

    if (courseConfig && selectedSubjectData) {
      setCourse(selectedCourseCode);
      setClass(selectedClassValue);
      setSubject({
        id: selectedSubjectData._id,
        name: selectedSubjectData.name,
        course: selectedSubjectData.course,
        class: selectedSubjectData.class,
        topics: [] // Will be loaded by API hooks
      });
      onOpenChange(false);
    }
  };

  // Set default subject selection when subjects load
  if (subjects.length > 0 && !selectedSubjectId) {
    // For school courses, prefer physics if available
    if (courseType === "school") {
      const physicsSubject = subjects.find((s: any) => s.name.toLowerCase().includes('physics'));
      if (physicsSubject) {
        setSelectedSubjectId(physicsSubject._id);
      } else {
        setSelectedSubjectId(subjects[0]._id);
      }
    } else {
      // For college courses, just select the first available subject
      setSelectedSubjectId(subjects[0]._id);
    }
  }

  const canContinue = selectedSubjectId && subjects.length > 0;
  const selectedCourseConfig = COURSE_CONFIGS.find(c => c.code === selectedCourseCode);
  const classLabel = courseType === "school" ? "Class" : "Year";

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
          {/* Step 0: Education Level */}
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#135bec] text-white text-sm font-bold shadow-sm">
                📚
              </span>
              <h3 className="text-lg font-bold leading-tight tracking-[-0.015em]">
                Choose Education Level
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <label className="group relative cursor-pointer">
                <input
                  type="radio"
                  name="courseType"
                  checked={courseType === "school"}
                  onChange={() => handleCourseTypeChange("school")}
                  className="peer invisible absolute"
                />
                <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-white dark:bg-card p-6 h-40 transition-all duration-200 hover:border-[#135bec]/50 hover:bg-gray-50 dark:hover:bg-gray-800 peer-checked:border-[3px] peer-checked:border-[#135bec] peer-checked:bg-[#135bec]/5 dark:peer-checked:bg-[#135bec]/10 peer-checked:shadow-md">
                  <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-500 group-hover:text-[#135bec] transition-colors peer-checked:text-[#135bec]">
                    school
                  </span>
                  <div className="text-center">
                    <span className="text-xl font-semibold group-hover:text-[#135bec]">School</span>
                    <p className="text-sm text-gray-600 mt-1">Class 10-12, JEE, NEET</p>
                  </div>
                </div>
                {courseType === "school" && (
                  <div className="absolute top-3 right-3 text-[#135bec]">
                    <Check className="w-5 h-5" />
                  </div>
                )}
              </label>
              
              <label className="group relative cursor-pointer">
                <input
                  type="radio"
                  name="courseType"
                  checked={courseType === "college"}
                  onChange={() => handleCourseTypeChange("college")}
                  className="peer invisible absolute"
                />
                <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-white dark:bg-card p-6 h-40 transition-all duration-200 hover:border-[#135bec]/50 hover:bg-gray-50 dark:hover:bg-gray-800 peer-checked:border-[3px] peer-checked:border-[#135bec] peer-checked:bg-[#135bec]/5 dark:peer-checked:bg-[#135bec]/10 peer-checked:shadow-md">
                  <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-500 group-hover:text-[#135bec] transition-colors peer-checked:text-[#135bec]">
                    apartment
                  </span>
                  <div className="text-center">
                    <span className="text-xl font-semibold group-hover:text-[#135bec]">College</span>
                    <p className="text-sm text-gray-600 mt-1">B.Tech, BCA, MBA, etc.</p>
                  </div>
                </div>
                {courseType === "college" && (
                  <div className="absolute top-3 right-3 text-[#135bec]">
                    <Check className="w-5 h-5" />
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Step 1: Course */}
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#135bec] text-white text-sm font-bold shadow-sm">
                1
              </span>
              <h3 className="text-lg font-bold leading-tight tracking-[-0.015em]">
                Choose {courseType === "school" ? "Board/Exam" : "Course"}
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {availableCourses.map((course) => (
                <label key={course.code} className="group relative cursor-pointer">
                  <input
                    type="radio"
                    name="course"
                    checked={selectedCourseCode === course.code}
                    onChange={() => {
                      setSelectedCourseCode(course.code);
                      setSelectedClassValue(course.classes[0]);
                      setSelectedSubjectId(null);
                    }}
                    className="peer invisible absolute"
                  />
                  <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-white dark:bg-card p-4 h-32 transition-all duration-200 hover:border-[#135bec]/50 hover:bg-gray-50 dark:hover:bg-gray-800 peer-checked:border-[3px] peer-checked:border-[#135bec] peer-checked:bg-[#135bec]/5 dark:peer-checked:bg-[#135bec]/10 peer-checked:shadow-md">
                    <span className="material-symbols-outlined text-4xl text-gray-400 dark:text-gray-500 group-hover:text-[#135bec] transition-colors peer-checked:text-[#135bec]">
                      {course.icon}
                    </span>
                    <span className="text-sm font-semibold group-hover:text-[#135bec] text-center">
                      {course.name}
                    </span>
                  </div>
                  {selectedCourseCode === course.code && (
                    <div className="absolute top-3 right-3 text-[#135bec]">
                      <Check className="w-5 h-5" />
                    </div>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Step 2: Class/Year */}
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#135bec] text-white text-sm font-bold shadow-sm">
                2
              </span>
              <h3 className="text-lg font-bold leading-tight tracking-[-0.015em]">
                Choose {classLabel}
              </h3>
            </div>
            <div className="flex flex-wrap gap-4">
              {selectedCourseConfig?.classes.map((cls) => (
                <label key={cls} className="group relative cursor-pointer">
                  <input
                    type="radio"
                    name="class"
                    checked={selectedClassValue === cls}
                    onChange={() => {
                      setSelectedClassValue(cls);
                      setSelectedSubjectId(null);
                    }}
                    className="peer invisible absolute"
                  />
                  <div className="flex items-center justify-center rounded-xl border border-border bg-white dark:bg-card px-6 py-4 transition-all duration-200 hover:border-[#135bec]/50 hover:bg-gray-50 dark:hover:bg-gray-800 peer-checked:border-[3px] peer-checked:border-[#135bec] peer-checked:bg-[#135bec]/5 dark:peer-checked:bg-[#135bec]/10 peer-checked:shadow-md">
                    <span className="text-lg font-semibold">
                      {classLabel} {cls}
                      {courseType === "college" && cls === "1" ? " (1st Year)" : 
                       courseType === "college" && cls === "2" ? " (2nd Year)" : 
                       courseType === "college" && cls === "3" ? " (3rd Year)" : 
                       courseType === "college" && cls === "4" ? " (4th Year)" : 
                       courseType === "college" && cls === "5" ? " (5th Year)" : ""}
                    </span>
                  </div>
                  {selectedClassValue === cls && (
                    <div className="absolute top-2 right-2 text-[#135bec]">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Step 3: Subject */}
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#135bec] text-white text-sm font-bold shadow-sm">
                3
              </span>
              <h3 className="text-lg font-bold leading-tight tracking-[-0.015em]">
                Choose Subject
              </h3>
            </div>

            {subjectsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-[#135bec]" />
                <span className="ml-2 text-sm text-gray-600">Loading subjects...</span>
              </div>
            ) : subjectsError ? (
              <div className="text-center py-12 text-red-600">
                <p className="font-semibold">Error loading subjects</p>
                <p className="text-sm text-gray-600 mt-1">
                  Please try selecting a different course or class combination.
                </p>
              </div>
            ) : subjects.length === 0 ? (
              <div className="text-center py-12 text-gray-600">
                <p className="font-semibold">No subjects available</p>
                <p className="text-sm mt-1">
                  No subjects found for <strong>{selectedCourseConfig?.name}</strong> - {classLabel} {selectedClassValue}.
                  {courseType === "college" && (
                    <span className="block mt-2 text-xs text-blue-600">
                      💡 Try different course or year combinations. More college subjects will be added soon!
                    </span>
                  )}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subjects.map((subject: any) => (
                  <label key={subject._id} className="group relative cursor-pointer">
                    <input
                      type="radio"
                      name="subject"
                      checked={selectedSubjectId === subject._id}
                      onChange={() => setSelectedSubjectId(subject._id)}
                      className="peer invisible absolute"
                    />
                    <div className="flex items-center gap-4 rounded-xl border border-border bg-white dark:bg-card p-4 transition-all duration-200 hover:border-[#135bec]/50 hover:bg-gray-50 dark:hover:bg-gray-800 peer-checked:border-[3px] peer-checked:border-[#135bec] peer-checked:bg-[#135bec]/5 dark:peer-checked:bg-[#135bec]/10 peer-checked:shadow-md">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                        {subject.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-base">{subject.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {subject.course.toUpperCase()} - Class {subject.class}
                        </p>
                      </div>
                    </div>
                    {selectedSubjectId === subject._id && (
                      <div className="absolute top-3 right-3 text-[#135bec]">
                        <Check className="w-5 h-5" />
                      </div>
                    )}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 z-20 flex justify-end gap-4 px-6 py-4 md:px-10 md:py-6 bg-white dark:bg-card border-t border-gray-100 dark:border-gray-800">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="px-6"
          >
            Cancel
          </Button>
          <Button
            onClick={handleContinue}
            disabled={!canContinue}
            className="px-6 bg-[#135bec] hover:bg-[#135bec]/90"
          >
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Custom scrollbar styles */}
        <style dangerouslySetInnerHTML={{
          __html: `
            .custom-scrollbar {
              scrollbar-width: thin;
              scrollbar-color: #cbd5e1 transparent;
            }
            .custom-scrollbar::-webkit-scrollbar {
              width: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: transparent;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background-color: #cbd5e1;
              border-radius: 20px;
              border: transparent;
            }
            .dark .custom-scrollbar::-webkit-scrollbar-thumb {
              background-color: #475569;
            }
          `
        }} />
      </DialogContent>
    </Dialog>
  );
}