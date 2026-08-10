# API: анимации и пресеты

## createSkinAnimation

Фабрика готовых клипов:

```ts
import { createSkinAnimation, type SkinAnimId } from "mine3d-embedded";

type SkinAnimId =
  | "idle"
  | "run"
  | "wave"
  | "sneak"
  | "look"
  | "cool"
  | "glide"
  | "victory"
  | "sad"
  | "dance";

engine.setAnimation(createSkinAnimation("run"));
engine.setAnimation(null); // без анимации
```

`setAnimation` делает короткий кроссфейд позы (~0.38 с).

## Классы анимаций

Можно создавать напрямую:

| Класс | Типичный id |
|-------|-------------|
| `HeroIdleAnimation` | `idle` |
| `TrailerRunAnimation` | `run` |
| `WaveHelloAnimation` | `wave` |
| `SneakAnimation` | `sneak` |
| `LookAroundAnimation` | `look` |
| `CoolPoseAnimation` | `cool` |
| `GlideAnimation` | `glide` |
| `VictoryAnimation` | `victory` |
| `SadAnimation` | `sad` |
| `DanceAnimation` | `dance` |
| `BustPoseAnimation` | для bust / discord |

Также реэкспортируются анимации skin3d: `IdleAnimation`, `WalkAnimation`, `RunningAnimation`, `PlayerAnimation`.

## Shot presets

Пресеты кадра под скриншот / аватар:

```ts
type ShotPresetId = "hero" | "bust" | "back" | "discord";

engine.applyShotPreset("hero");
engine.fitPlayerToFrame({ fillY: 0.7, offsetY: 0 });

engine.clearShotPreset();
engine.setPresentationMode("full");
engine.setAnimation(createSkinAnimation("idle"));
```

Поведение:

- `hero` — cool-поза, полный рост
- `bust` / `discord` — ноги скрыты, BustPose
- `back` — yaw = π (спина)

После `applyShotPreset` UI обычно вызывает `fitPlayerToFrame` со своими fill-опциями.

## Presentation mode

```ts
engine.setPresentationMode("bust"); // прозрачный фон + bust-поза
engine.setPresentationMode("full");
```

В режиме `bust` ноги скрыты. Для карточек удобно сочетать с `enableEffects: false` и `enableControls: false`.

## Idle: взгляд и nudge

```ts
engine.setAnimation(createSkinAnimation("idle"));
engine.setCursorFollow(true);

stage.addEventListener("pointermove", (e) => {
  const rect = stage.getBoundingClientRect();
  const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
  engine.setCursorAim(nx, ny);
});

engine.nudge(); // короткий «толчок» idle, если активен HeroIdle
```

## Утилиты

```ts
import {
  animationControlsLegs,
  resetPlayerRootPose,
} from "mine3d-embedded";
```

- `animationControlsLegs(anim)` — управляет ли анимация ногами
- `resetPlayerRootPose(player)` — сброс root rotation модели
