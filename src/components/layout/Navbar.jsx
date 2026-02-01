import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    Menu, X, Search, User, MessageCircle,
    Dice5, Users, Info, Settings, ChevronLeft, ChevronRight,
    Home, Zap, CheckCircle, Tags, Play
} from 'lucide-react';

const Navbar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const searchRef = useRef(null);
    const sidebarRef = useRef(null);

    const genres = [
        "Action", "Adventure", "Comedy", "Drama", "Fantasy",
        "Horror", "Mystery", "Psychological", "Romance",
        "Sci-Fi", "Slice of Life", "Sports", "Supernatural", "Thriller"
    ];

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isSidebarOpen) {
            document.body.style.overflow = 'hidden';
            if (window.lenis) window.lenis.stop();
        } else {
            document.body.style.overflow = '';
            if (window.lenis) window.lenis.start();
        }

        return () => {
            document.body.style.overflow = '';
            if (window.lenis) window.lenis.start();
        };
    }, [isSidebarOpen]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?keyword=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
        }
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
        if (isSearchOpen) setIsSearchOpen(false);
    };

    return (
        <>
            {/* --- TOP NAVBAR --- */}
            <header
                className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${isScrolled
                    ? 'h-16 bg-black/20 backdrop-blur-3xl shadow-lg'
                    : 'h-20 bg-transparent'
                    }`}
            >
                <div className="container mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-4">

                    {/* Left: Burger & Logo */}
                    <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
                        <button
                            onClick={toggleSidebar}
                            className="p-2 text-white/80 hover:text-dhex-accent transition-colors active:scale-90"
                        >
                            <Menu size={26} />
                        </button>

                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 rounded-lg bg-dhex-accent flex items-center justify-center text-white font-black group-hover:scale-110 transition-transform">
                                D
                            </div>
                            <span className="hidden xs:block text-2xl font-black tracking-tighter text-white">
                                DHEX<span className="text-dhex-accent">Stream</span>
                            </span>
                        </Link>
                    </div>

                    {/* Middle: Integrated Search Box (Desktop) */}
                    <div className="hidden lg:flex items-center flex-grow max-w-xl group">
                        <form onSubmit={handleSearch} className="w-full relative">
                            <div className="relative flex items-center">
                                <Link
                                    to="/filter"
                                    className="absolute left-4 text-xs font-bold text-gray-400 hover:text-dhex-accent transition-colors border-r border-black/10 pr-3 h-4 flex items-center"
                                >
                                    Filter
                                </Link>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search anime..."
                                    className="w-full h-11 bg-black/20 hover:bg-black/30 focus:bg-black/30 border border-black/10 focus:border-dhex-accent/50 rounded-lg pl-20 pr-12 text-sm text-gray-200 transition-all outline-none"
                                />
                                <button type="submit" className="absolute right-3 p-1.5 text-gray-400 hover:text-white transition-colors">
                                    <Search size={18} />
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-1 sm:gap-3">
                        {/* Interactive Toggles (Hidden on mobile) */}
                        <div className="hidden xl:flex items-center gap-1 mr-4">
                            <button className="p-2 text-gray-400 hover:text-dhex-accent transition-colors flex flex-col items-center gap-0.5 group">
                                <Users size={18} className="group-hover:-translate-y-0.5 transition-transform" />
                                <span className="text-[10px] font-bold">Watch2gether</span>
                            </button>
                            <button className="p-2 text-gray-400 hover:text-dhex-accent transition-colors flex flex-col items-center gap-0.5 group">
                                <Dice5 size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                                <span className="text-[10px] font-bold">Random</span>
                            </button>
                            <button className="p-2 text-gray-400 hover:text-dhex-accent transition-colors flex flex-col items-center gap-0.5 group">
                                <MessageCircle size={18} className="group-hover:scale-110 transition-transform" />
                                <span className="text-[10px] font-bold">Community</span>
                            </button>
                        </div>

                        {/* Mobile Search Trigger */}
                        <button
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className="lg:hidden p-2 text-gray-300 hover:text-dhex-accent"
                        >
                            <Search size={22} />
                        </button>

                        {/* Login Button */}
                        <button className="ml-2 px-6 h-10 bg-dhex-accent hover:bg-dhex-accent-hover text-white text-sm font-bold rounded-lg transition-all active:scale-95 shadow-lg shadow-dhex-accent/20">
                            Log In
                        </button>
                    </div>
                </div>

                {/* Mobile Search Dropdown */}
                <div className={`lg:hidden absolute top-full left-0 w-full bg-dhex-bg-secondary/95 backdrop-blur-sm border-b border-black/5 transition-all duration-300 transform ${isSearchOpen ? 'translate-y-0 opacity-100 visible' : '-translate-y-4 opacity-0 invisible'
                    }`}>
                    <form onSubmit={handleSearch} className="container mx-auto p-4 flex items-center gap-2">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Enter keywords..."
                            className="flex-grow h-12 bg-black/20 border border-black/10 rounded-lg px-4 text-white focus:outline-none focus:border-dhex-accent/50"
                        />
                        <button type="submit" className="w-12 h-12 bg-dhex-accent rounded-lg flex items-center justify-center text-white">
                            <Search size={20} />
                        </button>
                    </form>
                </div>
            </header>

            {/* --- SIDEBAR MENU --- */}
            <div
                className={`fixed inset-0 z-[110] bg-transparent backdrop-blur-lg transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
                    }`}
                onClick={() => setIsSidebarOpen(false)}
                style={{ touchAction: 'none' }}
            />

            {/* Sidebar Content */}
            <aside
                ref={sidebarRef}
                data-lenis-prevent
                className={`fixed top-0 left-0 h-screen w-[280px] sm:w-[320px] bg-dhex-bg-secondary/60 backdrop-blur-md z-[120] transition-transform duration-500 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } border-r border-black/5 shadow-2xl overflow-y-auto scrollbar-hide`}
            >
                <div className="p-6 min-h-full">
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="mb-8 flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md rounded-xl text-gray-400 hover:text-white font-bold transition-all shadow-xl shadow-black/20 border border-white/5 active:scale-95 group"
                    >
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
                        Close Menu
                    </button>

                    {/* Main Nav Links */}
                    <nav className="space-y-1 mb-8">
                        <NavLink icon={<Home size={20} />} label="Beranda" to="/" active={location.pathname === '/'} onClick={() => setIsSidebarOpen(false)} />
                        <NavLink icon={<Zap size={20} />} label="On Going" to="/watch/ongoing" active={location.pathname === '/watch/ongoing'} onClick={() => setIsSidebarOpen(false)} />
                        <NavLink icon={<CheckCircle size={20} />} label="Completed" to="/watch/completed" active={location.pathname === '/watch/completed'} onClick={() => setIsSidebarOpen(false)} />
                        <NavLink icon={<Settings size={20} />} label="Jadwal" to="/schedule" active={location.pathname === '/schedule'} onClick={() => setIsSidebarOpen(false)} />
                        <NavLink icon={<Info size={20} />} label="Genre" to="/genre" active={location.pathname.startsWith('/genre')} onClick={() => setIsSidebarOpen(false)} />
                    </nav>

                    {/* Genre List Section */}
                    <div className="border-t border-black/5 pt-6 mt-6">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                            {genres.map((genre, index) => {
                                const genreColors = [
                                    'text-rose-400', 'text-amber-400', 'text-emerald-400', 'text-sky-400',
                                    'text-indigo-400', 'text-purple-400', 'text-pink-400', 'text-cyan-400',
                                    'text-lime-400', 'text-orange-400', 'text-teal-400', 'text-violet-400',
                                    'text-fuchsia-400', 'text-blue-400'
                                ];
                                const colorClass = genreColors[index % genreColors.length];

                                return (
                                    <Link
                                        key={genre}
                                        to={`/genre/${genre.toLowerCase().replace(/ /g, '-')}`}
                                        onClick={() => setIsSidebarOpen(false)}
                                        className={`text-[13px] ${colorClass} hover:brightness-125 hover:pl-2 transition-all py-1.5 flex items-center justify-between group font-medium`}
                                    >
                                        {genre}
                                        <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

// Helper Components
const NavLink = ({ icon, label, to, active, onClick }) => (
    <Link
        to={to}
        onClick={onClick}
        className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group border-b border-white/10 ${active
            ? 'bg-dhex-accent text-white shadow-lg shadow-dhex-accent/20'
            : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
    >
        <span className={`${active ? '' : 'group-hover:scale-110 transition-transform'}`}>
            {icon}
        </span>
        <span className="font-bold text-sm tracking-wide">{label}</span>
        {!active && (
            <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        )}
    </Link>
);


export default Navbar;