import Link from "next/link";
import { BookOpen, Star, Zap, ChevronRight } from "lucide-react";

export default function MarketingPage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary-600/20 blur-[120px] rounded-full pointer-events-none -z-10" />
      
      {/* Navigation */}
      <nav className="w-full border-b border-white/5 bg-surface-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <span className="text-white font-bold">E</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">EdgeLearn</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Log in
            </Link>
            <Link href="/signup" className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium rounded-xl transition-all shadow-[0_0_15px_rgba(124,58,237,0.3)]">
              Sign up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 mt-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-primary-400 font-medium mb-8">
          <Zap className="w-4 h-4 fill-primary-400" /> Introducing EdgeLearn 2.0
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight max-w-4xl mb-6">
          Master the future of tech with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">interactive learning.</span>
        </h1>
        
        <p className="text-lg text-gray-400 max-w-2xl mb-10">
          Join thousands of developers leveling up their skills with premium, high-quality courses designed for the modern web.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/explore" className="px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-2xl transition-all shadow-[0_0_30px_rgba(124,58,237,0.4)] flex items-center gap-2">
            Explore Courses <ChevronRight className="w-5 h-5" />
          </Link>
          <Link href="/dashboard" className="px-8 py-4 bg-surface-800 hover:bg-surface-700 text-white font-bold rounded-2xl border border-white/10 transition-colors">
            Go to Dashboard
          </Link>
        </div>
        
        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full mt-24">
          <div className="glass-panel p-6 rounded-3xl text-left flex flex-col items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-400"><BookOpen className="w-6 h-6" /></div>
            <h3 className="text-xl font-bold text-white">Premium Content</h3>
            <p className="text-gray-400 text-sm">Learn from industry experts with meticulously crafted video lessons and resources.</p>
          </div>
          <div className="glass-panel p-6 rounded-3xl text-left flex flex-col items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-accent-500/10 flex items-center justify-center text-accent-400"><Zap className="w-6 h-6" /></div>
            <h3 className="text-xl font-bold text-white">Interactive Progress</h3>
            <p className="text-gray-400 text-sm">Track your daily streaks and stay motivated with gamified learning experiences.</p>
          </div>
          <div className="glass-panel p-6 rounded-3xl text-left flex flex-col items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-400"><Star className="w-6 h-6" /></div>
            <h3 className="text-xl font-bold text-white">Lifetime Access</h3>
            <p className="text-gray-400 text-sm">Buy a course once and own it forever. Learn at your own pace, anytime.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
