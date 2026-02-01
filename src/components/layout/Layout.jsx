import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useLenis } from '../../hooks/useLenis';

const Layout = () => {
    useLenis(); // Initialize smooth scroll
    const location = useLocation();
    const isHome = location.pathname === '/';

    return (
        <div className="flex flex-col min-h-screen bg-dhex-bg text-dhex-text font-sans">
            <Navbar />
            <main className={`flex-grow ${isHome ? '' : 'pt-20'}`}>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
