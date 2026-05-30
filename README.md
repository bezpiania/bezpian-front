# Zapien · Frontend

Proyecto React 18 + Vite con la arquitectura del admin de referencia
(React Router v7, TanStack React Query, Axios, Ant Design, Tailwind v4).
Porta el mockup HTML de Zapien a 18 pantallas reales con rutas.

## Stack

- **React 18** + **Vite 5** (ES modules)
- **React Router DOM v7** para rutas públicas/privadas
- **TanStack React Query** para llamadas API
- **Axios** (instancia única en `apis/app.js` desde `libs/axios.js`)
- **Ant Design** (solo Form, message, etc. donde el prompt lo pide)
- **Tailwind v4** vía `@tailwindcss/vite` + design system Zapien en `src/index.css`

## Cómo correrlo

```bash
npm install
cp .env.example .env   # ajusta VITE_API_APP si tu backend vive en otro puerto
npm run dev
```

El dev server arranca en `http://localhost:5173`. Login → Dashboard.

> **Nota dev**: el login tiene un fallback de desarrollo. Si el backend no
> responde (error de red), te deja entrar con un user demo guardado en
> `localStorage`. Útil para revisar pantallas sin tener backend levantado.
> **Sácalo en producción** — está en `src/pages/public/Login.jsx`, dentro del
> bloque `if (isNetwork)` del `catch`.

## Estructura

```
src/
├── apis/app.js              ← instancia axios (baseURL desde VITE_API_APP)
├── libs/axios.js            ← createInstance(baseURL)
├── services/                ← clases con métodos de API
│   ├── Auth.js
│   └── Status.js
├── hooks/                   ← useQuery wrappers
│   └── useStatus.js
├── components/
│   ├── AppLayout.jsx        ← shell de páginas privadas (sidebar + main)
│   ├── IconSprite.jsx       ← sprite SVG con todos los iconos
│   ├── PageHead.jsx         ← cabecera de página reutilizable
│   ├── PrivateRoute.jsx     ← protege rutas según localStorage 'user'
│   └── Sidebar.jsx          ← nav app Zapien con NavLink
├── pages/
│   ├── public/
│   │   ├── Login.jsx
│   │   ├── VerifyEmail.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── Widget.jsx           ← preview del widget del visitante
│   │   └── PublicQuote.jsx      ← cotización pública
│   └── private/
│       ├── Dashboard.jsx
│       ├── chatbots/{BotsList,BotDetail,BotEmbed}.jsx
│       ├── operacion/{Conversations,ConversationDetail,Leads,Appointments,Quotes,QuoteDetail}.jsx
│       └── cuenta/{Team,Integrations,Billing,Profile}.jsx
├── App.jsx                  ← router con todas las rutas
├── main.jsx                 ← QueryClient + antd reset + estilos
└── index.css                ← Tailwind import + design system Zapien
```

## Flujo de datos

Sigue el patrón del prompt: **Page → Hook → Service → API**.
El Dashboard llama a `useStatus()` → `Status.getStatus()` → `GET /api/example/status`.
Para añadir un nuevo recurso (p.ej. Leads):

```js
// services/Leads.js
import instance from '../apis/app.js';
class LeadsService {
  getAll = () => instance.get('/api/leads');
}
export default new LeadsService();

// hooks/useLeads.js
import { useQuery } from '@tanstack/react-query';
import Leads from '../services/Leads.js';
const useLeads = () => useQuery({ queryKey: ['leads'], queryFn: () => Leads.getAll() });
export default useLeads;
```

## Rutas

| Ruta | Descripción |
|---|---|
| `/login` | Login (público) |
| `/verificar-email` | Verificación post-registro |
| `/recuperar` | Recuperar contraseña |
| `/widget` | Preview público del widget del visitante |
| `/cotizacion/:id` | Cotización pública (sin sesión) |
| `/dashboard` | Inicio del workspace ⭐ |
| `/chatbots` · `/chatbots/:id` · `/chatbots/:id/embed` | Bots |
| `/conversaciones` · `/conversaciones/:id` | Chats |
| `/leads` | CRM liviano |
| `/citas` | Agenda |
| `/cotizaciones` · `/cotizaciones/:id` | Cotizaciones |
| `/equipo` · `/integraciones` · `/plan` · `/perfil` | Cuenta |

## Design system

Variables CSS en `src/index.css` (`:root`):

- **Paleta**: bone `#F4F0E8`, carbon `#15140F`, voltage `#DCFF1E`, magma `#FF4D1F`
- **Tipos**: Bricolage Grotesque (display), Fraunces (body, con itálicas), JetBrains Mono (mono)
- **Textura de grano** via `body::before` con SVG `feTurbulence`
- Clases base: `.app`, `.app-sidebar`, `.page-head`, `.btn`, `.card`, `.data-table`, `.pill`, `.kpis`, etc.

Tailwind queda disponible para utilidades sueltas pero el grueso del UI
usa las clases del design system para mantener fidelidad con el mockup.
