"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/utils/supabase/client";
import { Mail, Lock, User, AlertCircle } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  const handleGoogleSignup = async () => {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-background pt-20">
      <Navbar />

      <section className="flex-1 flex items-center justify-center py-16 px-6 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex items-center justify-center">
          <div className="w-[500px] h-[500px] bg-foreground/5 rounded-full blur-[100px]"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-surface border border-foreground/10 p-8 relative z-10 shadow-2xl"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-heading text-foreground uppercase tracking-widest mb-2">Join Orvano</h1>
            <p className="text-foreground/60 text-xs uppercase tracking-widest">Create your premium account</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 mb-6 rounded-sm flex items-center text-sm">
              <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              {error}
            </div>
          )}

          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-[#D4AF37]/20 text-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-heading uppercase tracking-widest mb-4">Check Your Email</h3>
              <p className="text-foreground/60 font-light text-sm mb-6">
                We&apos;ve sent a confirmation link to <span className="text-foreground">{email}</span>. 
                Please verify your email to complete registration.
              </p>
              <Link href="/login">
                <Button variant="outline" className="w-full">Return to Login</Button>
              </Link>
            </div>
          ) : (
            <>
              <form onSubmit={handleEmailSignup} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-foreground/60 text-xs tracking-widest uppercase block">First Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                      <input 
                        type="text" 
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className="w-full bg-background border border-foreground/10 pl-10 pr-4 py-3 text-foreground focus:outline-none focus:border-[#D4AF37] transition-colors" 
                        placeholder="John"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-foreground/60 text-xs tracking-widest uppercase block">Last Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                      <input 
                        type="text" 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        className="w-full bg-background border border-foreground/10 pl-10 pr-4 py-3 text-foreground focus:outline-none focus:border-[#D4AF37] transition-colors" 
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-foreground/60 text-xs tracking-widest uppercase block">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-background border border-foreground/10 pl-12 pr-4 py-3 text-foreground focus:outline-none focus:border-[#D4AF37] transition-colors" 
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-foreground/60 text-xs tracking-widest uppercase block">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full bg-background border border-foreground/10 pl-12 pr-4 py-3 text-foreground focus:outline-none focus:border-[#D4AF37] transition-colors" 
                      placeholder="••••••••"
                    />
                  </div>
                  <p className="text-foreground/40 text-[10px] tracking-widest uppercase">Must be at least 6 characters</p>
                </div>

                <Button type="submit" disabled={loading} className="w-full mt-2">
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>

              <div className="mt-8 mb-6 relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-[10px] sm:text-xs uppercase tracking-[0.2em] font-bold">
                  <span className="bg-[#0A0A0B] px-4 py-1 text-white/50 border border-white/10 rounded-full">
                    OR CONTINUE WITH
                  </span>
                </div>
              </div>

              <Button 
                type="button" 
                variant="outline" 
                onClick={handleGoogleSignup} 
                className="w-full border-white/20 hover:border-[#D4AF37] hover:bg-white/5 transition-all duration-300 py-6"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="font-bold tracking-widest text-xs uppercase text-white">Continue with Google</span>
              </Button>

              <p className="mt-8 text-center text-xs text-foreground/60 tracking-wider">
                Already have an account?{" "}
                <Link href="/login" className="text-[#D4AF37] uppercase font-bold hover:text-[#F5D67B] transition-colors ml-1">
                  Sign In
                </Link>
              </p>
            </>
          )}
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
