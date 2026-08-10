# Troubleshooting

## Скин не загружается / tainted canvas

**Симптом:** ошибка при `setSkin(https://…)` или чёрная/пустая модель.

**Причина:** CORS. Canvas не может читать пиксели cross-origin изображения без CORS.

**Решение:**

- Используйте `setSkinByUsername` (CDN с CORS)
- Свой хост: `Access-Control-Allow-Origin`
- Для локальных файлов — `URL.createObjectURL(file)` (blob:)

## Classic вместо Slim (или наоборот)

Включите `autoDetectModel: true` (дефолт) или задайте явно:

```ts
engine.setModelType(SkinModelType.Slim);
```

Infer смотрит на прозрачность/пиксели рук в атласе (skinview-utils).

## Пустой / серый / белый кадр при включённом PostFX

На части конфигураций ANGLE + EffectComposer кадр может «пропасть».

```ts
engine.setDebugOptions({ postFx: false });
```

Или откройте debug и выключите «PostFX». Прямой рендер должен показать сцену.

Если `getDebugStats().postFx === "bloom+SMAA"` и `triangles` ~ 1 — composer, скорее всего, не рисует сцену.

## Персонаж обрезан / слишком крупный

После загрузки и resize:

```ts
engine.fitPlayerToFrame({ fillY: 0.65, maxFillX: 0.75, offsetY: 0 });
```

- Меньше `fillY` → дальше камера
- `offsetY: 0` → вертикальный центр; отрицательный → чуть ниже

Убедитесь, что canvas имеет ненулевой `clientWidth/Height` до `setSize` / fit.

## Утечки памяти / чёрный экран после навигации

Всегда вызывайте `dispose()` при размонтировании. Не переиспользуйте disposed-инстанс — создайте новый.

Blob URL после `setSkin(blobUrl)` отзывайте (`URL.revokeObjectURL`), когда скин больше не нужен.

## Несколько вьюверов тормозят

Каждый `SkinViewEngine` — отдельный WebGLRenderer. Для сетки превью:

```ts
new SkinViewEngine(canvas, {
  enableControls: false,
  enableEffects: false,
  idleAnimation: false,
  presentation: "bust",
  antialias: false,
});
```

И останавливайте невидимые (`stop()` / `dispose()`).

## TypeScript не находит типы

Проверьте, что установлены зависимости и собран `dist/`:

```bash
npm run build:lib
```

В потребителе: `"moduleResolution": "bundler"` или Node16+.

## Конфликт версий three

Два Three в бандле ломают `instanceof` и контролы. Сведите к одному:

```bash
npm ls three
```

Peer: `three@^0.156.1`.

## Ник не найден

`setSkinByUsername` пробует mc-heads, затем mineskin. Если оба падают — будет `Error` с текстом последней ошибки. Проверьте ник и сеть; пустая строка → `EmptyUsernameError`.
