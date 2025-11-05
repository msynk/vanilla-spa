import { loadHtml } from '../../utils/load-html.ts'
import { renderTemplate } from '../../utils/render-template.ts'

export async function Home(): Promise<HTMLDivElement> {
    const html = await loadHtml('./src/pages/home/home.html')
    const rendered = renderTemplate(html, { title: 'Home Page' })
    const container = document.createElement('div')
    container.innerHTML = rendered
    return container
}
