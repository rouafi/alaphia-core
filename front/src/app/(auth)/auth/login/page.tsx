"use client"

/* eslint-disable @next/next/no-img-element */

import Link from "next/link"
import { useEffect } from "react"

import { useAuth0 } from "@auth0/auth0-react"
import { useRouter, useSearchParams } from "next/navigation"

import LoginButton from "@/components/auth/LoginButton"
import LogoutButton from "@/components/auth/LogoutButton"
import Profile from "@/components/auth/Profile"

export default function LoginPage() {
  const { isAuthenticated, isLoading, error } = useAuth0()
  const router = useRouter()
  const searchParams = useSearchParams()

  const rawReturnTo = searchParams?.get("returnTo") ?? "/dashboard"
  const returnTo =
    rawReturnTo.startsWith("/") && rawReturnTo !== "/"
      ? rawReturnTo
      : "/dashboard"

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(returnTo)
    }
  }, [isAuthenticated, isLoading, returnTo, router])

  if (isLoading) {
    return (
      <div className="auth0-page">
        <div className="app-container">
          <div className="loading-state">
            <div className="loading-text">Loading...</div>
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

  return (
    <div className="auth0-page">
      <div className="app-container">
        <div className="main-card-wrapper">
          <img
            src="https://cdn.auth0.com/quantum-assets/dist/latest/logos/auth0/auth0-lockup-en-ondark.png"
            alt="Auth0 Logo"
            className="auth0-logo"
            onError={(event) => {
              event.currentTarget.style.display = "none"
            }}
          />
          <h1 className="main-title">Welcome to Sample0</h1>

          {isAuthenticated ? (
            <div className="logged-in-section">
              <div className="logged-in-message">
                ✅ Successfully authenticated!
              </div>
              <h2 className="profile-section-title">Your Profile</h2>
              <div className="profile-card">
                <Profile />
              </div>
              <LogoutButton />
              <Link href="/dashboard" className="return-link">
                Enter workspace
              </Link>
            </div>
          ) : (
            <div className="action-card">
              <p className="action-text">
                Get started by signing in to your account
              </p>
              <LoginButton />
              <p className="signup-hint">
                Need an account? Sign up in the Auth0 Universal Login
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


