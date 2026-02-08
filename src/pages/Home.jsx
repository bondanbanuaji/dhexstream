import React from 'react';
import { useFetch } from '../hooks/useFetch';
import { Link } from 'react-router-dom';
import { Zap, CheckCircle, ChevronRight } from 'lucide-react';
import AnimeCard from '../components/anime/AnimeCard';
import HeroSlider from '../components/home/HeroSlider';
import RecentWatch from '../components/home/RecentWatch';

const Home = () => {
    const { data: homeData, loading, error } = useFetch('home');

    // Extract data based on actual API structure
    const ongoingAnimes = homeData?.data?.ongoing?.animeList || [];
    const completedAnimes = homeData?.data?.completed?.animeList || [];

    // Use ongoing anime for spotlight/hero slider (first 6)
    const spotlightAnimes = ongoingAnimes.slice(0, 6);

    if (loading) {
        return (
            <div className="min-h-screen pt-20 flex justify-center items-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-dhex-accent mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen pt-20 flex justify-center items-center">
                <div className="text-center text-red-500">
                    <p>Error loading homepage</p>
                </div>
            </div>
        );
    }

    return (
        <div className="pb-20">
            {/* Hero Spotlight Slider */}
            {spotlightAnimes.length > 0 && (
                <HeroSlider slides={spotlightAnimes} />
            )}

            {/* Recent Watch Section */}
            <RecentWatch />

            {/* Ongoing Anime Section */}
            <div className="container mx-auto px-6 py-16">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                        <Zap className="text-dhex-accent" size={32} />
                        On Going Anime
                    </h2>
                    <Link
                        to="/watch/ongoing"
                        className="text-dhex-accent hover:text-dhex-accent-hover transition-colors flex items-center gap-2"
                    >
                        View All
                        <ChevronRight size={18} />
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 md:gap-6">
                    {ongoingAnimes.slice(0, 12).map((anime, idx) => (
                        <div
                            key={anime.animeId || idx}
                            className="animate-fade-in-up"
                            style={{ animationDelay: `${idx * 0.05}s` }}
                        >
                            <AnimeCard anime={anime} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Completed Anime Section */}
            <div className="container mx-auto px-6 py-8">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                        <CheckCircle className="text-green-500" size={32} />
                        Completed Anime
                    </h2>
                    <Link
                        to="/watch/completed"
                        className="text-dhex-accent hover:text-dhex-accent-hover transition-colors flex items-center gap-2"
                    >
                        View All
                        <ChevronRight size={18} />
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 md:gap-6">
                    {completedAnimes.slice(0, 12).map((anime, idx) => (
                        <div
                            key={anime.animeId || idx}
                            className="animate-fade-in-up"
                            style={{ animationDelay: `${idx * 0.05}s` }}
                        >
                            <AnimeCard anime={anime} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
