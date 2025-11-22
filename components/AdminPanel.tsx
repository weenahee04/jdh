
import React, { useState, useRef, useEffect } from 'react';
import { 
  Shield, Users, Database, Settings, X, Search, 
  PlusCircle, Trash2, RefreshCw, Wallet, AlertTriangle,
  Save, Check, Terminal, Keypad, Lock, Edit2, Download, Upload, Eye, Store, CreditCard, CheckCircle2
} from 'lucide-react';
import { DhammaCard, MasterDhammaCard, Rarity, VisualVariant, VARIANT_MULTIPLIERS, SELL_VALUES, MarketItem } from '../types';
import { MASTER_CARD_POOL } from '../data/cardPool';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  points: number;
  setPoints: React.Dispatch<React.SetStateAction<number>>;
  inventory: DhammaCard[];
  setInventory: React.Dispatch<React.SetStateAction<DhammaCard[]>>;
  marketItems: MarketItem[];
  setMarketItems: React.Dispatch<React.SetStateAction<MarketItem[]>>;
  resetApp: () => void;
  merchantId: string;
  setMerchantId: React.Dispatch<React.SetStateAction<string>>;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen, onClose, points, setPoints, inventory, setInventory, marketItems, setMarketItems, resetApp, merchantId, setMerchantId
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'SPAWN' | 'INVENTORY' | 'MARKET' | 'BACKUP' | 'SETTINGS'>('DASHBOARD');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVariant, setSelectedVariant] = useState<VisualVariant>(VisualVariant.BASIC);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tempMerchantId, setTempMerchantId] = useState(merchantId);
  const [saveStatus, setSaveStatus] = useState<'IDLE' | 'SUCCESS'>('IDLE');

  // Sync prop to local state when opening
  useEffect(() => {
      if (isOpen) {
          setTempMerchantId(merchantId);
          setSaveStatus('IDLE');
      }
  }, [isOpen, merchantId]);

  if (!isOpen) return null;

  // --- LOGIN SCREEN ---
  if (!isAuthenticated) {
    const handleLogin = () => {
      if (pin === '9999') setIsAuthenticated(true);
      else alert('รหัสผ่านผิด (Default: 9999)');
      setPin('');
    };

    return (
      <div className="fixed inset-0 z-[100] bg-gray-900 flex items-center justify-center p-4 animate-fade-in">
         <div className="bg-gray-800 w-full max-w-xs p-6 rounded-3xl shadow-2xl border border-gray-700">
            <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
                    <Lock className="text-amber-500" size={32} />
                </div>
            </div>
            <h2 className="text-center text-white font-bold text-xl mb-6 font-mono">SYSTEM ADMIN</h2>
            <input 
              type="password" 
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter PIN"
              className="w-full bg-gray-700 text-white text-center text-2xl tracking-widest py-3 rounded-xl mb-4 focus:ring-2 focus:ring-amber-500 outline-none"
              autoFocus
            />
            <div className="grid grid-cols-2 gap-3">
                <button onClick={onClose} className="bg-gray-600 text-gray-300 py-3 rounded-xl font-bold">CANCEL</button>
                <button onClick={handleLogin} className="bg-amber-600 text-white py-3 rounded-xl font-bold hover:bg-amber-500">ACCESS</button>
            </div>
         </div>
      </div>
    );
  }

  // --- ACTIONS ---
  const calculatePortfolioValue = () => {
     return inventory.reduce((total, card) => {
         const variantMult = VARIANT_MULTIPLIERS[card.visualVariant || VisualVariant.BASIC];
         return total + (SELL_VALUES[card.rarity] * variantMult);
     }, 0);
  };

  const handleSpawnCard = (master: MasterDhammaCard) => {
      const newCard: DhammaCard = {
          ...master,
          instanceId: `admin_spawn_${Date.now()}_${Math.random()}`,
          acquiredAt: Date.now(),
          serialNumber: 'ADMIN' + Math.floor(Math.random()*100),
          visualVariant: selectedVariant
      };
      setInventory(prev => [newCard, ...prev]);
  };

  const handleDeleteCard = (instanceId: string) => {
      if (confirm('Delete this card permanently?')) {
          setInventory(prev => prev.filter(c => c.instanceId !== instanceId));
      }
  };

  const handleUpgradeCard = (card: DhammaCard) => {
      // Toggle Variant Cycle: Basic -> Textured -> Animated -> Holo -> Basic
      const variants = Object.values(VisualVariant);
      const currentIndex = variants.indexOf(card.visualVariant || VisualVariant.BASIC);
      const nextVariant = variants[(currentIndex + 1) % variants.length];
      
      const updatedCard = { ...card, visualVariant: nextVariant };
      setInventory(prev => prev.map(c => c.instanceId === card.instanceId ? updatedCard : c));
  };

  const handleForceDelist = (instanceId: string) => {
      if (confirm('Force remove listing from market?')) {
          setMarketItems(prev => prev.filter(i => i.instanceId !== instanceId));
      }
  };

  const handleExportData = () => {
      const data = {
          points,
          inventory,
          marketItems,
          timestamp: Date.now()
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dhamma_save_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
          try {
              const data = JSON.parse(e.target?.result as string);
              if (confirm('Overwrite current game data with this file?')) {
                  if (data.points !== undefined) setPoints(data.points);
                  if (data.inventory) setInventory(data.inventory);
                  if (data.marketItems) setMarketItems(data.marketItems);
                  alert('Data restored successfully!');
              }
          } catch (err) {
              alert('Invalid JSON file');
          }
      };
      reader.readAsText(file);
  };

  const handleSaveSettings = () => {
      setMerchantId(tempMerchantId);
      setSaveStatus('SUCCESS');
      
      setTimeout(() => {
          setSaveStatus('IDLE');
      }, 2000);
  };

  // --- RENDERERS ---

  const renderDashboard = () => (
      <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700 p-4 rounded-2xl">
                  <p className="text-gray-400 text-xs uppercase">Total Cards</p>
                  <p className="text-2xl font-mono text-white font-bold">{inventory.length}</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-2xl">
                  <p className="text-gray-400 text-xs uppercase">Market Listings</p>
                  <p className="text-2xl font-mono text-amber-400 font-bold">{marketItems.length}</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-2xl col-span-2 flex justify-between items-center">
                  <div>
                    <p className="text-gray-400 text-xs uppercase">System Balance (JDH)</p>
                    <p className="text-3xl font-mono text-green-400 font-bold">{points.toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                      <button onClick={() => setPoints(p => p + 10000)} className="bg-green-600/20 text-green-400 border border-green-600/50 px-3 py-1 rounded-lg font-mono text-xs">+10k</button>
                      <button onClick={() => setPoints(p => p + 1000000)} className="bg-green-600/20 text-green-400 border border-green-600/50 px-3 py-1 rounded-lg font-mono text-xs">+1M</button>
                  </div>
              </div>
          </div>

          <div className="bg-gray-700 p-4 rounded-2xl border border-red-900/50">
              <h3 className="text-red-400 font-bold mb-4 flex items-center gap-2"><AlertTriangle size={18} /> Danger Zone</h3>
              <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => { if(confirm('Clear ALL Inventory?')) setInventory([]) }} className="py-2 bg-red-900/30 text-red-400 border border-red-800 rounded-xl hover:bg-red-900/50 flex items-center justify-center gap-2 text-xs">
                      <Trash2 size={14} /> Wipe Inventory
                  </button>
                  <button onClick={() => { if(confirm('Clear ALL Market?')) setMarketItems([]) }} className="py-2 bg-red-900/30 text-red-400 border border-red-800 rounded-xl hover:bg-red-900/50 flex items-center justify-center gap-2 text-xs">
                      <RefreshCw size={14} /> Wipe Market
                  </button>
                  <button onClick={() => { if(confirm('FACTORY RESET?')) resetApp(); }} className="col-span-2 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 flex items-center justify-center gap-2 font-bold">
                      FULL SYSTEM RESET
                  </button>
              </div>
          </div>
      </div>
  );

  const renderSpawn = () => (
      <div className="flex flex-col h-full">
          <div className="mb-4 space-y-2">
              <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search Master Pool..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-700 text-white pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                  {Object.values(VisualVariant).map(v => (
                      <button 
                        key={v} 
                        onClick={() => setSelectedVariant(v)}
                        className={`px-3 py-1 rounded-lg text-[10px] font-mono border ${selectedVariant === v ? 'bg-amber-600 border-amber-500 text-white' : 'bg-gray-700 border-gray-600 text-gray-400'}`}
                      >
                          {v}
                      </button>
                  ))}
              </div>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
              {MASTER_CARD_POOL
                .filter(c => c.term.includes(searchTerm) || c.category.includes(searchTerm))
                .map(card => (
                  <div key={card.id} className="bg-gray-700 p-2 rounded-xl flex justify-between items-center border border-gray-600">
                      <div className="flex-1 min-w-0 mr-2">
                          <div className="flex items-center gap-2 mb-1">
                              <span className={`w-2 h-2 rounded-full ${
                                  card.rarity === Rarity.LEGENDARY ? 'bg-amber-400' :
                                  card.rarity === Rarity.EPIC ? 'bg-purple-400' :
                                  card.rarity === Rarity.RARE ? 'bg-blue-400' : 'bg-green-400'
                              }`}></span>
                              <span className="text-white font-bold truncate text-sm">{card.term}</span>
                          </div>
                      </div>
                      <button 
                        onClick={() => handleSpawnCard(card)}
                        className="bg-gray-600 hover:bg-green-600 text-white p-2 rounded-lg transition-colors"
                      >
                          <PlusCircle size={18} />
                      </button>
                  </div>
              ))}
          </div>
      </div>
  );

  const renderInventoryManager = () => (
      <div className="flex flex-col h-full">
          <h3 className="text-gray-400 text-xs uppercase mb-2">Editing User Inventory ({inventory.length})</h3>
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
              {inventory.map((card, idx) => (
                  <div key={card.instanceId} className="bg-gray-700 p-2 rounded-lg flex items-center justify-between border border-gray-600">
                      <div className="flex items-center gap-3">
                          <div className="text-gray-500 font-mono text-xs w-6">{idx+1}</div>
                          <div>
                              <p className="text-white font-bold text-sm">{card.term}</p>
                              <div className="flex gap-2 text-[10px]">
                                  <span className={`text-${card.rarity === 'LEGENDARY' ? 'amber' : 'gray'}-400`}>{card.rarity}</span>
                                  <span className="text-blue-300">{card.visualVariant}</span>
                              </div>
                          </div>
                      </div>
                      <div className="flex gap-2">
                          <button onClick={() => handleUpgradeCard(card)} className="p-2 bg-blue-900/50 text-blue-400 rounded hover:bg-blue-900" title="Cycle Variant">
                              <Edit2 size={14} />
                          </button>
                          <button onClick={() => handleDeleteCard(card.instanceId)} className="p-2 bg-red-900/50 text-red-400 rounded hover:bg-red-900" title="Delete">
                              <Trash2 size={14} />
                          </button>
                      </div>
                  </div>
              ))}
              {inventory.length === 0 && <p className="text-gray-500 text-center py-10">Inventory is empty</p>}
          </div>
      </div>
  );

  const renderMarketManager = () => (
      <div className="flex flex-col h-full">
          <h3 className="text-gray-400 text-xs uppercase mb-2">Active Listings ({marketItems.length})</h3>
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
              {marketItems.map((item) => (
                  <div key={item.instanceId} className="bg-gray-700 p-2 rounded-lg flex items-center justify-between border border-gray-600">
                      <div>
                          <p className="text-white font-bold text-sm">{item.term} <span className="text-gray-400 text-xs">by {item.sellerName}</span></p>
                          <p className="text-amber-400 font-mono text-xs">{item.price.toLocaleString()} JDH</p>
                      </div>
                      <button onClick={() => handleForceDelist(item.instanceId)} className="p-2 bg-red-900/50 text-red-400 rounded hover:bg-red-900" title="Force Delist">
                          <Trash2 size={14} />
                      </button>
                  </div>
              ))}
          </div>
      </div>
  );

  const renderBackup = () => (
      <div className="space-y-6 flex flex-col items-center justify-center h-full">
          <div className="text-center space-y-2">
              <Database size={48} className="text-amber-500 mx-auto" />
              <h3 className="text-white font-bold text-lg">Save Data Management</h3>
              <p className="text-gray-400 text-sm max-w-xs mx-auto">Backup your local game data to a JSON file or restore from a previous save.</p>
          </div>
          
          <button onClick={handleExportData} className="w-full max-w-xs bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-colors">
              <Download size={20} /> Export Save File
          </button>

          <div className="w-full max-w-xs relative">
              <input 
                  type="file" 
                  accept=".json" 
                  ref={fileInputRef}
                  onChange={handleImportData}
                  className="hidden"
              />
              <button onClick={() => fileInputRef.current?.click()} className="w-full bg-gray-600 hover:bg-gray-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-colors border border-gray-500">
                  <Upload size={20} /> Import Save File
              </button>
          </div>
      </div>
  );

  const renderSettings = () => (
      <div className="space-y-6 p-4">
          <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <CreditCard className="text-amber-500" /> Payment Configuration
              </h3>
              <div className="space-y-4">
                  <div>
                      <label className="block text-gray-400 text-xs mb-1">PromptPay ID / ID Card Number</label>
                      <input 
                          type="text" 
                          value={tempMerchantId}
                          onChange={(e) => setTempMerchantId(e.target.value)}
                          className="w-full bg-gray-700 text-white p-3 rounded-xl border border-gray-600 focus:border-amber-500 outline-none font-mono transition-colors"
                          placeholder="08xxxxxxxx or 13-digit ID"
                      />
                      <p className="text-[10px] text-gray-500 mt-2">
                          * This ID will be used to generate QR Codes for user Top Ups via promptpay.io API.
                      </p>
                  </div>
                  
                  <button 
                      onClick={handleSaveSettings}
                      disabled={saveStatus === 'SUCCESS'}
                      className={`w-full py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                          saveStatus === 'SUCCESS' 
                          ? 'bg-green-600 text-white shadow-lg scale-105' 
                          : 'bg-amber-600 hover:bg-amber-500 text-white'
                      }`}
                  >
                      {saveStatus === 'SUCCESS' ? (
                          <>
                              <CheckCircle2 size={20} /> Saved Successfully
                          </>
                      ) : (
                          "Save Configuration"
                      )}
                  </button>
              </div>
          </div>
      </div>
  );

  return (
    <div className="fixed inset-0 z-[90] bg-gray-900 text-white flex flex-col animate-fade-in">
        {/* Header */}
        <div className="bg-gray-800 p-4 shadow-md flex justify-between items-center border-b border-gray-700 shrink-0">
            <div className="flex items-center gap-3">
                <div className="bg-amber-600 p-2 rounded-lg">
                    <Settings size={20} className="text-white" />
                </div>
                <div>
                    <h1 className="font-bold font-mono text-lg">ADMIN CONTROL</h1>
                    <p className="text-[10px] text-gray-400">GOD MODE • v2.0</p>
                </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-full">
                <X size={24} className="text-gray-400" />
            </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
            {/* Sidebar */}
            <div className="w-16 bg-gray-800 border-r border-gray-700 flex flex-col items-center py-4 gap-4 shrink-0 overflow-y-auto">
                <button onClick={() => setActiveTab('DASHBOARD')} title="Dashboard" className={`p-3 rounded-xl transition-all ${activeTab === 'DASHBOARD' ? 'bg-amber-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-700'}`}>
                    <Wallet size={20} />
                </button>
                <button onClick={() => setActiveTab('SPAWN')} title="Spawn Items" className={`p-3 rounded-xl transition-all ${activeTab === 'SPAWN' ? 'bg-amber-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-700'}`}>
                    <PlusCircle size={20} />
                </button>
                <button onClick={() => setActiveTab('INVENTORY')} title="Manage Inventory" className={`p-3 rounded-xl transition-all ${activeTab === 'INVENTORY' ? 'bg-amber-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-700'}`}>
                    <Database size={20} />
                </button>
                <button onClick={() => setActiveTab('MARKET')} title="Manage Market" className={`p-3 rounded-xl transition-all ${activeTab === 'MARKET' ? 'bg-amber-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-700'}`}>
                    <Store size={20} />
                </button>
                <button onClick={() => setActiveTab('BACKUP')} title="Backup/Restore" className={`p-3 rounded-xl transition-all ${activeTab === 'BACKUP' ? 'bg-amber-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-700'}`}>
                    <Save size={20} />
                </button>
                {/* Settings Tab */}
                <button onClick={() => setActiveTab('SETTINGS')} title="System Settings" className={`p-3 rounded-xl transition-all ${activeTab === 'SETTINGS' ? 'bg-amber-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-700'}`}>
                    <Settings size={20} />
                </button>
            </div>

            {/* Main Area */}
            <div className="flex-1 p-4 sm:p-6 overflow-hidden bg-gray-900">
                {activeTab === 'DASHBOARD' && renderDashboard()}
                {activeTab === 'SPAWN' && renderSpawn()}
                {activeTab === 'INVENTORY' && renderInventoryManager()}
                {activeTab === 'MARKET' && renderMarketManager()}
                {activeTab === 'BACKUP' && renderBackup()}
                {activeTab === 'SETTINGS' && renderSettings()}
            </div>
        </div>
    </div>
  );
};
    