import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell, Mono } from "@/components/site";

const MAC_FILE = "Nahual-0.3-arm64.dmg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nahual — IDE para vibecodear en español" },
      { name: "description", content: "Instala Nahual, entra con correo o Google y programa con un agente. Sin pegar API keys." },
      { property: "og:title", content: "Nahual — IDE para vibecodear en español" },
      { property: "og:description", content: "IDE de escritorio con agente. Sin API keys. Plan gratis que vuelve cada 30 días." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <Shell>
      <section className="reveal py-24">
        <p className="font-mono text-sm text-primary">nahual.dev</p>
        <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">
          Vibecodea en español.<br />Sin pegar API keys.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted-foreground">
          Nahual es un IDE de escritorio con un agente que programa contigo. Lo instalas, entras y empiezas.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <a href="#descargar" className="btn btn-primary">Descargar para Mac</a>
          <Link to="/membresia" className="btn btn-ghost">Ver planes</Link>
        </div>
      </section>

      <section className="reveal py-16">
        <h2 className="text-2xl font-bold">Cómo funciona</h2>
        <ol className="mt-8 space-y-4">
          {[
            ["Instalas el IDE", "Una app en tu computadora. Nada que configurar."],
            ["Entras con correo o Google", "Tu cuenta se crea dentro de Nahual. No necesitas llaves de nadie."],
            ["Programas", "Le pides cosas al agente y él escribe el código contigo."],
          ].map(([t, d], i) => (
            <li key={t} className="card flex gap-5 p-6">
              <span className="font-mono text-primary">0{i + 1}</span>
              <div><p className="font-semibold">{t}</p><p className="mt-1 text-muted-foreground">{d}</p></div>
            </li>
          ))}
        </ol>
        <p className="mt-8 text-muted-foreground">
          Los modelos se llaman <Mono>rapido</Mono>, <Mono>estandar</Mono>, <Mono>flash</Mono> y <Mono>nano</Mono>.
          Abres con <Mono>rapido</Mono>. <Mono>nano</Mono> es el más económico.
        </p>
      </section>

      <section className="reveal py-16">
        <h2 className="text-2xl font-bold">Planes</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="card p-6">
            <p className="font-semibold">Gratis</p>
            <p className="mt-2 font-mono text-2xl">$2 USD</p>
            <p className="mt-2 text-muted-foreground">Una bolsa de uso. Cuando se acaba, esperas: vuelve sola cada 30 días.</p>
          </div>
          <div className="card p-6">
            <p className="font-semibold">member</p>
            <p className="mt-2 font-mono text-2xl">$— MXN / mes</p>
            <p className="mt-2 text-muted-foreground">Una bolsa más grande, aparte de la gratis. Para no esperar.</p>
          </div>
        </div>
        <Link to="/membresia" className="btn btn-ghost mt-6">Ver detalles de planes</Link>
      </section>

      <section id="descargar" className="reveal scroll-mt-24 py-16">
        <h2 className="text-2xl font-bold">Descarga</h2>
        <div className="mt-8 space-y-3">
          <div className="card flex flex-wrap items-center justify-between gap-4 p-6">
            <div>
              <p className="font-semibold">Mac con Apple Silicon</p>
              <p className="mt-1 font-mono text-sm text-muted-foreground">{MAC_FILE}</p>
            </div>
            {/* TODO: apuntar al URL real del instalador */}
            <a href="#descargar" className="btn btn-primary">Descargar</a>
          </div>
          {["Windows", "Linux"].map((os) => (
            <div key={os} className="card flex items-center justify-between p-6">
              <p className="font-semibold">{os}</p>
              <span className="font-mono text-sm text-warning">próximamente</span>
            </div>
          ))}
        </div>
      </section>
    </Shell>
  );
}
