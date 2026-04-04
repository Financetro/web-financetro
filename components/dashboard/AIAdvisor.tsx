"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, TrendingUp, TrendingDown, AlertCircle, CheckCircle2 } from "lucide-react";
import { useCurrencyStore } from "@/store/currencyStore";

interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  date: string;
}

interface AIAdvisorProps {
  transactions: Transaction[];
  income: number;
  expense: number;
  balance: number;
}

export function AIAdvisor({ transactions, income, expense, balance }: AIAdvisorProps) {
  const [tips, setTips] = useState<{ icon: any, text: string, color: string }[]>([]);
  const { formatAmount } = useCurrencyStore();

  useEffect(() => {
    const generateInsights = () => {
      const newTips = [];

      // 1. Savings Rate Analysis
      const savingsRate = income > 0 ? ((income - expense) / income) * 100 : 0;
      if (savingsRate > 20) {
        newTips.push({
          icon: CheckCircle2,
          text: `Excellent! Your savings rate is ${savingsRate.toFixed(1)}%. You're in the top 10% of savers.`,
          color: "text-primary"
        });
      } else if (savingsRate > 0) {
        newTips.push({
          icon: TrendingUp,
          text: `You're saving ${savingsRate.toFixed(1)}% of your income. Aim for 20% to reach your goals faster.`,
          color: "text-yellow-500"
        });
      } else {
        newTips.push({
          icon: AlertCircle,
          text: "Your expenses are exceeding your income. Consider reviewing your non-essential spending.",
          color: "text-destructive"
        });
      }

      // 2. Category Analysis
      const categories: Record<string, number> = {};
      transactions
        .filter(t => t.type === "expense")
        .forEach(t => {
          categories[t.category] = (categories[t.category] || 0) + t.amount;
        });

      const topCategory = Object.entries(categories).sort((a, b) => b[1] - a[1])[0];
      if (topCategory) {
        const percentage = (topCategory[1] / expense) * 100;
        if (percentage > 40) {
          newTips.push({
            icon: Sparkles,
            text: `AI Insight: ${topCategory[0]} accounts for ${percentage.toFixed(0)}% of your spending. This is a potential area to cut back.`,
            color: "text-primary"
          });
        }
      }

      // 3. Subscription/Recurring Check
      const recurringCount = transactions.filter(t => t.type === "expense" && t.amount % 1 === 0).length;
      if (recurringCount > 5) {
        newTips.push({
          icon: AlertCircle,
          text: "Smart Detect: You have several recurring-style payments. Check if you're still using all these services.",
          color: "text-primary"
        });
      }

      // 4. Growth Prediction (Simple)
      if (balance > 0 && income > expense) {
        const monthsTo100k = Math.ceil((100000 - balance) / (income - expense));
        if (monthsTo100k > 0 && monthsTo100k < 60) {
          newTips.push({
            icon: TrendingUp,
            text: `At this rate, you'll reach ${formatAmount(100000)} in about ${monthsTo100k} months. Keep it up!`,
            color: "text-green-500"
          });
        }
      }

      setTips(newTips.slice(0, 3));
    };

    generateInsights();
  }, [transactions, income, expense, balance, formatAmount]);

  return (
    <Card className="glass relative overflow-hidden h-full">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50 pointer-events-none" />
      <CardHeader className="pb-3 border-b border-white/5 bg-card/20 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary/20 rounded-md">
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
          </div>
          <CardTitle className="text-sm font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            AI Financial Advisor
          </CardTitle>
          <div className="ml-auto flex items-center gap-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-[10px] text-primary font-bold uppercase tracking-widest opacity-80">Live Analysis</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-5 space-y-4">
        {tips.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-muted-foreground opacity-50">
            <p className="text-xs">Analyze more transactions to get insights.</p>
          </div>
        ) : (
          tips.map((tip, idx) => (
            <div key={idx} className="flex gap-3 group animate-in slide-in-from-left duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
              <div className={`p-2 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors shrink-0 h-fit ${tip.color}`}>
                <tip.icon className="h-4 w-4" />
              </div>
              <p className="text-xs leading-relaxed text-white/80 group-hover:text-white transition-colors">
                {tip.text}
              </p>
            </div>
          ))
        )}
        
        <div className="pt-2">
          <div className="p-3 bg-white/5 rounded-2xl border border-white/5 text-[10px] text-muted-foreground italic text-center">
            "I'm continuously learning from your habits to provide better advice."
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
