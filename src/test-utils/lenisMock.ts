/* Jest replacement for `lenis` (mapped via moduleNameMapper) —
   real Lenis drives window scrolling, which jsdom can't do. */
export default class LenisMock {
  scrollTo() {}
  stop() {}
  start() {}
  destroy() {}
  on() {}
  raf() {}
}
