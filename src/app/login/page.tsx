import Link from 'next/link'
import { login } from './actions'
import { BookOpen, AlertCircle } from 'lucide-react'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ message: string }> }) {
  const params = await searchParams;

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mx-auto pt-20">
      <Link
        href="/"
        className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-secondary hover:bg-secondary/80 flex items-center group text-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>{' '}
        Back
      </Link>

      <div className="w-full flex justify-center mb-8">
        <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(79,70,229,0.5)]">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
      </div>

      <form className="animate-in flex-1 flex flex-col w-full justify-center gap-4 text-foreground">
        <h1 className="text-3xl font-bold text-center mb-2">Welcome Back</h1>
        <p className="text-muted-foreground text-center mb-8 text-sm">
          Sign in to your Next-Gen Learning account
        </p>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            className="rounded-xl px-4 py-3 bg-secondary/50 border border-border focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all"
            name="email"
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium" htmlFor="password">
            Password
          </label>
          <input
            className="rounded-xl px-4 py-3 bg-secondary/50 border border-border focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all"
            type="password"
            name="password"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          formAction={login}
          className="mt-6 bg-primary-600 hover:bg-primary-700 text-white rounded-xl px-4 py-3 text-sm font-semibold shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all hover:shadow-[0_0_30px_rgba(79,70,229,0.5)]"
        >
          Sign In
        </button>
        
        {params?.message && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-2 rounded-xl">
             <AlertCircle className="w-4 h-4" />
             {params.message}
          </div>
        )}

        <div className="mt-8 text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link href="/signup" className="text-primary-400 hover:text-primary-300 font-medium underline underline-offset-4">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  )
}
