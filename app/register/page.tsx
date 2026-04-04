"use client";

import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, Eye, EyeOff, Check, X } from "lucide-react";
import { toast } from "sonner";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const getStrength = (pass: string) => {
    let s = 0;
    if (pass.length >= 8) s++;
    if (/[a-z]/.test(pass)) s++;
    if (/[A-Z]/.test(pass)) s++;
    if (/[0-9]/.test(pass)) s++;
    if (/[^A-Za-z0-9]/.test(pass)) s++;
    return Math.min(4, s);
  };

  const strength = getStrength(password);

  const getStrengthColor = () => {
    if (strength === 0) return "bg-muted";
    if (strength === 1) return "bg-destructive";
    if (strength === 2) return "bg-orange-500";
    if (strength === 3) return "bg-yellow-500";
    return "bg-primary";
  };

  const getStrengthText = () => {
    if (password.length === 0) return "";
    if (strength === 1) return "Weak";
    if (strength === 2) return "Medium";
    if (strength === 3) return "Good";
    if (strength === 4) return "Strong";
    return "Too short";
  };

  const checks = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Lowercase letter", met: /[a-z]/.test(password) },
    { label: "Uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Number", met: /[0-9]/.test(password) },
    { label: "Special character", met: /[^A-Za-z0-9]/.test(password) },
  ];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (strength < 4) {
      toast.error("Please meet all password requirements");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: name,
      });

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: email,
        createdAt: new Date(),
        monthlyBudget: 0,
      });

      toast.success("Account created successfully!");
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to create an account.");
      toast.error(err.message || "Failed to create an account.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          name: user.displayName || "User",
          email: user.email,
          createdAt: new Date(),
          monthlyBudget: 0,
        });
      }

      toast.success("Signed in with Google!");
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      toast.error("Google sign in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md p-8 space-y-6 bg-card border border-white/5 rounded-2xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 p-32 bg-primary/10 rounded-full blur-[100px] -z-10 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="flex flex-col items-center space-y-2 text-center">
          <Wallet className="h-10 w-10 text-primary mb-2" />
          <h1 className="text-2xl font-bold tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your details to sign up for Financetro
          </p>
        </div>

        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full h-11 border-white/10 bg-background/50 hover:bg-white/5 transition-all flex items-center justify-center gap-3"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign up with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/5"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-background/50 border-white/10 focus:border-primary/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-background/50 border-white/10 focus:border-primary/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background/50 border-white/10 focus:border-primary/50 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Strength indicator */}
            <div className="space-y-3 pt-1">
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden flex gap-1">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`h-full flex-1 transition-all duration-500 ${
                      strength >= step ? getStrengthColor() : "bg-white/5"
                    }`}
                  ></div>
                ))}
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-muted-foreground font-medium uppercase tracking-wider">
                  Strength
                </span>
                <span
                  className={`font-bold uppercase tracking-widest ${strength === 4 ? "text-primary" : strength <= 1 ? "text-destructive" : "text-orange-500"}`}
                >
                  {getStrengthText()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2">
                {checks.map((check, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div
                      className={`p-0.5 rounded-full ${check.met ? "bg-primary/20 text-primary" : "bg-white/5 text-muted-foreground"}`}
                    >
                      {check.met ? <Check size={10} /> : <X size={10} />}
                    </div>
                    <span
                      className={`text-[10px] ${check.met ? "text-foreground font-medium" : "text-muted-foreground"}`}
                    >
                      {check.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {error && (
            <p className="text-sm text-destructive font-medium">{error}</p>
          )}
          <Button
            type="submit"
            className="w-full h-11 shadow-lg shadow-primary/20"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign up"}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm border-t border-white/5 pt-4">
          Already have an account?{" "}
          <Link
            href="/login"
            className="underline underline-offset-4 text-primary hover:text-primary-hover font-medium transition-colors"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
