"use client";

import { useState, useRef, useCallback, ChangeEvent, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Upload,
  X,
  ImagePlus,
  ShoppingBag,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  IndianRupee,
  Tag,
  FileText,
  Layers,
  Camera,
  Wand2,
  RefreshCw,
} from "lucide-react";
import { CategoryType, ConditionType } from "../marketplace/types";
import { useRouter } from "next/navigation";
import axios from "axios";
/* ────────────────────────────────────────────
   Types
   ──────────────────────────────────────────── */
interface FormData {
  title: string;
  description: string;
  price: string;
  originalPrice: string;
  condition: ConditionType | "";
  category: CategoryType | "";
  branch: string;
  year: string;
  whatsapp: string;
  location: string;
}

interface FormErrors {
  [key: string]: string;
}

/* ────────────────────────────────────────────
   Constants
   ──────────────────────────────────────────── */
const CATEGORIES: CategoryType[] = [
  "Engineering Tools",
  "Books",
  "Electronics",
  "Hostel",
  "Lab Equipment",
  "Others",
];

const CONDITIONS: { value: ConditionType; label: string; description: string }[] = [
  { value: "Like New", label: "Like New", description: "Minimal or no signs of use" },
  { value: "Good", label: "Good", description: "Minor wear, works perfectly" },
  { value: "Fair", label: "Fair", description: "Visible wear, fully functional" },
];

/* ────────────────────────────────────────────
   Helpers
   ──────────────────────────────────────────── */
function normalizeCondition(cond: string): ConditionType {
  const c = (cond || "").toUpperCase().replace(/[\s-]/g, "_");
  if (c.includes("LIKE_NEW") || c.includes("EXCELLENT")) return "Like New";
  if (c.includes("FAIR") || c.includes("POOR")) return "Fair";
  return "Good";
}

function normalizeCategory(cat: string): CategoryType {
  const directMatch = CATEGORIES.find(
    (c) => c.toLowerCase() === (cat || "").toLowerCase()
  );
  if (directMatch) return directMatch;
  const lower = (cat || "").toLowerCase();
  if (lower.includes("book") || lower.includes("textbook") || lower.includes("novel") || lower.includes("note")) return "Books";
  if (lower.includes("electronic") || lower.includes("calculator") || lower.includes("laptop") || lower.includes("phone") || lower.includes("earbud") || lower.includes("charger")) return "Electronics";
  if (lower.includes("tool") || lower.includes("draft") || lower.includes("scale") || lower.includes("t-square") || lower.includes("compass")) return "Engineering Tools";
  if (lower.includes("hostel") || lower.includes("mattress") || lower.includes("kettle") || lower.includes("bucket") || lower.includes("lamp") || lower.includes("iron")) return "Hostel";
  if (lower.includes("lab") || lower.includes("coat") || lower.includes("apron") || lower.includes("beaker") || lower.includes("breadboard")) return "Lab Equipment";
  return "Others";
}
function validate(form: FormData, images: File[]): FormErrors {
  const errors: FormErrors = {};
  if (images.length === 0) errors.images = "Please upload at least one product photo.";
  if (!form.title.trim()) errors.title = "Product title is required.";
  else if (form.title.trim().length < 5) errors.title = "Title must be at least 5 characters.";
  if (!form.description.trim()) errors.description = "Description is required.";
  else if (form.description.trim().length < 20) errors.description = "Description must be at least 20 characters.";
  if (!form.price) errors.price = "Selling price is required.";
  else if (Number(form.price) <= 0) errors.price = "Price must be greater than ₹0.";
  if (form.originalPrice && Number(form.originalPrice) < Number(form.price))
    errors.originalPrice = "Original price should be ≥ selling price.";
  if (!form.condition) errors.condition = "Please select a condition.";
  if (!form.category) errors.category = "Please select a category.";
  return errors;
}

/* ────────────────────────────────────────────
   Sub-components
   ──────────────────────────────────────────── */
function FieldLabel({
  htmlFor,
  children,
  required = false,
}: {
  htmlFor?: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wide mb-1.5"
    >
      {children}
      {required && <span className="text-rose-500 ml-0.5">*</span>}
    </label>
  );
}
function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1 text-[11px] text-rose-600 font-medium">
      <AlertCircle size={12} />
      {message}
    </p>
  );
}

