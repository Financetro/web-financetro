"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { collection, query, onSnapshot, addDoc, deleteDoc, doc, updateDoc, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Target, Trash2, X, Trophy } from "lucide-react";
import { toast } from "sonner";
import { useCurrencyStore } from "@/store/currencyStore";
import { useNotification } from "@/hooks/useNotification";

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  category: string;
}

export default function GoalsPage() {
  const { user } = useAuthStore();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [current, setCurrent] = useState("");
  const [loading, setLoading] = useState(false);
  const { formatAmount, currency } = useCurrencyStore();
  const { sendNotification } = useNotification();

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, `users/${user.uid}/goals`), orderBy("name", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const goalsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Goal[];
      setGoals(goalsData);
    }, (error) => console.error("Goals snapshot error:", error));
    return () => unsubscribe();
  }, [user]);

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !name || !target) return;
    const { currency } = useCurrencyStore.getState();
    const targetInBase = parseFloat(target) / (currency.rate || 1);
    const currentInBase = (parseFloat(current) || 0) / (currency.rate || 1);

    setLoading(true);
    try {
      await addDoc(collection(db, `users/${user.uid}/goals`), {
        name,
        targetAmount: targetInBase,
        currentAmount: currentInBase,
        createdAt: new Date().toISOString()
      });

      sendNotification("New Goal Set!", {
        body: `Target for ${name}: ${currency.symbol}${parseFloat(target)}`,
      });

      toast.success("Savings goal set!");
      setIsModalOpen(false);
      setName("");
      setTarget("");
      setCurrent("");
    } catch (e) {
      toast.error("Failed to add goal.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!user || !confirm("Delete this goal?")) return;
    try {
      await deleteDoc(doc(db, `users/${user.uid}/goals`, id));
      toast.success("Goal removed.");
    } catch (e) {
      toast.error("Error deleting goal.");
    }
  };

  const handleQuickAdd = async (id: string, amount: number) => {
    if (!user) return;
    const goal = goals.find(g => g.id === id);
    if (!goal) return;
    const { currency } = useCurrencyStore.getState();
    const amountInBase = amount / (currency.rate || 1);

    try {
      await updateDoc(doc(db, `users/${user.uid}/goals`, id), {
        currentAmount: goal.currentAmount + amountInBase
      });

      sendNotification("Goal Contribution Added!", {
        body: `${currency.symbol}${amount} added to ${goal.name}`,
      });

      toast.success(`${formatAmount(amount)} added to ${goal.name}!`);
    } catch (e) {
      toast.error("Error updating goal.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Savings Goals</h1>
          <p className="text-muted-foreground mt-1">Plan and track your long-term dreams.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="h-10">
          <Plus className="mr-2 h-4 w-4" /> New Goal
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {goals.length === 0 ? (
          <Card className="glass col-span-full p-12 text-center text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>No goals set yet. Start by creating one!</p>
          </Card>
        ) : (
          goals.map((goal) => {
            const percentage = Math.round((goal.currentAmount / goal.targetAmount) * 100);
            const isCompleted = percentage >= 100;
            return (
              <Card key={goal.id} className={`glass overflow-hidden relative group transition-all hover:scale-[1.02] ${isCompleted ? 'border-primary/40' : ''}`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{goal.name}</CardTitle>
                      <CardDescription>Target: {formatAmount(goal.targetAmount)}</CardDescription>
                    </div>
                    {isCompleted ? (
                      <div className="p-2 bg-primary/20 rounded-lg text-primary animate-bounce">
                        <Trophy className="h-5 w-5" />
                      </div>
                    ) : (
                      <Target className="h-5 w-5 text-muted-foreground opacity-50" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-muted-foreground">Progress</span>
                    <span className={isCompleted ? "text-primary font-bold" : ""}>
                      {formatAmount(goal.currentAmount)} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden shadow-inner">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${isCompleted ? "bg-primary" : "bg-primary/60"}`}
                      style={{ width: `${Math.min(100, percentage)}%` }}
                    ></div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs border-white/5 hover:bg-white/5"
                      onClick={() => handleQuickAdd(goal.id, 10)}
                    >
                      +{currency.symbol}10
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs border-white/5 hover:bg-white/5"
                      onClick={() => handleQuickAdd(goal.id, 50)}
                    >
                      +{currency.symbol}50
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDelete(goal.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
                {isCompleted && (
                  <div className="absolute top-0 right-0 p-1 bg-primary text-[10px] font-bold text-white uppercase rounded-bl-lg">
                    Completed
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <div className="bg-card w-full max-w-md rounded-2xl border border-white/10 shadow-2xl p-8 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute right-4 top-4 text-muted-foreground hover:text-white">
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Target className="text-primary" />
              New Savings Goal
            </h2>
            <form onSubmit={handleAddGoal} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Goal Name</Label>
                <Input id="name" placeholder="Emergency Fund, Vacation, etc." value={name} onChange={(e) => setName(e.target.value)} required className="glass" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="target">Target Amount ({currency.symbol})</Label>
                  <Input id="target" type="number" placeholder="5000" value={target} onChange={(e) => setTarget(e.target.value)} required className="glass font-mono" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="current">Starting Amount ({currency.symbol})</Label>
                  <Input id="current" type="number" placeholder="0" value={current} onChange={(e) => setCurrent(e.target.value)} className="glass font-mono" />
                </div>
              </div>
              <Button type="submit" className="w-full h-12 shadow-lg shadow-primary/20" disabled={loading}>
                {loading ? "Creating..." : "Save Goal"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
