import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Atmosphere } from "@/components/atmosphere";

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-border/60 bg-background/55 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
        <Link to="/" className="font-mono text-lg font-semibold text-foreground transition-colors hover:text-primary">nahual</Link>
        <nav className="flex items-center gap-6 text-sm text-muted-foreground">
          <a href="/#descargar" className="transition-colors hover:text-foreground">Descargar</a>
          <Link to="/membresia" className="transition-colors hover:text-foreground">Planes</Link>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mx-auto mt-24 max-w-3xl border-t px-6 py-10 text-sm text-muted-foreground">
      <p className="font-mono text-foreground">nahual.dev</p>
      <p className="mt-2">IDE de escritorio para vibecodear en español. Hecho para Latinoamérica.</p>
      <p className="mt-2">Los modelos corren en la nube a través de Nahual. El uso tiene límite según tu plan.</p>
    </footer>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="relative isolate min-h-screen">
      <Atmosphere />
      <Header />
      <main className="mx-auto max-w-3xl px-6">{children}</main>
      <Footer />
    </div>
  );
}

export const Mono = ({ children }: { children: ReactNode }) => (
  <code className="rounded-md bg-elevated px-1.5 py-0.5 font-mono text-[0.9em] text-primary">{children}</code>
);
