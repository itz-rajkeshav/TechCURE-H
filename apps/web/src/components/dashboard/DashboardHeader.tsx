import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { useAppStore } from "@/store/appStore";
import { ChangeContextModal } from "./ChangeContextModal";

export function DashboardHeader() {
  const { selectedClass, selectedCourse, selectedSubject } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Use values from store or fallback to the hardcoded values from the user's design for the preview
  const course = selectedCourse || 'B.Tech';
  const cls = selectedClass || 'Semester 5';
  const subjectName = selectedSubject?.name || 'Operating Systems';

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-solid border-[#e7ebf3] bg-white px-4 md:px-10 py-3">
        <div className="flex w-full items-center justify-between whitespace-nowrap">
          <div className="flex items-center gap-4">
            <div className="text-[#135bec]">
               <BookOpen className="size-8" />
            </div>
            <h2 className="text-xl font-black leading-tight tracking-tight text-[#0d121b]">LearnPath</h2>
          </div>
          
          <div className="flex flex-1 justify-end items-center gap-6">
            <div className="hidden md:flex items-center gap-2 text-sm font-medium text-[#4c669a]">
              <span>{course}</span>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span>{cls}</span>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span className="text-[#0d121b]">{subjectName}</span>
            </div>
            <button 
               onClick={() => setIsModalOpen(true)}
               className="flex min-w-[120px] cursor-pointer items-center justify-center rounded-lg bg-[#135bec] h-10 px-4 text-white text-sm font-bold transition-colors hover:bg-[#135bec]/90"
            >
              <span>Change Context</span>
            </button>
          </div>
        </div>
      </header>
      
      <ChangeContextModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
}
