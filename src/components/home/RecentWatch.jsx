import React from 'react';
import { useFetch } from '../../hooks/useFetch';
import { Link } from 'react-router-dom';
import { History, ChevronRight, Play } from 'lucide-react';
import { useGsap } from '../../hooks/useGsap';

const RecentCard = ({ anime }) => {
    const cardRef = React.useRef(null);
    const { gsap } = useGsap();

    const handleMouseEnter = () => {
        gsap.to(cardRef.current, { y: -5, scale: 1.02, duration: 0.3, ease: 'power2.out' });
        gsap.to(cardRef.current.querySelector('.play-btn'), { opacity: 1, scale: 1, duration: 0.3 });
    };

    const handleMouseLeave = () => {
        gsap.to(cardRef.current, { y: 0, scale: 1, duration: 0.3, ease: 'power2.out' });
        gsap.to(cardRef.current.querySelector('.play-btn'), { opacity: 0, scale: 0.8, duration: 0.3 });
    };

    return (
        <Link to={`/watch/${anime.href.replace(/^\/+/, '')}`} className="block">
            <div
                ref={cardRef}
                className="relative group rounded-xl overflow-hidden shadow-lg bg-dhex-bg-secondary w-full aspect-[16/9] cursor-pointer" // Correct aspect ratio for recent? User didn't specify, maybe wide card? Or just normal card. Let's stick to normal card ratio but maybe slightly different layout? User said "bar didalem card".
                // Actually sticking to standard card ratio 3/4 or maybe 16/9 if it's like a continue watching thumbnail.
                // Let's assume standard poster ratio for now, similar to AnimeCard but with extra info.
                // Actually, Recent Watch usually implies episodes. API returns animeId and poster.
                // Let's use 3/4 aspect ratio like AnimeCard.
                style={{ aspectRatio: '3/4' }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <img
                    src={anime.poster}
                    alt={anime.title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                    loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />

                <div className="play-btn absolute inset-0 flex items-center justify-center opacity-0 scale-75 transform text-white transition-all duration-300">
                    <div className="bg-dhex-accent/90 p-3 rounded-full backdrop-blur-sm shadow-xl hover:bg-dhex-accent">
                        <Play fill="currentColor" size={20} />
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-3">
                    {/* The "Bar" inside the card - Last Watch Indicator */}
                    <div className="mb-2">
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-dhex-accent/90 backdrop-blur-md rounded-md text-[10px] font-bold text-white uppercase tracking-wider shadow-lg">
                            <History size={10} />
                            Last Watch {anime.time !== 'baru saja' ? anime.time : ''}
                        </span>
                    </div>

                    <h3 className="text-white font-semibold truncate text-sm leading-tight drop-shadow-md">
                        {anime.title}
                    </h3>
                </div>
            </div>
        </Link>
    );
};

const RecentWatch = () => {
    const { data: recentData, loading, error } = useFetch('get_recent');

    if (loading || error || !recentData?.data || recentData.data.length === 0) {
        return null;
    }

    const recentList = recentData.data;

    return (
        <div className="container mx-auto px-6 pt-8 pb-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                    <History className="text-blue-400" size={32} />
                    Continue Watching
                </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 md:gap-6">
                {recentList.slice(0, 7).map((anime, idx) => (
                    <div
                        key={anime.animeId || idx}
                        className="animate-fade-in-up"
                        style={{ animationDelay: `${idx * 0.05}s` }}
                    >
                        <RecentCard anime={anime} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentWatch;
