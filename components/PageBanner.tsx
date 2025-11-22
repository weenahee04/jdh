
import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';

interface PageBannerProps {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  description: string;
  gradient?: string;
}

export const PageBanner: React.FC<PageBannerProps> = ({ 
  title, 
  subtitle, 
  icon: Icon, 
  description,
  gradient = "from-amber-100 via-amber-50 to-white"
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`w-full bg-gradient-to-r ${gradient} border-b border-amber-200/50 shadow-sm relative overflow-hidden transition-all duration-300`}>
      <div 
        className="p-4 flex items-center justify-between cursor-pointer active:bg-black/5 relative z-10"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm text-amber-600 ring-1 ring-amber-100">
            <Icon size={20} />
          </div>
          <div>
            <h2 className="font-serif font-bold text-amber-900 leading-none mb-1 text-lg">{title}</h2>
            <p className="text-[10px] uppercase tracking-wider text-amber-700 font-bold opacity-80">{subtitle}</p>
          </div>
        </div>
        
        <div className="text-amber-400 hover:text-amber-600 transition-colors p-1 rounded-full hover:bg-amber-100">
           {isExpanded ? <ChevronUp size={20} /> : <Info size={20} />}
        </div>
      </div>

      {/* Expanded Content */}
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
      >
         <div className="px-4 pb-4 pt-0">
            <div className="text-xs text-amber-800/80 leading-relaxed bg-white/60 p-3 rounded-lg border border-amber-100/50 shadow-inner">
                <p className="font-semibold mb-1 text-amber-900">คำแนะนำ:</p>
                {description}
            </div>
         </div>
      </div>

      {/* Decorative Background Icon */}
      <Icon className="absolute -right-4 -bottom-6 opacity-[0.07] text-amber-900 pointer-events-none transform -rotate-12 transition-transform duration-500 group-hover:rotate-0" size={100} />
    </div>
  );
};
