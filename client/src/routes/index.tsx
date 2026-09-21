import { Link } from "@tanstack/react-router";
import HeroBackground from "../components/HeroBackground";
import ThemeToggle from "../components/ThemeToggle";
import WebChatLogo from "../components/WebChatLogo";

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
                <Link
                    to="/"
                    className="flex items-center gap-2 text-lg font-bold text-foreground"
                >
                    <WebChatLogo size={22} />
                    WebChat
                </Link>

                <div className="flex items-center">
                    <ThemeToggle />
                </div>
            </nav>
        </header>
    );
}

function Hero() {
    return (
        <section className="relative flex flex-1 items-center justify-center overflow-hidden px-4 text-center">      <HeroBackground />

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
        <footer className="border-t border-border px-4 py-6 text-center">
            <p className="text-sm text-muted-foreground">
                Built by{" "}
                <span className="font-medium text-foreground">
                    Sahithya Hegde
                </span>
            </p>
        </footer>
    );
}