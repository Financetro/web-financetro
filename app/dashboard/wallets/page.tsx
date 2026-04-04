"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc,
  updateDoc 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Wallet, 
  CreditCard, 
  Coins, 
  Trash2, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Globe
} from "lucide-react";
import { toast } from "sonner";
import { useCurrencyStore } from "@/store/currencyStore";

type WalletItem = {
  id: string;
  name: string;
  type: "bank" | "cash" | "crypto" | "investment";
  balance: number;
  currency: string;
  address?: string; // For crypto
};

export default function WalletsPage() {
  const { user } = useAuthStore();
  const [wallets, setWallets] = useState<WalletItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const { currency, formatAmount } = useCurrencyStore();
  
  // Form states
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<WalletItem["type"]>("bank");
  const [newBalance, setNewBalance] = useState("");
  const [newAddress, setNewAddress] = useState("");

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, `users/${user.uid}/wallets`));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const walletData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as WalletItem[];
      setWallets(walletData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAddWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newName || !newBalance) return;

    try {
      await addDoc(collection(db, `users/${user.uid}/wallets`), {
        name: newName,
        type: newType,
        balance: parseFloat(newBalance),
        currency: "USD",
        address: newAddress || null,
        createdAt: new Date().toISOString()
      });
      toast.success("Wallet added successfully!");
      setIsAdding(false);
      // Reset form
      setNewName("");
      setNewBalance("");
      setNewAddress("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add wallet.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!user || !confirm("Delete this wallet?")) return;
    try {
      await deleteDoc(doc(db, `users/${user.uid}/wallets`, id));
      toast.success("Wallet removed.");
    } catch (error) {
      toast.error("Failed to delete.");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center p-20">
      <div className="animate-spin text-primary font-bold">LOADING...</div>
    </div>
  );

  const totalNetWorth = wallets.reduce((sum, w) => sum + w.balance, 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Wallets & Accounts</h1>
          <p className="text-muted-foreground mt-1">Manage your liquid assets and crypto holdings.</p>
        </div>
        <Button onClick={() => setIsAdding(!isAdding)} className="shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
          {isAdding ? "Cancel" : <><Plus className="mr-2 h-4 w-4" /> Add New</>}
        </Button>
      </div>

      {isAdding && (
        <Card className="glass border-primary/20 animate-in slide-in-from-top-4 duration-500 overflow-hidden">
          <div className="h-1 bg-linear-to-r from-primary via-blue-500 to-purple-500" />
          <CardHeader>
            <CardTitle>Register New Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddWallet} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Account Name</label>
                <Input 
                  placeholder="e.g. Chase Bank, Cash, Keplr" 
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="glass"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Asset Type</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-white/10 bg-card/60 backdrop-blur-md px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  value={newType}
                  onChange={e => setNewType(e.target.value as any)}
                >
                  <option value="bank">Bank Account</option>
                  <option value="cash">Physical Cash</option>
                  <option value="crypto">Crypto Wallet</option>
                  <option value="investment">Investment Portfolio</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Current Balance ({currency.code})</label>
                <Input 
                  type="number" 
                  step="0.01" 
                  placeholder="0.00" 
                  value={newBalance}
                  onChange={e => setNewBalance(e.target.value)}
                  className="glass font-mono"
                  required
                />
              </div>
              {newType === "crypto" && (
                <div className="space-y-2 col-span-full md:col-span-1">
                  <label className="text-sm font-medium text-muted-foreground">Wallet Address (Optional)</label>
                  <Input 
                    placeholder="0x... or cosmos..." 
                    value={newAddress}
                    onChange={e => setNewAddress(e.target.value)}
                    className="glass font-mono text-xs"
                  />
                </div>
              )}
              <div className="md:col-start-2 lg:col-start-4">
                <Button type="submit" className="w-full h-10 font-bold uppercase tracking-wider">Save Account</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Net Worth Summary */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="glass md:col-span-1 relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary/5 -z-10 group-hover:bg-primary/10 transition-colors" />
          <CardHeader className="pb-2">
             <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total Assets</p>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black font-mono tracking-tighter">
              {formatAmount(totalNetWorth)}
            </div>
            <div className="flex items-center mt-2 text-[10px] font-bold text-primary">
               <TrendingUp className="h-3 w-3 mr-1" />
               LIVE MARKET VALUE
            </div>
          </CardContent>
        </Card>
        
        {/* Placeholder for exchange rates or other insights */}
        <Card className="glass md:col-span-3 border-white/5 flex items-center justify-center p-6 text-center group">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-primary)_0%,transparent_70%)] opacity-5 pointer-events-none" />
           <div className="max-w-md">
             <h4 className="text-sm font-bold mb-1 group-hover:text-primary transition-colors">Market Intelligence</h4>
             <p className="text-xs text-muted-foreground">Connect your trading accounts to see real-time performance and allocation charts.</p>
           </div>
        </Card>
      </div>

      {/* Wallet List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {wallets.length === 0 ? (
           <div className="col-span-full p-20 text-center border-2 border-dashed border-white/5 rounded-3xl opacity-50">
             <Wallet className="h-12 w-12 mx-auto mb-4 opacity-20" />
             <p>No accounts registered yet.</p>
           </div>
        ) : (
          wallets.map((wallet) => (
            <Card key={wallet.id} className="glass group hover:border-primary/30 transition-all duration-300 relative overflow-hidden">
               {/* Background Glow based on type */}
               <div className={`absolute -top-10 -right-10 w-24 h-24 blur-2xl rounded-full opacity-10 transition-all group-hover:opacity-20 ${
                 wallet.type === 'crypto' ? 'bg-orange-500' : 
                 wallet.type === 'bank' ? 'bg-primary' : 
                 wallet.type === 'cash' ? 'bg-green-500' : 'bg-purple-500'
               }`} />

               <CardHeader className="flex flex-row items-center justify-between pb-2">
                 <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${
                      wallet.type === 'crypto' ? 'bg-orange-500/10 text-orange-500' : 
                      wallet.type === 'bank' ? 'bg-primary/10 text-primary' : 
                      wallet.type === 'cash' ? 'bg-green-500/10 text-green-500' : 'bg-purple-500/10 text-purple-500'
                    }`}>
                       {wallet.type === 'crypto' ? <Coins size={20} /> : 
                        wallet.type === 'bank' ? <CreditCard size={20} /> : 
                        wallet.type === 'cash' ? <Wallet size={20} /> : <Globe size={20} />}
                    </div>
                    <div>
                      <CardTitle className="text-md">{wallet.name}</CardTitle>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest opacity-70">{wallet.type}</p>
                    </div>
                 </div>
                 <button 
                  onClick={() => handleDelete(wallet.id)}
                  className="p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                 >
                   <Trash2 size={16} />
                 </button>
               </CardHeader>
               
               <CardContent>
                 <div className="mt-4">
                    <p className="text-2xl font-mono font-bold tracking-tight">
                       {formatAmount(wallet.balance)}
                    </p>
                 </div>
                 
                 {wallet.address && (
                   <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between group/addr cursor-pointer hover:bg-white/10 transition-colors">
                      <div className="min-w-0">
                        <p className="text-[9px] uppercase font-bold text-muted-foreground mb-1 leading-none">Wallet Address</p>
                        <p className="text-[10px] font-mono truncate max-w-[150px]">{wallet.address}</p>
                      </div>
                      <ExternalLink size={12} className="text-muted-foreground group-hover/addr:text-primary" />
                   </div>
                 )}

                 <Button variant="ghost" className="w-full mt-6 h-8 text-[10px] font-bold uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-all">
                    View Details <ChevronRight size={12} className="ml-1" />
                 </Button>
               </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
