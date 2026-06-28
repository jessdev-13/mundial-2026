import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Providers from "@/components/providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Mundial 2026",
  description: "Dashboard en vivo del FIFA World Cup 2026",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-background text-white min-h-screen`}>
        <Providers>
          <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 border-r border-border bg-surface hidden lg:flex flex-col p-6 fixed h-full">
              <div className="mb-10">
                <p className="text-xs text-[var(--text-secondary)] uppercase tracking-widest mb-1">FIFA</p>
                <h1 className="text-2xl font-bold text-gold">Mundial <span className="text-white">2026</span></h1>
              </div>

              <nav className="flex flex-col gap-1">
                <a href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--text-secondary)] hover:text-white hover:bg-surface-2 transition-colors">
                  <span>⚽</span> Inicio
                </a>
                <a href="/fixture" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--text-secondary)] hover:text-white hover:bg-surface-2 transition-colors">
                  <span>📅</span> Fixture
                </a>
                <a href="/grupos" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--text-secondary)] hover:text-white hover:bg-surface-2 transition-colors">
                  <span>🏆</span> Grupos
                </a>
                <a href="/quiniela" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--text-secondary)] hover:text-white hover:bg-surface-2 transition-colors">
                  <span>🎯</span> Quiniela
                </a>
              </nav>

              <div className="mt-auto">
                <div className="flex items-center gap-2 px-3 py-2">
                  <span className="w-2 h-2 rounded-full bg-mexico-green live-dot"></span>
                  <span className="text-xs text-[var(--text-secondary)]">Mundial en curso</span>
                </div>
              </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 lg:ml-64 min-h-screen">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  )
}