"use client"

import { ReactNode, useMemo } from "react"

import { Auth0Provider } from "@auth0/auth0-react"

type Auth0ProviderWithConfigProps = {
  children: ReactNode
}

const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN
const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID

if (!domain || !clientId) {
  console.error("Auth0 configuration missing. Please check front/.env.local.")
  console.error("Required environment variables:")
  console.error("- NEXT_PUBLIC_AUTH0_DOMAIN")
  console.error("- NEXT_PUBLIC_AUTH0_CLIENT_ID")
  throw new Error("Auth0 domain and client ID must be set in .env.local")
}

if (
  !domain.includes(".auth0.com") &&
  !domain.includes(".us.auth0.com") &&
  !domain.includes(".eu.auth0.com") &&
  !domain.includes(".au.auth0.com")
) {
  console.warn(
    "Auth0 domain format might be incorrect. Expected format: your-domain.auth0.com"
  )
}

const getAppBaseUrl = () =>
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001"

const getRedirectUri = (origin?: string) => {
  const base = origin ?? getAppBaseUrl()
  return `${base.replace(/\/$/, "")}/auth/login`
}

export function Auth0ProviderWithConfig({
  children,
}: Auth0ProviderWithConfigProps) {
  const origin = useMemo(() => {
    if (typeof window === "undefined") {
      return undefined
    }
    return window.location.origin
  }, [])

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: getRedirectUri(origin),
      }}
      cacheLocation="localstorage"
    >
      {children}
    </Auth0Provider>
  )
}

