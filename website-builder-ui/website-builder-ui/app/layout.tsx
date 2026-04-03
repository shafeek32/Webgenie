import type React from "react"
import type { Metadata, Viewport } from "next"
import "./globals.css"

export const metadata: Metadata = {
    title: "BuildAI - Generate Full-Stack Websites with AI",
    description:
        "Create complete full-stack websites from a single text prompt. AI-powered web builder with live preview and drag-and-drop editing.",
    generator: "v0.app",
}

export const viewport: Viewport = {
    themeColor: "#0a0a0a",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`font-sans antialiased`}>
                {children}
            </body>
        </html>
    )
}
