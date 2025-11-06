import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">ResiLink</h1>
          <p className="text-slate-600 dark:text-slate-400">Property Management Platform</p>
        </div>

        <div className="space-y-3">
          <Link href="/auth/login" className="block">
            <Button className="w-full" size="lg">
              Login
            </Button>
          </Link>
          <Link href="/auth/sign-up" className="block">
            <Button variant="outline" className="w-full bg-transparent" size="lg">
              Sign Up
            </Button>
          </Link>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-500">
          Multi-tenant system for managing residences, assets, and payments
        </p>
      </div>
    </div>
  )
}
