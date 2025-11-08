import { loadHtml } from '../../utils/load-html.ts';

export async function NotFound(): Promise<HTMLDivElement> {
    const html = await loadHtml('./src/pages/not-found/not-found.html');
    const container = document.createElement('div');
    container.innerHTML = html;
    return container;
}
