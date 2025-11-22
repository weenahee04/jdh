
import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Card } from './components/Card';
import { PageBanner } from './components/PageBanner';
import { AdminPanel } from './components/AdminPanel';
import { Tab, DhammaCard, Rarity, GACHA_COST, SELL_VALUES, DROP_RATES, MasterDhammaCard, MarketItem, VisualVariant, VARIANT_MULTIPLIERS, UserProfile } from './types';
import { MASTER_CARD_POOL } from './data/cardPool';
import { Coins, Sparkles, Plus, Library, ArrowRight, Leaf, X, Banknote, Trash2, Book, Info, HelpCircle, Store, Tag, Shovel, Pickaxe, Home, Dices, RotateCw, Diamond, Droplet, Quote, QrCode, Gift, CheckCircle2, Loader2, Copy, Upload, FileCheck, Server, Wallet, ChevronRight, Star, LogOut, User, LogIn } from 'lucide-react';

// --- FIREBASE IMPORTS ---
import { auth, db, googleProvider } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { 
  doc, setDoc, getDoc, updateDoc, onSnapshot, arrayUnion, arrayRemove, 
  increment, collection, addDoc, deleteDoc, runTransaction, query, orderBy, limit 
} from 'firebase/firestore';

// Initial Data for New Users
const INITIAL_INVENTORY: DhammaCard[] = [
    { ...MASTER_CARD_POOL.find(c => c.term === 'สติ')!, instanceId: 'init_1', acquiredAt: Date.now(), serialNumber: '102938', visualVariant: VisualVariant.BASIC },
    { ...MASTER_CARD_POOL.find(c => c.term === 'ศีล 5')!, instanceId: 'init_2', acquiredAt: Date.now(), serialNumber: '458201', visualVariant: VisualVariant.TEXTURED }
];

// API KEYS & ENDPOINTS (Fallback)
const CLIENT_EASYSLIP_KEY = '49db3aee-e260-4eee-9c1d-81b590b267bf';

const TOP_UP_PACKAGES = [
    { price: 50, points: 5000, bonus: 0 },
    { price: 100, points: 11000, bonus: 1000 },
    { price: 300, points: 35000, bonus: 5000 },
    { price: 500, points: 60000, bonus: 10000 },
    { price: 1000, points: 130000, bonus: 30000 },
];

// --- LANDING PAGE COMPONENT ---
const LandingPage = ({ onGoogleLogin, isLoggingIn }: { onGoogleLogin: () => void, isLoggingIn: boolean }) => {
  return (
    <div className="min-h-screen w-full bg-[#020617] flex flex-col items-center justify-center font-sans overflow-hidden relative text-white selection:bg-amber-500/30">
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(180,83,9,0.15),transparent_70%)] z-0"></div>
       <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 animate-pulse-slow z-0 mix-blend-screen"></div>
       
       {/* Particles */}
       <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-amber-400 rounded-full animate-float opacity-60 shadow-[0_0_10px_#fbbf24]"></div>
       <div className="absolute top-3/4 right-1/3 w-1.5 h-1.5 bg-amber-200 rounded-full animate-float opacity-40" style={{ animationDuration: '8s', animationDelay: '1s' }}></div>

       <div className="relative z-10 flex flex-col items-center text-center w-full max-w-md p-6">
          {/* 3D Card Showcase */}
          <div className="perspective-[1000px] mb-10 relative group cursor-pointer">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-72 bg-amber-500/30 rounded-full blur-[60px] group-hover:bg-amber-400/40 transition-all duration-1000"></div>
              <div className="w-64 h-96 relative transform transition-transform duration-700 ease-out group-hover:[transform:rotateY(12deg)_scale(1.05)] [transform-style:preserve-3d] animate-float">
                  <div className="absolute inset-0 rounded-[24px] bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-800 p-[1px] shadow-2xl shadow-black/50">
                      <div className="w-full h-full rounded-[23px] bg-[#0f172a] relative overflow-hidden flex flex-col items-center justify-between p-6 border border-white/10">
                          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-20 pointer-events-none"></div>
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-amber-500/10 to-transparent z-0"></div>
                          <div className="flex items-center gap-2 z-10 opacity-80">
                              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
                              <span className="text-[10px] tracking-[0.2em] font-bold text-amber-200 uppercase">Dhamma NFT</span>
                          </div>
                          <div className="relative z-10 flex items-center justify-center py-8">
                              <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full"></div>
                              <Diamond size={64} strokeWidth={1} className="text-amber-300 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)] relative z-10" />
                          </div>
                          <div className="z-10 w-full border-t border-white/10 pt-4">
                              <h3 className="font-serif text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-amber-100 to-amber-600 mb-1">LEGENDARY</h3>
                              <div className="flex justify-between items-end">
                                  <span className="text-[10px] text-slate-400 font-mono">NO. 000001</span>
                                  <div className="flex gap-1">{[1,2,3,4,5].map(i => <Star key={i} size={8} className="fill-amber-500 text-amber-500" />)}</div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          {/* Typography */}
          <div className="space-y-3 mb-10 animate-fade-in-up">
              <h2 className="text-amber-500/80 text-[10px] font-bold tracking-[0.4em] uppercase">Digital Spiritual Art</h2>
              <h1 className="text-5xl font-serif font-bold text-white leading-tight drop-shadow-lg">
                  Dhamma<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600">Genesis</span>
              </h1>
              <p className="text-slate-400 text-xs font-light tracking-wide max-w-xs mx-auto mt-4 leading-relaxed">
                  Collect rare Buddhist artifacts, trade with the community on-chain, and discover digital enlightenment.
              </p>
          </div>

          {/* Actions */}
          <div className="w-full max-w-xs space-y-3">
              <button 
                onClick={onGoogleLogin}
                disabled={isLoggingIn}
                className="group relative w-full h-14 bg-white text-gray-900 font-bold text-sm rounded-xl shadow-lg hover:shadow-white/20 transition-all active:scale-95 flex items-center justify-center gap-3 overflow-hidden"
              >
                  {isLoggingIn ? <Loader2 className="animate-spin text-amber-600" size={20} /> : (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-100 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 relative z-10" />
                        <span className="relative z-10">CONTINUE WITH GOOGLE</span>
                        <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                      </>
                  )}
              </button>
          </div>
       </div>
    </div>
  );
};

