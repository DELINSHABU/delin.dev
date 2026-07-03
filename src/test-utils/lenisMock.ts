/* Jest replacement for `lenis` (mapped via moduleNameMapper) —
   real Lenis drives window scrolling, which jsdom can't do. */
export default class LenisMock {
  scroll = 0;
  scrollTo() {}
  stop() {}
  start() {}
  destroy() {}
  on() {}
  off() {}
  raf() {}
}
