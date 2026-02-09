import React, { useState, useRef, useEffect, useCallback } from 'react';
import HeroSlide from './HeroSlide';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import gsap from 'gsap';

const HeroSlider = ({ slides }) => {
    // Clones for infinite loop: [last, ...slides, first]
    const displaySlides = [slides[slides.length - 1], ...slides, slides[0]];
    const [currentIndex, setCurrentIndex] = useState(1); // Start at the first "real" slide
    const [dragOffset, setDragOffset] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(true);

    const startX = useRef(0);
    const sliderRef = useRef(null);
    const autoSlideInterval = useRef(null);

    const startAutoSlide = useCallback(() => {
        stopAutoSlide();
        autoSlideInterval.current = setInterval(() => {
            handleNext();
        }, 5000);
    }, [slides.length]);

    const stopAutoSlide = useCallback(() => {
        if (autoSlideInterval.current) {
            clearInterval(autoSlideInterval.current);
        }
    }, []);

    useEffect(() => {
        startAutoSlide();
        return () => stopAutoSlide();
    }, [startAutoSlide, stopAutoSlide]);

    // Handle the snap back for infinite loop
    useEffect(() => {
        if (!isTransitioning) {
            // Wait a tiny bit for the "none" transition to take effect
            const timer = setTimeout(() => setIsTransitioning(true), 10);
            return () => clearTimeout(timer);
        }

        if (currentIndex === 0) {
            // Jump from clone of last to real last
            const timer = setTimeout(() => {
                setIsTransitioning(false);
                setCurrentIndex(displaySlides.length - 2);
            }, 500); // Wait for transition animation (0.5s) to finish
            return () => clearTimeout(timer);
        } else if (currentIndex === displaySlides.length - 1) {
            // Jump from clone of first to real first
            const timer = setTimeout(() => {
                setIsTransitioning(false);
                setCurrentIndex(1);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [currentIndex, displaySlides.length, isTransitioning]);

    const handleStart = (e) => {
        if (!isTransitioning) return;
        stopAutoSlide();
        setIsDragging(true);
        startX.current = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    };

    const handleMove = useCallback((e) => {
        if (!isDragging) return;
        const currentX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const diff = currentX - startX.current;
        setDragOffset(diff);
    }, [isDragging]);

    const handleEnd = useCallback(() => {
        if (!isDragging) return;
        setIsDragging(false);
        const threshold = 100;

        if (dragOffset < -threshold) {
            setCurrentIndex(prev => prev + 1);
        } else if (dragOffset > threshold) {
            setCurrentIndex(prev => prev - 1);
        }

        setDragOffset(0);
        startAutoSlide();
    }, [dragOffset, isDragging, startAutoSlide]);

    const handlePrev = () => {
        if (!isTransitioning) return;
        stopAutoSlide();
        setCurrentIndex(prev => prev - 1);
        startAutoSlide();
    };

    const handleNext = () => {
        if (!isTransitioning) return;
        stopAutoSlide();
        setCurrentIndex(prev => prev + 1);
        startAutoSlide();
    };

    useEffect(() => {
        const handleMouseMoveWindow = (e) => handleMove(e);
        const handleMouseUpWindow = () => handleEnd();
        const handleTouchMoveWindow = (e) => handleMove(e);
        const handleTouchEndWindow = () => handleEnd();

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMoveWindow);
            window.addEventListener('mouseup', handleMouseUpWindow);
            window.addEventListener('touchmove', handleTouchMoveWindow, { passive: false });
            window.addEventListener('touchend', handleTouchEndWindow);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMoveWindow);
            window.removeEventListener('mouseup', handleMouseUpWindow);
            window.removeEventListener('touchmove', handleTouchMoveWindow);
            window.removeEventListener('touchend', handleTouchEndWindow);
        };
    }, [isDragging, handleMove, handleEnd]);

    const translateX = -(currentIndex * 100) + (dragOffset / (sliderRef.current?.clientWidth || 1)) * 100;

    // Map current index back to real slide index for bullets
    let activeBulletIndex = currentIndex - 1;
    if (currentIndex === 0) activeBulletIndex = slides.length - 1;
    if (currentIndex === displaySlides.length - 1) activeBulletIndex = 0;

    return (
        <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden group">
            {/* Slider Container */}
            <div
                ref={sliderRef}
                className="flex h-full w-full"
                style={{
                    transform: `translateX(${translateX}%)`,
                    transition: (isDragging || !isTransitioning) ? 'none' : 'transform 0.5s cubic-bezier(0.2, 0, 0.2, 1)',
                }}
                onMouseDown={handleStart}
                onTouchStart={handleStart}
            >
                {displaySlides.map((anime, index) => (
                    <div key={`${anime.animeId}-${index}`} className="w-full h-full flex-shrink-0">
                        <HeroSlide
                            anime={anime}
                            currentSlide={index === 0 ? slides.length - 1 : index === displaySlides.length - 1 ? 0 : index - 1}
                            totalSlides={slides.length}
                            active={index === currentIndex}
                        />
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 hidden md:flex"
            >
                <ChevronLeft size={24} />
            </button>
            <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 hidden md:flex"
            >
                <ChevronRight size={24} />
            </button>

            {/* Pagination Dots */}
            <div className="absolute z-20 flex gap-3 transition-all 
                right-4 sm:right-6 top-1/2 -translate-y-1/2 flex-col
                p-3 sm:p-4 lg:p-2 lg:right-auto lg:top-auto lg:translate-y-0
                lg:bottom-8 lg:left-1/2 lg:-translate-x-1/2 lg:flex-row
                rounded-2xl lg:rounded-full bg-black/10 backdrop-blur-sm border border-white/5"
            >
                {slides.map((_, index) => {
                    const isActive = index === activeBulletIndex;
                    return (
                        <button
                            key={index}
                            onClick={() => { stopAutoSlide(); setCurrentIndex(index + 1); startAutoSlide(); }}
                            className={`relative rounded-full transition-all duration-300 overflow-hidden 
                                ${isActive
                                    ? 'bg-white/10 h-8 w-2 lg:h-2 lg:w-10'
                                    : 'h-2 w-2 bg-white/30 hover:bg-white/50'
                                }`}
                        >
                            {/* Progress Indicator */}
                            {isActive && (
                                <span
                                    className="absolute inset-0 bg-dhex-accent"
                                    style={{
                                        animation: `progress-slide 5s linear forwards`,
                                        transformOrigin: 'top left',
                                        display: 'block'
                                    }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media (max-width: 1023px) {
                    @keyframes progress-slide {
                        from { transform: scaleY(0); }
                        to { transform: scaleY(1); }
                    }
                }
                @media (min-width: 1024px) {
                    @keyframes progress-slide {
                        from { transform: scaleX(0); }
                        to { transform: scaleX(1); }
                    }
                }
            `}} />
        </div>
    );
};

export default HeroSlider;
