
import React from 'react';
import { Home, Dices, Library, Store } from 'lucide-react';
import { Tab } from '../types';

interface NavbarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: 'HOME', label: 'หน้าแรก', icon: Home },
    { id: 'MARKET', label: 'ตลาดพระ', icon: Store },
    { id: 'GACHA', label: 'สุ่มธรรมะ', icon: Dices },
    { id: 'COLLECTION', label: 'คลังการ์ด', icon: Library },
  ];

  return (
    <div className="w-full bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-safe">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id as Tab)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-200 active:scale-95 ${
                isActive ? 'text-amber-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'drop-shadow-sm' : ''} />
              <span className={`text-[10px] font-medium ${isActive ? 'font-bold' : ''}`}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
