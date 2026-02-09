import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { History, Play } from 'lucide-react';
import { useGsap } from '../../hooks/useGsap';

const RecentCard = ({ anime }) => {
    const cardRef = useRef(null);
    const ctxRef = useRef(null);
    const { gsap } = useGsap();

    const handleMouseEnter = () => {
        if (!cardRef.current) return;

        // Kill any existing animation context first
        if (ctxRef.current) ctxRef.current.revert();

        ctxRef.current = gsap.context(() => {
            const card = cardRef.current;
            const playBtn = card?.querySelector('.play-btn');

            if (card) {
                gsap.to(card, { y: -5, scale: 1.02, duration: 0.3, ease: 'power2.out' });
            }
            if (playBtn) {
                gsap.to(playBtn, { opacity: 1, scale: 1, duration: 0.3 });
            }
        }, cardRef);
    };

    const handleMouseLeave = () => {
        if (!cardRef.current) return;

        if (ctxRef.current) ctxRef.current.revert();

        ctxRef.current = gsap.context(() => {
            const card = cardRef.current;
            const playBtn = card?.querySelector('.play-btn');

            if (card) {
                gsap.to(card, { y: 0, scale: 1, duration: 0.3, ease: 'power2.out' });
            }
            if (playBtn) {
                gsap.to(playBtn, { opacity: 0, scale: 0.8, duration: 0.3 });
            }
        }, cardRef);
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (ctxRef.current) {
                ctxRef.current.revert();
            }
        };
    }, []);

    return (
        <Link to={`/watch/${anime.href.replace(/^\/+/, '')}`} className="block">
            <div
                ref={cardRef}
                className="relative group rounded-xl overflow-hidden shadow-lg bg-dhex-bg-secondary w-full aspect-[3/4] cursor-pointer"
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

export default RecentCard;
