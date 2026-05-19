# OPS Command v4 · Túnel Oriente 24/7

Centro de gestión operativa 24/7 con sincronización en tiempo real — PWA instalable en tablets.

![Version](https://img.shields.io/badge/version-4.0-orange)
![PWA](https://img.shields.io/badge/PWA-ready-blue)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-yellow)
![Realtime](https://img.shields.io/badge/sync-tiempo_real-green)

---

## Novedades v4

- **Sincronización en tiempo real** — Firebase Firestore: todos los usuarios ven los cambios al instante
- **Tablero de Sprints** — vista completa por sprint con columnas Por hacer / En progreso / Completado, barra de progreso y estado
- **Delegación integrada** — desde la misma tarea del líder se delega al turno (Día/Noche/Ambos) y grupo (A/B/C)
- **Indicador de sincronización** — barra superior muestra estado online/syncing/offline en tiempo real

---

## Estructura del repositorio

```
ops-command/
├── index.html              ← App completa (PWA + Firebase)
├── firebase-config.js      ← TUS credenciales van aquí
├── manifest.json           ← Config PWA
├── sw.js                   ← Service Worker offline
├── firestore.rules         ← Reglas de seguridad Firestore
├── icons/
│   ├── icon-32.png
│   ├── icon-180.png
│   ├── icon-192.png
│   └── icon-512.png
└── .github/workflows/
    └── deploy.yml          ← Auto-deploy a GitHub Pages
```

---

## PASO 1 — Crear proyecto Firebase (10 minutos)

### 1.1 Crear el proyecto
1. Ve a [console.firebase.google.com](https://console.firebase.google.com)
2. Clic en **"Agregar proyecto"**
3. Nombre: `ops-command-to`
4. Desactiva Google Analytics (no es necesario)
5. Clic en **"Crear proyecto"** → espera ~30 segundos

### 1.2 Registrar la app Web
1. En el panel del proyecto, clic en el ícono **`</>`** (Web)
2. Nombre de la app: `OPS Command`
3. **NO** marques Firebase Hosting (usaremos GitHub Pages)
4. Clic en **"Registrar app"**
5. Verás un bloque `firebaseConfig` con tus credenciales — **cópialo**

### 1.3 Llenar firebase-config.js
Abre el archivo `firebase-config.js` y reemplaza los valores:

```javascript
const FIREBASE_CONFIG = {
  apiKey:            "AIzaSy...",          // ← tu valor real
  authDomain:        "ops-command-to.firebaseapp.com",
  projectId:         "ops-command-to",
  storageBucket:     "ops-command-to.appspot.com",
  messagingSenderId: "123456789",
  appId:             "1:123456789:web:abc123"
};
```

### 1.4 Activar Firestore Database
1. En el panel izquierdo: **Firestore Database**
2. Clic en **"Crear base de datos"**
3. Selecciona **"Iniciar en modo de prueba"** → Siguiente
4. Elige la región más cercana (ej: `us-central1` o `southamerica-east1`)
5. Clic en **"Listo"**

### 1.5 Copiar las reglas de seguridad
1. En Firestore → pestaña **"Reglas"**
2. Reemplaza el contenido con el del archivo `firestore.rules` de este repo
3. Clic en **"Publicar"**

### 1.6 Activar Autenticación Anónima
1. En el panel izquierdo: **Authentication**
2. Clic en **"Comenzar"**
3. Pestaña **"Sign-in method"**
4. Clic en **"Anónimo"**
5. Activa el toggle → **"Guardar"**

> Esto permite que la app funcione sin login pero con datos seguros en la nube.

---

## PASO 2 — Subir a GitHub y activar GitHub Pages

### 2.1 Crear repositorio
1. Ve a [github.com](https://github.com) → botón verde **"New"**
2. Nombre: `ops-command`
3. Público ✓
4. **"Create repository"**

### 2.2 Subir archivos

**Opción A — Sin terminal (arrastra y suelta):**
1. En el repositorio vacío → **"uploading an existing file"**
2. Arrastra el contenido descomprimido del ZIP
3. Commit: `feat: OPS Command v4 — Firebase realtime sync`

**Opción B — Con terminal:**
```bash
cd ops-command
git init
git remote add origin https://github.com/TU_USUARIO/ops-command.git
git add .
git commit -m "feat: OPS Command v4 — Firebase realtime sync"
git push -u origin main
```

### 2.3 Activar GitHub Pages
1. En el repositorio → **Settings** → **Pages** (menú izquierdo)
2. Source: `Deploy from a branch`
3. Branch: `main` / Folder: `/ (root)`
4. **"Save"**

En ~2 minutos tendrás la app en:
```
https://TU_USUARIO.github.io/ops-command/
```

> Cada `git push` a `main` redeploya automáticamente gracias al workflow de GitHub Actions.

---

## PASO 3 — Instalar en tablets

### Android (Chrome)
1. Abre la URL en Chrome
2. Menú (⋮) → **"Agregar a pantalla de inicio"**
3. O espera el banner automático de instalación
4. La app queda en el home screen como app nativa

### iPad (Safari)
1. Abre la URL en Safari
2. Botón Compartir **(□↑)**
3. **"Añadir a pantalla de inicio"**
4. Confirma → **"Añadir"**

### Orientación recomendada
La app está optimizada para **landscape (horizontal)** en tablets de 10".
Funciona también en portrait — las columnas se adaptan a 2 por fila.

---

## Ciclo de turnos (3 grupos · 21 días)

```
Patrón:  3D · 4N · 3R · 4D · 3N · 4R  = 21 días

Grupo A: offset  0 días  │ Grupo B: offset  7 días  │ Grupo C: offset 14 días

Resultado diario garantizado:
  ☀ 1 grupo en Turno Día (06:00–18:00)
  ☾ 1 grupo en Turno Noche (18:00–06:00)
  ⬡ 1 grupo en Descanso
```

Fecha ancla: **6 enero 2025** = Día 1 del ciclo para Grupo A.
Para ajustar al arranque real de tu operación, edita en `index.html`:
```javascript
const ANCHOR = new Date('2025-01-06T00:00:00');
```

---

## Colecciones Firestore

| Colección | Descripción |
|---|---|
| `ops_sprints` | Sprints creados (nombre, fechas, estado) |
| `ops_sprint_tasks` | Tareas de sprint con info de delegación a turno |
| `ops_op_tasks` | Tareas operativas directas delegadas a turnos |

---

## Sincronización en tiempo real

- Todos los cambios se sincronizan al instante entre todas las tablets conectadas
- El indicador en la barra superior muestra: 🟢 En línea / 🟡 Sincronizando / 🔴 Offline
- En modo offline la app usa la última versión cacheada por el Service Worker

---

## Personalizar nombres de líderes

En `index.html`, busca:
```javascript
const LEADERS = {
  ops: { name: 'Líder Operación',  role: 'Operations Lead',  initials: 'OP' },
  emg: { name: 'Líder Emergencia', role: 'Emergency Lead',   initials: 'EM' },
  seg: { name: 'Líder Seg. Vial',  role: 'Road Safety Lead', initials: 'SV' },
};
```
Reemplaza con los nombres reales y haz push.

---

## Roadmap

- [ ] Autenticación por rol (gerente / líder / operativo)
- [ ] Exportar reporte de turno a PDF
- [ ] Notificaciones push en cambio de turno
- [ ] Módulo de incidentes con foto desde cámara
- [ ] Historial de cambios por tarea

---

*Túnel Oriente · OPS Command v4.0 · Firebase Firestore + PWA*
