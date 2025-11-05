import { loadHtml } from '../../utils/load-html.ts'
import { renderTemplate } from '../../utils/render-template.ts'

export async function Footer(): Promise<HTMLDivElement> {
  const html = await loadHtml('./src/components/footer/footer.html')
  const rendered = renderTemplate(html, { year: new Date().getFullYear() })
  const container = document.createElement('div')
  container.innerHTML = rendered
  return container
}
