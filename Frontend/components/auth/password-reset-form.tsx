"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, ArrowLeft, Shield, Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type Step = "email" | "otp" | "password"

export function PasswordResetForm() {
  const [step, setStep] = useState<Step>("email")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const { toast } = useToast()

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      toast({
        title: "Reset code sent",
        description: "Check your email for the verification code",
      })
      setStep("otp")
    } catch (err) {
      setError("Failed to send reset code. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      if (otp === "123456") {
        setStep("password")
      } else {
        setError("Invalid verification code")
      }
    } catch (err) {
      setError("Failed to verify code. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long")
      setIsLoading(false)
      return
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      toast({
        title: "Password reset successful",
        description: "Your password has been updated",
      })
      // Redirect to login
      window.location.href = "/"
    } catch (err) {
      setError("Failed to reset password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const renderEmailStep = () => (
    <form onSubmit={handleEmailSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-white">
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400"
          required
        />
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
            Sending reset code...
          </>
        ) : (
          <>
            <Mail className="mr-2 h-4 w-4" />
            Send reset code
          </>
        )}
      </Button>
    </form>
  )

  const renderOtpStep = () => (
    <form onSubmit={handleOtpSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="otp" className="text-white">
          Verification Code
        </Label>
        <Input
          id="otp"
          type="text"
          placeholder="Enter 6-digit code"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 text-center text-lg tracking-widest"
          maxLength={6}
          required
        />
        <p className="text-sm text-gray-400 text-center">We sent a verification code to {email}</p>
      </div>

      {error && (
        <Alert className="bg-red-500/10 border-red-500/20">
          <AlertDescription className="text-red-400">{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-3">
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium"
          disabled={isLoading || otp.length !== 6}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify code"
          )}
        </Button>

        <Button
          type="button"
          variant="ghost"
          className="w-full text-purple-400 hover:text-purple-300"
          onClick={() => setStep("email")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to email
        </Button>
      </div>
    </form>
  )

  const renderPasswordStep = () => (
    <form onSubmit={handlePasswordSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="newPassword" className="text-white">
          New Password
        </Label>
        <div className="relative">
          <Input
            id="newPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

      <div className="space-y-2">
        <Label htmlFor="confirmNewPassword" className="text-white">
          Confirm New Password
        </Label>
        <div className="relative">
          <Input
            id="confirmNewPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
      </div>

      {error && (
        <Alert className="bg-red-500/10 border-red-500/20">
          <AlertDescription className="text-red-400">{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-3">
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating password...
            </>
          ) : (
            "Update password"
          )}
        </Button>

        <Button
          type="button"
          variant="ghost"
          className="w-full text-purple-400 hover:text-purple-300"
          onClick={() => setStep("otp")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to verification
        </Button>
      </div>
    </form>
  )

  const getStepTitle = () => {
    switch (step) {
      case "email":
        return "Reset your password"
      case "otp":
        return "Enter verification code"
      case "password":
        return "Create new password"
    }
  }

  const getStepDescription = () => {
    switch (step) {
      case "email":
        return "Enter your email to receive a reset code"
      case "otp":
        return "Enter the 6-digit code we sent to your email"
      case "password":
        return "Choose a strong password for your account"
    }
  }

  return (
    <Card className="w-full max-w-md backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
      <CardHeader className="space-y-1 text-center">
        <div className="flex items-center justify-center mb-4">
          <Shield className="h-8 w-8 text-purple-400" />
        </div>
        <CardTitle className="text-2xl font-bold text-white">{getStepTitle()}</CardTitle>
        <CardDescription className="text-gray-300">{getStepDescription()}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {step === "email" && renderEmailStep()}
        {step === "otp" && renderOtpStep()}
        {step === "password" && renderPasswordStep()}

        <div className="text-center text-sm text-gray-400">
          Remember your password?{" "}
          <Link href="/" className="text-purple-400 hover:text-purple-300 transition-colors">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
