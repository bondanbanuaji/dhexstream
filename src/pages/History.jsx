import React from 'react';
import { useFetch } from '../hooks/useFetch';
import RecentCard from '../components/anime/RecentCard';
import { History as HistoryIcon, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const History = () => {
    // API endpoint 'get_recent' returns { ... data: [ ...items ] }
    const { data: recentData, loading, error } = useFetch('get_recent');

    const historyList = recentData?.data || [];
    const itemCount = historyList.length;

    if (loading) {
        return (
            <div className="min-h-screen pt-20 flex flex-col items-center justify-center">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-dhex-accent/20 rounded-full"></div>
                    <div className="w-16 h-16 border-4 border-dhex-accent border-t-transparent rounded-full animate-spin absolute top-0"></div>
                </div>
                <p className="text-dhex-accent mt-4 font-semibold">Loading history...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen pt-20 flex flex-col items-center justify-center">
                <div className="text-center bg-red-500/10 border border-red-500/30 rounded-2xl p-8 max-w-md">
                    <p className="text-red-500 text-xl mb-2 font-bold">⚠️ Error Loading History</p>
                    <p className="text-gray-400 text-sm">{error.message || 'Please try again later'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-10 min-h-screen">
            {/* Header */}
            <div className="text-center mb-10">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3">
                    <HistoryIcon className="text-dhex-accent" size={40} />
                    Watch History
                </h1>
            </div>

            {/* Back to Home Link (Optional but helpful) */}
            <div className="mb-8">
                <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft size={18} />
                    <span>Back to Home</span>
                </Link>
            </div>

            {/* History Grid */}
            {historyList.length === 0 ? (
                <div className="text-center py-20">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-12 max-w-md mx-auto">
                        <HistoryIcon className="text-gray-600 mx-auto mb-4" size={48} />
                        <p className="text-gray-400 text-xl mb-2">📭 No watch history found</p>
                        <p className="text-gray-500 text-sm">Start watching anime to see them here!</p>
                        <Link to="/" className="inline-block mt-6 px-6 py-2 bg-dhex-accent hover:bg-dhex-accent-hover text-white rounded-lg transition-colors">
                            Browse Anime
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 md:gap-6">
                    {historyList.map((anime, idx) => (
                        <div
                            key={anime.animeId || idx}
                            className="animate-fade-in-up"
                            style={{ animationDelay: `${idx * 0.05}s` }}
                        >
                            <RecentCard anime={anime} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default History;
