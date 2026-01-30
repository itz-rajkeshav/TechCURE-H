import * as React from "react"
import { cn } from "@/lib/utils"

interface SelectProps {
  children: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
}

interface SelectItemProps {
  children: React.ReactNode;
  value: string;
}

interface SelectTriggerProps {
  children: React.ReactNode;
  className?: string;
}

interface SelectContentProps {
  children: React.ReactNode;
}

interface SelectValueProps {
  placeholder?: string;
}

const Select = ({ children, value, onValueChange }: SelectProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(value || '');

  const handleSelect = (newValue: string) => {
    setSelectedValue(newValue);
    onValueChange?.(newValue);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as any, {
              isOpen,
              selectedValue,
              onToggle: () => setIsOpen(!isOpen),
              onSelect: handleSelect,
            })
          : child
      )}
    </div>
  );
};

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps & any>(
  ({ className, children, isOpen, onToggle, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      onClick={onToggle}
      {...props}
    >
      {children}
      <svg
        className={cn("h-4 w-4 transition-transform", isOpen && "transform rotate-180")}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  )
);

const SelectContent = ({ children, isOpen, onSelect }: SelectContentProps & any) => {
  if (!isOpen) return null;

  return (
    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
      <div className="py-1">
        {React.Children.map(children, (child) =>
          React.isValidElement(child)
            ? React.cloneElement(child as any, { onSelect })
            : child
        )}
      </div>
    </div>
  );
};

const SelectItem = ({ children, value, onSelect }: SelectItemProps & any) => (
  <div
    className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
    onClick={() => onSelect?.(value)}
  >
    {children}
  </div>
);

const SelectValue = ({ placeholder, selectedValue }: SelectValueProps & any) => (
  <span className={cn(!selectedValue && "text-gray-500")}>
    {selectedValue || placeholder}
  </span>
);

export {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
}