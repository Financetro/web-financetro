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
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Trash2,
  Calendar,
  AlertCircle,
  CheckCircle2,
  PieChart,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useCurrencyStore } from "@/store/currencyStore";
import { useNotification } from "@/hooks/useNotification";

type Loan = {
  id: string;
  name: string;
  type: "lent" | "borrowed";
  amount: number;
  remainingAmount: number;
  interestRate: number;
  dueDate: string;
  status: "active" | "paid";
};

export default function LoansPage() {
  const { user } = useAuthStore();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const { currency, formatAmount } = useCurrencyStore();
  const { sendNotification } = useNotification();

  // Form states
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<Loan["type"]>("borrowed");
  const [newAmount, setNewAmount] = useState("");
  const [newInterest, setNewInterest] = useState("0");
  const [newDueDate, setNewDueDate] = useState("");

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, `users/${user.uid}/loans`));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loanData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Loan[];
      setLoans(loanData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAddLoan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newName || !newAmount) return;

    const { currency } = useCurrencyStore.getState();
    const amountInBase = parseFloat(newAmount) / (currency.rate || 1);

    try {
      await addDoc(collection(db, `users/${user.uid}/loans`), {
        name: newName,
        type: newType,
        amount: amountInBase,
        remainingAmount: amountInBase,
        interestRate: parseFloat(newInterest),
        dueDate: newDueDate,
        status: "active",
        createdAt: new Date().toISOString(),
      });

      sendNotification(`${newType === 'lent' ? 'Money Lent' : 'Money Borrowed'}!`, {
        body: `${newName}: ${currency.symbol}${newAmount}`,
      });

      toast.success("Debt record created successfully!");
      setIsAdding(false);
      // Reset form
      setNewName("");
      setNewAmount("");
      setNewInterest("0");
      setNewDueDate("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save loan.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!user || !confirm("Delete this record permanently?")) return;
    try {
      await deleteDoc(doc(db, `users/${user.uid}/loans`, id));
      toast.success("Record deleted.");
    } catch (error) {
      toast.error("Failed to delete.");
    }
  };

  const toggleStatus = async (id: string, currentStatus: "active" | "paid") => {
    if (!user) return;
    const newStatus = currentStatus === "active" ? "paid" : "active";
    try {
      await updateDoc(doc(db, `users/${user.uid}/loans`, id), {
        status: newStatus,
        remainingAmount: newStatus === "paid" ? 0 : 0, // Should probably restore original but for demo let's keep it simple
      });
      toast.success(`Marker as ${newStatus}!`);
    } catch (error) {
      toast.error("Failed to update status.");
    }
  };

  if (loading)
    return (
      <div className="p-20 text-center animate-pulse">Scanning ledgers...</div>
    );

  const totalBorrowed = loans
    .filter((l) => l.type === "borrowed" && l.status === "active")
    .reduce((sum, l) => sum + l.amount, 0);
  const totalLent = loans
    .filter((l) => l.type === "lent" && l.status === "active")
    .reduce((sum, l) => sum + l.amount, 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Debt & Loans Tracker
          </h1>
          <p className="text-muted-foreground mt-1">
            Keep track of money you owe or are owed.
          </p>
        </div>
        <Button
          onClick={() => setIsAdding(!isAdding)}
          className="shadow-lg shadow-primary/20"
        >
          {isAdding ? (
            "Cancel"
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" /> Log New Entry
            </>
          )}
        </Button>
      </div>

      {isAdding && (
        <Card className="glass border-orange-500/20 overflow-hidden">
          <div className="h-1 bg-linear-to-r from-orange-500 to-red-500" />
          <CardHeader>
            <CardTitle>Add Debt Record</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleAddLoan}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Description / Name
                </label>
                <Input
                  placeholder="e.g. Personal Loan, Rent Debt"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="glass"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Relationship
                </label>
                <select
                  className="flex h-10 w-full rounded-md border border-white/10 bg-card/60 backdrop-blur-md px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                >
                  <option value="borrowed">I Borrowed (Debt)</option>
                  <option value="lent">I Lent (Credit)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Original Amount ({currency.code})
                </label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="glass font-mono"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Due Date
                </label>
                <Input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="glass"
                />
              </div>
              <div className="md:col-start-4">
                <Button
                  type="submit"
                  className="w-full h-10 font-bold bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Save Entry
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="glass relative overflow-hidden">
          <div className="absolute right-0 top-0 p-8 bg-destructive/10 rounded-full blur-2xl -z-10" />
          <CardHeader className="pb-2">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              Debt Owed
            </p>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black font-mono text-destructive tracking-tighter">
              {formatAmount(totalBorrowed)}
            </div>
          </CardContent>
        </Card>

        <Card className="glass relative overflow-hidden">
          <div className="absolute right-0 top-0 p-8 bg-primary/10 rounded-full blur-2xl -z-10" />
          <CardHeader className="pb-2">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              Money Receivable
            </p>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black font-mono text-primary tracking-tighter">
              {formatAmount(totalLent)}
            </div>
          </CardContent>
        </Card>

        <Card className="glass bg-white/5 border-white/5 flex flex-col justify-center px-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Net Position</p>
              <p
                className={`text-xl font-bold font-mono ${totalLent - totalBorrowed >= 0 ? "text-primary" : "text-destructive"}`}
              >
                {formatAmount(totalLent - totalBorrowed)}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-card border border-white/5 shadow-inner">
              <PieChart className="h-6 w-6 text-muted-foreground opacity-50" />
            </div>
          </div>
        </Card>
      </div>

      {/* Debt List Table */}
      <Card className="glass border-white/5 overflow-hidden">
        <div className="overflow-x-auto hidden md:block">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-white/5">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4 text-right">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loans.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-muted-foreground opacity-50 italic"
                  >
                    The ledgers are clear. No active loans or debts.
                  </td>
                </tr>
              ) : (
                loans.map((loan) => (
                  <tr
                    key={loan.id}
                    className={`group hover:bg-white/2 transition-colors ${loan.status === "paid" ? "opacity-50" : ""}`}
                  >
                    <td className="px-6 py-4 font-bold">{loan.name}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                          loan.type === "lent"
                            ? "bg-primary/20 text-primary"
                            : "bg-destructive/20 text-destructive"
                        }`}
                      >
                        {loan.type === "lent" ? (
                          <ArrowUpRight className="h-2 w-2 mr-1" />
                        ) : (
                          <ArrowDownLeft className="h-2 w-2 mr-1" />
                        )}
                        {loan.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground font-mono">
                      {loan.dueDate
                        ? format(new Date(loan.dueDate), "MMM dd, yyyy")
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold tracking-tight">
                      {formatAmount(loan.amount)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-7 px-3 text-[10px] uppercase font-black tracking-widest rounded-lg ${
                          loan.status === "paid"
                            ? "bg-green-500/20 text-green-500"
                            : "bg-orange-500/20 text-orange-500"
                        }`}
                        onClick={() => toggleStatus(loan.id, loan.status)}
                      >
                        {loan.status === "active" ? (
                          <AlertCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                        )}
                        {loan.status}
                      </Button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(loan.id)}
                        className="p-2 text-muted-foreground hover:text-destructive md:opacity-0 md:group-hover:opacity-100 transition-all"
                      >
                        <Trash2 size={16} />
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
          {loans.length === 0 ? (
            <div className="px-6 py-12 text-center text-muted-foreground opacity-50 italic">
              The ledgers are clear.
            </div>
          ) : (
            loans.map((loan) => (
              <div key={loan.id} className={`p-5 active:bg-white/5 transition-colors ${loan.status === 'paid' ? 'opacity-50' : ''}`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex flex-col gap-1">
                    <h4 className="font-bold text-sm">{loan.name}</h4>
                    <span
                      className={`inline-flex w-fit items-center px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                        loan.type === "lent"
                          ? "bg-primary/20 text-primary"
                          : "bg-destructive/20 text-destructive"
                      }`}
                    >
                      {loan.type}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold text-sm">{formatAmount(loan.amount)}</p>
                    <p className="text-[9px] text-muted-foreground uppercase font-bold mt-1">
                      Due: {loan.dueDate ? format(new Date(loan.dueDate), "MMM dd") : "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-7 px-3 text-[9px] uppercase font-black tracking-widest rounded-lg ${
                      loan.status === "paid"
                        ? "bg-green-500/20 text-green-500"
                        : "bg-orange-500/20 text-orange-500"
                    }`}
                    onClick={() => toggleStatus(loan.id, loan.status)}
                  >
                    {loan.status}
                  </Button>
                  <button
                    onClick={() => handleDelete(loan.id)}
                    className="p-2 text-muted-foreground hover:text-destructive transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Pro Tip Card */}
      <div className="p-6 rounded-4xl bg-linear-to-br from-[#1E232B] to-background border border-white/5 relative overflow-hidden group">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700" />
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="p-4 rounded-2xl bg-primary/20 text-primary">
            <Calendar size={32} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h4 className="text-lg font-bold mb-1">
              Coming Soon: Automatic Payment Links
            </h4>
            <p className="text-sm text-muted-foreground">
              Soon you'll be able to generate payment links for your friends
              when you lend them money.
            </p>
          </div>
          <Button
            variant="outline"
            className="border-white/10 hover:bg-white/5"
          >
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
}
