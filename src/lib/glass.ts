export function glassHighlight(node: HTMLElement) {
  if (!matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches) return;

  let frame = 0;
  function move(event: PointerEvent) {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const bounds = node.getBoundingClientRect();
      node.style.setProperty('--shine-x', `${((event.clientX - bounds.left) / bounds.width) * 100}%`);
    });
  }
  function reset() {
    cancelAnimationFrame(frame);
    node.style.removeProperty('--shine-x');
  }
  node.addEventListener('pointermove', move);
  node.addEventListener('pointerleave', reset);
  return {
    destroy() {
      reset();
      node.removeEventListener('pointermove', move);
      node.removeEventListener('pointerleave', reset);
    }
  };
}

export function glassEntrance(node: HTMLElement) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      node.classList.add('glass-entered');
      observer.disconnect();
    }
  }, { threshold: 0.25 });
  observer.observe(node);
  return { destroy: () => observer.disconnect() };
}
