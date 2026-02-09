import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Info, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import gsap from 'gsap';
import { useAniListImage } from '../../hooks/useAniListImage';

const HeroSlide = ({ anime, currentSlide, totalSlides, active }) => {
    const heroContentRef = useRef(null);
    const { image: highResImage, loading: imageLoading } = useAniListImage(anime.title);

    const bgImage = highResImage || anime.poster;

    useEffect(() => {
        if (heroContentRef.current && active) {
            const ctx = gsap.context(() => {
                // Scope selector to only elements inside this specific slide's heroContentRef
                const animateElements = heroContentRef.current.querySelectorAll('.animate-hero');

                if (animateElements.length > 0) {
                    const tl = gsap.timeline();
                    tl.fromTo(animateElements,
                        { opacity: 0, x: -30 },
                        { opacity: 1, x: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
                    );
                }
            }, heroContentRef);

            return () => ctx.revert();
        }
    }, [anime.animeId, active]);

    return (
        <div className="relative w-full h-full overflow-hidden select-none">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: `url(${bgImage})`,
                    backgroundPosition: highResImage ? 'center center' : 'center 20%',
                    filter: highResImage ? 'brightness(1)' : 'brightness(0.5) blur(3px)',
                    transform: highResImage ? 'scale(1.0)' : 'scale(1.1)'
                }}
            />

            {/* Gradient Overlay: Dark Gray on left, fading to transparent on right */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900 via-transparent to-transparent" style={{ backgroundSize: '150% 100%', backgroundPosition: 'left' }} />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-dhex-bg via-transparent to-transparent" />

            {/* Content */}
            <div className="container mx-auto px-4 sm:px-6 h-full relative z-10" ref={heroContentRef}>
                <div className="h-full flex flex-col justify-end pb-12 sm:pb-16 md:pb-20 lg:pb-24 max-w-[90%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[60%]">
                    <div className="animate-hero text-dhex-accent text-[10px] sm:text-xs md:text-sm font-semibold mb-1 sm:mb-2 uppercase tracking-wide">
                        #{currentSlide + 1} Spotlight
                    </div>
                    <h1 className="animate-hero text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-2 sm:mb-4 leading-tight line-clamp-2">
                        {anime.title}
                    </h1>

                    {/* Meta Info */}
                    <div className="animate-hero flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm md:text-base text-gray-300 mb-4 sm:mb-6">
                        <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-dhex-accent rounded text-white font-semibold text-[10px] sm:text-xs">HD</span>
                        <span className="flex items-center gap-1">
                            <Play size={14} className="w-3 h-3 sm:w-4 sm:h-4" />
                            {anime.type || 'TV'}
                        </span>
                        <span className="flex items-center gap-1">
                            <Zap size={14} className="text-yellow-500 w-3 h-3 sm:w-4 sm:h-4" />
                            {new Date().toLocaleDateString('id-ID', { weekday: 'long' })}
                        </span>
                        {anime.latestReleaseDate && (
                            <span className="hidden xs:inline">{anime.latestReleaseDate}</span>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="animate-hero flex gap-3 sm:gap-4">
                        <Link
                            to={`/anime/${anime.animeId}`}
                            className="px-4 py-2 sm:px-6 sm:py-3 bg-dhex-accent hover:bg-dhex-accent-hover text-white rounded-full font-semibold flex items-center gap-2 transition-transform hover:scale-105 text-xs sm:text-sm md:text-base"
                        >
                            <Play size={16} className="w-4 h-4 sm:w-5 sm:h-5" />
                            Mulai Menonton
                        </Link>
                        <Link
                            to={`/anime/${anime.animeId}`}
                            className="px-4 py-2 sm:px-6 sm:py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full font-semibold flex items-center gap-2 transition-transform hover:scale-105 text-xs sm:text-sm md:text-base"
                        >
                            <Info size={16} className="w-4 h-4 sm:w-5 sm:h-5" />
                            Detail
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSlide;
