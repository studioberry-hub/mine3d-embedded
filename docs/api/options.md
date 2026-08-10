# API: опции и типы

## EngineOptions

Передаются в `new SkinViewEngine(canvas, options)`.

| Поле | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `modelType` | `SkinModelType` | `Classic` | classic / slim |
| `autoDetectModel` | `boolean` | `true` | Infer slim по текстуре |
| `autoResize` | `boolean` | `true` | ResizeObserver на canvas |
| `zoom` | `number` | из `DEFAULT_CAMERA_SETTINGS` | Масштаб камеры |
| `fov` | `number` | из defaults | Угол обзора |
| `idleAnimation` | `boolean \| SkinAnimation` | `true` | `true` → HeroIdle; `false` → без анимации |
| `transparent` | `boolean` | `false` | Прозрачный фон сразу |
| `presentation` | `"full" \| "bust"` | `"full"` | Режим показа |
| `enableControls` | `boolean` | `true` | OrbitControls |
| `antialias` | `boolean` | `true` | WebGL antialias (силуэт дополнительно сглаживает SMAA) |
| `uvInsetTexels` | `number` | `0` | UV-inset inner |
| `outerUvInsetTexels` | `number` | `0` | UV-inset outer |
| `debugShadows` | `boolean` | `false` | Лог shadow frustum |
| `enableEffects` | `boolean` | `true` | Частицы, dress FX, PostFX-стек |

```ts
import { SkinModelType, type EngineOptions } from "mine3d-embedded";

const options: EngineOptions = {
  presentation: "bust",
  enableControls: false,
  enableEffects: false,
  autoDetectModel: true,
};
```

## SkinModelType

```ts
enum SkinModelType {
  Classic = "classic",
  Slim = "slim",
}
```

## CameraSettings

```ts
interface CameraSettings {
  fov: number;
  zoom: number;
  lookTargetY: number;
  distance: number;
  autoRotate: boolean;
  minPolarAngleDeg: number;
  maxPolarAngleDeg: number;
}
```

Дефолты: `DEFAULT_CAMERA_SETTINGS`.

```ts
engine.applyCameraSettings({
  ...engine.getCameraSettings(),
  autoRotate: true,
  fov: 22,
});
```

## LightSettings

```ts
interface LightSettings {
  keyAzimuthDeg: number;
  keyElevationDeg: number;
  keyIntensity: number;
  ambientIntensity: number;
  fillIntensity: number;
  shadowRadius: number;
  shadowIntensity: number;
  castShadows: boolean;
}
```

Дефолты: `DEFAULT_LIGHT_SETTINGS`. Класс `ProductLighting` — низкоуровневая обёртка над лампами сцены (обычно не нужна снаружи).

## SkinDebugOptions

Флаги визуальной отладки. Дефолты при включённой панели: `DEFAULT_SKIN_DEBUG_OPTIONS`.

Группы:

- **Оверлеи:** `hitbox`, `partHitboxes`, `axes`, `grid`, `lightHelper`, `shadowCamera`, `lookTarget`, `wireframe`
- **Сцена:** `floor`, `ground`, `contactShadow`, `atmosphere`, `particles`, `postFx`, `shadows`, `envMap`
- **Части:** `head`, `body`, `arms`, `legs`, `outerLayer`, `cape`, `elytra`, `outerVoxels`
- **Поведение:** `pauseAnimation`, `freezeCamera`, `forceAutoRotate`, `flatShading`

```ts
engine.setDebugEnabled(true);
engine.setDebugOptions({ hitbox: true, postFx: true, wireframe: false });
```

Важно: `postFx` из опций учитывается всегда (и без debug UI). `false` → прямой `renderer.render`.

## SkinDebugStats

Снимок из `getDebugStats()`: FPS, GPU-строка, viewport, drawCalls, triangles, presentation, animation, camera*, флаги `options`.

Поля `gpuLoad` — оценка по `frameMs` относительно бюджета 60 FPS, не системный utilization.

## SkinSource / PresentationMode

```ts
type SkinSource = string | HTMLImageElement | ImageBitmap | HTMLCanvasElement;
type PresentationMode = "full" | "bust";
```

## FrameFitOptions

Для `fitPlayerToFrame` / `fitObjectToFrame`:

| Поле | Описание |
|------|----------|
| `fillY` | Целевая доля высоты кадра |
| `maxFillX` | Макс. доля ширины |
| `offsetY` | Смещение центра по Y в NDC |

См. также типы `FrameFitResult`, `FrameMeasure`, `NdcBox` в модуле кадрирования.
