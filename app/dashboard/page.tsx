"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { AIAdvisor } from "@/components/dashboard/AIAdvisor";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  Wallet,
  Activity,
  TrendingUp,
} from "lucide-react";
import { useCurrencyStore } from "@/store/currencyStore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

type Transaction = {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  date: string;
  note: string;
};

export default function DashboardPage() {
  const { user, loading } = useAuthStore();
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [changePercentage, setChangePercentage] = useState(0);
  const [isFetching, setIsFetching] = useState(true);
  const { formatAmount, currency } = useCurrencyStore();

  useEffect(() => {
    if (!user) return;
    setIsFetching(true);
    const q = query(
      collection(db, `users/${user.uid}/transactions`),
      orderBy("date", "desc"),
    );

    const goalsQ = query(collection(db, `users/${user.uid}/goals`), limit(3));
    const schedulesQ = query(
      collection(db, `users/${user.uid}/schedules`),
      orderBy("nextDate", "asc"),
      limit(2),
    );

    const unsubTx = onSnapshot(q, (snapshot) => {
      const txData: Transaction[] = [];
      let totalInc = 0;
      let totalExp = 0;

      snapshot.forEach((doc) => {
        const data = doc.data() as Omit<Transaction, "id">;
        txData.push({ id: doc.id, ...data });

        if (data.type === "income") totalInc += data.amount;
        if (data.type === "expense") totalExp += data.amount;
      });

      setTransactions(txData);
      setIncome(totalInc);
      setExpense(totalExp);
      setBalance(totalInc - totalExp);

      // Simple growth calculation logic
      setChangePercentage(
        totalInc > 0 ? ((totalInc - totalExp) / totalInc) * 100 : 0,
      );

      // Process last 7 days chart data
      const last7Days: any[] = [];
      const rate = currency.rate || 1;

      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayName = format(date, "EEE");
        const dateStr = format(date, "yyyy-MM-dd");

        const dayIncome = txData
          .filter((tx) => tx.type === "income" && tx.date === dateStr)
          .reduce((sum, tx) => sum + tx.amount * rate, 0);

        const dayExpense = txData
          .filter((tx) => tx.type === "expense" && tx.date === dateStr)
          .reduce((sum, tx) => sum + tx.amount * rate, 0);

        last7Days.push({
          name: dayName,
          income: dayIncome,
          expense: dayExpense,
        });
      }
      setChartData(last7Days);

      setIsFetching(false);
    }, (error) => {
      console.error("Transactions snapshot error:", error);
      setIsFetching(false);
    });

    const unsubGoals = onSnapshot(goalsQ, (snapshot) => {
      setGoals(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    }, (error) => console.error("Goals snapshot error:", error));

    const unsubSchedules = onSnapshot(schedulesQ, (snapshot) => {
      setSchedules(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    }, (error) => console.error("Schedules snapshot error:", error));

    return () => {
      unsubTx();
      unsubGoals();
      unsubSchedules();
    };
  }, [user, currency]);

  if (isFetching) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="animate-spin text-primary">
          <Activity size={32} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s a summary of your financial status.
          </p>
        </div>
        <Link href="/dashboard/transactions?add=true">
          <Button className="h-10 shadow-lg shadow-primary/20">
            <span className="mr-2 text-xl leading-none">+</span> Add Transaction
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="glass relative overflow-hidden group">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--color-primary)_0%,transparent_40%)] opacity-5 pointer-events-none" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 z-10 relative">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Balance
            </CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg">
              <Wallet className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="z-10 relative">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold font-mono tracking-tighter truncate">
              {formatAmount(balance)}
            </div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center">
              <TrendingUp
                className={`h-3 w-3 mr-1 ${changePercentage >= 0 ? "text-primary" : "text-destructive"}`}
              />
              <span
                className={
                  changePercentage >= 0 ? "text-primary" : "text-destructive"
                }
              >
                {changePercentage >= 0 ? "+" : ""}
                {changePercentage.toFixed(1)}%
              </span>
              <span className="ml-1">since start</span>
            </p>
          </CardContent>
        </Card>

        <Card className="glass relative overflow-hidden group">
          <div className="absolute -right-8 -top-8 bg-green-500/10 w-32 h-32 rounded-full blur-2xl group-hover:bg-green-500/20 transition-all duration-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Monthly Income
            </CardTitle>
            <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
              <ArrowUpIcon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono tracking-tighter">
              {formatAmount(income)}
            </div>
          </CardContent>
        </Card>

        <Card className="glass relative overflow-hidden group">
          <div className="absolute -right-8 -top-8 bg-destructive/10 w-32 h-32 rounded-full blur-2xl group-hover:bg-destructive/20 transition-all duration-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Monthly Expenses
            </CardTitle>
            <div className="p-2 bg-destructive/10 rounded-lg text-destructive">
              <ArrowDownIcon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono tracking-tighter">
              {formatAmount(expense)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7 lg:grid-cols-8">
        <Card className="glass col-span-full md:col-span-4 lg:col-span-5 flex flex-col h-[500px]">
          <CardHeader>
            <CardTitle>Cash Flow</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 w-full min-h-0 pl-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-primary)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-primary)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-destructive)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-destructive)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(255,255,255,0.05)"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 10 }}
                  tickFormatter={(value) =>
                    value >= 1000
                      ? `${currency.symbol}${(value / 1000).toFixed(0)}k`
                      : `${currency.symbol}${value}`
                  }
                />
                <Tooltip
                  cursor={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 2 }}
                  contentStyle={{
                    backgroundColor: "#1E232B",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.4)",
                  }}
                  itemStyle={{ color: "#F3F4F6", fontSize: "12px" }}
                  formatter={(value: any) =>
                    `${currency.symbol}${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                  }
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  height={36}
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground ml-1">
                      {value}
                    </span>
                  )}
                />
                <Area
                  name="Income"
                  type="monotone"
                  dataKey="income"
                  stroke="var(--color-primary)"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorIncome)"
                  animationDuration={1500}
                />
                <Area
                  name="Expense"
                  type="monotone"
                  dataKey="expense"
                  stroke="var(--color-destructive)"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorExpense)"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <div className="col-span-full md:col-span-3 lg:col-span-3 flex flex-col gap-6 md:h-[500px]">
          {/* AI Insights Card */}
          {/* <AIAdvisor
            transactions={transactions}
            income={income}
            expense={expense}
            balance={balance}
          /> */}

          {/* Savings Goals Summary Card */}
          <Card className="glass flex flex-col overflow-hidden shrink-0">
            <CardHeader className="pb-2 border-b border-white/5 bg-card/30">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">
                  Savings Goals
                </CardTitle>
                <Link
                  href="/dashboard/goals"
                  className="text-[10px] text-primary hover:underline uppercase font-bold tracking-wider"
                >
                  View All
                </Link>
              </div>
            </CardHeader>
            <CardContent className="py-4 space-y-4">
              {goals.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-2 opacity-50">
                  No goals active
                </p>
              ) : (
                goals.map((goal) => {
                  const progress = Math.min(
                    100,
                    Math.round((goal.currentAmount / goal.targetAmount) * 100),
                  );
                  return (
                    <div key={goal.id} className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-medium">
                        <span className="truncate pr-2">{goal.name}</span>
                        <span className="font-mono text-primary">
                          {progress}%
                        </span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-primary h-full rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* Upcoming Recurring Payments */}
          <Card className="glass flex flex-col overflow-hidden shrink-0">
            <CardHeader className="pb-2 border-b border-white/5 bg-card/30">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">
                  Upcoming Bills
                </CardTitle>
                <Link
                  href="/dashboard/schedules"
                  className="text-[10px] text-primary hover:underline uppercase font-bold tracking-wider"
                >
                  View All
                </Link>
              </div>
            </CardHeader>
            <CardContent className="py-4 space-y-3">
              {schedules.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-2 opacity-50">
                  No upcoming bills
                </p>
              ) : (
                schedules.map((sch) => (
                  <div
                    key={sch.id}
                    className="flex justify-between items-center group cursor-pointer"
                  >
                    <div className="flex flex-col">
                      <span className="text-[11px] font-medium truncate">
                        {sch.name}
                      </span>
                      <span className="text-[9px] text-muted-foreground uppercase opacity-70">
                        {format(new Date(sch.nextDate), "MMM dd")}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-white group-hover:text-primary transition-colors">
                      {formatAmount(sch.amount)}
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Recent Activity Card */}
          <Card className="glass flex flex-col overflow-hidden flex-1">
            <CardHeader className="bg-card/50 backdrop-blur-sm sticky top-0 z-10 border-b border-white/5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">
                  Recent Activity
                </CardTitle>
                <Link
                  href="/dashboard/transactions"
                  className="text-[10px] text-primary hover:underline uppercase font-bold tracking-wider"
                >
                  View all
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-y-auto">
              {transactions.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground flex flex-col items-center justify-center h-full opacity-50">
                  <Activity className="h-8 w-8 mb-4 opacity-20" />
                  <p className="text-xs">No recent transactions.</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {transactions.slice(0, 5).map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-2 rounded-lg flex items-center justify-center ${
                            tx.type === "income"
                              ? "bg-primary/10 text-primary"
                              : "bg-destructive/10 text-destructive"
                          }`}
                        >
                          {tx.type === "income" ? (
                            <ArrowUpIcon className="h-3.5 w-3.5" />
                          ) : (
                            <ArrowDownIcon className="h-3.5 w-3.5" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold truncate">
                            {tx.category || "Uncategorized"}
                          </p>
                          <p className="text-[10px] text-muted-foreground truncate opacity-70">
                            {tx.note || "No note"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-xs font-bold font-mono ${tx.type === "income" ? "text-primary" : "text-white"}`}
                        >
                          {tx.type === "income" ? "+" : "-"}
                          {formatAmount(tx.amount)}
                        </p>
                        <p className="text-[10px] text-muted-foreground opacity-50">
                          {tx.date ? format(new Date(tx.date), "MMM dd") : ""}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
