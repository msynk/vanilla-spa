import { loadHtml } from '../../utils/load-html.js';

export async function Navbar(): Promise<HTMLDivElement> {
    const html = await loadHtml('./src/components/navbar/navbar.html');
    const container = document.createElement('div');
    container.innerHTML = html;

    container.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.matches('[data-link]')) {
            e.preventDefault();
            const url = (target as HTMLAnchorElement).href;
            history.pushState(null, '', url);
            window.dispatchEvent(new Event('popstate'));
        }
    });

    return container;
}
