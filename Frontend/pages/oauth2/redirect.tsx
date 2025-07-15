"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { jwtDecode } from "jwt-decode"

interface JwtPayload {
    role: string
    sub: string
    exp: number
}

export default function OAuth2Redirect() {
    const router = useRouter()

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const token = params.get("token")

        if (token) {
            localStorage.setItem("token", token)

            try {
                const decoded = jwtDecode<JwtPayload>(token)
                const role = decoded.role

                if (role === "ADMIN") {
                    router.push("/admin")
                } else {
                    router.push("/dashboard")
                }
            } catch (error) {
                console.error("Invalid token", error)
                router.push("/login")
            }
        } else {
            router.push("/login")
        }
    }, [router])

    return <p className="text-white text-center mt-10">Redirecting...</p>
}
