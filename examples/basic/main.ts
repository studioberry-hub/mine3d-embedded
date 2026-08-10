// Минимальный пример: canvas + скин Steve по нику
import {
  SkinViewEngine,
  ENGINE_DISPLAY_NAME,
  ENGINE_VERSION,
} from "mine3d-embedded";

const canvas = document.getElementById("skin-canvas");
if (!(canvas instanceof HTMLCanvasElement)) {
  throw new Error("Canvas #skin-canvas не найден");
}

const engine = new SkinViewEngine(canvas, {
  idleAnimation: true,
  enableControls: true,
  autoDetectModel: true,
});

engine.controls.enableZoom = true;
engine.setCursorFollow(true);
engine.start();

void engine.setSkinByUsername("Steve").then(() => {
  engine.fitPlayerToFrame({ fillY: 0.72, maxFillX: 0.8, offsetY: 0 });
  console.info(`${ENGINE_DISPLAY_NAME} ${ENGINE_VERSION}: Steve loaded`);
});

window.addEventListener("beforeunload", () => {
  engine.dispose();
});
