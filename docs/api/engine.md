# API: SkinViewEngine

Главный класс библиотеки. Создаёт Three.js-сцену, модель игрока (skin3d `PlayerObject`), освещение, PostFX и цикл рендера.

```ts
import { SkinViewEngine } from "mine3d-embedded";

const engine = new SkinViewEngine(canvas, options?);
```

Константы:

```ts
import {
  ENGINE_DISPLAY_NAME, // "Mine3D Embedded"
  ENGINE_VERSION,      // "0.2.0"
  DEFAULT_CAMERA_SETTINGS,
} from "mine3d-embedded";
```

## Жизненный цикл

| Метод | Описание |
|-------|----------|
| `start()` | Запуск RAF-цикла |
| `stop()` | Остановка цикла (ресурсы не освобождаются) |
| `renderFrame()` | Один кадр вне цикла |
| `dispose()` | Полная очистка GPU/слушателей |
| `setSize(w, h)` | Размер viewport (CSS-пиксели) |

Свойства: `disposed`, `canvas`, `scene`, `camera`, `renderer`, `controls`, `playerObject`, `playerWrapper`, `lighting`.

## Скин и плащ

| Метод | Описание |
|-------|----------|
| `setSkin(source)` | URL / Image / Canvas / ImageBitmap |
| `setSkinByUsername(name)` | CDN: mc-heads → mineskin |
| `loadSkin(url)` | **deprecated**, алиас `setSkin` |
| `setCape(source \| null)` | Плащ; `null` скрывает |
| `clearCape()` | Скрыть и dispose текстуры |
| `setModelType(SkinModelType)` | classic / slim |
| `modelType` | getter |

Тип `SkinSource`: `string | HTMLImageElement | ImageBitmap | HTMLCanvasElement`.

## Анимация и поза

| Метод / свойство | Описание |
|------------------|----------|
| `setAnimation(anim \| null)` | С кроссфейдом ~0.38 с |
| `animation` | Текущая анимация |
| `applyShotPreset(id)` | `hero` \| `bust` \| `back` \| `discord` |
| `clearShotPreset()` | Сброс shot-пресета |
| `shotPreset` | Текущий пресет или `null` |
| `nudge()` | Толчок idle (если HeroIdle) |
| `setPlayerYaw(rad)` | Поворот модели |

См. также [animations.md](animations.md).

## Presentation и фон

| Метод | Описание |
|-------|----------|
| `setPresentationMode("full" \| "bust")` | Полный рост / бюст (+ прозрачный фон в bust) |
| `presentationMode` | getter |
| `setTransparentBackground(bool)` | Без пола/атмосферы, alpha clear |

## Камера

| Метод | Описание |
|-------|----------|
| `getCameraSettings()` / `applyCameraSettings(s)` | Снимок / применение |
| `resetCamera()` | К дефолтам + поза |
| `getCameraFov` / `setCameraFov` | FOV |
| `getZoom` / `setZoom` | Зум |
| `getCameraDistance` / `setCameraDistance` | Дистанция |
| `getLookTargetY` / `setLookTargetY` | Цель орбиты по Y |
| `getAutoRotate` / `setAutoRotate` | Автовращение |
| `getPolarLimitsDeg` / `setPolarLimitsDeg` | Ограничения орбиты |
| `fitPlayerToFrame(options?)` | Вписать модель в кадр |
| `measurePlayerFrame()` | Замер NDC bbox |

`fitPlayerToFrame` опции (`FrameFitOptions`):

- `fillY` — доля высоты кадра (0…1), меньше = дальше камера
- `maxFillX` — ограничение по ширине
- `offsetY` — вертикальный сдвиг центра в NDC (`0` = середина)

## Взгляд за курсором

| Метод | Описание |
|-------|----------|
| `setCursorFollow(bool)` | Вкл/выкл |
| `cursorFollow` | getter |
| `setCursorAim(x, y)` | NDC-подобная цель (−1…1 и чуть шире) |

Для idle-анимации голова/тело следят за aim. Координаты удобно считать от bbox сцены.

## Свет

| Метод | Описание |
|-------|----------|
| `getLightSettings()` / `applyLightSettings(s)` | Снимок / применение |
| `resetLighting()` | К `DEFAULT_LIGHT_SETTINGS` |

См. [options.md](options.md).

## Debug

| Метод | Описание |
|-------|----------|
| `setDebugEnabled(bool)` | Телеметрия + оверлеи |
| `getDebugEnabled()` | |
| `setDebugOptions(partial)` | Частичное обновление флагов |
| `getDebugOptions()` | Копия опций |
| `getDebugStats()` | Снимок `SkinDebugStats` |

Подробнее: [debug.md](../debug.md).

## Утилиты ника

Экспортируются отдельно (без движка):

```ts
import {
  normalizeUsername,
  buildSkinUrlsByUsername,
  EmptyUsernameError,
} from "mine3d-embedded";
```

## Кадрирование объектов (low-level)

```ts
import {
  fitObjectToFrame,
  measureObjectFrame,
  computeVisibleBounds,
} from "mine3d-embedded";
```

Обычно достаточно `engine.fitPlayerToFrame`.
