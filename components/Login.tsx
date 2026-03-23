"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface LoginProps {
  callbackUrl?: string;
}

export default function LoginPage({ callbackUrl = "/dashboard" }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    console.log("Callback url:", callbackUrl);
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl,
      });

      if (res?.error) {
        toast.error("Invalid email or password");
        setIsLoading(false);
        return;
      }

      toast.success("Welcome back!");
      router.push(callbackUrl);
    } catch (error) {
      console.log(error);
      toast.error("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  const handleGoogleLogIn = () => {
    setIsLoading(true);
    signIn("google", { callbackUrl });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-[#0d0d0d] p-4 relative overflow-hidden">

      {/* Background blobs */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-200 dark:bg-indigo-900/20 rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-200 dark:bg-purple-900/20 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="relative w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-2xl font-bold text-zinc-900 dark:text-white">
              Your<span className="text-indigo-600 dark:text-indigo-400">Learn</span>
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-xl dark:shadow-black/30">

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
              Welcome back
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
              Login to continue learning
            </p>
          </div>

          {/* Google first */}
          <button
            onClick={handleGoogleLogIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-700/60 disabled:opacity-50 disabled:cursor-not-allowed transition mb-5"
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="Google" />
            )}
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px bg-zinc-200 dark:bg-zinc-700 flex-1" />
            <span className="text-xs text-zinc-400">or continue with email</span>
            <div className="h-px bg-zinc-200 dark:bg-zinc-700 flex-1" />
          </div>

          {/* Form */}
          <form className="space-y-4">
            <div>
              <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full px-4 py-2.5 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition placeholder:text-zinc-400"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Password</label>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 w-full px-4 py-2.5 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition placeholder:text-zinc-400"
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition text-white text-sm font-semibold flex items-center justify-center gap-2 mt-2 shadow-lg shadow-indigo-500/20"
            >
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-zinc-400 mt-6">
            Don't have an account?{" "}
            <Link
              href={`/register?callbackUrl=${encodeURIComponent(callbackUrl)}`}
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              Create one
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-zinc-400 mt-6">
          By logging in you agree to our terms of service.
        </p>
      </div>
    </div>
  );
}