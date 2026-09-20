"use client"

import React, { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
    ShieldCheck,
    ArrowRight,
    Sparkles,
    CheckCircle2,
    AlertCircle,
    Loader2,
    RotateCcw,
    Phone
} from "lucide-react"
import axios from "axios"
export default function OtpPage() {
    const router = useRouter()
    const [otp, setOtp] = useState(["", "", "", "", "", ""])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [timer, setTimer] = useState(30)
    const [canResend, setCanResend] = useState(false)
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    // Countdown timer for Resend OTP
    useEffect(() => {
        if (timer > 0) {
            const countdown = setInterval(() => {
                setTimer((prev) => prev - 1)
            }, 1000)
            return () => clearInterval(countdown)
        } else {
            setCanResend(true)
        }
    }, [timer])
useEffect(() => {
const saved = sessionStorage.getItem("signupData");
if(!saved){
    router.push("/signup")
}
    }, [])
    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return

        const newOtp = [...otp]
        newOtp[index] = value.slice(-1)
        setOtp(newOtp)
        setError(null)

        // Auto move to next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData("text").trim().slice(0, 6)
        if (!/^\d+$/.test(pastedData)) return

        const newOtp = [...otp]
        pastedData.split("").forEach((char, idx) => {
            if (idx < 6) newOtp[idx] = char
        })
        setOtp(newOtp)

        // Focus the appropriate input after paste
        const nextIndex = Math.min(pastedData.length, 5)
        inputRefs.current[nextIndex]?.focus()
    }

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        const fullOtp = otp.join("")
        if (fullOtp.length < 6) {
            setError("Please enter the complete 6-digit verification code.")
            return
        }

        try {
            setLoading(true)
            setError(null)
            const saved = sessionStorage.getItem("signupData");
            const state = JSON.parse(saved || '{}') as {
  sessionid: string;
  username: string;
  mobilenumber: string;
  password: string;
  name: string;
  college: string;
  year: number;
  department: string;
};
            const res = await axios.post(`http://localhost:3001/api/auth/verify-otp`, {
                sessionid: state.sessionid,
                otp: fullOtp,
                username: state.username,
                mobilenumber: state.mobilenumber,
                password: state.password,
                name: state.name,
                college: state.college,
                year: state.year,
                department: state.department
            });
            if(res.status == 200 && res.data.token){
                localStorage.setItem("token", res.data.token)
                sessionStorage.removeItem("signupData")
                router.push("/marketplace")
            }
            
        } catch (err: any) {
            setError(err?.response?.data?.message || "Invalid OTP code. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleResendOtp = () => {
        if (!canResend) return
        setCanResend(false)
        setTimer(30)
        setError(null)
        // User handles the resend OTP logic
    }

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

                        <div className="mx-auto w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-3 shadow-inner">
                            <ShieldCheck className="w-6 h-6" />
                        </div>

                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                            Verify Mobile
                        </h1>
                        <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto">
                            Enter the 6-digit OTP sent to your registered mobile number
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
                            <span>Mobile number verified! Redirecting...</span>
                        </div>
                    )}

                    {/* OTP Form */}
                    <form onSubmit={handleVerifyOtp} className="space-y-6">
                        <div className="flex justify-between items-center gap-2 sm:gap-2.5">
                            {otp.map((digit, idx) => (
                                <input
                                    key={idx}
                                    ref={(el) => { inputRefs.current[idx] = el }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(idx, e)}
                                    onPaste={handlePaste}
                                    className="w-11 h-13 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold text-slate-900 bg-slate-50/60 border border-slate-200 rounded-xl outline-none transition-all duration-200 hover:border-slate-300 hover:bg-white focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10"
                                    required
                                />
                            ))}
                        </div>

                        {/* Resend Section */}
                        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                            <span className="flex items-center gap-1.5">
                                <Phone className="w-3.5 h-3.5 text-slate-400" />
                                Didn't receive code?
                            </span>
                            {canResend ? (
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    className="font-semibold text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-1 cursor-pointer"
                                >
                                    <RotateCcw className="w-3 h-3" />
                                    Resend OTP
                                </button>
                            ) : (
                                <span className="font-medium text-slate-400">
                                    Resend in {timer}s
                                </span>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || success}
                            className="group relative w-full py-3 px-4 rounded-xl text-white font-medium text-sm bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 shadow-md hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Verifying OTP...</span>
                                </>
                            ) : (
                                <>
                                    <span>Verify & Proceed</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer Navigation */}
                    <div className="mt-6 pt-5 border-t border-slate-100 text-center">
                        <p className="text-sm text-slate-500">
                            Wrong number or want to change?{" "}
                            <Link
                                href="/signup"
                                className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors ml-1"
                            >
                                Back to Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}