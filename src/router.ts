import { Home } from './pages/home/home.ts';
import { About } from './pages/about/about.ts';
import { NotFound } from './pages/not-found/not-found.ts';

const routes: Record<string, () => Promise<HTMLDivElement>> = {
    '/': Home,
    '/about': About
};

export async function router(): Promise<void> {
    const path = window.location.pathname;
    const Page = routes[path] || NotFound;
    const app = document.getElementById('app') as HTMLElement;
    app.innerHTML = 'Loading...';

    try {
        const view = await Page();
        app.innerHTML = '';
        app.append(view);
    } catch (err) {
        console.error(err);
        app.innerHTML = '<h2>Error loading page</h2>';
    }
}

window.addEventListener('popstate', router);
