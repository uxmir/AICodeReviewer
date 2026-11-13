"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { 
  GitPullRequest, 
  Bot, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  Database, 
  ArrowRight, 
  CheckCircle2, 
  Terminal, 
  GitBranch, 
  Sparkles,
  Layers
} from "lucide-react";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'security' | 'performance'>('security');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white font-sans">
      
      {/* 1. STICKY NAVBAR */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Bot className="w-6 h-6" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              GitReview.ai
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-indigo-600 transition">Features</a>
            <a href="#architecture" className="hover:text-indigo-600 transition">Architecture</a>
            <a href="#workflow" className="hover:text-indigo-600 transition">How it Works</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard/github" 
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-medium transition shadow-sm"
            >
              <GitBranch className="w-4 h-4" />
              <span>Install GitHub App</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Powered by RAG & Pinecone Vector DB</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight">
            Automated Code Reviews with <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Deep Contextual Awareness</span>
          </h1>
          
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Instantly review Pull Requests and code pushes using AI. Built with Next.js, Inngest, and Pinecone to safeguard your codebase quality 24/7.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/dashboard" 
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-semibold transition shadow-lg shadow-indigo-200"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a 
              href="#architecture" 
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 px-8 py-4 rounded-xl font-semibold transition"
            >
              Explore Architecture
            </a>
          </div>

          {/* MOCK PR DIFF PREVIEW CARD */}
          <div className="mt-16 max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200/80 shadow-2xl overflow-hidden text-left">
            <div className="bg-slate-900 px-4 py-3 flex items-center justify-between text-slate-400 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                <span className="ml-2 text-slate-300">PR #42: optimize-webhook-sync.ts</span>
              </div>
              <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-[10px]">AI Review Passed</span>
            </div>
            <div className="p-6 font-mono text-xs sm:text-sm bg-slate-50 space-y-4">
              <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-slate-200">
                <Bot className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-800 flex items-center gap-2">
                    <span>GitReview AI Bot</span>
                    <span className="text-xs font-normal text-slate-400">Just now</span>
                  </div>
                  <p className="mt-1 text-slate-600 font-sans">
                    ✨ Looks solid! The O(1) Set lookup added for repository synchronization prevents duplicate entries effectively. One minor suggestion: ensure `repositories_removed` IDs are validated properly.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. TECH STACK STRIP */}
      <section className="py-10 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-6">Engineered with modern full-stack tools</p>
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-16 opacity-75 font-semibold text-slate-700">
            <span className="flex items-center gap-2"><Layers className="w-5 h-5 text-indigo-600" /> Next.js 15</span>
            <span className="flex items-center gap-2"><Database className="w-5 h-5 text-emerald-600" /> MongoDB Atlas</span>
            <span className="flex items-center gap-2"><Cpu className="w-5 h-5 text-violet-600" /> Pinecone Vector DB</span>
            <span className="flex items-center gap-2"><Zap className="w-5 h-5 text-amber-600" /> Inngest Workflows</span>
            <span className="flex items-center gap-2"><GitBranch className="w-5 h-5 text-slate-900" /> GitHub App API</span>
          </div>
        </div>
      </section>

      {/* 4. CORE FEATURES GRID */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Everything you need for autonomous code audits
          </h2>
          <p className="mt-4 text-slate-600">
            Designed for high-performance software engineering teams who value code security and architecture integrity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">RAG-Powered Context</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Chunks your entire repository and indexes embeddings into Pinecone so the AI understands your custom codebase architecture.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Real-time Webhook Sync</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Handles repository installation, addition, and removal events instantly with optimized O(1) set-based tracking.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Automated PR Comments</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Posts formatted code reviews directly onto GitHub Pull Requests via Octokit and tracks status in MongoDB.
            </p>
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
    <Suspense>
      <Footer/>
    </Suspense>
    </div>
  );
}

const Footer:React.FC=()=>{
  return(
          <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p> &copy;{new Date().getFullYear()} GitReview.ai. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-900 transition">Privacy</a>
            <a href="#" className="hover:text-slate-900 transition">Terms</a>
            <a href="#" className="hover:text-slate-900 transition">GitHub</a>
          </div>
        </div>
      </footer>
  )
}