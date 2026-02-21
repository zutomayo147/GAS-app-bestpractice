import { useState } from 'react';
import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export function Accordion({ title, icon, children, defaultOpen = false, disabled = false, onClick }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-3 transition-all hover:shadow-md">
      <button
        onClick={() => {
          if (disabled) {
            if (onClick) onClick();
            return;
          }
          setIsOpen(!isOpen);
        }}
        className={`w-full px-5 py-4 flex items-center justify-between text-left transition-colors hover:bg-gray-50/50 ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
      >
        <div className="flex items-center gap-3">
          {icon && <div className="text-primary">{icon}</div>}
          <span className="font-semibold text-gray-700">{title}</span>
        </div>
        <ChevronDown 
          size={20} 
          className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[500px] border-t border-gray-50' : 'max-h-0'
        }`}
      >
        <div className="p-5 bg-white/50">
          {children}
        </div>
      </div>
    </div>
  );
}
