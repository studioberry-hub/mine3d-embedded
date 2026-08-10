# Быстрый старт

## Требования

- Браузер с WebGL 2 (или современный Electron)
- Node.js 18+ для сборки
- `three@^0.156.1` в вашем проекте (peer dependency)

## Минимальный HTML + TypeScript

```html
<canvas id="skin-canvas"></canvas>
<script type="module" src="./main.ts"></script>
```

```ts
import { SkinViewEngine } from "mine3d-embedded";

const canvas = document.getElementById("skin-canvas") as HTMLCanvasElement;
const engine = new SkinViewEngine(canvas, {
  idleAnimation: true,
  enableControls: true,
  autoDetectModel: true,
});

engine.start();
await engine.setSkinByUsername("Steve");
engine.fitPlayerToFrame({ fillY: 0.72, maxFillX: 0.8, offsetY: 0 });
```

Полный рабочий пример: [`examples/basic`](../examples/basic).

## Жизненный цикл

1. **Создание** — `new SkinViewEngine(canvas, options?)` создаёт сцену, камеру, освещение, PostFX и модель игрока.
2. **`start()`** — запускает `requestAnimationFrame`-цикл.
3. **Загрузка скина** — `setSkin` / `setSkinByUsername` (асинхронно).
4. **Кадрирование** — `fitPlayerToFrame(...)` после появления модели.
5. **`dispose()`** — останавливает цикл, освобождает GPU-ресурсы. Вызывайте при уходе со страницы / размонтировании компонента.

```ts
window.addEventListener("beforeunload", () => engine.dispose());
```

## Источники скина

| Способ | API |
|--------|-----|
| URL PNG | `await engine.setSkin("https://…/skin.png")` |
| Ник Minecraft | `await engine.setSkinByUsername("Notch")` |
| Файл / blob | `await engine.setSkin(URL.createObjectURL(file))` |
| Image / Canvas | `await engine.setSkin(imageElement)` |

Для remote URL нужен CORS (CDN вроде mc-heads.net обычно отдают корректные заголовки). Подробнее — [Troubleshooting](troubleshooting.md).

## Classic / Slim

По умолчанию `autoDetectModel: true` — тип определяется по текстуре.

```ts
import { SkinModelType } from "mine3d-embedded";

engine.setModelType(SkinModelType.Slim);
```

## Управление камерой

При `enableControls: true` (по умолчанию):

- ЛКМ — орбита
- ПКМ / Alt+ЛКМ — пан
- Колёсико — зум (если `engine.controls.enableZoom = true`)

```ts
engine.controls.enableZoom = true;
engine.setAutoRotate(true);
engine.setCursorFollow(true); // idle смотрит за курсором
```

## Следующие шаги

- [Интеграция в Vite / Electron](integration.md)
- [Полный API движка](api/engine.md)
- [Анимации и пресеты](api/animations.md)
