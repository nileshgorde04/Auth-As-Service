"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, Shield, Activity, AlertTriangle, Eye, UserX, MoreHorizontal } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string
  email: string
  role: "Admin" | "User"
  provider: string
  status: "Active" | "Suspended"
  lastLogin: string
  avatar: string
}

const mockUsers: User[] = [
  {
    id: "1",
    email: "nileshgorade2004@gmail.com",
    role: "User",
    provider: "Email",
    status: "Active",
    lastLogin: "2 hours ago",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "2",
    email: "jane.smith@example.com",
    role: "Admin",
    provider: "Google",
    status: "Active",
    lastLogin: "1 day ago",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "3",
    email: "bob.wilson@example.com",
    role: "User",
    provider: "GitHub",
    status: "Suspended",
    lastLogin: "1 week ago",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "4",
    email: "alice.brown@example.com",
    role: "User",
    provider: "Email",
    status: "Active",
    lastLogin: "3 hours ago",
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

const mockLogs = [
  {
    id: "1",
    action: "User Login",
    user: "john.doe@example.com",
    timestamp: "2024-01-15 14:30:00",
    ip: "192.168.1.100",
  },
  {
    id: "2",
    action: "Password Reset",
    user: "jane.smith@example.com",
    timestamp: "2024-01-15 13:45:00",
    ip: "192.168.1.101",
  },
  {
    id: "3",
    action: "Role Changed",
    user: "bob.wilson@example.com",
    timestamp: "2024-01-15 12:15:00",
    ip: "192.168.1.102",
  },
  {
    id: "4",
    action: "Account Suspended",
    user: "alice.brown@example.com",
    timestamp: "2024-01-15 11:30:00",
    ip: "192.168.1.103",
  },
]

export function AdminDashboard() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showLogs, setShowLogs] = useState(false)
  const { toast } = useToast()

  const handleRoleChange = (userId: string, newRole: "Admin" | "User") => {
    setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, role: newRole } : user)))
    toast({
      title: "Role updated",
      description: `User role has been changed to ${newRole}`,
    })
  }

  const handleRevokeToken = (userId: string) => {
    const user = users.find((u) => u.id === userId)
    if (user) {
      toast({
        title: "Token revoked",
        description: `Authentication token revoked for ${user.email}`,
      })
    }
  }

  const handleSuspendUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, status: user.status === "Active" ? "Suspended" : "Active" } : user,
      ),
    )
    const user = users.find((u) => u.id === userId)
    toast({
      title: user?.status === "Active" ? "User suspended" : "User activated",
      description: `${user?.email} has been ${user?.status === "Active" ? "suspended" : "activated"}`,
    })
  }

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter((u) => u.status === "Active").length,
    adminUsers: users.filter((u) => u.role === "Admin").length,
    suspendedUsers: users.filter((u) => u.status === "Suspended").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage users, monitor activity, and configure system settings
          </p>
        </div>
        <Button onClick={() => setShowLogs(true)}>
          <Activity className="mr-2 h-4 w-4" />
          View Logs
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administrators</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.adminUsers}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.adminUsers / stats.totalUsers) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suspended</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.suspendedUsers}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Manage user accounts, roles, and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.email} />
                          <AvatarFallback>{user.email.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span>{user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={user.role}
                        onValueChange={(value: "Admin" | "User") => handleRoleChange(user.id, value)}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="User">User</SelectItem>
                          <SelectItem value="Admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.provider}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === "Active" ? "default" : "destructive"}>{user.status}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.lastLogin}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedUser(user)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleSuspendUser(user.id)}>
                          <UserX className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleRevokeToken(user.id)}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>View detailed information about this user account</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedUser.avatar || "/placeholder.svg"} alt={selectedUser.email} />
                  <AvatarFallback className="text-lg">{selectedUser.email.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{selectedUser.email}</h3>
                  <Badge variant={selectedUser.role === "Admin" ? "default" : "secondary"}>{selectedUser.role}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Provider:</span>
                  <p className="text-muted-foreground">{selectedUser.provider}</p>
                </div>
                <div>
                  <span className="font-medium">Status:</span>
                  <p className="text-muted-foreground">{selectedUser.status}</p>
                </div>
                <div>
                  <span className="font-medium">Last Login:</span>
                  <p className="text-muted-foreground">{selectedUser.lastLogin}</p>
                </div>
                <div>
                  <span className="font-medium">User ID:</span>
                  <p className="text-muted-foreground">{selectedUser.id}</p>
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button variant="outline" onClick={() => handleRevokeToken(selectedUser.id)}>
                  Revoke Token
                </Button>
                <Button
                  variant={selectedUser.status === "Active" ? "destructive" : "default"}
                  onClick={() => handleSuspendUser(selectedUser.id)}
                >
                  {selectedUser.status === "Active" ? "Suspend User" : "Activate User"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Logs Dialog */}
      <Dialog open={showLogs} onOpenChange={setShowLogs}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>System Logs</DialogTitle>
            <DialogDescription>Recent system activity and user actions</DialogDescription>
          </DialogHeader>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{log.action}</TableCell>
                    <TableCell>{log.user}</TableCell>
                    <TableCell className="text-muted-foreground">{log.timestamp}</TableCell>
                    <TableCell className="text-muted-foreground">{log.ip}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
