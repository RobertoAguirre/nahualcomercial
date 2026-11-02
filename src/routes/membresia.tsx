import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/site";

// PLAN_PRICE_PENDING: el precio de member aún no está cerrado. Reemplaza este texto cuando sea oficial.
const MEMBER_PRICE = "$— MXN / mes";
// Pega aquí el Stripe Payment Link cuando exista (ej. https://buy.stripe.com/...).
const STRIPE_PAYMENT_LINK = "";

export const Route = createFileRoute("/membresia")({
  head: () => ({
    meta: [
      { title: "Planes de Nahual — Gratis y member" },
      { name: "description", content: "Plan gratis de $2 USD que vuelve cada 30 días, o member para no esperar." },
      { property: "og:title", content: "Planes de Nahual — Gratis y member" },
      { property: "og:description", content: "Gratis cada 30 días, o member para seguir programando sin esperar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Membresia,
});

function Membresia() {
  const ready = STRIPE_PAYMENT_LINK.length > 0;
  return (
    <Shell>
      <section className="reveal py-20">
        <h1 className="text-4xl font-bold">Planes</h1>
        <p className="mt-4 text-lg text-muted-foreground">Empiezas gratis. Si no quieres esperar, subes a member.</p>
      </section>

      <div className="reveal grid gap-4 sm:grid-cols-2">
        <div className="card p-8">
          <p className="font-semibold">Gratis</p>
          <p className="mt-3 font-mono text-3xl">$2 USD</p>
          <ul className="mt-6 space-y-2 text-muted-foreground">
            <li>Bolsa de uso incluida con tu cuenta.</li>
            <li>Se reinicia sola cada 30 días.</li>
            <li>Si se acaba antes, esperas al reinicio.</li>
          </ul>
          <p className="mt-8 text-sm text-muted-foreground">Ya lo tienes al entrar al IDE.</p>
        </div>

        <div className="card border-primary/40 p-8">
          <p className="font-semibold text-primary">member</p>
          <p className="mt-3 font-mono text-3xl">{MEMBER_PRICE}</p>
          <ul className="mt-6 space-y-2 text-muted-foreground">
            <li>Una bolsa más grande.</li>
            <li>Aparte de tu bolsa gratis.</li>
            <li>Para seguir sin esperar 30 días.</li>
          </ul>
          {ready ? (
            <a href={STRIPE_PAYMENT_LINK} className="btn btn-primary mt-8 w-full">Hacerme member</a>
          ) : (
            <>
              <button disabled className="btn btn-primary mt-8 w-full cursor-not-allowed opacity-50">Hacerme member</button>
              <p className="mt-3 text-sm text-warning">El pago abre muy pronto.</p>
            </>
          )}
        </div>
      </div>

      <p className="mt-10 text-sm text-muted-foreground">
        Tu cuenta y tu uso viven dentro del IDE. Este sitio no guarda contraseñas ni llaves.
      </p>
    </Shell>
  );
}
