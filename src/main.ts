import { router } from './router.ts';
import { Navbar } from './components/navbar/navbar.ts';
import { Footer } from './components/footer/footer.ts';

async function init(): Promise<void> {
    document.getElementById('navbar')?.append(await Navbar());
    document.getElementById('footer')?.append(await Footer());
    router();
}

init();
