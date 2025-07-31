"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, Mail, Shield, Calendar, Edit, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

// This interface matches the UserDto from the backend
interface UserData {
  email: string
  role: string
  provider: string
  avatar: string | null
  lastLogin: string | null
}

export function UserDashboard() {
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [newAvatarUrl, setNewAvatarUrl] = useState("")
  const router = useRouter()
  const { toast } = useToast()
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/")
        return
      }
      try {
        const res = await fetch("http://localhost:8080/api/users/me", {
          headers: { "Authorization": `Bearer ${token}` }
        })
        if (!res.ok) throw new Error("Failed to fetch user profile.")
        const data: UserData = await res.json()
        setUser(data)
        setNewAvatarUrl(data.avatar || "")
      } catch (error) {
        console.error(error)
        router.push("/")
      } finally {
        setIsLoading(false)
      }
    }
    fetchUserProfile()
  }, [router])
  
  const handleChangePassword = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast({ title: "Error", description: "New passwords do not match.", variant: "destructive" });
        return;
    }

    try {
        const res = await fetch(`http://localhost:8080/api/users/me/password`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(passwordData),
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(errorText || 'Failed to change password.');
        }

        toast({ title: "Success", description: "Your password has been changed." });
        setIsPasswordModalOpen(false);
    } catch (error: any) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
    }
};

  const handleUpdateAvatar = async () => {
    const token = localStorage.getItem("token");
    if (!token || !user) return;

    try {
        const res = await fetch(`http://localhost:8080/api/users/me/avatar`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ avatar: newAvatarUrl }),
        });

        if (!res.ok) {
            throw new Error('Failed to update avatar.');
        }

        const updatedUser: UserData = await res.json();
        setUser(updatedUser); // Update state with the full user object from the response
        setIsEditModalOpen(false);
        toast({ title: "Success", description: "Your avatar has been updated." });

    } catch (error: any) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };


  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back!</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Here's your account overview and recent activity</p>
            </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Profile Card */}
            <Card className="col-span-full md:col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">Profile</CardTitle>
                {/* This button now correctly opens the modal */}
                <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setIsEditModalOpen(true)}>
                <Edit className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                    <AvatarImage src={user.avatar || "/placeholder-user.jpg"} alt="Profile" />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-lg">
                    {user.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">{user.email}</h3>
                    <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>{user.role}</Badge>
                </div>
                </div>
                <div className="space-y-3 pt-4 border-t">
                    <div className="flex items-center space-x-3 text-sm">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600 dark:text-gray-400">Email</span>
                        <span className="ml-auto text-gray-900 dark:text-white">{user.email}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                        <Shield className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600 dark:text-gray-400">Role</span>
                        <span className="ml-auto text-gray-900 dark:text-white">{user.role}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600 dark:text-gray-400">Provider</span>
                        <span className="ml-auto text-gray-900 dark:text-white">{user.provider}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600 dark:text-gray-400">Last Login</span>
                        <span className="ml-auto text-gray-900 dark:text-white">
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                        </span>
                    </div>
                </div>
            </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Account Status</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Email Verified</span>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                    Verified
                    </Badge>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">2FA Enabled</span>
                    <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                    Pending
                    </Badge>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Last Login</span>
                    <span className="text-sm text-gray-900 dark:text-white">Just now</span>
                </div>
                </div>
            </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">Logged in</p>
                    <p className="text-xs text-gray-500">Just now</p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">Profile updated</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">Password changed</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                </div>
                </div>
            </CardContent>
            </Card>
        </div>

        {/* Additional Cards */}
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
            <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security and privacy settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                <Shield className="mr-2 h-4 w-4" />
                Enable Two-Factor Authentication
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => setIsPasswordModalOpen(true)}>
                <User className="mr-2 h-4 w-4" />
                Change Password
                </Button>
            </CardContent>
            </Card>

            <Card>
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts for your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                <Mail className="mr-2 h-4 w-4" />
                Change Email Address
                </Button>
                <Button variant="outline" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                View Login History
                </Button>
            </CardContent>
            </Card>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="avatarUrl" className="text-right">
                Avatar URL
              </Label>
              <Input
                id="avatarUrl"
                value={newAvatarUrl}
                onChange={(e) => setNewAvatarUrl(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleUpdateAvatar}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              type="password"
              placeholder="Current Password"
              onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
            />
            <Input
              type="password"
              placeholder="New Password"
              onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
            />
            <Input
              type="password"
              placeholder="Confirm New Password"
              onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleChangePassword}>Update Password</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}