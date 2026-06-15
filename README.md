# React Native Clean Initial - Cashi App (Evaluación 3)

Starter minimalista de **React Native** con **Expo** + **Expo Router** + **TypeScript**.

Cashi es una aplicación de gestión de gastos e ingresos. En esta iteración (Evaluación 3) se agregaron capacidades de hardware: adjuntar comprobantes fotográficos y registrar ubicación GPS.

## Instrucciones para instalar y correr la app

1. Clonar el repositorio.
2. Instalar dependencias utilizando Yarn o npm:

```bash
yarn install
```

3. Iniciar la aplicación usando Expo:

```bash
yarn start
```

Esto abre el menú de Expo. Desde ahí podés abrir la app en:
- **Expo Go** — escaneando el QR con tu celular.
- **Emulador Android** — presionando `a`.
- **Simulador iOS** — presionando `i` (solo macOS).

## Qué cambió respecto a la Evaluación 2

Se extendió el modelo de datos de `Transaction` para incluir dos campos opcionales sin romper el funcionamiento anterior:

```typescript
export interface Transaction {
  // ... campos anteriores
  photoUri?: string; // URI local de la foto del comprobante
  location?: {
    latitude: number;
    longitude: number;
  };
}
```

**Funcionalidades agregadas:**
- **Foto del Comprobante:** Al crear o editar una transacción, se puede tomar una foto con la cámara o seleccionarla de la galería. Se muestra una previsualización antes de guardar.
- **Ubicación GPS:** Permite registrar la latitud y longitud actual al momento de crear la transacción.
- **Custom Hooks:** La lógica de hardware y manejo de permisos vive de manera exclusiva en `useImagePicker.ts` y `useLocation.ts`.
- **Manejo de Errores sin Alerts:** Si se deniegan permisos de cámara, galería o ubicación, se muestran mensajes claros directamente en la interfaz de usuario para evitar cierres o interrupciones con ventanas emergentes.

## Uso de IA

- **Herramientas utilizadas:** Gemini 3.1 Pro (mediante Antigravity IDE).
- **Para qué:** Se usó la IA para asistir en la estructuración de los Custom Hooks (`useImagePicker` y `useLocation`), y para la actualización del formulario de transacción para incluir el renderizado de la imagen y coordenadas, así como los mensajes de error dinámicos.
- **Qué aprendimos:** Aprendimos la importancia de separar la lógica de negocio y llamadas a APIs nativas en hooks reutilizables, permitiendo que los componentes de la interfaz de usuario se mantengan limpios ("dumb components" que solo consumen el estado y los métodos del hook). También aprendimos a manejar permisos de manera más amigable mediante renderizado condicional de errores en la pantalla en lugar de usar Alerts intrusivos.

## Estructura del proyecto

```
app/                  # Pantallas y navegación (file-based routing)
assets/               # Imágenes, fuentes y otros recursos
components/           # Componentes reutilizables
constants/            # Constantes y configuración
hooks/                # Custom hooks (incluyendo uso de hardware)
types/                # Definiciones de TypeScript
```
