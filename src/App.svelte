<script>
  import { onMount } from 'svelte'
  import { createTunnel } from './lib/Tunnel.js'

  let canvas
  let progress = 0
  let active = 0
  let tunnel

  const chapters = [
    {
      tag: '01 — Origen',
      title: 'Tu IDE con múltiples agentes, hecho en México',
      body: 'Nahual es un entorno de desarrollo con IA propia: editor, chat, diffs y terminal en un solo flujo, pensado para equipos que quieren velocidad sin perder control.',
      side: 'left',
      stats: [
        { k: 'Agentes', v: 'N' },
        { k: 'Idioma', v: 'ES' },
        { k: 'Origen', v: 'MX' }
      ]
    },
    {
      tag: '02 — Orquestación',
      title: 'Varios agentes, un solo hilo de trabajo',
      body: 'Uno investiga el repo, otro propone cambios, otro corre pruebas. Nahual coordina el relevo para que avances sin saltar entre herramientas.',
      side: 'right',
      stats: [
        { k: 'Investigar', v: '●' },
        { k: 'Editar', v: '●' },
        { k: 'Probar', v: '●' }
      ]
    },
    {
      tag: '03 — Espacio de trabajo',
      title: 'Chat, código y terminal en el mismo lienzo',
      body: 'Describe el objetivo en lenguaje natural. Revisa diffs claros, acepta cambios y deja que los agentes iteren hasta que compile y pase tus checks.',
      side: 'left',
      stats: [
        { k: 'Diffs', v: 'live' },
        { k: 'Terminal', v: 'in-IDE' },
        { k: 'Contexto', v: 'repo' }
      ]
    },
    {
      tag: '04 — Privacidad',
      title: 'Tu código se queda contigo',
      body: 'Corre local o en tu infra. El cerebro de Nahual puede vivir en tus servidores: sin filtrar propiedad intelectual a nubes ajenas.',
      side: 'right',
      stats: [
        { k: 'On-prem', v: 'sí' },
        { k: 'Local', v: 'sí' },
        { k: 'Cloud ajena', v: 'no' }
      ]
    },
    {
      tag: '05 — Equipo',
      title: 'Hecho aquí, para equipos de aquí',
      body: 'Producto en español, ritmo cercano y soporte que entiende startups y squads en México y Latam. Menos fricción, más envíos.',
      side: 'left',
      stats: [
        { k: 'Soporte', v: 'MX' },
        { k: 'UI', v: 'ES' },
        { k: 'Foco', v: 'ship' }
      ]
    },
    {
      tag: '06 — Siguiente paso',
      title: 'Entra al túnel. Empieza a construir.',
      body: 'Nahual está diseñado para acompañarte de la idea al PR: agentes listos, contexto del repo y un IDE que no te saca del flow.',
      side: 'center',
      stats: [
        { k: 'Estado', v: 'beta' },
        { k: 'Acceso', v: 'espera' },
        { k: 'Stack', v: 'tuyo' }
      ]
    }
  ]

  function visibility(i) {
    const n = chapters.length
    const center = (i + 0.5) / n
    const dist = Math.abs(progress - center)
    const falloff = 0.55 / n
    const v = Math.max(0, 1 - dist / falloff)
    return Math.pow(v, 1.35)
  }

  function onScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight
    progress = max > 0 ? window.scrollY / max : 0
    active = Math.min(chapters.length - 1, Math.floor(progress * chapters.length + 0.001))
    tunnel?.setProgress(progress * 0.92)
  }

  onMount(() => {
    tunnel = createTunnel(canvas)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      tunnel.destroy()
    }
  })
</script>

<canvas bind:this={canvas} class="bg" aria-hidden="true"></canvas>

<header>
  <a class="logo" href="/">nahual</a>
  <div class="meta">
    <span>{String(active + 1).padStart(2, '0')} / {String(chapters.length).padStart(2, '0')}</span>
    <button class="menu" type="button" aria-label="Menu">
      <span></span><span></span>
    </button>
  </div>
</header>

