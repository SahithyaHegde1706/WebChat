import { Link } from "@tanstack/react-router";
import HeroBackground from "../components/HeroBackground";
import ThemeToggle from "../components/ThemeToggle";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <Hero />
      <Footer />
    </div>
  );
}

function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link to="/" className="text-lg font-bold text-foreground">
          WebChat
        </Link>

        <div className="flex items-center gap-6">
          <ThemeToggle />

          <Link
            to="/chat"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Start Chat
          </Link>
        </div>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative flex min-h-[500px] items-center justify-center overflow-hidden px-4 text-center">
      <HeroBackground />

      <div className="relative z-[1] mx-auto max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Real-Time Chat, Built with WebSockets.
        </h1>

        <p className="mt-5 text-lg text-muted-foreground">
          A simple real-time chat application built to demonstrate how
          WebSockets enable instant client-server communication.
        </p>

        <div className="mt-8">
          <Link
            to="/chat"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Start Chat
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mt-auto border-t border-border px-4 py-8 text-center">
      <p className="text-sm font-semibold text-foreground">WebChat</p>

      <p className="mt-1 text-sm text-muted-foreground">
        Built for learning WebSockets.
      </p>

      <p className="mt-3 text-xs text-muted-foreground">
        © 2026 WebChat
      </p>
    </footer>
  );
}