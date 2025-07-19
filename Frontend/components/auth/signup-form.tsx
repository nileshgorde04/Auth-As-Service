"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Github, Mail, Eye, EyeOff, Shield, Check, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  })
  const router = useRouter()
  const { toast } = useToast()

  const passwordValidation = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /\d/.test(formData.password),
    match: formData.password === formData.confirmPassword && formData.confirmPassword !== "",
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!Object.values(passwordValidation).every(Boolean)) {
      setError("Please ensure all password requirements are met")
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const message = await res.text()
        // Try to parse the message as JSON if it's an object, otherwise use the text
        try {
            const errorJson = JSON.parse(message);
            throw new Error(errorJson.message || "Registration failed");
        } catch (e) {
            throw new Error(message || "Registration failed");
        }
      }

      // Show success message
      toast({
        title: "Account Created Successfully!",
        description: "Please sign in to continue.",
      })

      // Redirect to the login page after a short delay
      setTimeout(() => {
        router.push("/")
      }, 2000) // 2-second delay to allow the user to read the toast message

    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }
{/*}
  const handleOAuthSignup = (provider: "google" | "github") => {
    window.location.href = `http://localhost:8080/oauth2/authorize/${provider}?redirect_uri=http://localhost:3000/oauth2/callback`
  }
  */}

  return (
    <Card className="w-full max-w-md backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
      <CardHeader className="space-y-1 text-center">
        <div className="flex items-center justify-center mb-4">
          <Shield className="h-8 w-8 text-purple-400" />
        </div>
        <CardTitle className="text-2xl font-bold text-white">Create account</CardTitle>
        <CardDescription className="text-gray-300">Get started with your new account</CardDescription>
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
            <Label htmlFor="role" className="text-white">
              Role
            </Label>
            <Select value={formData.role} onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value }))}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-purple-400">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="User">User</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
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

            {formData.password && (
              <div className="space-y-1 text-xs">
                <div
                  className={`flex items-center gap-2 ${passwordValidation.length ? "text-green-400" : "text-gray-400"}`}
                >
                  {passwordValidation.length ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                  At least 8 characters
                </div>
                <div
                  className={`flex items-center gap-2 ${passwordValidation.uppercase ? "text-green-400" : "text-gray-400"}`}
                >
                  {passwordValidation.uppercase ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                  One uppercase letter
                </div>
                <div
                  className={`flex items-center gap-2 ${passwordValidation.lowercase ? "text-green-400" : "text-gray-400"}`}
                >
                  {passwordValidation.lowercase ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                  One lowercase letter
                </div>
                <div
                  className={`flex items-center gap-2 ${passwordValidation.number ? "text-green-400" : "text-gray-400"}`}
                >
                  {passwordValidation.number ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                  One number
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-white">
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>

            {formData.confirmPassword && (
              <div
                className={`flex items-center gap-2 text-xs ${passwordValidation.match ? "text-green-400" : "text-red-400"}`}
              >
                {passwordValidation.match ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                Passwords match
              </div>
            )}
          </div>

          {error && (
            <Alert className="bg-red-500/10 border-red-500/20">
              <AlertDescription className="text-red-400">{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium"
            disabled={isLoading || !formData.role}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </form>
        {/*}
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
            onClick={() => handleOAuthSignup("google")}
            disabled={isLoading}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Mail className="mr-2 h-4 w-4" />
            Google
          </Button>
          <Button
            variant="outline"
            onClick={() => handleOAuthSignup("github")}
            disabled={isLoading}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </Button>
        </div>
*/}
        <div className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link href="/" className="text-purple-400 hover:text-purple-300 transition-colors">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
