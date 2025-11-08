import { loadHtml } from '../../utils/load-html.ts';
import { renderTemplate } from '../../utils/render-template.ts';

export async function About(): Promise<HTMLDivElement> {
    const html = await loadHtml('./src/pages/about/about.html');
    const rendered = renderTemplate(html, { title: 'About Us' });
    const container = document.createElement('div');
    container.innerHTML = rendered;
    return container;
}
