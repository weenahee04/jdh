
import React from 'react';
import { DhammaCard, Rarity, MasterDhammaCard, VisualVariant } from '../types';
import { Sparkles, Quote, Leaf, Droplet, Diamond, Lock, Banknote, User, Zap, Wind, Star } from 'lucide-react';

interface CardProps {
  card: DhammaCard | MasterDhammaCard;
  showDetails?: boolean;
  isNew?: boolean;
  isLocked?: boolean;
  price?: number; // Market Prop
  sellerName?: string; // Market Prop
  isMine?: boolean; // Market Prop
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ 
  card, 
  showDetails = false, 
  isNew = false, 
  isLocked = false, 
  price,
  sellerName,
  isMine,
  onClick 
}) => {
  // Cast to check variants if available
  const visualVariant = !isLocked && 'visualVariant' in card 
      ? (card as DhammaCard).visualVariant 
      : VisualVariant.BASIC;

  // Animation is active for ANIMATED or HOLOGRAPHIC variants
  const isAnimated = !isLocked && (visualVariant === VisualVariant.ANIMATED || visualVariant === VisualVariant.HOLOGRAPHIC);

  const getRarityStyles = (rarity: Rarity) => {
    switch (rarity) {
      case Rarity.LEGENDARY:
        return {
          container: 'border-amber-300 border-2', // Thicker gold border
          textMain: 'text-amber-950',
          textSub: 'text-amber-800',
          badge: 'bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-white shadow-amber-200 border border-yellow-200',
          catBadge: 'bg-gradient-to-r from-yellow-50 to-amber-100 text-amber-900 border-amber-300',
          accent: 'bg-amber-600',
          // Rich Metallic Gold Gradient
          bgBase: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-50 via-amber-200 to-yellow-500', 
          bgHolo: 'bg-gradient-to-r from-yellow-200 via-amber-400 to-yellow-100 animate-gradient-xy',
          hoverShadow: 'hover:shadow-[0_0_25px_rgba(245,158,11,0.6)]',
          serial: 'text-amber-900/60',
        };
      case Rarity.EPIC:
        return {
          container: 'border-purple-200',
          textMain: 'text-purple-900',
          textSub: 'text-purple-700',
          badge: 'bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white shadow-purple-200',
          catBadge: 'bg-purple-50 text-purple-700 border-purple-200',
          accent: 'bg-purple-500',
          bgBase: 'bg-gradient-to-br from-purple-50 via-fuchsia-50 to-purple-100',
          bgHolo: 'bg-gradient-to-r from-fuchsia-200 via-purple-300 to-pink-200 animate-gradient-xy',
          hoverShadow: 'hover:shadow-purple-200/60',
          serial: 'text-purple-800/40',
        };
      case Rarity.RARE:
        return {
          container: 'border-blue-200',
          textMain: 'text-blue-900',
          textSub: 'text-blue-700',
          badge: 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white shadow-blue-200',
          catBadge: 'bg-blue-50 text-blue-700 border-blue-200',
          accent: 'bg-blue-500',
          bgBase: 'bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100',
          bgHolo: 'bg-gradient-to-r from-cyan-200 via-blue-300 to-sky-200 animate-gradient-xy',
          hoverShadow: 'hover:shadow-blue-200/60',
          serial: 'text-blue-800/40',
        };
      default: // COMMON
        return {
          container: 'border-gray-200',
          textMain: 'text-emerald-900',
          textSub: 'text-emerald-700',
          badge: 'bg-gray-600 text-white',
          catBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          accent: 'bg-emerald-500',
          bgBase: 'bg-white',
          bgHolo: 'bg-gradient-to-r from-green-200 via-emerald-200 to-lime-100 animate-gradient-xy',
          hoverShadow: 'hover:shadow-emerald-200/40',
          serial: 'text-gray-400/50',
        };
    }
  };

  const styles = getRarityStyles(card.rarity);

  const getRarityIcon = (rarity: Rarity) => {
    switch (rarity) {
      case Rarity.LEGENDARY:
        return <Diamond size={10} className="fill-current" />;
      case Rarity.EPIC:
        return <Sparkles size={10} className="fill-current" />;
      case Rarity.RARE:
        return <Droplet size={10} className="fill-current" />;
      default:
        return <Leaf size={10} className="fill-current" />;
    }
  };

  // Background Pattern Components
  const renderBackground = (rarity: Rarity) => {
    const uniqueId = card.id;
    const svgClass = "absolute inset-0 w-full h-full pointer-events-none";

    // Base Pattern SVG based on Rarity with specialized animations
    let pattern = null;
    switch (rarity) {
      case Rarity.LEGENDARY:
         // Thai "Pikul" Flower / Kanok Motif
         // More ornate and symmetric for Legendary
         pattern = (
             <pattern id={`pattern-legendary-${uniqueId}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <g opacity="0.25">
                    {/* Stylized Flower */}
                    <path d="M20 5 Q25 15 35 20 Q25 25 20 35 Q15 25 5 20 Q15 15 20 5 Z" fill="#B45309" />
                    {/* Connecting Lines */}
                    <path d="M20 0 L20 5 M20 35 L20 40 M0 20 L5 20 M35 20 L40 20" stroke="#B45309" strokeWidth="1" />
                    <circle cx="20" cy="20" r="2" fill="white" />
                </g>
                {isAnimated && (
                    <animateTransform attributeName="patternTransform" type="rotate" from="0 20 20" to="360 20 20" dur="120s" repeatCount="indefinite" />
                )}
            </pattern>
         );
         break;
      case Rarity.EPIC:
         // Thai Prachamyam (Floral Grid) Pattern
         // A four-petaled flower shape often used in grids
         pattern = (
           <pattern id={`pattern-epic-${uniqueId}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
             {/* Prachamyam Motif */}
             <path 
                d="M20 0 Q 25 15 40 20 Q 25 25 20 40 Q 15 25 0 20 Q 15 15 20 0 Z" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1" 
                className="text-purple-600 opacity-15" 
             />
             <rect x="18" y="18" width="4" height="4" transform="rotate(45 20 20)" fill="currentColor" className="text-purple-500 opacity-20" />
             
             {isAnimated && (
                <animateTransform attributeName="patternTransform" type="translate" from="0 0" to="0 -40" dur="10s" repeatCount="indefinite" />
             )}
           </pattern>
         );
         break;
      case Rarity.RARE:
         // Simple static or slowly moving wave pattern for the base SVG
         pattern = (
            <pattern id={`pattern-rare-${uniqueId}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
               <path d="M0 10 Q5 5 10 10 T20 10" fill="none" stroke="currentColor" strokeWidth="1" className="text-blue-500 opacity-10" />
               {isAnimated && (
                 <animateTransform attributeName="patternTransform" type="translate" from="0 0" to="20 0" dur="3s" repeatCount="indefinite" />
               )}
            </pattern>
         );
         break;
      default: // COMMON
        // Static or very subtle
        pattern = (
           <pattern id={`pattern-common-${uniqueId}`} x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
             <circle cx="1.5" cy="1.5" r="1.5" className="text-emerald-600 opacity-10" fill="currentColor" />
           </pattern>
        );
    }

    return (
      <>
        {/* 1. Base Background or Holo Gradient */}
        <div className={`absolute inset-0 ${
            visualVariant === VisualVariant.HOLOGRAPHIC ? styles.bgHolo : 
            (isAnimated && rarity === Rarity.LEGENDARY) ? 'bg-gradient-to-br from-amber-50 via-yellow-100 to-amber-50 animate-pulse-slow' :
            styles.bgBase
        }`}></div>

        {/* 2. Textured Effect (If applicable) */}
        {visualVariant === VisualVariant.TEXTURED && (
             <div className="absolute inset-0 opacity-40 mix-blend-multiply bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-200 via-gray-100 to-transparent bg-size-200"></div>
        )}

        {/* 3. Pattern Layer */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl">
             <svg className={svgClass}>
                {pattern}
                <rect width="100%" height="100%" fill={`url(#pattern-${rarity.toLowerCase()}-${uniqueId})`} />
             </svg>
        </div>

        {/* 4. Specialized Overlays for Animated Variants */}
        {isAnimated && rarity === Rarity.EPIC && (
            // Epic Shimmer Overlay
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-200/20 to-transparent bg-size-200 animate-shine-vertical pointer-events-none mix-blend-overlay"></div>
        )}
        
        {/* 5. Rarity Specific Animations */}
        
        {/* RARE: Gentle Waves Animation */}
        {!isLocked && rarity === Rarity.RARE && (
          <>
             <div className="absolute bottom-0 left-0 w-[200%] h-32 opacity-20 text-blue-400 pointer-events-none animate-mist rounded-b-3xl overflow-hidden">
                 <svg className="w-full h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
                    <path fill="currentColor" d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,197.3C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                 </svg>
             </div>
             {/* Second Wave Layer for Depth */}
             <div className="absolute bottom-0 left-0 w-[200%] h-40 opacity-10 text-cyan-300 pointer-events-none animate-mist rounded-b-3xl overflow-hidden" style={{ animationDuration: '15s', animationDirection: 'reverse' }}>
                 <svg className="w-full h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
                    <path fill="currentColor" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                 </svg>
             </div>
          </>
        )}

        {/* LEGENDARY: Rotating Sunburst + Corner Ornaments */}
        {!isLocked && rarity === Rarity.LEGENDARY && (
              <>
                {/* Rotating Sunburst Rays */}
                <svg className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250%] h-[250%] opacity-30 pointer-events-none ${isAnimated ? 'animate-spin-[20s]' : 'animate-spin-slow'}`} viewBox="0 0 100 100">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <path key={i} d="M50 50 L50 0 L60 0 Z" fill="url(#gradLegendary)" transform={`rotate(${i * 30} 50 50)`} />
                  ))}
                  <defs>
                    <linearGradient id="gradLegendary" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Center Glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(252,211,77,0.3)_0%,transparent_60%)] pointer-events-none"></div>

                {/* Corner Decorations (Golden Frame Effect) */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-50">
                    <svg className="w-full h-full" preserveAspectRatio="none">
                        {/* Top Left */}
                        <path d="M2 20 L2 2 L20 2" stroke="#B45309" strokeWidth="2" fill="none" />
                        <path d="M2 2 L10 10" stroke="#B45309" strokeWidth="1" />
                        {/* Top Right */}
                        <path d="M100% 20 L100% 2 Lcalc(100% - 20px) 2" stroke="#B45309" strokeWidth="2" fill="none" transform="scale(-1, 1) translate(-100%, 0)" style={{transformBox: 'fill-box', transformOrigin: 'center'}} /> 
                        
                        {/* Use CSS positioning for cleaner corner placement */}
                    </svg>
                    
                    <div className="absolute top-1 left-1 w-8 h-8 border-t-2 border-l-2 border-amber-500 rounded-tl-lg"></div>
                    <div className="absolute top-1 right-1 w-8 h-8 border-t-2 border-r-2 border-amber-500 rounded-tr-lg"></div>
                    <div className="absolute bottom-1 left-1 w-8 h-8 border-b-2 border-l-2 border-amber-500 rounded-bl-lg"></div>
                    <div className="absolute bottom-1 right-1 w-8 h-8 border-b-2 border-r-2 border-amber-500 rounded-br-lg"></div>
                </div>
              </>
        )}
        
        {/* EPIC: Decorative Rings (Subtle Overlay) */}
        {!isLocked && rarity === Rarity.EPIC && (
                <svg className="absolute -right-20 -bottom-20 w-64 h-64 opacity-10 text-purple-600 pointer-events-none" viewBox="0 0 100 100">
                   <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.5" fill="none" />
                   <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="0.5" fill="none" strokeDasharray="2 2" />
                   <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.5" fill="none" />
                   <path d="M50 10 Q60 30 50 50 Q40 30 50 10 Z" fill="currentColor" transform="rotate(0 50 50)" />
                   <path d="M50 10 Q60 30 50 50 Q40 30 50 10 Z" fill="currentColor" transform="rotate(45 50 50)" />
                   <path d="M50 10 Q60 30 50 50 Q40 30 50 10 Z" fill="currentColor" transform="rotate(90 50 50)" />
                </svg>
        )}

        {/* 6. Holo Shine Effect */}
        {visualVariant === VisualVariant.HOLOGRAPHIC && (
           <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-white/40 to-transparent opacity-50 animate-pulse pointer-events-none"></div>
        )}
      </>
    );
  };

  return (
    <div 
      onClick={!isLocked ? onClick : undefined}
      className={`
        relative w-full aspect-[3/4] rounded-3xl border
        ${styles.container} 
        shadow-sm transition-all duration-300 ease-out transform
        ${!isLocked && onClick ? `cursor-pointer hover:scale-[1.03] hover:-translate-y-1.5 hover:shadow-xl ${styles.hoverShadow}` : ''}
        ${isNew ? 'animate-pop' : ''}
        ${isLocked ? 'grayscale opacity-80 bg-gray-100' : ''}
        flex flex-col overflow-hidden group
      `}
    >
      {/* Dynamic Background */}
      {renderBackground(card.rarity)}
      
      {/* Locked Overlay */}
      {isLocked && (
        <div className="absolute inset-0 z-50 bg-gray-200/40 backdrop-blur-[1px] flex flex-col items-center justify-center">
            <div className="bg-white/50 p-3 rounded-full mb-2">
              <Lock size={24} className="text-gray-500" />
            </div>
        </div>
      )}

      {/* Shine for Legendary/Epic (Unlocked only) */}
      {!isLocked && (card.rarity === Rarity.LEGENDARY || card.rarity === Rarity.EPIC) && (
        <div className="absolute inset-0 pointer-events-none card-shine-effect opacity-30 z-10"></div>
      )}

      {/* Rare Item Hover Badge (RARE, EPIC, LEGENDARY) */}
      {!isLocked && onClick && card.rarity !== Rarity.COMMON && (
         <div className="absolute top-3 right-3 z-30 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 pointer-events-none">
             <div className={`
                flex items-center gap-1 px-2 py-0.5 rounded-md border border-white/20 shadow-sm backdrop-blur-md
                ${card.rarity === Rarity.LEGENDARY ? 'bg-amber-900/80 text-amber-100' : 
                  card.rarity === Rarity.EPIC ? 'bg-purple-900/80 text-purple-100' : 
                  'bg-blue-900/80 text-blue-100'}
             `}>
                 <Star size={8} className="fill-current animate-pulse" />
                 <span className="text-[8px] font-bold uppercase tracking-wider">Rare Item</span>
             </div>
         </div>
      )}

      {/* Top Section: Badges */}
      <div className="relative z-20 flex justify-between items-start p-3 sm:p-4 w-full">
        <span className={`px-2.5 py-1 rounded-lg text-[9px] sm:text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-md bg-opacity-90 ${styles.badge} flex items-center gap-1`}>
          {getRarityIcon(card.rarity)}
          {card.rarity}
        </span>
      </div>

      {/* Main Content: Center */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center p-4 text-center mt-0 overflow-hidden">
        {/* Decorative Line */}
        <div className={`w-12 h-1 rounded-full mb-3 sm:mb-4 opacity-40 ${styles.accent} shrink-0`}></div>
        
        {/* Term - UPDATED FONT STYLE & Truncation */}
        <h3 className={`text-xl sm:text-3xl font-serif font-bold ${styles.textMain} mb-1 sm:mb-2 leading-tight drop-shadow-sm tracking-tight px-1 w-full truncate`}>
          {card.term}
        </h3>
        
        {/* Meaning - Blurred if Locked */}
        <p className={`text-[10px] sm:text-xs font-medium ${styles.textSub} mb-3 px-2 line-clamp-1 ${isLocked ? 'blur-sm select-none opacity-50' : ''}`}>
          {isLocked ? 'ความหมายถูกปิดผนึก' : card.meaning}
        </p>

        {/* Category Label */}
        {card.category && (
          <span className={`px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-semibold border backdrop-blur-sm ${styles.catBadge} ${isLocked ? 'opacity-50' : ''} truncate max-w-full`}>
            {card.category}
          </span>
        )}

        {/* Quote/Teaching Highlight (Only if space allows in detailed view, hidden in preview often) */}
        {showDetails && !isLocked && card.teaching && (
            <div className="mt-4 relative px-6 py-2 animate-fade-in">
                <Quote size={12} className={`absolute top-0 left-2 opacity-30 ${styles.textMain}`} />
                <p className={`text-sm italic opacity-80 font-medium ${styles.textMain}`}>
                  "{card.teaching}"
                </p>
                <Quote size={12} className={`absolute bottom-0 right-2 opacity-30 rotate-180 ${styles.textMain}`} />
            </div>
        )}

        {/* Legendary Sparkle */}
        {!isLocked && card.rarity === Rarity.LEGENDARY && (
            <Sparkles size={20} className="absolute top-1/4 right-4 text-amber-400 animate-pulse" />
        )}
      </div>

      {/* Bottom Details Section */}
      <div className={`relative z-20 bg-white/60 backdrop-blur-md border-t border-white/20 flex items-center justify-center transition-colors group-hover:bg-white/70 ${showDetails ? 'p-4' : 'p-2 sm:p-3'}`}>
         {showDetails && !isLocked ? (
           <div className="text-left animate-fade-in w-full">
             <div className="flex gap-2 items-start mb-1">
                <p className="text-[10px] uppercase tracking-wide font-bold opacity-50">คำอธิบาย</p>
             </div>
             <p className={`text-xs sm:text-sm leading-relaxed ${styles.textSub}`}>
               {card.details}
             </p>
           </div>
         ) : (
           <div className="w-full">
             {price ? (
                 // Market Price Tag Display - Refined Layout for Narrow Cards
                 <div className="flex justify-between items-center w-full gap-1">
                    <div className="flex items-center min-w-0 flex-1">
                        <User size={10} className="text-gray-400 mr-1 shrink-0" />
                        <span className="text-[9px] text-gray-500 truncate">
                           {sellerName || 'Unknown'}
                        </span>
                    </div>
                    <div className={`px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 shadow-sm shrink-0 ${isMine ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                        <Banknote size={10} />
                        {price.toLocaleString()}
                    </div>
                 </div>
             ) : (
                // Normal Collection Display
                <div className="flex justify-between items-end">
                   {/* Animated dots indicator (Hidden if locked) */}
                   {!isLocked ? (
                      <div className="flex gap-1 opacity-50">
                        <div className={`w-1.5 h-1.5 rounded-full ${styles.accent} group-hover:scale-125 transition-transform`}></div>
                        <div className={`w-1.5 h-1.5 rounded-full ${styles.accent} group-hover:scale-125 transition-transform delay-75`}></div>
                      </div>
                   ) : <div />}
                   
                   {/* Serial Number (Or ??? if locked) */}
                   <span className={`text-[9px] sm:text-[10px] font-mono font-semibold tracking-widest ${styles.serial}`}>
                      {!isLocked && 'serialNumber' in card ? `NO. ${(card as DhammaCard).serialNumber}` : '???'}
                   </span>
                </div>
             )}
           </div>
         )}
      </div>
    </div>
  );
};
