// Purpose: Centralizes smooth section navigation and temporary visual highlighting.
const HIGHLIGHT_CLASS_NAME = "is-section-highlighted";
const HIGHLIGHT_DURATION_MS = 2200;
const highlightTimeouts = new WeakMap();

// Restarts the temporary highlight animation on one existing element.
export const highlightElement = (target, { center = true } = {}) => {
  window.clearTimeout(highlightTimeouts.get(target));
  target.classList.remove(HIGHLIGHT_CLASS_NAME);
  window.requestAnimationFrame(() => {
    target.classList.add(HIGHLIGHT_CLASS_NAME);
  });

  const timeoutId = window.setTimeout(() => {
    target.classList.remove(HIGHLIGHT_CLASS_NAME);
  }, HIGHLIGHT_DURATION_MS);

  highlightTimeouts.set(target, timeoutId);

  if (center) {
    target.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }
};

// Centers a dashboard section and restarts its temporary highlight animation.
export const centerAndHighlightSection = (sectionId, { updateHistory = true } = {}) => {
  const target = document.getElementById(sectionId);

  if (!target) {
    return;
  }

  if (updateHistory) {
    window.history.pushState(null, "", `#${sectionId}`);
  }

  highlightElement(target);
};