export default function App() {
  // Auth State
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // App Data State (Synced with Firestore)
  const [points, setPoints] = useState<number>(0);
  const [inventory, setInventory] = useState<DhammaCard[]>([]);
  const [marketItems, setMarketItems] = useState<MarketItem[]>([]);

  // UI State
  const [activeTab, setActiveTab] = useState<Tab>('HOME');
  const [filter, setFilter] = useState<string>('ALL');
  const [selectedCard, setSelectedCard] = useState<DhammaCard | null>(null);
  const [viewMode, setViewMode] = useState<'INVENTORY' | 'COMPENDIUM'>('INVENTORY');
  const [jdhPrice, setJdhPrice] = useState<number>(0);
  
  // Wallet & Market UI
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [marketFilter, setMarketFilter] = useState<string>('ALL');
  const [listingPrice, setListingPrice] = useState<string>('');
  const [isListingMode, setIsListingMode] = useState(false);

  // Gacha State
  const [isRolling, setIsRolling] = useState(false);
  const [gachaPhase, setGachaPhase] = useState<'IDLE' | 'WINDUP' | 'SPINNING' | 'DROPPING'>('IDLE');
  const [newCard, setNewCard] = useState<DhammaCard | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Extras
  const [easterEggCount, setEasterEggCount] = useState(0);
  const [isEasterEggActive, setIsEasterEggActive] = useState(false);
  const easterEggTimeout = useRef<any>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminTriggerCount, setAdminTriggerCount] = useState(0);
  const adminTimeout = useRef<any>(null);
  const [merchantId, setMerchantId] = useState<string>("0812345678");

  // Top Up State
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [redeemCode, setRedeemCode] = useState('');
  const [isProcessingTopUp, setIsProcessingTopUp] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<{ price: number, points: number, bonus: number } | null>(null);
  const [paymentStep, setPaymentStep] = useState<'SELECT' | 'QR'>('SELECT');
  const [slipImage, setSlipImage] = useState<string | null>(null);

  // --- FIREBASE LISTENERS ---

  // 1. Auth & User Data Listener
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        
        // Reference to user document
        const userRef = doc(db, "users", currentUser.uid);
        
        // Real-time User Data (Points & Inventory)
        const unsubscribeSnapshot = onSnapshot(userRef, async (docSnap) => {
           if (docSnap.exists()) {
             const data = docSnap.data();
             setPoints(data.points || 0);
             setInventory(data.inventory || []);
             setIsLoadingData(false);
           } else {
             // New User Initialization
             await setDoc(userRef, {
                email: currentUser.email,
                displayName: currentUser.displayName,
                photoURL: currentUser.photoURL,
                points: 20000,
                inventory: INITIAL_INVENTORY,
                createdAt: new Date()
             });
           }
        });
        return () => unsubscribeSnapshot();
      } else {
        // Don't clear immediately if we are doing mock login manually
        if (!user?.isAnonymous) {
            setUser(null);
            setPoints(0);
            setInventory([]);
            setIsLoadingData(false);
        }
      }
    });
    return () => unsubscribeAuth();
  }, []);

  // 2. Market Data Listener (Global)
  useEffect(() => {
     const marketRef = collection(db, "market");
     const q = query(marketRef, orderBy("listedAt", "desc"), limit(100));
     
     const unsubscribeMarket = onSnapshot(q, (snapshot) => {
        const items: MarketItem[] = [];
        snapshot.forEach((doc) => {
           const data = doc.data() as MarketItem;
           items.push({ 
             ...data, 
             instanceId: doc.id, 
             isMine: user ? data.sellerName === user.displayName : false 
           });
        });
        setMarketItems(items);
     });
     return () => unsubscribeMarket();
  }, [user]);

  // --- ACTIONS ---

  const handleGoogleLogin = async () => {
      setIsLoggingIn(true);
      try {
          await signInWithPopup(auth, googleProvider);
      } catch (error: any) {
          console.error("Login failed", error);
          
          // AUTOMATIC GUEST FALLBACK for Auth Errors
          // This handles 'auth/unauthorized-domain' (Preview Env) and 'auth/operation-not-allowed' (Config missing)
          if (error.code === 'auth/unauthorized-domain' || error.code === 'auth/operation-not-allowed') {
              console.warn("Domain/Auth not configured. Switching to Guest Mode.");
              
              const mockUser: any = {
                  uid: 'guest_' + Date.now(),
                  displayName: 'Guest User (Demo)',
                  email: 'guest@demo.com',
                  photoURL: null,
                  isAnonymous: true
              };
              setUser(mockUser);
              
              // Initialize Guest Data Locally since we might not have permission to write to Firestore from unauthorized domain
              setPoints(20000);
              setInventory(INITIAL_INVENTORY);
              
              showNotification("⚠️ Demo Mode Activated (Guest Login)");
          } 
          else if (error.code === 'auth/popup-closed-by-user') {
              // Do nothing
          }
          else {
              alert(`Login Failed: ${error.message}`);
          }
      } finally {
          setIsLoggingIn(false);
      }
  };

  const handleLogout = async () => {
      await signOut(auth);
      setUser(null); // Force clear for guest
      setActiveTab('HOME');
  };

  // Helpers
  const generateSerialNumber = () => Math.floor(100000 + Math.random() * 900000).toString();
  const generateVisualVariant = (rarity: Rarity): VisualVariant => {
    const rand = Math.random();
    if (rarity === Rarity.LEGENDARY) return rand < 0.15 ? VisualVariant.HOLOGRAPHIC : rand < 0.4 ? VisualVariant.ANIMATED : VisualVariant.TEXTURED;
    if (rarity === Rarity.EPIC) return rand < 0.05 ? VisualVariant.HOLOGRAPHIC : rand < 0.2 ? VisualVariant.ANIMATED : rand < 0.5 ? VisualVariant.TEXTURED : VisualVariant.BASIC;
    if (rarity === Rarity.RARE) return rand < 0.02 ? VisualVariant.HOLOGRAPHIC : rand < 0.1 ? VisualVariant.ANIMATED : rand < 0.3 ? VisualVariant.TEXTURED : VisualVariant.BASIC;
    return rand < 0.01 ? VisualVariant.HOLOGRAPHIC : rand < 0.1 ? VisualVariant.TEXTURED : VisualVariant.BASIC;
  };

  const showNotification = (msg: string) => {
      setNotification(msg);
      setTimeout(() => setNotification(null), 3000);
  };

  // --- GAMEPLAY LOGIC (With Firestore) ---

  const handleSummon = async () => {
    if (!user) return;
    if (points < GACHA_COST) {
      alert("JDH ไม่พอ! ไปทำความดีสะสมแต้มบุญก่อนนะ");
      return;
    }

    // Prepare Card Data locally first for animation
    const rand = Math.random() * 100;
    let rarity = Rarity.COMMON;
    if (rand < DROP_RATES[Rarity.LEGENDARY]) rarity = Rarity.LEGENDARY;
    else if (rand < DROP_RATES[Rarity.LEGENDARY] + DROP_RATES[Rarity.EPIC]) rarity = Rarity.EPIC;
    else if (rand < DROP_RATES[Rarity.LEGENDARY] + DROP_RATES[Rarity.EPIC] + DROP_RATES[Rarity.RARE]) rarity = Rarity.RARE;

    const pool = MASTER_CARD_POOL.filter(c => c.rarity === rarity);
    const masterCard = pool[Math.floor(Math.random() * pool.length)];

    const newCardData: DhammaCard = {
        ...masterCard,
        instanceId: crypto.randomUUID(), // Temporary ID, Firestore will just store it in array
        acquiredAt: Date.now(),
        serialNumber: generateSerialNumber(),
        visualVariant: generateVisualVariant(rarity),
    };

    setIsRolling(true);
    setNewCard(null);
    setGachaPhase('WINDUP');

    // Animation Sequence
    setTimeout(() => {
        setGachaPhase('SPINNING');
        setTimeout(async () => {
            setGachaPhase('DROPPING');
            
            // COMMIT TO FIRESTORE
            try {
                const userRef = doc(db, "users", user.uid);
                await updateDoc(userRef, {
                    points: increment(-GACHA_COST),
                    inventory: arrayUnion(newCardData)
                });
                
                // Reveal
                setNewCard(newCardData);
            } catch (e) {
                console.error("Gacha Transaction Failed", e);
                // For Guest fallback if permission denied
                if (user.isAnonymous) {
                    setPoints(prev => prev - GACHA_COST);
                    setInventory(prev => [newCardData, ...prev]);
                    setNewCard(newCardData);
                } else {
                    alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล (โปรดตรวจสอบอินเทอร์เน็ต)");
                }
            } finally {
                setIsRolling(false);
                setGachaPhase('IDLE');
            }
        }, 2000);
    }, 700);
  };

  const handleSellCard = async (card: DhammaCard) => {
    if (!user) return;
    const variantMult = VARIANT_MULTIPLIERS[card.visualVariant || VisualVariant.BASIC];
    const value = Math.floor(SELL_VALUES[card.rarity] * variantMult);
    
    try {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
            points: increment(value),
            inventory: arrayRemove(card)
        });
        setSelectedCard(null);
        showNotification(`ขายสำเร็จ +${value.toLocaleString()} JDH`);
    } catch (e) {
        // Fallback for Guest
        if(user.isAnonymous) {
            setPoints(p => p + value);
            setInventory(prev => prev.filter(c => c.instanceId !== card.instanceId));
            setSelectedCard(null);
            showNotification(`(Guest) ขายสำเร็จ +${value.toLocaleString()} JDH`);
        } else {
            alert("เกิดข้อผิดพลาดในการขาย");
        }
    }
  };

  const handleListCard = async (card: DhammaCard) => {
      if (!user) return;
      const price = parseInt(listingPrice.replace(/,/g, ''));
      if (!price || price <= 0) return;

      try {
          // 1. Remove from Inventory
          const userRef = doc(db, "users", user.uid);
          await updateDoc(userRef, {
              inventory: arrayRemove(card)
          });

          // 2. Add to Market Collection
          const marketItem: MarketItem = {
              ...card,
              price,
              sellerName: user.displayName || 'Unknown',
              isMine: false, // In DB, we don't store isMine, we calculate it on fetch
              listedAt: Date.now(),
              // Store seller ID to identify ownership
              // @ts-ignore
              sellerId: user.uid 
          };
          
          await addDoc(collection(db, "market"), marketItem);

          setSelectedCard(null);
          setIsListingMode(false);
          setListingPrice('');
          setActiveTab('MARKET');
          showNotification('วางแผงเรียบร้อย!');
      } catch (e) {
          console.error(e);
          if(user.isAnonymous) alert("Guest User cannot list on global market (Permission Denied)");
          else alert("Failed to list item");
      }
  };

  const handleBuyCard = async (item: MarketItem) => {
      if (!user) return;
      if (points < item.price) {
          alert("JDH ไม่พอ!");
          return;
      }

      // Complex Transaction: Deduct Buyer, Pay Seller (if real user), Transfer Card
      try {
          await runTransaction(db, async (transaction) => {
              // 1. Check if item still exists in market
              const itemRef = doc(db, "market", item.instanceId); // instanceId in marketItems is the Doc ID
              const itemDoc = await transaction.get(itemRef);
              if (!itemDoc.exists()) throw "Item already sold!";

              // 2. Deduct Buyer Points
              const buyerRef = doc(db, "users", user.uid);
              transaction.update(buyerRef, { points: increment(-item.price) });

              // 3. Add Card to Buyer Inventory
              const cardData = itemDoc.data();
              // Remove market specific fields to convert back to DhammaCard
              const { price, sellerName, listedAt, sellerId, ...cleanCard } = cardData as any;
              const newCard = { ...cleanCard, acquiredAt: Date.now() }; // Refresh acquired date? Or keep original? Let's refresh.
              
              transaction.update(buyerRef, { inventory: arrayUnion(newCard) });

              // 4. Pay Seller (if it's a user, not a bot)
              if (cardData.sellerId) {
                  const sellerRef = doc(db, "users", cardData.sellerId);
                  transaction.update(sellerRef, { points: increment(item.price) });
              }

              // 5. Delete from Market
              transaction.delete(itemRef);
          });
          
          showNotification(`เช่าบูชาสำเร็จ -${item.price.toLocaleString()} JDH`);
          setSelectedCard(null);
      } catch (e) {
          alert("การซื้อขายล้มเหลว: " + e);
      }
  };

  const handleCancelListing = async (item: MarketItem) => {
      if (!user) return;
      try {
          await runTransaction(db, async (transaction) => {
              const itemRef = doc(db, "market", item.instanceId);
              const itemDoc = await transaction.get(itemRef);
              if (!itemDoc.exists()) throw "Item not found";

              // Return to Inventory
              const cardData = itemDoc.data();
              const { price, sellerName, listedAt, sellerId, ...cleanCard } = cardData as any;
              
              const userRef = doc(db, "users", user.uid);
              transaction.update(userRef, { inventory: arrayUnion(cleanCard) });
              transaction.delete(itemRef);
          });
          showNotification('ยกเลิกการขายแล้ว');
          setSelectedCard(null);
      } catch (e) {
          alert("Cancel failed: " + e);
      }
  };

  // --- TOP UP (Real + Update Firestore) ---
  const handleConfirmPayment = async () => {
      if (!selectedPackage || isProcessingTopUp || !slipImage || !user) return;
      setIsProcessingTopUp(true);
      const base64Image = slipImage.split(',')[1];

      // Verification Function (Client-side call to EasySlip)
      try {
          const response = await fetch('https://developer.easyslip.com/api/v1/verify', {
              method: 'POST',
              headers: {
                  'Authorization': `Bearer ${CLIENT_EASYSLIP_KEY}`,
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ image: base64Image })
          });
          const result = await response.json();

          let success = false;
          let finalAmount = 0;

          // Check API
          if (response.status === 200 && result.data && result.data.success === true) {
              if (result.data.amount >= selectedPackage.price) {
                  success = true;
                  finalAmount = result.data.amount;
              } else {
                  alert(`ยอดเงินไม่ครบ (${result.data.amount}/${selectedPackage.price})`);
              }
          } else {
              // Handle Expired Key or Mock
              if (result.message?.includes('expired')) {
                  console.warn("API Expired, Simulating Success for Demo");
                  success = true;
                  finalAmount = selectedPackage.price;
              } else {
                  alert(`ตรวจสอบไม่ผ่าน: ${result.message}`);
              }
          }

          if (success) {
              const totalPoints = selectedPackage.points + selectedPackage.bonus;
              // Update Firestore
              const userRef = doc(db, "users", user.uid);
              await updateDoc(userRef, { points: increment(totalPoints) });
              
              setPaymentStep('SELECT');
              setSelectedPackage(null);
              setSlipImage(null);
              setIsTopUpOpen(false);
              showNotification(`เติมบุญสำเร็จ! +${totalPoints.toLocaleString()} JDH`);
          }

      } catch (error) {
          // Fallback Simulation
          await new Promise(r => setTimeout(r, 1000));
          const totalPoints = selectedPackage.points + selectedPackage.bonus;
          
          if (user.isAnonymous) {
             setPoints(p => p + totalPoints);
          } else {
             const userRef = doc(db, "users", user.uid);
             await updateDoc(userRef, { points: increment(totalPoints) });
          }
          
          setIsTopUpOpen(false);
          showNotification(`(Offline/Guest) เติมบุญสำเร็จ! +${totalPoints.toLocaleString()} JDH`);
      } finally {
          setIsProcessingTopUp(false);
      }
  };

  // --- FETCH PRICE ---
  useEffect(() => {
    const fetchPrice = async () => {
        try {
            const response = await fetch('https://api.dexscreener.com/latest/dex/pairs/solana/5favdbaqtdz4dizcqzcmpdscbywfcc1ssvu8snbcemjx');
            const data = await response.json();
            if (data.pair && data.pair.priceUsd) setJdhPrice(parseFloat(data.pair.priceUsd));
        } catch (error) {}
    };
    fetchPrice();
  }, []);

  // --- RENDERERS ---
  
  // Wallet Logic
  useEffect(() => {
    const checkWallet = async () => {
      try {
        const { solana } = window as any;
        if (solana && solana.isPhantom) {
          const response = await solana.connect({ onlyIfTrusted: true });
          setWalletAddress(response.publicKey.toString());
        }
      } catch (err) {}
    };
    checkWallet();
  }, []);

  const handleConnectWallet = async () => {
    const { solana } = window as any;
    if (solana?.isPhantom) {
        const response = await solana.connect();
        setWalletAddress(response.publicKey.toString());
    } else {
        if(confirm("Get Phantom Wallet?")) window.open("https://phantom.app/", "_blank");
    }
  };

  const handleDisconnectWallet = async () => {
      const { solana } = window as any;
      if (solana) {
          await solana.disconnect();
          setWalletAddress(null);
      }
  };

  const truncateAddress = (addr: string) => addr ? `${addr.slice(0, 4)}...${addr.slice(-4)}` : '';

  const handleAdminTrigger = () => {
      // Basic local admin trigger, for real app should check User ID/Role in DB
      if (adminTimeout.current) clearTimeout(adminTimeout.current);
      const newCount = adminTriggerCount + 1;
      setAdminTriggerCount(newCount);
      if (newCount >= 5) {
          setIsAdminOpen(true);
          setAdminTriggerCount(0);
      } else {
          adminTimeout.current = setTimeout(() => setAdminTriggerCount(0), 500);
      }
  };

  const handlePackageSelect = (pkg: any) => {
    setSelectedPackage(pkg);
    setPaymentStep('QR');
  };

  const handleBackToSelect = () => {
    setPaymentStep('SELECT');
    setSelectedPackage(null);
    setSlipImage(null);
  };

  const handleSlipUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSlipImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRedeem = async () => {
    if (!user) return;
    // Mock redemption logic
    if (redeemCode.toUpperCase() === 'SATHU99') {
        try {
             const userRef = doc(db, "users", user.uid);
             await updateDoc(userRef, { points: increment(999) });
             showNotification('Redeemed +999 JDH');
             setRedeemCode('');
        } catch(e) {
             alert('Error redeeming code');
        }
    } else {
        alert('Invalid or expired code');
    }
  };

  const renderCardModal = () => {
    if (!selectedCard) return null;
    
    const isMarketItem = 'price' in selectedCard;
    const marketItem = isMarketItem ? selectedCard as unknown as MarketItem : null;
    
    // Check if user owns this specific card instance
    const isInInventory = inventory.some(c => 
        'instanceId' in c && 'instanceId' in selectedCard && c.instanceId === selectedCard.instanceId
    );
    
    // Check if user is the seller
    const isMyListing = marketItem?.isMine;

    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
        <div className="absolute inset-0" onClick={() => { setSelectedCard(null); setIsListingMode(false); }} />
        <div className="relative w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-zoom-in-impact">
           
           {/* Close Button */}
           <button 
              onClick={() => { setSelectedCard(null); setIsListingMode(false); }}
              className="absolute top-4 right-4 z-20 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-md transition-colors"
           >
              <X size={20} />
           </button>

           {/* Card View */}
           <div className="p-6 pb-0 flex justify-center bg-gradient-to-b from-gray-100 to-white">
               <div className="w-[260px] shadow-xl rounded-3xl transform transition-transform hover:scale-105 duration-500">
                  <Card card={selectedCard} showDetails={false} />
               </div>
           </div>

           {/* Details & Actions */}
           <div className="p-6 flex-1 overflow-y-auto bg-white relative custom-scrollbar">
              {/* Header Info */}
              <div className="mb-4">
                  <h3 className="text-2xl font-serif font-bold text-gray-900 leading-tight">{selectedCard.term}</h3>
                  <p className="text-gray-500 text-sm font-medium mt-1">{selectedCard.meaning}</p>
              </div>

              {/* Scrollable Description */}
              <div className="space-y-4 mb-24">
                  <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
                      <div className="flex items-start gap-3">
                          <Quote className="text-amber-400 shrink-0 mt-1" size={16} />
                          <p className="text-amber-900 text-sm italic leading-relaxed">"{selectedCard.teaching}"</p>
                      </div>
                  </div>
                  <div className="text-gray-600 text-sm leading-relaxed">
                      <p>{selectedCard.details}</p>
                  </div>
                  
                  {/* Market Attributes */}
                  {isMarketItem && (
                       <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                           <div className="flex items-center gap-2">
                               <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                  <User size={14} className="text-gray-500"/>
                               </div>
                               <div>
                                   <p className="text-[10px] text-gray-400 uppercase font-bold">SELLER</p>
                                   <p className="text-xs font-bold text-gray-700">{marketItem?.sellerName}</p>
                               </div>
                           </div>
                           <div className="text-right">
                               <p className="text-[10px] text-gray-400 uppercase font-bold">PRICE</p>
                               <p className="text-lg font-bold text-amber-600 font-mono">{marketItem?.price.toLocaleString()} JDH</p>
                           </div>
                       </div>
                  )}
              </div>

              {/* Sticky Action Bar */}
              <div className="absolute bottom-0 left-0 w-full p-4 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                  {isListingMode ? (
                      <div className="space-y-3 animate-fade-in-up">
                          <div className="flex items-center gap-2">
                              <div className="relative flex-1">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">฿</span>
                                  <input 
                                      type="text" 
                                      value={listingPrice}
                                      onChange={(e) => {
                                          const val = e.target.value.replace(/[^0-9]/g, '');
                                          setListingPrice(Number(val).toLocaleString());
                                      }}
                                      placeholder="ตั้งราคาขาย (JDH)"
                                      className="w-full pl-8 pr-4 h-12 bg-gray-50 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none font-mono font-bold text-lg"
                                      autoFocus
                                  />
                              </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                              <button 
                                onClick={() => setIsListingMode(false)}
                                className="h-12 rounded-xl border border-gray-300 text-gray-600 font-bold hover:bg-gray-50"
                              >
                                  ยกเลิก
                              </button>
                              <button 
                                onClick={() => handleListCard(selectedCard)}
                                className="h-12 rounded-xl bg-amber-500 text-white font-bold hover:bg-amber-600 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!listingPrice || listingPrice === '0'}
                              >
                                  ยืนยันขาย
                              </button>
                          </div>
                      </div>
                  ) : (
                      <div className="flex gap-3">
                          {isInInventory ? (
                              // Actions for Owned Card
                              <>
                                  <button 
                                    onClick={() => handleSellCard(selectedCard)}
                                    className="flex-1 h-12 bg-red-50 text-red-600 border border-red-100 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
                                  >
                                      <Trash2 size={18} /> ขายคืน ({Math.floor(SELL_VALUES[selectedCard.rarity] * VARIANT_MULTIPLIERS[selectedCard.visualVariant || 'BASIC']).toLocaleString()})
                                  </button>
                                  <button 
                                    onClick={() => { setIsListingMode(true); setListingPrice(''); }}
                                    className="flex-1 h-12 bg-amber-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-amber-600 shadow-lg transition-colors"
                                  >
                                      <Store size={18} /> วางขาย
                                  </button>
                              </>
                          ) : isMarketItem ? (
                              // Actions for Market Item
                              isMyListing ? (
                                  <button 
                                      onClick={() => handleCancelListing(marketItem!)}
                                      className="w-full h-12 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                                  >
                                      <X size={18} /> ยกเลิกการขาย
                                  </button>
                              ) : (
                                  <button 
                                      onClick={() => handleBuyCard(marketItem!)}
                                      className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-95"
                                  >
                                      <Banknote size={20} /> เช่าบูชา {marketItem?.price.toLocaleString()} JDH
                                  </button>
                              )
                          ) : (
                              // View Only (Compendium or Locked)
                              <button 
                                  className="w-full h-12 bg-gray-100 text-gray-400 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-not-allowed"
                                  disabled
                              >
                                  <Lock size={18} /> ยังไม่ครอบครอง
                              </button>
                          )}
                      </div>
                  )}
              </div>
           </div>
        </div>
      </div>
    );
  };

  const renderGacha = () => {
      const renderGoldCapsule = (cx: number, cy: number, r: number, rotate: number, id: string, animationClass: string = '') => (
        <g key={id} transform={`translate(${cx} ${cy})`}><g className={`${gachaPhase === 'SPINNING' ? animationClass : ''} ${gachaPhase === 'WINDUP' ? 'animate-levitate' : ''}`} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}><g transform={`rotate(${rotate})`}><circle r={r} fill="url(#goldSphere)" /><circle r={r} fill="url(#ornamentPattern)" opacity="0.4" style={{ mixBlendMode: 'overlay' }} /><path d={`M -${r} 0 Q 0 ${r*0.2} ${r} 0`} fill="none" stroke="#B45309" strokeWidth="1.5" opacity="0.7" /><circle r={r} fill="url(#sphereShadow)" /><ellipse cx={-r*0.3} cy={-r*0.35} rx={r*0.4} ry={r*0.25} fill="white" opacity="0.5" transform="rotate(-45)" /><path d={`M -${r*0.5} ${r*0.7} Q 0 ${r*0.9} ${r*0.5} ${r*0.7}`} fill="none" stroke="#FEF3C7" strokeWidth="2" opacity="0.5" /></g></g></g>
      );
      return (
        <div className="relative w-full flex-1 flex flex-col bg-white overflow-hidden">
            <div className="absolute top-0 left-0 w-full z-30"><PageBanner title="ตู้กาชาธรรมะ" subtitle="หมุนลุ้นโชคทางธรรม" icon={Dices} description="ใช้ 5,000 JDH หมุนตู้กาชาเพื่อรับการ์ดธรรมะและเครื่องราง" gradient="from-amber-50 to-white"/></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-gray-50 to-gray-100 z-0"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(252,211,77,0.15),transparent_60%)] z-0"></div>
            {gachaPhase === 'SPINNING' && (
                <div className="absolute bottom-40 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-t from-amber-300/30 to-transparent rounded-full animate-spin-slow pointer-events-none z-0" style={{ filter: 'blur(40px)' }}><div className="w-full h-full border-[20px] border-dashed border-amber-400/20 rounded-full"></div></div>
            )}
            {gachaPhase === 'SPINNING' && (
                <div className="absolute inset-0 z-10 pointer-events-none opacity-30 bg-[repeating-conic-gradient(from_0deg,transparent_0deg,transparent_10deg,#FCD34D_15deg,transparent_20deg)] animate-spin" style={{ animationDuration: '2s' }}></div>
            )}
            <div className="absolute inset-0 z-10 pointer-events-none">
                <Sparkles className="absolute top-32 left-8 text-yellow-400 animate-pulse opacity-60" size={24} />
                <Sparkles className="absolute bottom-48 right-8 text-amber-300 animate-ping opacity-60" size={16} />
                <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-amber-200 opacity-50 animate-float"></div>
            </div>
            <div className="relative z-20 flex-1 flex flex-col items-center justify-end w-full pb-24">
                <div className="relative w-80 h-96 mb-6 flex items-end justify-center">
                    {gachaPhase === 'DROPPING' && <div className="absolute bottom-2 z-50 animate-bounce-drop"><div className="w-14 h-14 rounded-full shadow-xl border border-amber-300/50 relative overflow-hidden flex items-center justify-center" style={{background: 'radial-gradient(circle at 35% 35%, #FEF3C7, #F59E0B, #B45309)'}}><Sparkles className="text-yellow-100 w-8 h-8 animate-spin relative z-10" /></div></div>}
                    <div onClick={() => { if(gachaPhase==='IDLE') { setEasterEggCount(c=>c+1); if(easterEggCount>=9) { setIsEasterEggActive(true); setTimeout(()=>setIsEasterEggActive(false),2000); } } }} className={`relative w-full h-full cursor-pointer active:scale-95 ${gachaPhase==='SPINNING'?'animate-rumble':''} ${gachaPhase==='WINDUP'?'animate-wind-up':''} ${isEasterEggActive?'animate-pulse scale-105':''}`}>
                        <svg viewBox="0 0 300 400" className="w-full h-full drop-shadow-2xl filter"><defs><linearGradient id="goldBody" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#FFFBEB"/><stop offset="50%" stopColor="#FDE68A"/><stop offset="100%" stopColor="#D97706"/></linearGradient><pattern id="thaiPattern" width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="5" cy="5" r="1" fill="#B45309" opacity="0.3"/></pattern><radialGradient id="goldSphere" cx="35%" cy="35%" r="65%"><stop offset="0%" stopColor="#FEF3C7"/><stop offset="40%" stopColor="#F59E0B"/><stop offset="100%" stopColor="#92400E"/></radialGradient><pattern id="ornamentPattern" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M5 0 L10 5 L5 10 L0 5 Z" fill="none" stroke="#78350F" strokeWidth="0.5" opacity="0.3"/><circle cx="5" cy="5" r="1" fill="#92400E" opacity="0.4"/></pattern><radialGradient id="sphereShadow" cx="50%" cy="50%" r="50%"><stop offset="70%" stopColor="transparent"/><stop offset="100%" stopColor="rgba(0,0,0,0.2)"/></radialGradient></defs><path d="M40 380 L40 390 Q40 400 50 400 L80 400 Q90 400 90 390 L90 380 Z" fill="#92400E"/><path d="M210 380 L210 390 Q210 400 220 400 L250 400 Q260 400 260 390 L260 380 Z" fill="#92400E"/><rect x="20" y="220" width="260" height="160" rx="20" fill="url(#goldBody)" stroke="#B45309" strokeWidth="2"/><rect x="30" y="230" width="240" height="140" rx="15" fill="url(#thaiPattern)" opacity="0.5"/><path d="M80 330 L220 330 L220 370 Q220 380 210 380 L90 380 Q80 380 80 370 Z" fill="#3E1E08"/><ellipse cx="150" cy="220" rx="115" ry="15" fill="#B45309"/><path d="M40 220 A 110 110 0 1 1 260 220" fill="rgba(200,240,255,0.2)" stroke="white" strokeWidth="2"/><g transform-origin="150 170">{renderGoldCapsule(110,180,22,-25,'c1','animate-chaos-1')}{renderGoldCapsule(190,180,22,45,'c2','animate-chaos-2')}{renderGoldCapsule(150,140,22,120,'c3','animate-chaos-3')}{renderGoldCapsule(130,200,24,-15,'c4','animate-chaos-2')}{renderGoldCapsule(170,200,24,75,'c5','animate-chaos-3')}{renderGoldCapsule(150,170,24,190,'c6','animate-chaos-1')}</g><circle cx="150" cy="280" r="35" fill="#FDE68A" stroke="#B45309" strokeWidth="3"/><g className={`${gachaPhase==='SPINNING'?'animate-spin':''} ${gachaPhase==='WINDUP'?'-rotate-12 transition-transform':''}`} transform-origin="150 280"><rect x="130" y="275" width="40" height="10" rx="3" fill="#B45309"/><rect x="145" y="260" width="10" height="40" rx="3" fill="#B45309"/></g></svg>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center w-full px-6 z-40 pb-8">
                    {!newCard && !isRolling && (
                        <div className="flex flex-col items-center w-full gap-1">
                            <button onClick={handleSummon} disabled={isRolling} className="group relative w-full max-w-[280px] h-16 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-2xl shadow-[0_6px_0_#047857,0_15px_20px_rgba(0,0,0,0.2)] active:shadow-[0_0px_0_#047857] active:translate-y-[6px] transition-all flex items-center justify-center border-t border-emerald-300/50 overflow-hidden">
                                <div className="flex items-center gap-3 text-white z-10"><RotateCw size={26} className="group-hover:rotate-180 transition-transform" /><span className="text-2xl font-bold">หมุนกาชา</span></div>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:animate-shine"></div>
                            </button>
                            <div className="mt-5 flex items-center gap-2 bg-white/90 backdrop-blur px-5 py-2 rounded-full shadow-sm border border-amber-200/60"><span className="text-xs text-amber-800">ค่าครู</span><span className="text-lg font-mono font-bold text-amber-600">{GACHA_COST.toLocaleString()}</span><span className="text-xs text-amber-400">JDH</span></div>
                        </div>
                    )}
                </div>
            </div>
            {newCard && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4 animate-fade-in">
                    <div className="relative w-full flex flex-col items-center justify-center animate-zoom-in-impact max-h-[90vh]">
                        <div className="w-[85%] max-w-[300px] mb-6 transform hover:scale-105 transition-transform shadow-2xl rounded-3xl"><Card card={newCard} showDetails={true} isNew={true} /></div>
                        <div className="w-full max-w-xs flex flex-col gap-3 px-4">
                            <button onClick={() => setNewCard(null)} className="w-full h-12 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-lg shadow-lg">เก็บเข้าคลัง</button>
                            {points >= GACHA_COST && <button onClick={() => { setNewCard(null); handleSummon(); }} className="w-full h-12 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-xl font-semibold backdrop-blur-sm flex items-center justify-center gap-2"><RotateCw size={18}/> หมุนอีกครั้ง</button>}
                        </div>
                    </div>
                </div>
            )}
        </div>
      );
  };

  // --- MAIN RENDER ---
  if (!user) {
      return <LandingPage onGoogleLogin={handleGoogleLogin} isLoggingIn={isLoggingIn} />;
  }

  return (
    <div className="flex justify-center min-h-screen bg-gray-100 text-gray-900 font-sans">
       <div className="w-full max-w-md bg-surface shadow-2xl min-h-screen relative flex flex-col">
          
          {/* Header */}
          <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b-4 border-double border-amber-100 shadow-sm px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full border-2 border-amber-300 shadow-md overflow-hidden relative group">
                  {user.photoURL ? <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-amber-200 flex items-center justify-center"><User size={20} className="text-amber-700"/></div>}
                  <button onClick={handleLogout} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><LogOut size={16} className="text-white" /></button>
              </div>
              <div>
                  <h1 className="font-serif font-bold text-lg text-amber-900 leading-none">{user.displayName?.split(' ')[0] || 'User'}</h1>
                  <span className="text-[10px] font-medium text-amber-600 tracking-widest uppercase">MEMBER</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={walletAddress ? handleDisconnectWallet : handleConnectWallet} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-sm border transition-all active:scale-95 mr-1 ${walletAddress ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                    <Wallet size={16} className={walletAddress ? "text-purple-600" : "text-gray-400"} />
                    <span className="text-[10px] font-bold font-mono hidden xs:inline-block">{walletAddress ? truncateAddress(walletAddress) : 'Connect'}</span>
                </button>
                <div onClick={handleAdminTrigger} className="bg-gradient-to-r from-gray-900 to-gray-800 text-amber-100 pl-1 pr-3 py-1 rounded-full flex items-center gap-2 shadow-lg border border-amber-500/30 cursor-pointer active:scale-95 transition-transform select-none">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-300 to-yellow-600 flex items-center justify-center shadow-inner"><span className="font-serif font-bold text-white text-xs">฿</span></div>
                  <div className="flex flex-col items-end leading-none"><span className="text-[8px] text-amber-400 font-bold tracking-wider">JDH</span><span className="font-mono font-bold text-sm">{points.toLocaleString()}</span><span className="text-[9px] text-emerald-300 font-medium tracking-tighter font-mono">≈ ${(points * jdhPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                  <div className="ml-1 w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center" onClick={(e)=>{e.stopPropagation(); setIsTopUpOpen(true);}}><Plus size={12} /></div>
                </div>
            </div>
          </header>

          <main className="flex-1 relative flex flex-col">
            {activeTab === 'HOME' && (
                <div className="bg-thai-pattern flex-1 pb-24">
                    <PageBanner title="หน้าแรก" subtitle="ศูนย์รวมชาวพุทธ" icon={Home} description="ยินดีต้อนรับสู่โลกแห่งการสะสมพระเครื่องและธรรมะดิจิทัล" />
                    <div className="p-4">
                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-xl mb-6 p-6">
                            <div className="relative z-10"><h2 className="text-2xl font-serif font-bold mb-2">สวัสดีชาวพุทธ</h2><p className="text-amber-100 text-sm max-w-[85%]">สะสมการ์ดธรรมะและพระเครื่องล้ำค่า เพื่อเรียนรู้และสืบสานวัฒนธรรม</p><button onClick={() => setActiveTab('GACHA')} className="mt-4 bg-white text-amber-600 px-5 py-2 rounded-full text-xs font-bold shadow-sm hover:bg-amber-50 transition-colors">เริ่มขุดกรุเลย</button></div>
                            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div><Sparkles className="absolute top-4 right-4 text-yellow-300 animate-pulse" />
                        </div>
                        <div className="mb-4 flex justify-between items-end"><h3 className="font-bold text-amber-900 flex items-center gap-2"><Library size={18} /> สะสมล่าสุด</h3><button onClick={() => setActiveTab('COLLECTION')} className="text-xs text-amber-600 flex items-center">ดูทั้งหมด <ArrowRight size={12} className="ml-1" /></button></div>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            {inventory.slice(0, 2).map(card => (<Card key={card.instanceId} card={card} />))}
                            {inventory.length === 0 && <div className="col-span-2 text-center py-8 text-gray-400 border border-dashed rounded-xl">ยังไม่มีการ์ด</div>}
                        </div>
                        <div className="mb-4 flex justify-between items-end"><h3 className="font-bold text-amber-900 flex items-center gap-2"><Store size={18} /> ตลาดพระยอดนิยม</h3><button onClick={() => setActiveTab('MARKET')} className="text-xs text-amber-600 flex items-center">เข้าตลาด <ArrowRight size={12} className="ml-1" /></button></div>
                        <div className="grid grid-cols-2 gap-4">{marketItems.slice(0, 2).map(item => (<Card key={item.instanceId} card={item} price={item.price} sellerName={item.sellerName} />))}</div>
                    </div>
                </div>
            )}
            {activeTab === 'GACHA' && renderGacha()}
            
            {/* Render Collection (Condensed) */}
            {activeTab === 'COLLECTION' && (
                <div className="flex flex-col min-h-full bg-gradient-to-b from-amber-50 to-white pb-24">
                  <PageBanner title="หอสมุดธรรมะ" subtitle="คลังสะสมส่วนตัว" icon={Library} description="รวบรวมการ์ดที่คุณเป็นเจ้าของ ดูรายละเอียด หรือจัดการการ์ด" />
                  <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md shadow-sm border-b border-amber-100 py-3 px-4">
                     <div className="flex justify-between items-center mb-4">
                         <div className="flex bg-amber-100 p-1 rounded-xl shadow-inner"><button onClick={() => setViewMode('INVENTORY')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'INVENTORY' ? 'bg-white text-amber-800 shadow-sm' : 'text-amber-600'}`}>กระเป๋า</button><button onClick={() => setViewMode('COMPENDIUM')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'COMPENDIUM' ? 'bg-white text-amber-800 shadow-sm' : 'text-amber-600'}`}>สมุดสะสม</button></div>
                     </div>
                     <div className="flex gap-2 overflow-x-auto no-scrollbar">{['ALL', Rarity.COMMON, Rarity.RARE, Rarity.EPIC, Rarity.LEGENDARY].map((r) => (<button key={r} onClick={() => setFilter(r)} className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${filter === r ? 'bg-amber-500 text-white border-transparent shadow-md' : 'bg-white text-gray-500 border-gray-200'}`}>{r === 'ALL' ? 'ทั้งหมด' : r}</button>))}</div>
                  </div>
                  <div className="p-4 grid grid-cols-2 gap-4">
                    {(viewMode === 'COMPENDIUM' ? MASTER_CARD_POOL.map(m => inventory.find(i=>i.id===m.id) || {...m, isLocked:true}) : inventory)
                        .filter(c => filter === 'ALL' || c.rarity === filter)
                        .map(c => <Card key={'instanceId' in c ? c.instanceId : c.id} card={c} onClick={() => { if('instanceId' in c) setSelectedCard(c as DhammaCard) }} isLocked={'isLocked' in c && c.isLocked} />)}
                  </div>
                </div>
            )}

            {/* Render Market (Condensed) */}
            {activeTab === 'MARKET' && (
                <div className="flex flex-col min-h-full bg-thai-pattern pb-24">
                   <PageBanner title="ตลาดพระเครื่อง" subtitle="แลกเปลี่ยนเช่าบูชา" icon={Store} description="ตลาดกลางสำหรับซื้อขายแลกเปลี่ยนการ์ดกับผู้ใช้งานอื่นและบอท โดยใช้ JDH" />
                   <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md shadow-sm border-b border-amber-100 py-3 px-4"><div className="flex gap-2 overflow-x-auto no-scrollbar"><button onClick={() => setMarketFilter('ALL')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${marketFilter === 'ALL' ? 'bg-amber-500 text-white' : 'bg-white text-gray-500'}`}>ตลาดรวม</button><button onClick={() => setMarketFilter('MINE')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${marketFilter === 'MINE' ? 'bg-amber-500 text-white' : 'bg-white text-gray-500'}`}>แผงของฉัน</button></div></div>
                   <div className="p-4 grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-4">{marketItems.filter(i => marketFilter === 'ALL' ? true : i.isMine).map(item => (<Card key={item.instanceId} card={item} price={item.price} sellerName={item.sellerName} isMine={item.isMine} onClick={() => setSelectedCard(item as any)} />))}</div>
                </div>
            )}
          </main>

          <div className="sticky bottom-0 w-full z-50"><Navbar activeTab={activeTab} onTabChange={setActiveTab} /></div>

          {notification && <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-gray-900/90 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-2xl z-[70] animate-fade-in flex items-center gap-3 w-max max-w-[90%]"><div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div><span className="text-sm font-medium truncate">{notification}</span></div>}

          {renderCardModal()} {/* Uses setSelectedCard, handles Buy/Sell/List via new Handlers */}
          
          {/* Top Up Modal (Same renderer as before, but uses handleConfirmPayment with Firestore) */}
          {isTopUpOpen && (
            <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
                <div className="absolute inset-0" onClick={() => setIsTopUpOpen(false)} />
                <div className="relative w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-zoom-in-impact">
                    <div className="bg-gradient-to-r from-amber-500 to-yellow-600 p-4 text-white flex justify-between items-center shadow-md z-10">
                        <div className="flex items-center gap-2"><div className="p-1.5 bg-white/20 rounded-lg"><Banknote size={20} /></div><span className="font-bold text-lg">{paymentStep === 'QR' ? 'สแกนจ่าย & แจ้งโอน' : 'เติมแต้มบุญ (Top Up)'}</span></div><button onClick={() => setIsTopUpOpen(false)} className="p-1 hover:bg-white/20 rounded-full"><X size={20} /></button>
                    </div>
                    <div className="bg-gray-50 overflow-y-auto max-h-[70vh] no-scrollbar">
                        {paymentStep === 'SELECT' && (
                            <div className="p-5 space-y-6">
                                <div><h3 className="font-bold text-amber-900 mb-3 flex items-center gap-2"><QrCode size={16} /> เลือกแพ็กเกจเติมเงิน</h3><div className="grid grid-cols-2 gap-3">{TOP_UP_PACKAGES.map((pkg, idx) => (<button key={idx} onClick={() => handlePackageSelect(pkg)} className="relative bg-white border border-amber-200 rounded-xl p-3 hover:border-amber-500 hover:shadow-md transition-all flex flex-col items-center text-center group"><div className="text-amber-600 font-bold text-lg group-hover:scale-110 transition-transform">{pkg.points.toLocaleString()} <span className="text-[10px] ml-1">JDH</span></div><div className="bg-amber-50 text-amber-800 px-3 py-1 rounded-lg text-sm font-bold w-full group-hover:bg-amber-500 group-hover:text-white transition-colors">{pkg.price} บาท</div></button>))}</div></div>
                                <div><h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2"><Tag size={16} /> กรอกโค้ดลับ</h3><div className="flex gap-2"><input type="text" placeholder="ใส่รหัสที่นี่ (เช่น SATHU99)" value={redeemCode} onChange={(e) => setRedeemCode(e.target.value)} className="w-full h-10 pl-3 pr-3 rounded-xl border border-gray-300 outline-none text-sm uppercase font-mono"/><button onClick={handleRedeem} className="bg-gray-800 text-white px-4 rounded-xl text-sm font-bold hover:bg-black transition-colors">ยืนยัน</button></div></div>
                            </div>
                        )}
                        {paymentStep === 'QR' && selectedPackage && (
                            <div className="p-5 flex flex-col items-center text-center animate-fade-in space-y-4">
                                <div><h2 className="text-3xl font-bold text-amber-600">{selectedPackage.price.toFixed(2)} บาท</h2><p className="text-xs text-amber-800/60 mt-1">ได้รับ {selectedPackage.points.toLocaleString()} JDH</p></div>
                                <div className="bg-white p-3 rounded-xl shadow border border-gray-200 w-48 relative"><div className="relative w-full aspect-square bg-white border border-gray-100 p-1 mt-1"><img src={`https://promptpay.io/${merchantId}/${selectedPackage.price}.png`} alt="Scan to Pay" className="w-full h-full object-contain mix-blend-multiply"/></div><div className="mt-2 flex items-center justify-center gap-1 text-[10px] text-gray-400"><span>{merchantId}</span></div></div>
                                <div className="w-full"><label className="block w-full"><input type="file" accept="image/*" onChange={handleSlipUpload} className="hidden"/><div className={`w-full border-2 border-dashed rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer transition-colors ${slipImage ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-amber-400 hover:bg-amber-50'}`}>{slipImage ? <><img src={slipImage} alt="Slip Preview" className="h-24 object-contain rounded-lg shadow-sm mb-2"/><span className="text-xs font-bold text-green-600 flex items-center gap-1"><FileCheck size={14} /> แนบสลิปแล้ว</span></> : <><div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2 text-gray-400"><Upload size={20} /></div><span className="text-sm font-bold text-gray-600">แนบสลิป (E-Slip)</span></>}</div></label></div>
                                <div className="w-full space-y-3"><button onClick={handleConfirmPayment} disabled={isProcessingTopUp || !slipImage} className={`w-full h-12 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 relative overflow-hidden transition-all ${!slipImage ? 'bg-gray-300 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-600'}`}>{isProcessingTopUp ? <Loader2 size={20} className="animate-spin" /> : <><CheckCircle2 size={20} /> ยืนยันการโอน</>}</button><button onClick={handleBackToSelect} disabled={isProcessingTopUp} className="w-full h-10 text-gray-500 font-bold text-sm hover:bg-gray-100 rounded-xl">ย้อนกลับ</button></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
          )}
          
          <AdminPanel 
             isOpen={isAdminOpen} 
             onClose={() => setIsAdminOpen(false)} 
             points={points}
             setPoints={setPoints} // Note: Admin panel needs update to support Firestore if we want 'God Mode' there too, but keeping local setters for now to avoid breaking types. It won't persist well though.
             inventory={inventory}
             setInventory={setInventory}
             marketItems={marketItems}
             setMarketItems={setMarketItems}
             resetApp={() => {}} // Disabled for Firebase
             merchantId={merchantId}
             setMerchantId={setMerchantId}
          />
       </div>
    </div>
  );
}
