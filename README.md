# Cashi App — Evaluación Final

Aplicación React Native con Expo para gestión de finanzas personales.  
Conectada a un backend real con autenticación JWT.

## Instrucciones para instalar y correr la app

### Requisitos

- Node.js 18+
- Yarn (v1.22.4)

### Instalación

```bash
yarn install
```

### Configurar la URL de la API

Editar el archivo `services/api.ts` y cambiar `API_BASE_URL` a la URL del servidor:

```ts
// iOS Simulator (mismo Mac)
export const API_BASE_URL = 'http://localhost:3000';

// Android Emulator
export const API_BASE_URL = 'http://10.0.2.2:3000';

// Dispositivo físico en la misma red WiFi
export const API_BASE_URL = 'http://192.168.X.X:3000';
```

### Iniciar la app

```bash
yarn start
```

Luego escanear el QR con Expo Go, o presionar `a` (Android) / `i` (iOS).

### URL de la API

La API corre localmente en `http://localhost:3000`. Construida con **Hono + Prisma + PostgreSQL**.

---

## Qué cambió respecto a la Evaluación 3

| Aspecto | Evaluación 3 | Evaluación Final |
|---|---|---|
| Fuente de datos | AsyncStorage | API REST con JWT |
| Autenticación | Email/pass hardcodeado | Login/registro contra el servidor |
| Token | No aplica | `expo-secure-store` |
| `id` de transacción | `string` (Date.now) | `number` (Prisma Int) |
| Foto del comprobante | URI local en AsyncStorage | URI local → subida a la API → `receiptUrl` pública |
| Coordenadas | Objeto `{ latitude, longitude }` en AsyncStorage | Campos planos `latitude`/`longitude` en el servidor |
| Firma de hooks | — | **Igual** — componentes sin cambios |
| Componentes y pantallas | — | **Sin cambios** |

### Nuevos archivos

- `services/api.ts` — centraliza todas las llamadas HTTP
- `contexts/AuthContext.tsx` — token JWT en estado React
- `hooks/useAuth.ts` — thin wrapper del AuthContext
- `app/register.tsx` — pantalla de registro
- `app/(tabs)/profile.tsx` — perfil y logout

---

## Uso de IA

- **Herramientas utilizadas:** Gemini 3.1 Pro (mediante Antigravity IDE) y Claude Sonnet 4.6 (Thinking).
- **Para qué:**
  - Diseño de la arquitectura de capas (services → context → hooks → componentes).
  - Implementación de `apiService` centralizado con manejo de errores HTTP.
  - Migración de `useTransactions` y `useCategories` de AsyncStorage a la API REST.
  - Integración de `expo-secure-store` para persistir el JWT.
- **Qué aprendimos:**
  - La importancia de la separación en capas: el componente nunca sabe de dónde viene el token, solo usa el hook. Cambiar el proveedor de datos (de AsyncStorage a API) no requirió tocar ninguna pantalla.
  - Que `fetch` nativo es suficiente si se encapsula bien — no se necesita axios para este caso.
  - Cómo manejar tokens JWT de forma segura en React Native con SecureStore.

---

## Estructura del proyecto

```
app/
  _layout.tsx          # AuthProvider envuelve el árbol
  index.tsx            # Pantalla de login
  register.tsx         # Pantalla de registro (nueva)
  (tabs)/
    index.tsx          # Lista de transacciones
    balance.tsx        # Balance del servidor
    categories.tsx     # Categorías (solo lectura)
    profile.tsx        # Perfil + logout (nueva)
    transaction/
      [id].tsx         # Crear / Editar transacción

contexts/
  AuthContext.tsx      # Token JWT + login/register/logout

services/
  api.ts              # Todas las llamadas HTTP centralizadas

hooks/
  useAuth.ts          # Thin wrapper del AuthContext
  useTransactions.ts  # CRUD contra la API
  useCategories.ts    # GET /categories
  useImagePicker.ts   # Cámara y galería (sin cambios)
  useLocation.ts      # GPS (sin cambios)
  useTransactionForm.ts

types/
  index.ts            # Transaction.id: number, Category.id: number
```
