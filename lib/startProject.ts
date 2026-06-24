// Tiny global opener for the "Start a project" modal. Any CTA anywhere can
// call openStartProject() instead of navigating to /start; the single
// <StartProjectModal/> mounted in the site layout listens for the event.

export const START_PROJECT_EVENT = "evora:start-project";

export function openStartProject() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(START_PROJECT_EVENT));
  }
}
