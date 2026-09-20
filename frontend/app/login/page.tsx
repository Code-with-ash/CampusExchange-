"use client"

import axios from "axios"
import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
    Lock,
    ArrowRight,
    Sparkles,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Eye,
    EyeOff
} from "lucide-react"

export default function Login() {
    const router = useRouter()

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault()
        setError(null)

        if (!username.trim() || !password.trim()) {
            setError("Please enter both username and password.")
            return
        }
        try {
            setLoading(true)
            const response = await axios.post("http://localhost:3001/api/auth/login", {
                username: username.trim(),
                password
            })

            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", response.data.user.username);
                localStorage.setItem("branch", response.data.branch);
                localStorage.setItem("year", response.data.year);
                console.log(response.data.user.username);
            }

            setSuccess(true)
            setTimeout(() => {
                router.push("/marketplace")
            }, 1000)
        } catch (err) {
            let errorMsg = "Invalid username or password. Please try again."
            if (axios.isAxiosError(err) && err.response?.data?.message) {
                errorMsg = err.response.data.message
            }
            setError(errorMsg)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        try {
            const token = localStorage.getItem("token")
            if (token) {
                router.push("/marketplace")
            }
        } catch (err) {
            console.log(err)
        }
    }, [])
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/30 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative">
            {/* Background glowing ambient orbs */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative w-full max-w-md">
                {/* Main Card */}
                <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/80 p-6 sm:p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-slate-300">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-medium mb-3 transition-colors hover:bg-blue-100/70">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Campus Marketplace</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                            Welcome back
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Enter your credentials to access your account
                        </p>
                    </div>

                    {/* Alert Messages */}
                    {error && (
                        <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200/80 flex items-center gap-3 text-red-700 text-sm animate-in fade-in slide-in-from-top-1 duration-200">
                            <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center gap-3 text-emerald-700 text-sm animate-in fade-in slide-in-from-top-1 duration-200">
                            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
                            <span>Login successful! Redirecting to marketplace...</span>
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="space-y-4">
                        {/* Username */}
                        <div className="group">
                            <label
                                htmlFor="username"
                                className="block text-xs font-semibold text-slate-700 mb-1.5 transition-colors group-focus-within:text-blue-600"
                            >
                                Username
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                    <span className="text-xs font-bold text-slate-400 group-focus-within:text-blue-500">@</span>
                                </div>
                                <input
                                    id="username"
                                    type="text"
                                    placeholder="johndoe"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 hover:border-slate-300 hover:bg-white focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="group">
                            <label
                                htmlFor="password"
                                className="block text-xs font-semibold text-slate-700 mb-1.5 transition-colors group-focus-within:text-blue-600"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-9 pr-10 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 hover:border-slate-300 hover:bg-white focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button with Hover Effects */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading || success}
                                className="group relative w-full py-3 px-4 rounded-xl text-white font-medium text-sm bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 shadow-md hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Logging in...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Sign In</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Footer link to Signup */}
                    <div className="mt-6 pt-5 border-t border-slate-100 text-center">
                        <p className="text-sm text-slate-500">
                            {"Don't have an account yet? "}
                            <Link
                                href="/signup"
                                className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors ml-1"
                            >
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}