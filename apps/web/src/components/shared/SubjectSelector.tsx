import { useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { physics12CBSE } from '@/lib/data/physics12';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Check, BookOpen, GraduationCap, Calendar } from 'lucide-react';

export function SubjectSelector() {
  const { setCourse, setClass, setSubject, selectedCourse, selectedClass } = useAppStore();
  
  // Local state for UI feedback
  const [course, setLocalCourse] = useState<string>('');
  const [cls, setLocalClass] = useState<string>('');
  const [subj, setLocalSubj] = useState<string>('');

  const handleStart = () => {
    // Commit to store
    setCourse(course);
    setClass(cls);
    
    // For MVP we only have one subject data
    if (course === 'CBSE' && cls === 'Class 12' && subj === 'Physics') {
       setSubject(physics12CBSE);
    } else {
       // Handle other cases or show "Coming Soon" - for now just set logic
       // In real app we'd fetch specific subject data
       if (subj === 'Physics') setSubject(physics12CBSE); 
    }
  };

  const isReady = course && cls && subj;

  return (
    <div className="w-full max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center bg-card rounded-2xl p-8 border shadow-sm">
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight mb-2">Start with your current reality.</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Don't overwhelm yourself with the entire curriculum. Narrow your focus by selecting your current academic standing. LearnPath adapts the complexity based on your inputs.
                    </p>
                </div>
                
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-1 rounded-full">
                            <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-sm font-medium">Custom curriculum mapping</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-1 rounded-full">
                             <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-sm font-medium">Semester-specific resource allocation</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-1 rounded-full">
                             <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-sm font-medium">Subject isolation for deep work</span>
                    </div>
                </div>
            </div>

            <div className="bg-background rounded-xl p-6 border shadow-sm space-y-6">
                <div className="space-y-3">
                    <Label className="text-xs uppercase text-muted-foreground font-semibold tracking-wider">Select Course</Label>
                    <div className="relative">
                        <select 
                            className="w-full flex h-11 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                            value={course}
                            onChange={(e) => setLocalCourse(e.target.value)}
                        >
                            <option value="" disabled>Select a course</option>
                            <option value="CBSE">CBSE</option>
                            <option value="ICSE">ICSE</option>
                            <option value="JEE">JEE Main/Advanced</option>
                        </select>
                         <GraduationCap className="absolute right-3 top-3 h-5 w-5 text-muted-foreground pointer-events-none" />
                    </div>
                </div>

                <div className="space-y-3">
                    <Label className="text-xs uppercase text-muted-foreground font-semibold tracking-wider">Current Semester / Class</Label>
                    <div className="relative">
                         <select 
                            className="w-full flex h-11 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                            value={cls}
                            onChange={(e) => setLocalClass(e.target.value)}
                        >
                            <option value="" disabled>Select class</option>
                            <option value="Class 11">Class 11</option>
                            <option value="Class 12">Class 12</option>
                        </select>
                        <Calendar className="absolute right-3 top-3 h-5 w-5 text-muted-foreground pointer-events-none" />
                    </div>
                </div>

                <div className="space-y-3">
                    <Label className="text-xs uppercase text-muted-foreground font-semibold tracking-wider">Focus Subject</Label>
                    <div className="relative">
                         <select 
                            className="w-full flex h-11 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                            value={subj}
                            onChange={(e) => setLocalSubj(e.target.value)}
                        >
                            <option value="" disabled>Select subject</option>
                            <option value="Physics">Physics</option>
                            <option value="Chemistry">Chemistry</option>
                            <option value="Math">Math</option>
                            <option value="Computer Science">Computer Science</option>
                        </select>
                        <BookOpen className="absolute right-3 top-3 h-5 w-5 text-muted-foreground pointer-events-none" />
                    </div>
                </div>
                
                <Button 
                    className="w-full h-11 text-base" 
                    disabled={!isReady}
                    onClick={handleStart}
                >
                    Start Your Path
                </Button>
            </div>
        </div>
    </div>
  );
}
