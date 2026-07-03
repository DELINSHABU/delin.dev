// DOOM engine driver.
//
// Runs shareware DOOM compiled to WebAssembly. The wasm binary (with the WAD
// baked in) is self-hosted at /doom/doom.wasm so the game runs fully offline
// with no third-party CDN. The binary is sourced from the MIT-licensed
// `wasm-doom` package (github.com/iam-medvedev/wasm-doom) — see the
// `copy-doom-wasm` npm script — and the glue below is derived from it.
//
// We drive the wasm ourselves instead of using the library's runner because the
// library starts an uncancellable requestAnimationFrame loop: closing the
// window would leave DOOM simulating in the background forever (and reopening
// would stack a second instance). startDoom() returns a handle whose stop()
// cancels the loop and detaches input, so the game fully halts on close — the
// whole point of moving off the DOSBox emulator was to stop burning resources.

const WASM_URL = '/doom/doom.wasm';

// Native DOOM framebuffer. The wasm always renders at this fixed size; the
// on-screen <canvas> uses these as its backing-store dimensions and CSS scales
// it up to fill the window.
export const DOOM_W = 640;
export const DOOM_H = 400;

interface DoomExports {
  main(): void;
  doom_loop_step(): void;
  add_browser_event(type: number, keyCode: number): void;
}

export interface DoomHandle {
  stop(): void;
}

// Browser keyCode -> DOOM key code (from wasm-doom's Keyboard.mapDoomKeyCode).
function mapDoomKeyCode(k: number): number {
  switch (k) {
    case 8: return 127; // backspace
    case 17: return 157; // ctrl -> fire
    case 18: return 184; // alt -> strafe
    case 37: return 172; // left
    case 38: return 173; // up
    case 39: return 174; // right
    case 40: return 175; // down
    default:
      if (k >= 65 && k <= 90) return k + 32; // A-Z -> a-z
      if (k >= 112 && k <= 123) return k + 75; // F1-F12
      return k;
  }
}

/**
 * Boot DOOM onto a canvas. Input is scoped to the canvas (it must be focused),
 * so the game never hijacks the rest of the page. Resolves once the game loop
 * has started; call handle.stop() to fully tear it down.
 */
export async function startDoom(
  canvas: HTMLCanvasElement,
  onError?: (e: unknown) => void
): Promise<DoomHandle> {
  const ctx = canvas.getContext('2d');
  // 108 pages (~6.75MB) — the size the wasm build expects for imported memory.
  const memory = new WebAssembly.Memory({ initial: 108 });

  const drawScreen = (ptr: number) => {
    if (!ctx) return;
    // Fresh view every frame: DOOM may grow its memory and detach old buffers.
    const pixels = new Uint8ClampedArray(memory.buffer, ptr, DOOM_W * DOOM_H * 4);
    ctx.putImageData(new ImageData(pixels, DOOM_W, DOOM_H), 0, 0);
  };

  const imports: WebAssembly.Imports = {
    js: {
      js_console_log: () => {},
      js_stdout: () => {},
      js_stderr: () => {},
      js_draw_screen: drawScreen,
      js_milliseconds_since_start: () => performance.now(),
    },
    env: { memory },
  };

  // instantiateStreaming needs an application/wasm MIME type; fall back to a
  // buffered instantiate if the host doesn't send it.
  let instance: WebAssembly.Instance;
  try {
    ({ instance } = await WebAssembly.instantiateStreaming(fetch(WASM_URL), imports));
  } catch {
    const bytes = await (await fetch(WASM_URL)).arrayBuffer();
    ({ instance } = await WebAssembly.instantiate(bytes, imports));
  }

  const exports = instance.exports as unknown as DoomExports;

  const onKeyDown = (e: KeyboardEvent) => {
    exports.add_browser_event(0, mapDoomKeyCode(e.keyCode));
    e.preventDefault();
  };
  const onKeyUp = (e: KeyboardEvent) => {
    exports.add_browser_event(1, mapDoomKeyCode(e.keyCode));
    e.preventDefault();
  };
  canvas.addEventListener('keydown', onKeyDown);
  canvas.addEventListener('keyup', onKeyUp);

  exports.main();

  let stopped = false;
  let raf = 0;
  const step = () => {
    if (stopped) return;
    try {
      exports.doom_loop_step();
    } catch (e) {
      stopped = true;
      onError?.(e);
      return;
    }
    raf = requestAnimationFrame(step);
  };
  raf = requestAnimationFrame(step);

  return {
    stop() {
      stopped = true;
      cancelAnimationFrame(raf);
      canvas.removeEventListener('keydown', onKeyDown);
      canvas.removeEventListener('keyup', onKeyUp);
    },
  };
}
