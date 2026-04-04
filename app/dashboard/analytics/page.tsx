"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useCurrencyStore } from "@/store/currencyStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1'];

export default function AnalyticsPage() {
  const { user } = useAuthStore();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const { currency, formatAmount } = useCurrencyStore();

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, `users/${user.uid}/transactions`),
      orderBy("date", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const txData = snapshot.docs.map(doc => doc.data());
      setTransactions(txData);

      const rate = currency.rate || 1;

      // Process Category Data (Expenses only)
      const expenses = txData.filter(tx => tx.type === "expense");
      const categoryMap = expenses.reduce((acc, tx) => {
        const convertedAmount = tx.amount * rate;
        acc[tx.category] = (acc[tx.category] || 0) + convertedAmount;
        return acc;
      }, {} as Record<string, number>);
      
      const pieData = Object.entries(categoryMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
      setCategoryData(pieData);

      // Process Monthly Trend
      const monthMap: Record<string, { name: string; income: number; expense: number }> = {};
      txData.forEach(tx => {
        const date = new Date(tx.date);
        const monthName = date.toLocaleString('default', { month: 'short' });
        
        if (!monthMap[monthName]) {
          monthMap[monthName] = { name: monthName, income: 0, expense: 0 };
        }
        
        const convertedAmount = tx.amount * rate;
        if (tx.type === "income") monthMap[monthName].income += convertedAmount;
        else monthMap[monthName].expense += convertedAmount;
      });
      
      setMonthlyData(Object.values(monthMap));
    }, (error) => console.error("Analytics snapshot error:", error));

    return () => unsubscribe();
  }, [user, currency]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-1">Deep dive into your financial habits.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass relative overflow-hidden h-[450px]">
          <div className="absolute -left-8 -top-8 bg-primary/5 w-64 h-64 rounded-full blur-3xl"></div>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px] w-full relative z-10 flex items-center justify-center">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    stroke="none"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#1E232B', borderColor: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}
                    itemStyle={{ color: '#F3F4F6' }}
                    formatter={(value: any) => `${currency.symbol}${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-muted-foreground text-sm text-center">No expense data to display</div>
            )}
            
            {categoryData.length > 0 && (
              <div className="absolute inset-x-0 bottom-4 px-6 pt-4 flex flex-wrap justify-center gap-4 text-xs font-medium">
                {categoryData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center">
                    <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                    {entry.name}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass relative overflow-hidden h-[450px]">
          <CardHeader>
            <CardTitle>Income vs Expense (Monthly)</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px] w-full p-4 relative z-10">
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} dx={-10} tickFormatter={(value) => `${currency.symbol}${value}`} />
                  <RechartsTooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: '#1E232B', borderColor: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}
                    formatter={(value: any) => `${currency.symbol}${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                  />
                  <Bar dataKey="income" name="Income" fill="#10B981" radius={[4, 4, 0, 0]} barSize={30} />
                  <Bar dataKey="expense" name="Expense" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                No monthly data to display
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6">
        <Card className="glass">
          <CardHeader>
            <CardTitle>Top Categories Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryData.length > 0 ? (
              <div className="space-y-4">
                {categoryData.map((category, index) => {
                  const maxVal = categoryData[0]?.value || 1;
                  const percentage = Math.round((category.value / maxVal) * 100);
                  return (
                    <div key={category.name} className="flex items-center group">
                      <div className="w-10 h-10 rounded-xl bg-card border border-white/5 flex items-center justify-center shadow-lg group-hover:bg-white/5 transition-colors mr-4 z-10 relative">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">{category.name}</span>
                          <span className="text-sm font-bold font-mono">{currency.symbol}{category.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="h-1.5 rounded-full" 
                            style={{ 
                              width: `${percentage}%`, 
                              backgroundColor: COLORS[index % COLORS.length],
                              opacity: 0.8
                            }} 
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
               <div className="text-muted-foreground text-sm text-center py-4">No categories data to display</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
