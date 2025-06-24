import { AdminDashboard } from "@/components/dashboard/admin-dashboard"
import { Navbar } from "@/components/shared/navbar"
import { Footer } from "@/components/shared/footer"

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <AdminDashboard />
      </main>
      <Footer />
    </div>
  )
}
