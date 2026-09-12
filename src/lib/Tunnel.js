import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'

export function createTunnel(canvas) {
  const scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x000000, 0.035)

  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 200)
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x000000)

  const composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, camera))
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 1.4, 0.5, 0.15)
  composer.addPass(bloom)

  const points = []
  for (let i = 0; i < 80; i++) {
    const t = i / 10
    points.push(new THREE.Vector3(
      Math.sin(t * 0.7) * 4 + Math.sin(t * 1.3) * 1.5,
      Math.cos(t * 0.5) * 3 + Math.sin(t * 0.9) * 1.2,
      -i * 2.2
    ))
  }
  const curve = new THREE.CatmullRomCurve3(points)

  const tubes = []
  const count = 14
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2
    const radius = 1.8 + (i % 3) * 0.35
    const path = new THREE.CatmullRomCurve3(
      curve.getPoints(120).map((p, idx) => {
        const t = idx / 120
        const twist = t * 4 + angle
        return new THREE.Vector3(
          p.x + Math.cos(twist) * radius,
          p.y + Math.sin(twist) * radius,
          p.z
        )
      })
    )
    const geo = new THREE.TubeGeometry(path, 180, 0.012 + (i % 4) * 0.006, 6, false)
    const greens = [0x39ff6a, 0x1fdc55, 0xa8ffb8]
    const mat = new THREE.MeshBasicMaterial({
      color: greens[i % greens.length],
      transparent: true,
      opacity: 0.55 + (i % 3) * 0.15
    })
    const mesh = new THREE.Mesh(geo, mat)
    scene.add(mesh)
    tubes.push(mesh)
  }

  const n = 2500
  const pos = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    const t = Math.random()
    const p = curve.getPoint(t)
    const a = Math.random() * Math.PI * 2
    const r = 0.5 + Math.random() * 3.5
    pos[i * 3] = p.x + Math.cos(a) * r
    pos[i * 3 + 1] = p.y + Math.sin(a) * r
    pos[i * 3 + 2] = p.z
  }
  const pGeo = new THREE.BufferGeometry()
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  const particles = new THREE.Points(
    pGeo,
    new THREE.PointsMaterial({ color: 0x39ff6a, size: 0.03, transparent: true, opacity: 0.55 })
  )
  scene.add(particles)

  let target = 0
  let progress = 0
  let raf = 0
  let running = true

  function resize() {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h, false)
    composer.setSize(w, h)
    bloom.resolution.set(w, h)
  }

  function frame() {
    if (!running) return
    progress += (target - progress) * 0.06
    const t = Math.min(Math.max(progress, 0), 0.98)
    const p = curve.getPointAt(t)
    const look = curve.getPointAt(Math.min(t + 0.02, 0.99))
    camera.position.copy(p)
    camera.lookAt(look)
    particles.rotation.z += 0.0004
    bloom.strength = 1.15 + Math.sin(t * Math.PI) * 0.35
    composer.render()
    raf = requestAnimationFrame(frame)
  }

  const onResize = () => resize()
  window.addEventListener('resize', onResize)
  resize()
  frame()

  return {
    setProgress(v) {
      target = Math.min(Math.max(v, 0), 1)
    },
    destroy() {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      tubes.forEach((m) => {
        m.geometry.dispose()
        m.material.dispose()
      })
      pGeo.dispose()
      particles.material.dispose()
      renderer.dispose()
    }
  }
}
