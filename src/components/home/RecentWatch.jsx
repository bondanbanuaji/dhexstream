import React from 'react';
import { useFetch } from '../../hooks/useFetch';
import { Link } from 'react-router-dom';
import { History, ChevronRight, Play } from 'lucide-react';
import { useGsap } from '../../hooks/useGsap';

import RecentCard from '../anime/RecentCard';

const RecentWatch = () => {
    const { data: recentData, loading, error } = useFetch('get_recent');

    // For debugging, we remove the early return and show status
    // if (loading || error || !recentData?.data || recentData.data.length === 0) {
    //     return null;
    // }

    const recentList = recentData?.data || [];

    // If list is empty (and not loading), hide the component completely
    if (!loading && recentList.length === 0) {
        return null;
    }

    return (
        <div className="container mx-auto px-6 pt-8 pb-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                    <History className="text-blue-400" size={32} />
                    Continue Watching
                </h2>
                {/* Temporary Debug Info */}
                <Link
                    to="/history"
                    className="text-dhex-accent hover:text-dhex-accent-hover transition-colors flex items-center gap-2"
                >
                    View All
                    <ChevronRight size={18} />
                </Link>
            </div>

            {recentList.length > 0 ? (
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
            ) : (
                <div className="text-gray-500 text-center py-4">No watch history found.</div>
            )}
        </div>
    );
};

export default RecentWatch;
