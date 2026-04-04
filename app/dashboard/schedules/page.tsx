"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { collection, query, onSnapshot, addDoc, deleteDoc, doc, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X, Calendar, Clock, CreditCard, ArrowRight, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { format, addMonths } from "date-fns";
import { useCurrencyStore } from "@/store/currencyStore";
import { useNotification } from "@/hooks/useNotification";

interface Schedule {
  id: string;
  name: string;
  amount: number;
  type: "income" | "expense";
  frequency: "monthly" | "weekly" | "yearly";
  nextDate: string;
  category: string;
}

export default function SchedulesPage() {
  const { user } = useAuthStore();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currency, formatAmount } = useCurrencyStore();
  const { sendNotification } = useNotification();
  
  // Form State
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [frequency, setFrequency] = useState<"monthly" | "weekly" | "yearly">("monthly");
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState("Subscription");

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, `users/${user.uid}/schedules`), orderBy("nextDate", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setSchedules(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Schedule[]);
    }, (error) => console.error("Schedules snapshot error:", error));
    return () => unsubscribe();
  }, [user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !name || !amount) return;
    
    const { currency } = useCurrencyStore.getState();
    const amountInBase = parseFloat(amount) / (currency.rate || 1);

    setLoading(true);
    try {
      await addDoc(collection(db, `users/${user.uid}/schedules`), {
        name,
        amount: amountInBase,
        type,
        frequency,
        nextDate: startDate,
        category,
        createdAt: new Date().toISOString()
      });

      sendNotification("Transaction Scheduled!", {
        body: `${name}: ${currency.symbol}${amount} (${frequency})`,
      });

      toast.success("Recurring transaction scheduled!");
      setIsModalOpen(false);
      setName("");
      setAmount("");
    } catch (err) {
      toast.error("Failed to schedule.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!user || !confirm("Stop this subscription/schedule?")) return;
    try {
      await deleteDoc(doc(db, `users/${user.uid}/schedules`, id));
      toast.success("Schedule removed.");
    } catch (err) {
      toast.error("Error deleting!");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recurring Payments</h1>
          <p className="text-muted-foreground mt-1">Manage subscriptions and automated transfers.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="h-10 bg-primary hover:bg-primary-hover shadow-lg shadow-primary/20">
          <Plus className="mr-2 h-4 w-4" /> Add Schedule
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {schedules.length === 0 ? (
          <Card className="glass col-span-full p-16 text-center text-muted-foreground bg-card/20 border-dashed border-white/10">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p className="text-sm">No recurring payments scheduled yet.</p>
            <Button variant="link" onClick={() => setIsModalOpen(true)} className="mt-2 text-primary">Set up your first one</Button>
          </Card>
        ) : (
          schedules.map(sch => (
            <Card key={sch.id} className="glass overflow-hidden group transition-all hover:border-primary/30">
              <CardContent className="p-0">
                <div className={`h-1.5 w-full ${sch.type === "income" ? "bg-primary" : "bg-destructive/60"}`}></div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-lg">{sch.name}</h4>
                      <p className="text-xs text-muted-foreground capitalize flex items-center mt-1">
                        <Clock className="h-3 w-3 mr-1" /> {sch.frequency} • {sch.category}
                      </p>
                    </div>
                    <div className={`text-xl font-mono font-bold ${sch.type === "income" ? "text-primary" : "text-white"}`}>
                      {sch.type === "income" ? "+" : "-"}{formatAmount(sch.amount)}
                    </div>
                  </div>
                  
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Next Due</div>
                    <div className="text-sm font-medium">{format(new Date(sch.nextDate), "MMM dd, yyyy")}</div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" className="flex-1 text-xs border-white/5 h-9" disabled>
                      Pause
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-muted-foreground hover:text-destructive h-9 w-9"
                      onClick={() => handleDelete(sch.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="grid gap-6">
        <Card className="glass overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Bills & Income</CardTitle>
            <CardDescription>Estimated cashflow based on your schedules</CardDescription>
          </CardHeader>
          <CardContent>
            {schedules.length > 0 ? (
              <div className="space-y-4">
                {schedules.map((sch, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white/2 rounded-xl group hover:bg-white/5 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center border border-white/5">
                        <CreditCard className={`h-4 w-4 ${sch.type === "income" ? "text-primary" : "text-destructive"}`} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{sch.name}</p>
                        <p className="text-xs text-muted-foreground">Due in {Math.ceil((new Date(sch.nextDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right hidden sm:block">
                        <p className="text-xs font-mono font-bold tracking-tight">{formatAmount(sch.amount)}</p>
                        <p className="text-[10px] uppercase text-muted-foreground font-bold">{sch.type}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-center text-muted-foreground py-8 opacity-50">No upcoming items to show.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <div className="bg-card w-full max-w-md rounded-3xl border border-white/10 shadow-2xl p-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-16 bg-primary/5 rounded-full blur-3xl -z-10"></div>
             <button onClick={() => setIsModalOpen(false)} className="absolute right-4 top-4 text-muted-foreground hover:text-white">
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-2xl font-bold mb-6">Schedule Transaction</h2>
            <form onSubmit={handleCreate} className="space-y-5">
              <div className="space-y-2">
                <Label>Service/Payee Name</Label>
                <Input placeholder="Netflix, Gym, Salary, etc." value={name} onChange={(e) => setName(e.target.value)} required className="glass" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Amount ({currency.symbol})</Label>
                  <Input type="number" step="0.01" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} required className="glass font-mono" />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <select 
                    value={type} 
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-md border border-border bg-card/50 glass text-sm"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Frequency</Label>
                  <select 
                    value={frequency} 
                    onChange={(e) => setFrequency(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-md border border-border bg-card/50 glass text-sm"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="weekly">Weekly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input value={category} onChange={(e) => setCategory(e.target.value)} required className="glass" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required className="glass" />
              </div>

              <Button type="submit" className="w-full h-12 shadow-lg shadow-primary/20 mt-4" disabled={loading}>
                {loading ? "Scheduling..." : "Create Schedule"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
