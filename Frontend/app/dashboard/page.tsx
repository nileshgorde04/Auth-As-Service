import { UserDashboard } from "@/components/dashboard/user-dashboard"
import { Navbar } from "@/components/shared/navbar"
import { Footer } from "@/components/shared/footer"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <UserDashboard />
      </main>
      <Footer />
    </div>
  )
}
