// Adds `revealed` once an element scrolls into view, so CSS can run its entrance once.
export function reveal(node: HTMLElement) {
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    node.classList.add('revealed');
    observer.disconnect();
  }, { threshold: 0.2 });
  observer.observe(node);
  return { destroy: () => observer.disconnect() };
}
