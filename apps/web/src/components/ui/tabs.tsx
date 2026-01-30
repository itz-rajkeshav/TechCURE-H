import * as React from "react"
import { cn } from "@/lib/utils"

interface TabsProps {
  children: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

interface TabsTriggerProps {
  children: React.ReactNode;
  value: string;
  className?: string;
}

interface TabsContentProps {
  children: React.ReactNode;
  value: string;
  className?: string;
}

const TabsContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
}>({
  value: '',
  onValueChange: () => {},
});

const Tabs = ({ children, value = '', onValueChange, className }: TabsProps) => {
  const [currentValue, setCurrentValue] = React.useState(value);

  const handleValueChange = (newValue: string) => {
    setCurrentValue(newValue);
    onValueChange?.(newValue);
  };

  React.useEffect(() => {
    if (value !== undefined) {
      setCurrentValue(value);
    }
  }, [value]);

  return (
    <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
      <div className={className}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

const TabsList = ({ children, className }: TabsListProps) => (
  <div
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-slate-100 p-1 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
      className
    )}
  >
    {children}
  </div>
);

const TabsTrigger = ({ children, value, className }: TabsTriggerProps) => {
  const { value: currentValue, onValueChange } = React.useContext(TabsContext);
  const isActive = currentValue === value;

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isActive
          ? "bg-white text-slate-950 shadow-sm dark:bg-slate-950 dark:text-slate-50"
          : "hover:bg-white hover:text-slate-950 dark:hover:bg-slate-950 dark:hover:text-slate-50",
        className
      )}
      onClick={() => onValueChange(value)}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ children, value, className }: TabsContentProps) => {
  const { value: currentValue } = React.useContext(TabsContext);
  
  if (currentValue !== value) return null;

  return (
    <div
      className={cn(
        "mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300",
        className
      )}
    >
      {children}
    </div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent }