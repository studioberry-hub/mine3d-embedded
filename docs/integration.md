# Интеграция

## Установка из GitHub

```bash
npm install three@^0.156.1
npm install github:undefined-studio/mine3d-embedded
```

Или через `package.json`:

```json
{
  "dependencies": {
    "mine3d-embedded": "github:undefined-studio/mine3d-embedded",
    "three": "^0.156.1"
  }
}
```

Пакет отдаёт собранный ESM из `dist/` (`exports["."]`). Перед публикацией релиза в git должен быть либо закоммичен `dist/`, либо настроен CI, который кладёт артефакты. Локально:

```bash
npm run build:lib
```

## Peer dependency: three

Библиотека **не бандлит** Three.js. Версия peer: `^0.156.1` (та же, что у движка).

Несовпадение мажорных версий Three может сломать импорты `three/examples/jsm/...` (OrbitControls, EffectComposer, SMAA, Bloom).

## Vite

```ts
// vite.config.ts
import { defineConfig } from "vite";

export default defineConfig({
  optimizeDeps: {
    include: ["mine3d-embedded", "three", "skin3d"],
  },
});
```

```ts
import { SkinViewEngine } from "mine3d-embedded";
```

Для разработки самой библиотеки в этом репозитории алиас уже настроен: `mine3d-embedded` → `src/`.

## Webpack / другие бандлеры

Убедитесь, что:

1. Резолвятся ESM-импорты с расширениями `.js` внутри пакета.
2. `three` и `skin3d` не дублируются (один инстанс Three в бандле).
3. Для TypeScript: `"moduleResolution": "bundler"` или `"node16"` / `"nodenext"`.

## Готовый ESM-бандл (без npm в рантайме)

Если нужно положить один файл на статику (как на сайте лаунчера):

```bash
npx esbuild src/index.ts \
  --bundle --format=esm --platform=browser \
  --outfile=mine3d-embedded.js --minify
```

В бандл попадут `skin3d` / `skinview-utils` / `three`. Размер порядка ~640 KB minify.

```html
<script type="module">
  import { SkinViewEngine } from "./mine3d-embedded.js";
  // …
</script>
```

## Electron / Chromium

Движок работает в renderer-процессе на `<canvas>`. Рекомендации:

- Создавайте движок после появления canvas в DOM.
- Вызывайте `dispose()` при закрытии окна / смене вкладки.
- Для мини-превью карточек: `{ enableControls: false, enableEffects: false, presentation: "bust" }`.
- Не используйте несколько полноэкранных вьюверов одновременно без нужды — каждый держит WebGL-контекст.

## React (пример)

```tsx
import { useEffect, useRef } from "react";
import { SkinViewEngine } from "mine3d-embedded";

export function SkinViewer({ username }: { username: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const engine = new SkinViewEngine(canvas, { idleAnimation: true });
    engine.start();
    void engine.setSkinByUsername(username).then(() => {
      engine.fitPlayerToFrame({ fillY: 0.7, offsetY: 0 });
    });

    return () => engine.dispose();
  }, [username]);

  return <canvas ref={ref} style={{ width: "100%", height: "100%" }} />;
}
```

## CORS и загрузка скинов

Remote PNG читается в canvas → нужен CORS.

- `https://mc-heads.net/skin/{nick}` и `https://mineskin.eu/skin/{nick}` — основной путь `setSkinByUsername`.
- Свой CDN: отдавайте `Access-Control-Allow-Origin` (или `*`) и не ломайте preflight.
- `blob:` / same-origin / data URL — без `crossOrigin`.

Подробнее: [Troubleshooting](troubleshooting.md).

## Размер viewport

При `autoResize: true` (по умолчанию) движок следит за размером canvas через `ResizeObserver`. Можно задать вручную:

```ts
engine.setSize(width, height);
```

После смены layout вызывайте `fitPlayerToFrame`, если персонаж должен оставаться в кадре.
