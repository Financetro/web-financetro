"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { collection, query, onSnapshot, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Target, TrendingDown } from "lucide-react";
import { toast } from "sonner";
import { useCurrencyStore } from "@/store/currencyStore";

export default function BudgetPage() {
  const { user } = useAuthStore();
  const [budget, setBudget] = useState(0);
  const [spent, setSpent] = useState(0);
  const [editingBudget, setEditingBudget] = useState(false);
  const [newBudget, setNewBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const { currency, formatAmount } = useCurrencyStore();

  useEffect(() => {
    if (!user) return;
    
    // Get user budget
    const fetchUser = async () => {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        setBudget(data.monthlyBudget || 0);
        setNewBudget((data.monthlyBudget || 0).toString());
      }
    };
    fetchUser();

    // Calculate current month's expenses
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const q = query(collection(db, `users/${user.uid}/transactions`));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let totalSpent = 0;
      const categoryTotals: Record<string, number> = {};

      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        if (data.type === "expense") {
          const txDate = new Date(data.date);
          if (txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear) {
            totalSpent += data.amount;
            categoryTotals[data.category] = (categoryTotals[data.category] || 0) + data.amount;
          }
        }
      });
      setSpent(totalSpent);

      // Generate dynamic recommendations
      const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
      const recs = [];
      
      if (totalSpent > 0) {
        const [topCat, topVal] = sortedCategories[0];
        const percent = ((topVal / totalSpent) * 100).toFixed(0);
        recs.push({
          title: `Cut down on ${topCat}`,
          desc: `${topCat} takes up ${percent}% of your monthly spending.`
        });
      }

      if (totalSpent > budget && budget > 0) {
        recs.push({
          title: "Over Budget Alert",
          desc: "You have exceeded your limit. Try postponing non-essential purchases."
        });
      }

      recs.push({
        title: "Emergency Fund",
        desc: "Allocate 10% of any new income to your savings account."
      });

      setRecommendations(recs.slice(0, 3));
    });

    return () => unsubscribe();
  }, [user, budget]);

  const handleUpdateBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newBudget) return;
    setLoading(true);
    try {
      const { currency } = useCurrencyStore.getState();
      const parsedBudget = parseFloat(newBudget) / (currency.rate || 1);
      
      await updateDoc(doc(db, "users", user.uid), {
        monthlyBudget: parsedBudget
      });
      setBudget(parsedBudget);
      setEditingBudget(false);
      toast.success("Budget updated successfully!");
    } catch (error) {
      console.error("Error updating budget:", error);
      toast.error("Failed to update budget.");
    } finally {
      setLoading(false);
    }
  };

  const percentSpent = budget > 0 ? (spent / budget) * 100 : 0;
  const isExceeded = spent > budget && budget > 0;
  const remaining = budget - spent;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Budget Planner</h1>
        <p className="text-muted-foreground mt-1">Set limits and track your monthly spending.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="glass overflow-hidden md:col-span-2 relative">
          <div className="absolute right-0 top-0 p-16 bg-primary/5 rounded-full blur-3xl -z-10"></div>
          <CardHeader className="flex flex-row items-center justify-between z-10">
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2 text-primary" />
              Monthly Budget Progress
            </CardTitle>
            {!editingBudget && (
              <Button variant="outline" size="sm" onClick={() => setEditingBudget(true)}>
                Edit Budget
              </Button>
            )}
          </CardHeader>
          <CardContent className="z-10">
            {editingBudget ? (
              <form onSubmit={handleUpdateBudget} className="flex gap-4 items-end mb-6">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="budget">Monthly Budget Limit</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{currency.symbol}</span>
                    <Input 
                      id="budget"
                      type="number" 
                      step="0.01"
                      className="pl-8 bg-card/60 font-mono text-lg"
                      value={newBudget}
                      onChange={(e) => setNewBudget(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" disabled={loading}>Save</Button>
                <Button type="button" variant="ghost" onClick={() => setEditingBudget(false)}>Cancel</Button>
              </form>
            ) : (
              <div className="mb-8 mt-2">
                <div className="text-4xl font-mono font-bold tracking-tighter mb-1">
                  {formatAmount(budget)}
                </div>
                <p className="text-sm text-muted-foreground">Monthly Limit</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Spent so far</p>
                  <p className={`text-2xl font-mono font-bold ${isExceeded ? "text-destructive" : "text-primary"}`}>
                    {formatAmount(spent)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">Remaining</p>
                  <p className="text-2xl font-mono font-bold">
                    {formatAmount(Math.max(0, remaining))}
                  </p>
                </div>
              </div>
              
              <div className="w-full bg-white/5 rounded-full h-4 overflow-hidden relative shadow-inner">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${isExceeded ? "bg-destructive" : "bg-primary"}`}
                  style={{ width: `${Math.min(100, isExceeded ? 100 : percentSpent)}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span className={isExceeded ? "text-destructive font-bold" : ""}>{percentSpent.toFixed(1)}%</span>
                <span>100%</span>
              </div>
            </div>

            {isExceeded && (
              <div className="mt-8 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive flex gap-3 animate-in slide-in-from-bottom-2 fade-in">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm">Budget Exceeded</h4>
                  <p className="text-xs mt-1 text-destructive/80">You have exceeded your monthly budget by {formatAmount(Math.abs(remaining))}. Review your expenses to see where you can cut back.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass h-full">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <TrendingDown className="h-5 w-5 mr-2 text-primary" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendations.length > 0 ? (
              recommendations.map((rec, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-card border border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
                  <h4 className="text-sm font-semibold mb-1 group-hover:text-primary transition-colors">{rec.title}</h4>
                  <p className="text-xs text-muted-foreground">{rec.desc}</p>
                </div>
              ))
            ) : (
                <div className="p-4 text-center text-xs text-muted-foreground opacity-50">
                   Start adding transactions to get tailored insights.
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
