"use client"

import axios from "axios"
import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
    User,
    Lock,
    Phone,
    GraduationCap,
    Building2,
    Calendar,
    ArrowRight,
    Sparkles,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Eye,
    EyeOff
} from "lucide-react"
export default function Signup() {
    const [name, setName] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [college, setCollege] = useState("")
    const [year, setYear] = useState<number>(new Date().getFullYear())
    const [department, setDepartment] = useState("")
    const[mobilenumber,setMobilenumber] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const router = useRouter();
    async function handleSignup(e: React.FormEvent) {
        e.preventDefault()
        setError(null)

        // Validation
        if (!name.trim() || !username.trim() || !password.trim() || !college || !department) {
            setError("Please fill in all the required fields.")
            return
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.")
            return
        }

        try {
            setLoading(true)
            const response = await axios.post("http://localhost:3001/api/auth/signup", {
                name: name.trim(),
                username: username.trim(),
                password,
                mobilenumber:mobilenumber.trim(),
                college,
                year: Number(year),
                department
            })
           if(response.data.Status === "Success"){
          sessionStorage.setItem(
  "signupData",
  JSON.stringify({
    sessionid : response.data.Details,
    username: username.trim(),
    password,
    mobilenumber:mobilenumber.trim(),
    name:name.trim(),
    college,
    year:Number(year),
    department
           }))
            router.push("/otp");
           }
        } catch (err) {
            let errorMsg = "Failed to create account. Please try again."
            if (axios.isAxiosError(err) && err.response?.data?.message) {
                errorMsg = err.response.data.message
            }
            setError(errorMsg)
        } finally {
            setLoading(false)
        }
    }

    const currentYear = new Date().getFullYear()

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/30 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative">
            {/* Background glowing ambient orbs */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative w-full max-w-lg">
                {/* Main Card */}
                <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/80 p-6 sm:p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-slate-300">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-medium mb-3 transition-colors hover:bg-blue-100/70">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Campus Marketplace</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                            Create an account
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Buy, sell, and connect with peers from your college
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
                            <span>Account created successfully! Redirecting...</span>
                        </div>
                    )}

                    {/* Signup Form */}
                    <form onSubmit={handleSignup} className="space-y-4">
                        {/* 2-Column: Full Name & Username */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Full Name */}
                            <div className="group">
                                <label
                                    htmlFor="name"
                                    className="block text-xs font-semibold text-slate-700 mb-1.5 transition-colors group-focus-within:text-blue-600"
                                >
                                    Full Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <input
                                        id="name"
                                        type="text"
                                        placeholder="e.g. John Doe"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 hover:border-slate-300 hover:bg-white focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Username */}
                            <div className="group">
                                <label
                                    htmlFor="username"
                                    className="block text-xs font-semibold text-slate-700 mb-1.5 transition-colors group-focus-within:text-blue-600"
                                >
                                    Username
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                        <span className="text-xs font-bold text-slate-400 group-focus-within:text-blue-500">@</span>
                                    </div>
                                    <input
                                        id="username"
                                        type="text"
                                        placeholder="johndoe"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full pl-8 pr-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 hover:border-slate-300 hover:bg-white focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10"
                                        required
                                    />
                                </div>
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
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
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
                        <div className="group">
                            <label htmlFor="mobilenumber" className="block text-xs font-semibold text-slate-700 mb-1.5 transition-colors group-focus-within:text-blue-600"> Mobile Number</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                    <Phone className="w-4 h-4" />
                                </div>
                                <input
                                    id="mobilenumber"
                                    type="number"
                                    placeholder="1234567890"
                                    value={mobilenumber}
                                    maxLength={10}
                                    onChange={(e) => setMobilenumber(e.target.value)}
                                    className="w-full pl-9 pr-10 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 hover:border-slate-300 hover:bg-white focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10"
                                    required
                                />
                            </div>
                        </div>
                        {/* College Select */}
                        <div className="group">
                            <label
                                htmlFor="college"
                                className="block text-xs font-semibold text-slate-700 mb-1.5 transition-colors group-focus-within:text-blue-600"
                            >
                                College
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                    <Building2 className="w-4 h-4" />
                                </div>
                                <select
                                    id="college"
                                    value={college}
                                    onChange={(e) => setCollege(e.target.value)}
                                    className="w-full pl-9 pr-8 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none transition-all duration-200 hover:border-slate-300 hover:bg-white focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 cursor-pointer appearance-none"
                                    required
                                >
                                    <option value="">Select College</option>
                                    <option value="USICT">USICT - University School of Information, Communication & Technology</option>
                                    <option value="USAR">USAR - University School of Automation & Robotics</option>
                                    <option value="USCT">USCT - University School of Chemical Technology</option>
                                    <option value="USBT">USBT - University School of Biotechnology</option>
                                    <option value="MAIT">MAIT - Maharaja Agrasen Institute of Technology</option>
                                    <option value="MSIT">MSIT - Maharaja Surajmal Institute of Technology</option>
                                    <option value="BPIT">BPIT - Bhagwan Parshuram Institute of Technology</option>
                                    <option value="BVCOE">{"BVCOE - Bharati Vidyapeeth's College of Engineering"}</option>
                                    <option value="ADGITM">ADGITM - Dr. Akhilesh Das Gupta Institute of Technology & Management</option>
                                    <option value="GTBIT">GTBIT - Guru Tegh Bahadur Institute of Technology</option>
                                    <option value="VIPS-TC">VIPS Technical Campus</option>
                                    <option value="HMRITM">HMRITM - HMR Institute of Technology & Management</option>
                                    <option value="DTC">DTC - Delhi Technical Campus</option>
                                    <option value="TRINITY">Trinity Institute of Innovations in Professional Studies</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* 2-Column: Year & Department */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Year */}
                            <div className="group">
                                <label
                                    htmlFor="year"
                                    className="block text-xs font-semibold text-slate-700 mb-1.5 transition-colors group-focus-within:text-blue-600"
                                >
                                    Graduation Year
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                        <Calendar className="w-4 h-4" />
                                    </div>
                                    <input
                                        id="year"
                                        type="number"
                                        value={year}
                                        max={currentYear + 5}
                                        min={currentYear - 5}
                                        onChange={(e) => setYear(Number(e.target.value))}
                                        className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none transition-all duration-200 hover:border-slate-300 hover:bg-white focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Department */}
                            <div className="group">
                                <label
                                    htmlFor="department"
                                    className="block text-xs font-semibold text-slate-700 mb-1.5 transition-colors group-focus-within:text-blue-600"
                                >
                                    Department
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                        <GraduationCap className="w-4 h-4" />
                                    </div>
                                    <select
                                        id="department"
                                        value={department}
                                        onChange={(e) => setDepartment(e.target.value)}
                                        className="w-full pl-9 pr-8 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none transition-all duration-200 hover:border-slate-300 hover:bg-white focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 cursor-pointer appearance-none"
                                        required
                                    >
                                        <option value="">Select Department</option>
                                        <option value="CSE">Computer Science & Engineering</option>
                                        <option value="IT">Information Technology</option>
                                        <option value="ECE">Electronics & Communication</option>
                                        <option value="EE">Electrical Engineering</option>
                                        <option value="ME">Mechanical Engineering</option>
                                        <option value="AIDS">AI & Data Science</option>
                                        <option value="AIML">AI & Machine Learning</option>
                                        <option value="BT">Biotechnology</option>
                                        <option value="Civil">Civil Engineering</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button with Hover effects */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading || success}
                                className="group relative w-full py-3 px-4 rounded-xl text-white font-medium text-sm bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 shadow-md hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Creating account...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Create Account</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Footer link to Login */}
                    <div className="mt-6 pt-5 border-t border-slate-100 text-center">
                        <p className="text-sm text-slate-500">
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors ml-1"
                            >
                                Log in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}