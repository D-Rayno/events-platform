import ReactDOMServer from 'react-dom/server'
import { createInertiaApp } from '@inertiajs/react'
import '../css/app.css'

export default function render(page: any) {
  return createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    resolve: (name) => {
      const pages = import.meta.glob('../pages/**/*.tsx', { eager: true })
      console.log(pages)
      const component = pages[`../pages/${name}.tsx`]

      if (!component) {
        console.error(`Page not found: ${name}`)
        throw new Error(`Page component not found: ${name}`)
      }

      return component
    },
    setup: ({ App, props }) => <App {...props} />,
  })
}