function InputBase({
  id,
  hasError,
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean }) {
  return (
    <input
      id={id}
      className={`w-full px-4 py-3 text-sm text-[#0F172A] placeholder-[#94A3B8] bg-white border rounded-xl focus:outline-none focus:ring-2 transition-all duration-150 ${
        hasError
          ? "border-rose-400 focus:ring-rose-200 focus:border-rose-500"
          : "border-[#E2E8F0] focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
      } ${className}`}
      {...props}
    />
  );
}

/* ────────────────────────────────────────────
   Main Page Component
   ──────────────────────────────────────────── */
export default function SellPage() {
  const router = useRouter()
  const [isLoggedIn , setIsLoggedIn ] = useState(false)
useEffect(()=> {
  const token = localStorage.getItem("token")
  if(token){
    setIsLoggedIn(true)
    const fetchdata = async()=>{
   const data = await axios.get("http://localhost:3001/api/user/me",{
      headers:{
        Authorization: `Bearer ${token}`
      }
    }).then((res)=>{
      setForm((prev)=>{
        return{
          ...prev,
          whatsapp: res.data.mobilenumber || "",
          year: res.data.year || "",
          branch: res.data.department || "",
        }
      })
    }).catch((err)=>{
      console.log(err)
    })
  }
  fetchdata()
  }else{
    router.push("/login")
  }
}, []);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [aiValidating, setAiValidating] = useState(false);
  const [aiSuccess, setAiSuccess] = useState<string | null>(null);
  const [aiRejectionReason, setAiRejectionReason] = useState<string | null>(null);
  const [aiServiceError, setAiServiceError] = useState<string | null>(null);
  const [validationToken, setValidationToken] = useState<string | null>(null);

  const [form, setForm] = useState<FormData>({
    title: "",
    description: "",
    price: "",
    originalPrice: "",
    condition: "",
    category: "",
    branch: "",
    year: "",
    whatsapp: "",
    location: "",
  });

  /* ── AI Validation Call ── */
  const runAiValidation = async (targetFile: File) => {
    setAiValidating(true);
    setAiRejectionReason(null);
    setAiServiceError(null);
    setAiSuccess(null);
    setValidationToken(null);

    try {
      const formData = new FormData();
      formData.append("image", targetFile);

      const res = await axios.post(
        "http://localhost:3001/api/listproduct/validate",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success && res.data.data) {
        const aiData = res.data.data;
        const detectedTitle = aiData.productName || "";
        const detectedDesc = aiData.description || "";
        const detectedCategory = normalizeCategory(aiData.category);
        const detectedCondition = normalizeCondition(aiData.condition);

        setForm((prev) => ({
          ...prev,
          title: detectedTitle || prev.title,
          description: detectedDesc || prev.description,
          category: detectedCategory || prev.category,
          condition: detectedCondition || prev.condition,
        }));

        // Store cryptographic token
        if (res.data.validationToken) {
          setValidationToken(res.data.validationToken);
        }

        // Clear validation errors on auto-filled fields
        setErrors((prev) => ({
          ...prev,
          images: "",
          title: "",
          description: "",
          category: "",
          condition: "",
        }));

        setAiSuccess(detectedTitle || "Product identified successfully");
      } else if (res.data.isAiError) {
        // AI service down / parsing error
        setAiServiceError("Something went wrong, please try in few minutes.");
      } else {
        // Explicit photo rejection by AI (blurry, meme, non-product)
        const reason =
          res.data.message ||
          res.data.data?.reason ||
          "This image is not approved for the campus marketplace.";
        setAiRejectionReason(reason);
        setValidationToken(null);
        // Clear the rejected image
        setImages([]);
        setImagePreviews([]);
        setErrors((prev) => ({
          ...prev,
          images: reason,
        }));
      }
    } catch (err: any) {
      console.error("AI service error:", err);
      setValidationToken(null);
      if (err.response?.data?.isRejection) {
        const reason = err.response.data.message || "This photo is not approved.";
        setAiRejectionReason(reason);
        setImages([]);
        setImagePreviews([]);
        setErrors((prev) => ({ ...prev, images: reason }));
      } else {
        setAiServiceError("Something went wrong, please try in few minutes.");
      }
    } finally {
      setAiValidating(false);
    }
  };

  /* ── Image Handlers ── */
  const addFiles = useCallback(
    async (files: FileList | File[]) => {
      const newFiles = Array.from(files).filter((f) =>
        f.type.startsWith("image/")
      );
      if (newFiles.length === 0) return;

      const merged = [...images, ...newFiles].slice(0, 5);
      setImages(merged);
      const previews = merged.map((f) => URL.createObjectURL(f));
      setImagePreviews(previews);
      setErrors((prev) => ({ ...prev, images: "" }));

      await runAiValidation(newFiles[0]);
    },
    [images]
  );

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) addFiles(e.target.files);
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
    if (newImages.length === 0) {
      setValidationToken(null);
      setAiSuccess(null);
      setAiRejectionReason(null);
    }
  };

  /* ── Drag-and-Drop ── */
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
  };

  /* ── Form Handlers ── */
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const errs = validate({ ...form, [name]: value }, images);
      setErrors((prev) => ({ ...prev, [name]: errs[name] || "" }));
    }
  };

  const handleBlur = (name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const errs = validate(form, images);
    setErrors((prev) => ({ ...prev, [name]: errs[name] || "" }));
  };

  const handleConditionSelect = (value: ConditionType) => {
    setForm((prev) => ({ ...prev, condition: value }));
    setErrors((prev) => ({ ...prev, condition: "" }));
    setTouched((prev) => ({ ...prev, condition: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched: Record<string, boolean> = {};
    Object.keys(form).forEach((k) => (allTouched[k] = true));
    allTouched.images = true;
    setTouched(allTouched);

    const errs = validate(form, images);
    if (!validationToken && images.length > 0) {
      errs.images = "Please wait for AI image verification before publishing.";
    }
    setErrors(errs);

    if (Object.values(errs).some(Boolean)) return;

    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append("title", form.title.trim());
      formData.append("description", form.description.trim());
      formData.append("price", form.price);
      formData.append("originalprice", form.originalPrice || "");
      formData.append("condition", form.condition);
      formData.append("category", form.category);
      formData.append("pickuplocation", form.location || "");
      formData.append("location", form.location || "");
      formData.append("branch", form.branch || "");
      formData.append("year", form.year || "");
      formData.append("whatsapp", form.whatsapp || "");
      if (validationToken) {
        formData.append("validationToken", validationToken);
      }

      if (images[0]) {
        formData.append("image", images[0]);
      }

      await axios.post("http://localhost:3001/api/listproduct/create", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSubmitted(true);
    } catch (err: any) {
      console.log(err);
      const backendMessage = err.response?.data?.message || "Unable to publish this listing right now. Please try again.";
      setErrors((prev) => ({
        ...prev,
        submit: backendMessage,
      }));
    } finally {
      setSubmitting(false);
    }
  };

  const discount =
    form.originalPrice && form.price && Number(form.originalPrice) > Number(form.price)
      ? Math.round(
          ((Number(form.originalPrice) - Number(form.price)) /
            Number(form.originalPrice)) *
            100
        )
      : null;

  /* ── Success Screen ── */
  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center px-4">
        <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-lg p-10 sm:p-14 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={32} className="text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-[#0F172A] mb-3">Listing Published!</h2>
          <p className="text-sm text-[#64748B] leading-relaxed mb-8">
            Your item <strong className="text-[#0F172A]">"{form.title}"</strong> is now live
            on Campus Exchange. Students can reach you on WhatsApp at{" "}
            <strong className="text-[#0F172A]">{form.whatsapp}</strong>.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/marketplace"
              className="w-full py-3 rounded-xl bg-[#2563EB] text-white text-sm font-semibold hover:bg-[#1D4ED8] transition-colors"
            >
              View Marketplace
            </Link>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setForm({
                  title: "", description: "", price: "", originalPrice: "",
                  condition: "", category: "", branch: "", year: "", whatsapp: "", location: "",
                });
                setImages([]);
                setImagePreviews([]);
                setErrors({});
                setTouched({});
              }}
              className="w-full py-3 rounded-xl border border-[#E2E8F0] text-[#64748B] text-sm font-medium hover:bg-[#F8FAFC] transition-colors"
            >
              Post Another Item
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Main Form ── */
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-[#E2E8F0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 group"
          >
            <div className="w-7 h-7 bg-[#2563EB] rounded-lg flex items-center justify-center">
              <ShoppingBag size={14} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-semibold text-[#0F172A] text-sm tracking-tight">
              Campus<span className="text-[#2563EB]">Exchange</span>
            </span>
          </Link>

          <Link
            href="/marketplace"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#64748B] hover:text-[#0F172A] transition-colors"
          >
            <ArrowLeft size={14} />
            Back to listings
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* Page Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] text-xs font-semibold mb-4">
            <Sparkles size={13} />
            Sell on Campus Exchange
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
            List your item for sale
          </h1>
          <p className="mt-2 text-sm text-[#64748B]">
            Fill in the details below. Your listing goes live instantly to students in your college.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column (spans 2) */}
            <div className="lg:col-span-2 space-y-6">

              {/* ── Section: Product Photos ── */}
              <section className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Camera size={16} className="text-[#2563EB]" />
                  <h2 className="text-sm font-bold text-[#0F172A]">Product Photos</h2>
                  <span className="text-[11px] text-[#94A3B8] ml-auto font-medium">
                    {images.length}/2 uploaded
                  </span>
                </div>

                {/* Drop Zone */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
                  onDragLeave={() => setIsDraggingOver(false)}
                  onDrop={handleDrop}
                  onClick={() => !aiValidating && images.length < 2 && fileInputRef.current?.click()}
                  className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 overflow-hidden ${
                    isDraggingOver
                      ? "border-[#2563EB] bg-[#EFF6FF]"
                      : aiValidating
                      ? "border-blue-400 bg-blue-50/30 cursor-wait"
                      : aiRejectionReason
                      ? "border-rose-300 bg-rose-50/30"
                      : errors.images && touched.images
                      ? "border-rose-400 bg-rose-50/40"
                      : "border-[#CBD5E1] bg-[#F8FAFC] hover:border-[#2563EB] hover:bg-[#EFF6FF]/50"
                  } ${images.length >= 1 && !aiValidating ? "opacity-75" : ""}`}
                >
                  {aiValidating ? (
                    <div className="flex flex-col items-center justify-center p-4 text-center">
                      <div className="relative mb-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#2563EB] to-indigo-500 flex items-center justify-center text-white shadow-md animate-bounce">
                          <Wand2 size={22} />
                        </div>
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600"></span>
                        </span>
                      </div>
                      <p className="text-xs font-bold text-[#0F172A] tracking-tight">AI is analyzing your product…</p>
                      <p className="text-[11px] text-[#64748B] mt-1 max-w-xs">
                        Checking marketplace compliance & autofilling details
                      </p>
                    </div>
                  ) : (
                    <>
                      <ImagePlus
                        size={28}
                        className={isDraggingOver ? "text-[#2563EB]" : "text-[#94A3B8]"}
                        strokeWidth={1.8}
                      />
                      <p className="mt-3 text-sm font-semibold text-[#475569]">
                        {isDraggingOver ? "Drop to upload" : "Click or drag & drop photos"}
                      </p>
                      <p className="text-[11px] text-[#94A3B8] mt-1">
                        PNG, JPG, WEBP • AI auto-detects product details
                      </p>
                    </>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    id="product-images"
                    className="hidden"
                    disabled={aiValidating}
                    onChange={handleFileInputChange}
                  />
                </div>

                {/* AI Processing Bar */}
                {aiValidating && (
                  <div className="mt-3.5 p-3.5 rounded-xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200/80 flex items-center gap-3">
                    <Loader2 size={16} className="text-[#2563EB] animate-spin shrink-0" />
                    <div className="text-xs text-[#1E3A8A]">
                      <span className="font-semibold">AI WORKING : </span>
                      <span className="text-[#475569]">Identifying product title, category, and generating description…</span>
                    </div>
                  </div>
                )}

                {/* AI Rejection Banner */}
                {aiRejectionReason && (
                  <div className="mt-3.5 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="w-7 h-7 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600 shrink-0 mt-0.5">
                      <AlertCircle size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-rose-900">Photo Not Approved</p>
                        <button
                          type="button"
                          onClick={() => setAiRejectionReason(null)}
                          className="text-rose-400 hover:text-rose-700 p-0.5"
                        >
                          <X size={13} />
                        </button>
                      </div>
                      <p className="text-xs text-rose-700 mt-1 leading-relaxed">{aiRejectionReason}</p>
                      <button
                        type="button"
                        onClick={() => {
                          setAiRejectionReason(null);
                          fileInputRef.current?.click();
                        }}
                        className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-semibold transition-colors shadow-xs"
                      >
                        <Upload size={12} />
                        Upload a different photo
                      </button>
                    </div>
                  </div>
                )}

                {/* AI Service Error Banner */}
                {aiServiceError && (
                  <div className="mt-3.5 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 shrink-0 mt-0.5">
                      <AlertCircle size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-amber-900">AI Assistant Unavailable</p>
                        <button
                          type="button"
                          onClick={() => setAiServiceError(null)}
                          className="text-amber-500 hover:text-amber-800 p-0.5"
                        >
                          <X size={13} />
                        </button>
                      </div>
                      <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                        Something went wrong, please try in few minutes. You can also fill in the product details manually below.
                      </p>
                      {images.length > 0 && (
                        <div className="mt-2.5 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => runAiValidation(images[0])}
                            disabled={aiValidating}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-semibold transition-colors shadow-xs disabled:opacity-50"
                          >
                            <RefreshCw size={12} className={aiValidating ? "animate-spin" : ""} />
                            Retry AI analysis
                          </button>
                          <button
                            type="button"
                            onClick={() => setAiServiceError(null)}
                            className="px-3 py-1.5 rounded-lg border border-amber-300 text-amber-900 hover:bg-amber-100 text-[11px] font-medium transition-colors"
                          >
                            Fill manually
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* AI Success Banner */}
                {aiSuccess && !aiValidating && (
                  <div className="mt-3.5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3 text-emerald-900 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                        <Sparkles size={13} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-emerald-900">AI Auto-filled Product Details!</p>
                        <p className="text-[11px] text-emerald-700 truncate">{aiSuccess}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAiSuccess(null)}
                      className="text-emerald-500 hover:text-emerald-800 p-1"
                    >
                      <X size={13} />
                    </button>
                  </div>
                )}

                <FieldError message={touched.images && !aiRejectionReason ? errors.images : ""} />

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
                    {imagePreviews.map((src, idx) => (
                      <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-[#E2E8F0]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={src}
                          alt={`Preview ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {idx === 0 && (
                          <span className="absolute bottom-1 left-1 bg-[#2563EB] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-xs">
                            Main
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                          className="absolute top-1 right-1 w-5 h-5 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Remove image"
                        >
                          <X size={11} className="text-white" />
                        </button>
                      </div>
                    ))}
                    {images.length < 1 && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square rounded-xl border-2 border-dashed border-[#CBD5E1] hover:border-[#2563EB] flex items-center justify-center text-[#94A3B8] hover:text-[#2563EB] transition-colors"
                      >
                        <Upload size={18} />
                      </button>
                    )}
                  </div>
                )}
              </section>

              {/* ── Section: Product Details ── */}
              <section className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 space-y-5">
                <div className="flex items-center gap-2 mb-1">
                  <FileText size={16} className="text-[#2563EB]" />
                  <h2 className="text-sm font-bold text-[#0F172A]">Product Details</h2>
                  {aiSuccess && (
                    <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      <Sparkles size={11} />
                      AI Assisted
                    </span>
                  )}
                </div>

                {/* Title */}
                <div>
                  <FieldLabel htmlFor="title" required>Product Title</FieldLabel>
                  <InputBase
                    id="title"
                    name="title"
                    type="text"
                    placeholder="e.g., Casio fx-991EX Scientific Calculator, N.D. Bhatt Engineering Drawing"
                    value={form.title}
                    onChange={handleChange}
                    onBlur={() => handleBlur("title")}
                    hasError={!!(errors.title && touched.title)}
                  />
                  {touched.title && <FieldError message={errors.title} />}
                  {form.title && !errors.title && (
                    <p className="mt-1 text-[11px] text-[#94A3B8]">{form.title.length} chars</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <FieldLabel htmlFor="description" required>Description</FieldLabel>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    placeholder="Describe your item honestly — its condition, any accessories included, reason for selling, etc."
                    value={form.description}
                    onChange={handleChange}
                    onBlur={() => handleBlur("description")}
                    className={`w-full px-4 py-3 text-sm text-[#0F172A] placeholder-[#94A3B8] bg-white border rounded-xl focus:outline-none focus:ring-2 transition-all duration-150 resize-none ${
                      errors.description && touched.description
                        ? "border-rose-400 focus:ring-rose-200 focus:border-rose-500"
                        : "border-[#E2E8F0] focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                    }`}
                  />
                  {touched.description && <FieldError message={errors.description} />}
                  <p className="mt-1 text-[11px] text-[#94A3B8]">
                    {form.description.length} / 500 chars
                  </p>
                </div>
              </section>

              {/* ── Section: Pricing ── */}
              <section className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 space-y-5">
                <div className="flex items-center gap-2 mb-1">
                  <IndianRupee size={16} className="text-[#2563EB]" />
                  <h2 className="text-sm font-bold text-[#0F172A]">Pricing</h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Selling Price */}
                  <div>
                    <FieldLabel htmlFor="price" required>Your Selling Price (₹)</FieldLabel>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] text-sm font-semibold">₹</span>
                      <InputBase
                        id="price"
                        name="price"
                        type="number"
                        min="1"
                        placeholder="e.g., 350"
                        value={form.price}
                        onChange={handleChange}
                        onBlur={() => handleBlur("price")}
                        hasError={!!(errors.price && touched.price)}
                        className="pl-8"
                      />
                    </div>
                    {touched.price && <FieldError message={errors.price} />}
                  </div>

                  {/* Original Price */}
                  <div>
                    <FieldLabel htmlFor="originalPrice">Original / MRP (₹) <span className="text-[#94A3B8] font-normal normal-case">Optional</span></FieldLabel>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] text-sm font-semibold">₹</span>
                      <InputBase
                        id="originalPrice"
                        name="originalPrice"
                        type="number"
                        min="1"
                        placeholder="e.g., 1200"
                        value={form.originalPrice}
                        onChange={handleChange}
                        onBlur={() => handleBlur("originalPrice")}
                        hasError={!!(errors.originalPrice && touched.originalPrice)}
                        className="pl-8"
                      />
                    </div>
                    {touched.originalPrice && <FieldError message={errors.originalPrice} />}
                  </div>
                </div>

                {/* Discount Badge */}
                {discount !== null && (
                  <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <Tag size={14} className="text-emerald-600" />
                    <p className="text-xs text-emerald-700 font-semibold">
                      Buyers save <strong>{discount}%</strong> — that's ₹{Number(form.originalPrice) - Number(form.price)} off the retail price!
                    </p>
                  </div>
                )}
              </section>

              {/* ── Section: Condition & Category ── */}
              <section className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 space-y-6">
                <div className="flex items-center gap-2 mb-1">
                  <Layers size={16} className="text-[#2563EB]" />
                  <h2 className="text-sm font-bold text-[#0F172A]">Condition & Category</h2>
                </div>

                {/* Condition Cards */}
                <div>
                  <FieldLabel required>Item Condition</FieldLabel>
                  <div className="grid grid-cols-3 gap-3">
                    {CONDITIONS.map((c) => {
                      const selected = form.condition === c.value;
                      return (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() => handleConditionSelect(c.value)}
                          className={`p-3 rounded-xl border text-left transition-all duration-150 ${
                            selected
                              ? "border-[#2563EB] bg-[#EFF6FF] ring-2 ring-[#2563EB]/20"
                              : "border-[#E2E8F0] bg-white hover:border-[#CBD5E1] hover:bg-[#F8FAFC]"
                          }`}
                        >
                          <p className={`text-xs font-bold ${selected ? "text-[#2563EB]" : "text-[#0F172A]"}`}>
                            {c.label}
                          </p>
                          <p className="text-[11px] text-[#94A3B8] mt-0.5 leading-snug">{c.description}</p>
                        </button>
                      );
                    })}
                  </div>
                  {touched.condition && <FieldError message={errors.condition} />}
                </div>

                {/* Category Dropdown */}
                <div>
                  <FieldLabel htmlFor="category" required>Category</FieldLabel>
                  <div className="relative">
                    <select
                      id="category"
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      onBlur={() => handleBlur("category")}
                      className={`w-full appearance-none px-4 py-3 text-sm text-[#0F172A] bg-white border rounded-xl focus:outline-none focus:ring-2 transition-all cursor-pointer ${
                        errors.category && touched.category
                          ? "border-rose-400 focus:ring-rose-200 focus:border-rose-500"
                          : "border-[#E2E8F0] focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                      } ${form.category === "" ? "text-[#94A3B8]" : ""}`}
                    >
                      <option value="" disabled>Select a category…</option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <ChevronDown size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
                  </div>
                  {touched.category && <FieldError message={errors.category} />}
                </div>
              </section>
            </div>
            {/* department , year , whatsapp number from backend call*/}
                {/* Pickup Location */}
                <div>
                  <FieldLabel htmlFor="location">Pickup Location <span className="text-[#94A3B8] font-normal normal-case">Optional</span></FieldLabel>
                  <InputBase
                    id="location"
                    name="location"
                    type="text"
                    placeholder="e.g., Hostel Block B, Library Gate"
                    value={form.location}
                    onChange={handleChange}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center gap-2 mt-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Publishing…
                    </>
                  ) : (
                    <>
                      <Sparkles size={15} />
                      Publish Listing
                    </>
                  )}
                </button>

                <p className="text-[11px] text-[#94A3B8] text-center">
                  By listing, you agree to our{" "}
                  <Link href="#" className="text-[#2563EB] hover:underline">Terms of Service</Link>.
                </p>
          </div>
        </form>
      </main>
    </div>
  );
}