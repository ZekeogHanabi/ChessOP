# ♟️ ChessOp - Práctica de Aperturas de Ajedrez

Una aplicación web de **código abierto**, **ultra ligera** (bajo consumo de recursos) y diseñada con un enfoque **minimalista y atemporal**. Ideal para ajedrecistas que buscan memorizar y perfeccionar su repertorio de aperturas mediante repetición activa e inteligente.

El proyecto está diseñado al 100% para ser estático y se despliega de forma gratuita e inmediata en **Cloudflare Pages** (o GitHub Pages, Vercel, Netlify).

---

## ✨ Características Principales

1. **Aestética Minimalista y Atemporal**: Inspirada en *Chessreps*, *Lichess* e interfaces limpias como *Substack* o *Linear*. Utiliza una paleta selecta de grises suaves, blancos rotos, tonos tierra y carbón sepia. No incluye luces de neón pesadas ni animaciones futuristas agresivas.
2. **Bajo Consumo de Recursos (Low Resources)**:
   - Todo el estado, repertorios y el progreso se almacenan y evalúan localmente en el navegador a través de `localStorage`.
   - Cero bases de datos, cero llamadas a APIs pesadas.
   - Rendimiento del 100% en Lighthouse.
3. **Bucle de Entrenamiento Eficiente**:
   - **Modo Demostración (Interactiva)**: Muestra al usuario de forma gráfica cómo se juega la variante utilizando flechas guía dinámicas sobre el tablero. Al completarlo, el sistema registra que has aprendido la línea.
   - **Modo Práctica**: El tablero te desafía a jugar de memoria. Si haces una jugada incorrecta o fuera del árbol teórico seleccionado, el tablero te ofrece feedback visual instantáneo (parpadeo sutil en rojo con vibración lateral ligera) e invita a reintentar.
4. **Respuestas Automáticas**: Al realizar tu jugada teórica correcta, tras una pausa natural de 400ms, la máquina responde automáticamente con la línea preestablecida del repertorio.
5. **Comentarios Didácticos**: Cada movimiento de la variante incluye explicaciones teóricas y educativas en tiempo real para entender el *porqué* estratégico de cada jugada.
6. **Tema Adaptativo**: Alterna fácilmente entre el modo claro sepia suave y el modo oscuro carbón profundo.

---

## 🛠️ Stack Tecnológico

- **Núcleo**: React 18 + TypeScript + Vite.
- **Estilos**: Tailwind CSS v3 (Altamente optimizado y compatible con todos los navegadores).
- **Lógica de Ajedrez**: `chess.js` (Para la validación de movimientos y reglas de ajedrez).
- **Tablero Gráfico**: `react-chessboard` v5 (Utilizando la API unificada de opciones, súper rápida y responsive).
- **Iconos**: `lucide-react`.

---

## 📂 Estructura de Datos (TypeScript)

El árbol de variantes se modela de forma lineal y secuencial en `src/types.ts`:

```typescript
export interface MoveNode {
  from: string;      // Casilla origen, ej: "e2"
  to: string;        // Casilla destino, ej: "e4"
  notation: string;  // Notación algebraica, ej: "e4"
  comment?: string;  // Explicación estratégica de la jugada
}

export interface OpeningVariant {
  id: string;
  name: string;      // Nombre de la variante
  openingName: string; // Apertura principal
  description: string; // Contexto histórico/estratégico
  side: 'white' | 'black'; // Bando que practica el usuario
  moves: MoveNode[]; // Lista ordenada de jugadas alternativas
}
```

---

## 🚀 Despliegue en Cloudflare Pages (¡Gratis e Instantáneo!)

Al tratarse de una aplicación estática compilada con Vite, el despliegue en **Cloudflare Pages** es sumamente sencillo e inmediato a través de su integración nativa con GitHub:

1. Crea un repositorio en tu cuenta de **GitHub** y sube el código del proyecto.
2. Inicia sesión en tu panel de **Cloudflare**.
3. Ve a **Workers & Pages** -> **Create application** -> pestaña **Pages** -> **Connect to Git**.
4. Selecciona tu repositorio recién creado.
5. En la configuración del proyecto, selecciona la plantilla preestablecida de **Vite**:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Build Output Directory**: `dist`
6. Haz clic en **Save and Deploy**. ¡Listo! Tu sitio estará en línea en segundos en una URL como `https://tu-proyecto.pages.dev/` con SSL gratis y CDN global ultrarrápido.

---

## 💻 Desarrollo Local

Si deseas modificar la base de datos de aperturas o añadir tus propios repertorios:

1. **Clona el repositorio**:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd ChessOp
   ```

2. **Instala las dependencias**:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Inicia el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

4. **Compila para producción**:
   ```bash
   npm run build
   ```

---

## 📜 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia **MIT**. ¡Siéntete libre de clonarlo, mejorarlo y adaptarlo a tu propio estilo de juego! 🚀
# ChessOP
# ChessOP