<div class="rail" aria-hidden="true">
  <div class="rail-fill" style="height: {progress * 100}%"></div>
  {#each chapters as _, i}
    <button
      class="rail-dot"
      class:on={i === active}
      style="top: {((i + 0.5) / chapters.length) * 100}%"
      type="button"
      aria-label={`Ir a sección ${i + 1}`}
      onclick={() => window.scrollTo({ top: ((i + 0.15) / chapters.length) * (document.documentElement.scrollHeight - window.innerHeight), behavior: 'smooth' })}
    ></button>
  {/each}
</div>

<div class="stage">
  {#each chapters as ch, i}
    {@const vis = visibility(i)}
    <article
      class="chapter"
      class:left={ch.side === 'left'}
      class:right={ch.side === 'right'}
      class:center={ch.side === 'center'}
      style="opacity: {vis}; transform: {ch.side === 'center'
        ? `translate3d(-50%, calc(-50% + ${(1 - vis) * 28}px), 0) scale(${0.96 + vis * 0.04})`
        : `translate3d(0, calc(-50% + ${(1 - vis) * 28}px), 0) scale(${0.96 + vis * 0.04})`}; pointer-events: {vis > 0.35 ? 'auto' : 'none'};"
      aria-hidden={vis < 0.2}
    >
      <p class="tag">{ch.tag}</p>
      <h1>{ch.title}</h1>
      <p class="body">{ch.body}</p>
      <ul class="stats">
        {#each ch.stats as s}
          <li>
            <span class="k">{s.k}</span>
            <span class="v">{s.v}</span>
          </li>
        {/each}
      </ul>
    </article>
  {/each}

  <div class="hex" style="opacity: {0.35 + (1 - Math.abs(progress - 0.5) * 1.4) * 0.55}" aria-hidden="true">
    <svg viewBox="0 0 120 120" fill="none">
      <polygon points="60,4 112,34 112,86 60,116 8,86 8,34" stroke="#39ff6a" stroke-width="1.2" opacity="0.9"/>
      <g transform="translate(28,48)" stroke="#39ff6a" stroke-width="1" fill="none">
        <circle cx="16" cy="12" r="10"/>
        <circle cx="16" cy="12" r="3"/>
        <path d="M16 2v4M16 18v4M6 12h4M22 12h4M9 5l3 3M20 16l3 3M9 19l3-3M20 8l3-3"/>
      </g>
      <g transform="translate(60,48)" stroke="#39ff6a" stroke-width="1" fill="none">
        <circle cx="16" cy="12" r="10"/>
        <circle cx="16" cy="12" r="3"/>
        <path d="M16 2v4M16 18v4M6 12h4M22 12h4M9 5l3 3M20 16l3 3M9 19l3-3M20 8l3-3"/>
      </g>
    </svg>
  </div>
</div>

<div class="spacer" aria-hidden="true" style="height: {chapters.length * 100}vh"></div>

<footer>
  <p class="legal">
    2026 © Nahual. Todos los derechos reservados<br />
    Solo cookies técnicas · <a href="/privacy">Aviso de privacidad</a>
  </p>
  <p class="scroll">{progress > 0.92 ? 'Fin del recorrido' : 'Desplázate para continuar'}</p>
  <div class="social">
    <a href="https://linkedin.com" aria-label="LinkedIn" target="_blank" rel="noreferrer">in</a>
    <a href="https://x.com" aria-label="X" target="_blank" rel="noreferrer">𝕏</a>
    <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noreferrer">◎</a>
    <a href="https://youtube.com" aria-label="YouTube" target="_blank" rel="noreferrer">▶</a>
  </div>
</footer>

<style>
  :global(html) {
    scroll-behavior: smooth;
  }
  :global(html, body, #app) {
    margin: 0;
    min-height: 100%;
    background: #000;
    color: #b8ffc8;
    font-family: "Segoe UI", system-ui, sans-serif;
  }
  :global(body) {
    overflow-x: hidden;
  }

  .bg {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
    z-index: 0;
  }

  header, footer, .rail, .stage {
    position: fixed;
    z-index: 2;
  }

  header {
    top: 1.5rem;
    left: 1.75rem;
    right: 1.75rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo {
    color: #39ff6a;
    text-decoration: none;
    font-weight: 700;
    letter-spacing: 0.04em;
    font-size: 1.2rem;
  }

  .meta {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    color: #5dff8a;
    font-size: 0.75rem;
    letter-spacing: 0.12em;
  }

  .menu {
    background: none;
    border: 0;
    width: 28px;
    height: 18px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    cursor: pointer;
    padding: 0;
  }
  .menu span {
    display: block;
    height: 1.5px;
    background: #39ff6a;
    width: 100%;
  }

  .rail {
    top: 18vh;
    right: 1.9rem;
    width: 1px;
    height: 50vh;
    background: rgba(57, 255, 106, 0.2);
  }
  .rail-fill {
    width: 100%;
    background: #39ff6a;
    box-shadow: 0 0 12px rgba(57, 255, 106, 0.6);
    transition: height 0.05s linear;
  }
  .rail-dot {
    position: absolute;
    left: 50%;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    border: 0;
    padding: 0;
    transform: translate(-50%, -50%);
    background: rgba(57, 255, 106, 0.35);
    cursor: pointer;
  }
  .rail-dot.on {
    background: #39ff6a;
    box-shadow: 0 0 10px #39ff6a;
  }

  .stage {
    inset: 0;
    pointer-events: none;
  }

  .chapter {
    position: absolute;
    top: 50%;
    max-width: min(440px, 42vw);
    will-change: opacity, transform;
  }
  .chapter.left {
    left: 1.75rem;
    text-align: left;
  }
  .chapter.right {
    right: 8%;
    left: auto;
    text-align: left;
  }
  .chapter.center {
    left: 50%;
    max-width: min(520px, 80vw);
    text-align: center;
  }
  .chapter.center .stats {
    justify-content: center;
  }

  .tag {
    margin: 0 0 0.75rem;
    color: #5dff8a;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    font-size: 0.72rem;
  }
  h1 {
    margin: 0 0 1rem;
    font-size: clamp(1.55rem, 3.2vw, 2.6rem);
    font-weight: 700;
    line-height: 1.15;
    color: #e8ffe8;
    text-shadow: 0 0 40px rgba(57, 255, 106, 0.35);
  }
  .body {
    margin: 0;
    font-size: 0.92rem;
    line-height: 1.6;
    color: #9fefb0;
  }

  .stats {
    list-style: none;
    margin: 1.4rem 0 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem 1.25rem;
  }
  .stats li {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    min-width: 4.5rem;
  }
  .stats .k {
    font-size: 0.65rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #5a9a68;
  }
  .stats .v {
    color: #39ff6a;
    font-weight: 600;
    font-size: 0.95rem;
  }

  .hex {
    position: absolute;
    left: 50%;
    top: 48%;
    width: min(130px, 16vw);
    transform: translate(-50%, -50%);
    filter: drop-shadow(0 0 18px rgba(57, 255, 106, 0.35));
    pointer-events: none;
  }

  .spacer {
    position: relative;
    z-index: 1;
    pointer-events: none;
  }

  footer {
    left: 1.75rem;
    right: 1.75rem;
    bottom: 1.25rem;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: end;
    gap: 1rem;
    font-size: 0.68rem;
    color: #5a9a68;
    pointer-events: none;
  }
  footer a { pointer-events: auto; }
  .legal a { color: #39ff6a; }
  .scroll {
    text-align: center;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-size: 0.65rem;
    color: #39ff6a;
  }
  .social {
    display: flex;
    justify-content: flex-end;
    gap: 0.9rem;
  }
  .social a {
    color: #39ff6a;
    text-decoration: none;
    font-size: 0.8rem;
  }

  @media (max-width: 900px) {
    .hex { display: none; }
    .chapter, .chapter.left, .chapter.right, .chapter.center {
      left: 1.5rem;
      right: 1.5rem;
      max-width: none;
      text-align: left;
      top: 42%;
    }
    .chapter.center { transform: translateY(-50%); }
    footer {
      grid-template-columns: 1fr;
      gap: 0.45rem;
    }
    .scroll, .social { justify-content: flex-start; text-align: left; }
  }
</style>
