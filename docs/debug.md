# Отладка

Mine3D Embedded включает API телеметрии и визуальных оверлеев — тот же, что вкладка «Отладка» в Undefined Client.

## Включение

```ts
import { DEFAULT_SKIN_DEBUG_OPTIONS } from "mine3d-embedded";

engine.setDebugEnabled(true);
engine.setDebugOptions({
  ...DEFAULT_SKIN_DEBUG_OPTIONS,
  hitbox: true,
  wireframe: false,
});
```

Пока `setDebugEnabled(true)`:

- Рисуются выбранные оверлеи (AABB, оси, grid, helpers…)
- Можно паузить анимацию / камеру флагами поведения
- `getDebugStats()` наполняет FPS-статистику

При `setDebugEnabled(false)` продуктные визуалы восстанавливаются (`_restoreProductVisuals`).

## getDebugStats()

```ts
const s = engine.getDebugStats();
console.log(s.fps, s.gpu, s.triangles, s.postFx, s.skinType);
```

Полезные поля:

| Поле | Смысл |
|------|--------|
| `engine` / `engineVersion` | Имя и версия |
| `fps`, `fpsMin`, `fpsAvg`, `fpsMax`, `frameMs` | Производительность |
| `gpu`, `gpuVendor`, `webgl` | Строка WEBGL_debug_renderer_info |
| `gpuLoad` | Оценка нагрузки по frameMs (не OS GPU %) |
| `width` / `height` / `buffer*` / `pixelRatio` | Viewport |
| `drawCalls`, `triangles`, `geometries`, `textures`, `programs` | renderer.info |
| `postFx` | `"bloom+SMAA"` или `"direct"` |
| `skinType`, `hasCape`, `hasElytra` | Модель |
| `presentation`, `animation`, `shotPreset` | Состояние |
| `cameraFov`, `cameraDistance`, `cameraZoom`, `cameraYaw` | Камера |
| `autoRotate`, `cursorFollow` | Флаги |
| `options` | Текущие `SkinDebugOptions` |

## HUD в своём UI

Движок не рисует HTML-HUD сам — только отдаёт данные. Типичный паттерн:

```ts
function tick() {
  if (!engine.getDebugEnabled()) return;
  const s = engine.getDebugStats();
  fpsEl.textContent = String(s.fps);
  requestAnimationFrame(tick);
}
```

Справочный HUD есть в лаунчере и на демо-странице сайта (`skin-debug-hud`).

## PostFX и debug

Флаг `options.postFx`:

- `true` и есть composer → bloom + SMAA
- `false` → прямой `renderer.render(scene, camera)`

Это учитывается **всегда**, не только при включённом debug. Удобно, если на конкретной GPU-конфигурации composer даёт пустой кадр:

```ts
engine.setDebugOptions({ postFx: false });
```

## Рекомендуемые сценарии

1. **Хитбокс / части** — проверить масштаб и кадрирование
2. **Wireframe** — UV / геометрия outer voxels
3. **pauseAnimation** — зафиксировать позу для скрина
4. **Отключить atmosphere / floor** — изолировать персонажа
5. **Сверить FPS** на слабом железе перед встраиванием нескольких вьюверов
