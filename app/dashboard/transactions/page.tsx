"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Filter, Trash2, X, Download } from "lucide-react";
import { format } from "date-fns";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCurrencyStore } from "@/store/currencyStore";
import { useNotification } from "@/hooks/useNotification";

// Form Modal Component inside the file for simplicity
function AddTransactionModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { user } = useAuthStore();
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const { currency, formatAmount } = useCurrencyStore();
  const { sendNotification } = useNotification();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !amount || parseFloat(amount) <= 0 || !category || !date)
      return;

    const { currency } = useCurrencyStore.getState();
    const amountInBase = parseFloat(amount) / (currency.rate || 1);

    setLoading(true);
    try {
      await addDoc(collection(db, `users/${user.uid}/transactions`), {
        type,
        amount: amountInBase,
        category,
        date,
        note,
        createdAt: new Date().toISOString(),
      });
      
      // Fire Notification
      const displayAmount = (parseFloat(amount)).toLocaleString(undefined, { 
        style: 'currency', 
        currency: currency.code 
      });
      
      sendNotification(`New ${type.charAt(0).toUpperCase() + type.slice(1)} Added!`, {
        body: `${category}: ${displayAmount}`,
      });

      toast.success("Transaction added successfully!");
      onClose();
      // Reset form
      setAmount("");
      setCategory("");
      setNote("");
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast.error("Failed to add transaction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
      <div className="bg-card w-full max-w-md rounded-2xl border border-white/10 shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
        <h2 className="text-xl font-bold mb-6">Add Transaction</h2>

        <div className="flex p-1 bg-background/50 rounded-lg mb-6 border border-white/5">
          <button
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${type === "expense" ? "bg-destructive/20 text-destructive shadow-sm" : "text-muted-foreground hover:text-white"}`}
            onClick={() => setType("expense")}
          >
            Expense
          </button>
          <button
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${type === "income" ? "bg-primary/20 text-primary shadow-sm" : "text-muted-foreground hover:text-white"}`}
            onClick={() => setType("income")}
          >
            Income
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1 block">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {currency.symbol}
              </span>
              <Input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8 text-xl font-mono glass"
                placeholder="0.00"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="flex h-10 w-full rounded-md border border-border bg-card/60 backdrop-blur-md px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                required
              >
                <option value="" disabled>
                  Select
                </option>
                {type === "expense" ? (
                  <>
                    <option value="Food">Food & Dining</option>
                    <option value="Transport">Transportation</option>
                    <option value="Housing">Housing</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Other">Other</option>
                  </>
                ) : (
                  <>
                    <option value="Salary">Salary</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Investments">Investments</option>
                    <option value="Other">Other</option>
                  </>
                )}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">
                Date
              </label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="glass"
                required
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1 block">
              Note Optional
            </label>
            <Input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="glass"
              placeholder="What was this for?"
            />
          </div>
          <Button
            type="submit"
            className="w-full mt-6 h-12 text-md"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Transaction"}
          </Button>
        </form>
      </div>
    </div>
  );
}

import { Suspense } from "react";

function TransactionsContent() {
  const { user, loading } = useAuthStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">(
    "all",
  );
  const { formatAmount } = useCurrencyStore();

  useEffect(() => {
    const addParam = searchParams.get("add");
    const queryParam = searchParams.get("q");

    if (addParam === "true") {
      setIsModalOpen(true);
      router.replace("/dashboard/transactions");
    }

    if (queryParam) {
      setSearchTerm(queryParam);
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, `users/${user.uid}/transactions`),
      orderBy("date", "desc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const txData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTransactions(txData);
    });

    return () => unsubscribe();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!user || !confirm("Are you sure you want to delete this transaction?"))
      return;
    try {
      await deleteDoc(doc(db, `users/${user.uid}/transactions`, id));
      toast.success("Transaction deleted.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete transaction.");
    }
  };

  const handleExport = () => {
    if (transactions.length === 0) return;
    const headers = ["Date", "Type", "Category", "Amount", "Note"];
    const csvRows = transactions.map((tx) => [
      format(new Date(tx.date), "yyyy-MM-dd"),
      tx.type,
      tx.category,
      tx.amount,
      tx.note || "",
    ]);

    const csvContent = [headers, ...csvRows].map((e) => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `financetro_transactions_${format(new Date(), "yyyy-MM-dd")}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Transactions exported as CSV!");
  };

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.note?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || tx.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground mt-1">
            Manage your income and expenses.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="h-10 border-white/5 bg-background/50"
            onClick={handleExport}
          >
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button onClick={() => setIsModalOpen(true)} className="h-10">
            <Plus className="mr-2 h-4 w-4" /> Add Transaction
          </Button>
        </div>
      </div>

      <Card className="glass overflow-hidden border-white/5">
        <div className="p-4 border-b border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between bg-card/50">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search category or note..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full bg-background/50 border-white/5"
            />
          </div>

          <div className="flex p-1 bg-background/50 rounded-lg border border-white/5 w-full md:w-auto">
            {(["all", "income", "expense"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all capitalize ${
                  filterType === type
                    ? "bg-primary/20 text-primary shadow-sm"
                    : "text-muted-foreground hover:text-white"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto hidden md:block">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-white/2 border-b border-white/5">
              <tr>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium hidden md:table-cell">
                  Note
                </th>
                <th className="px-6 py-4 font-medium text-right">Amount</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-muted-foreground"
                  >
                    No transactions found.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-white/2 transition-colors group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground text-xs">
                      {format(new Date(tx.date), "MMM dd, yyyy")}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      <div className="flex items-center">
                        <span
                          className={`w-2 h-2 rounded-full mr-2 ${tx.type === "income" ? "bg-primary" : "bg-destructive"}`}
                        ></span>
                        {tx.category}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground hidden md:table-cell max-w-[200px] truncate">
                      {tx.note || "-"}
                    </td>
                    <td
                      className={`px-6 py-4 text-right font-mono font-bold ${tx.type === "income" ? "text-primary" : "text-white"}`}
                    >
                      {tx.type === "income" ? "+" : "-"}{formatAmount(tx.amount)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(tx.id)}
                        className="p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors md:opacity-0 md:group-hover:opacity-100"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile List View */}
        <div className="md:hidden divide-y divide-white/5">
          {filteredTransactions.length === 0 ? (
            <div className="px-6 py-12 text-center text-muted-foreground">
              No transactions found.
            </div>
          ) : (
            filteredTransactions.map((tx) => (
              <div key={tx.id} className="p-5 active:bg-white/5 transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${tx.type === "income" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
                     <Search size={14} /> {/* Placeholder icon or more specific ones */}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{tx.category}</h4>
                      <p className="text-[10px] text-muted-foreground font-mono">
                        {format(new Date(tx.date), "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-mono font-bold ${tx.type === "income" ? "text-primary" : "text-white"}`}>
                      {tx.type === "income" ? "+" : "-"}{formatAmount(tx.amount)}
                    </p>
                    <button 
                      onClick={() => handleDelete(tx.id)}
                      className="text-muted-foreground hover:text-destructive p-1 mt-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                {tx.note && (
                  <p className="text-[11px] text-muted-foreground mt-2 pl-11 opacity-70">
                    {tx.note}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </Card>

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default function TransactionsPage() {
  return (
    <Suspense fallback={<div>Loading transactions...</div>}>
      <TransactionsContent />
    </Suspense>
  );
}
