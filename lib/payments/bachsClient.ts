type EventHandlers = {
  onCompleted?: (reference: string) => void;
  onFailed?: () => void;
  onClosed?: () => void;
  onError?: (message: string) => void;
};

let currentHandlers: EventHandlers = {};
let initialized = false;

export function initBachsOnce() {
  if (initialized || typeof window === "undefined" || !(window as any).Bachs)
    return;
  (window as any).Bachs.Initialize({
    onEvent: (event: any) => {
      switch (event.type) {
        case "checkout.completed":
          currentHandlers.onCompleted?.(event.data.reference);
          break;
        case "checkout.failed":
          currentHandlers.onFailed?.();
          break;
        case "checkout.closed":
          currentHandlers.onClosed?.();
          break;
        case "checkout.error":
          currentHandlers.onError?.(event.data.message);
          break;
      }
    },
  });
  initialized = true;
}

export function setActiveCheckoutHandlers(handlers: EventHandlers) {
  currentHandlers = handlers;
}
