"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Shield, User, Settings, LogOut, Moon, Sun } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface UserData {
  email: string
  role: string
  provider: string
  avatar: string
}

export function Navbar() {
  const [user, setUser] = useState<UserData | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Check for dark mode preference
    const darkMode = localStorage.getItem("darkMode") === "true"
    setIsDarkMode(darkMode)
    if (darkMode) {
      document.documentElement.classList.add("dark")
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    })
    router.push("/")
  }

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    localStorage.setItem("darkMode", newDarkMode.toString())

    if (newDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href={user ? (user.role === "Admin" ? "/admin" : "/dashboard") : "/"}
              className="flex items-center space-x-2"
            >
              <Shield className="h-6 w-6 text-purple-600" />
              <span className="font-bold text-xl">AuthPlatform</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={toggleDarkMode} className="h-9 w-9 p-0">
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.email} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                        {user.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.email}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.role} • {user.provider}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={user.role === "Admin" ? "/admin" : "/dashboard"}>
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/">Sign in</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Sign up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
