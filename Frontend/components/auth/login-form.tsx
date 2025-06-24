"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Github, Mail, Eye, EyeOff, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock authentication logic
      if (formData.email === "admin@example.com" && formData.password === "admin123") {
        localStorage.setItem(
          "user",
          JSON.stringify({
            email: formData.email,
            role: "Admin",
            provider: "Email",
            avatar: "/placeholder.svg?height=40&width=40",
          }),
        )
        toast({
          title: "Login successful",
          description: "Welcome back!",
        })
        router.push("/admin")
      } else if (formData.email && formData.password) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            email: formData.email,
            role: "User",
            provider: "Email",
            avatar: "/placeholder.svg?height=40&width=40",
          }),
        )
        toast({
          title: "Login successful",
          description: "Welcome back!",
        })
        router.push("/dashboard")
      } else {
        setError("Invalid email or password")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthLogin = (provider: string) => {
    setIsLoading(true)
    // Simulate OAuth login
    setTimeout(() => {
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: `user@${provider.toLowerCase()}.com`,
          role: "User",
          provider: provider,
          avatar: "/placeholder.svg?height=40&width=40",
        }),
      )
      toast({
        title: "Login successful",
        description: `Logged in with ${provider}`,
      })
      router.push("/dashboard")
    }, 1500)
  }

  return (
    <Card className="w-full max-w-md backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
      <CardHeader className="space-y-1 text-center">
        <div className="flex items-center justify-center mb-4">
          <Shield className="h-8 w-8 text-purple-400" />
        </div>
        <CardTitle className="text-2xl font-bold text-white">Welcome back</CardTitle>
        <CardDescription className="text-gray-300">Sign in to your account to continue</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {error && (
            <Alert className="bg-red-500/10 border-red-500/20">
              <AlertDescription className="text-red-400">{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/20" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-transparent px-2 text-gray-400">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={() => handleOAuthLogin("Google")}
            disabled={isLoading}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Mail className="mr-2 h-4 w-4" />
            Google
          </Button>
          <Button
            variant="outline"
            onClick={() => handleOAuthLogin("GitHub")}
            disabled={isLoading}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </Button>
        </div>

        <div className="text-center space-y-2">
          <Link href="/reset-password" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
            Forgot your password?
          </Link>
          <div className="text-sm text-gray-400">
            {"Don't have an account? "}
            <Link href="/signup" className="text-purple-400 hover:text-purple-300 transition-colors">
              Sign up
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
