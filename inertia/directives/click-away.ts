// inertia/directives/click-away.ts
import type { DirectiveBinding } from 'vue'

interface ClickAwayElement extends HTMLElement {
  __clickAwayHandler?: (event: MouseEvent) => void
}

export const clickAwayDirective = {
  mounted(el: ClickAwayElement, binding: DirectiveBinding) {
    const handler = (event: MouseEvent) => {
      if (!el.contains(event.target as Node) && el !== event.target) {
        binding.value(event)
      }
    }

    el.__clickAwayHandler = handler
    document.addEventListener('click', handler, true)
  },

  unmounted(el: ClickAwayElement) {
    if (el.__clickAwayHandler) {
      document.removeEventListener('click', el.__clickAwayHandler, true)
      delete el.__clickAwayHandler
    }
  },
}