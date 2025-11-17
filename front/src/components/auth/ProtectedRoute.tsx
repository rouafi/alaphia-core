"use client"

import { ReactNode, useEffect } from "react"

import { useAuth0 } from "@auth0/auth0-react"
import { usePathname, useRouter } from "next/navigation"

import LoginButton from "@/components/auth/LoginButton"

type ProtectedRouteProps = {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, error } = useAuth0()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !error) {
      const params = new URLSearchParams()
      params.set("returnTo", pathname || "/dashboard")
      router.replace(`/auth/login?${params.toString()}`)
    }
  }, [error, isAuthenticated, isLoading, pathname, router])

  if (isLoading) {
    return (
      <div className="auth0-page">
        <div className="app-container">
          <div className="loading-state">
            <div className="loading-text">Loading workspace...</div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="auth0-page">
        <div className="app-container">
          <div className="error-state">
            <div className="error-title">Oops!</div>
            <div className="error-message">Something went wrong</div>
            <div className="error-sub-message">{error.message}</div>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="auth0-page">
        <div className="app-container">
          <div className="main-card-wrapper">
            <h1 className="main-title">Please log in to continue</h1>
            <div className="action-card">
              <p className="action-text">
                Your workspace content is protected. Sign in to unlock the
                experience.
              </p>
              <LoginButton />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

