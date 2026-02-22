import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface PresenceHeatmapProps {
    publishedDates: Date[];
}

export default function PresenceHeatmap({ publishedDates }: PresenceHeatmapProps) {
    const days = 28; // 4 weeks
    const today = new Date();

    const activityData = useMemo(() => {
        const data = [];
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(today.getDate() - i);
            const dateString = date.toDateString();

            const count = publishedDates.filter(d => new Date(d).toDateString() === dateString).length;
            data.push({
                date,
                count,
                level: count === 0 ? 0 : count === 1 ? 1 : count === 2 ? 2 : 3
            });
        }
        return data;
    }, [publishedDates]);

    return (
        <div className="bg-gradient-to-br from-white/80 to-teal-50 backdrop-blur-3xl border border-teal-200 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h4 className="text-[10px] font-black text-teal-500 uppercase tracking-[0.3em] mb-1">Social Velocity</h4>
                    <p className="text-xl font-black text-teal-900 tracking-tight uppercase">Presence Heatmap</p>
                </div>
                <div className="flex items-center gap-2">
                    {[0, 1, 2, 3].map((level) => (
                        <div
                            key={level}
                            className={`h-2 w-2 rounded-full ${level === 0 ? 'bg-gray-200' :
                                level === 1 ? 'bg-orange-300' :
                                    level === 2 ? 'bg-orange-500' : 'bg-orange-600 shadow-[0_0_10px_rgba(249,115,22,0.5)]'
                                }`}
                        />
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-7 gap-3">
                {activityData.map((day, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.01 }}
                        className="group relative"
                    >
                        <div
                            className={`aspect-square rounded-lg transition-all duration-500 ${day.level === 0 ? 'bg-gray-100 hover:bg-gray-200' :
                                day.level === 1 ? 'bg-orange-300' :
                                    day.level === 2 ? 'bg-orange-500' : 'bg-orange-600 shadow-[0_0_15px_rgba(249,115,22,0.4)]'
                                }`}
                        />
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-white border border-teal-200 rounded-md text-[8px] font-bold text-teal-900 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                            {day.date.toLocaleDateString([], { month: 'short', day: 'numeric' })}: {day.count} POSTS
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-6 pt-6 border-t border-teal-200 flex items-center justify-between text-[8px] font-black text-teal-500 uppercase tracking-widest">
                <span>{activityData[0].date.toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                <span>{activityData[activityData.length - 1].date.toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
            </div>
        </div>
    );
}
