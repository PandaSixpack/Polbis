import React, { useState, useEffect } from 'react';
import { Megaphone, Trophy, Calendar, BookOpen, Loader2 } from 'lucide-react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { formatDateForDisplay } from '../utils/dateUtils';

const Dashboard = () => {
  const [stats, setStats] = useState([
    { name: 'Announcements', value: '0', icon: Megaphone, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', path: '/announcements' },
    { name: 'Achievements', value: '0', icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20', path: '/achievements' },
    { name: 'Events', value: '0', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20', path: '/events' },
    { name: 'Programs', value: '0', icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20', path: '/programs' },
  ]);
  const [recentAnnouncements, setRecentAnnouncements] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [annRes, achRes, eveRes, proRes] = await Promise.all([
        api.get('/announcements', { params: { limit: 5 } }),
        api.get('/achievements', { params: { limit: 1 } }),
        api.get('/events', { params: { limit: 5 } }),
        api.get('/programs', { params: { limit: 1 } }),
      ]);

      setStats(prevStats => [
        { ...prevStats[0], value: (annRes.data.totalItems || 0).toString() },
        { ...prevStats[1], value: (achRes.data.totalItems || 0).toString() },
        { ...prevStats[2], value: (eveRes.data.totalItems || 0).toString() },
        { ...prevStats[3], value: (proRes.data.totalItems || 0).toString() },
      ]);

      setRecentAnnouncements(annRes.data.data.slice(0, 3));
      setUpcomingEvents(eveRes.data.data.slice(0, 3));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-primary-600" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Dashboard Overview</h1>
        <p className="text-slate-500 mt-2">Welcome to the Polbis University administration panel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link key={stat.name} to={stat.path} className="card p-6 flex items-center gap-5 hover:border-primary-500/50 transition-colors">
            <div className={`p-4 rounded-2xl ${stat.bg}`}>
              <stat.icon className={`${stat.color} w-6 h-6`} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.name}</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">{stat.value}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">Recent Announcements</h2>
            <Link to="/announcements" className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors">View All</Link>
          </div>
          <div className="space-y-4">
            {recentAnnouncements.length > 0 ? recentAnnouncements.map((item) => (
              <div key={item._id} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className={`w-2 h-10 rounded-full ${
                  item.priority === 'high' ? 'bg-red-500' : 
                  item.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">{item.title}</h3>
                  <p className="text-sm text-slate-500">{formatDateForDisplay(item.date)} • {item.priority.toUpperCase()} Priority</p>
                </div>
              </div>
            )) : (
              <p className="text-center text-slate-500 py-4">No recent announcements</p>
            )}
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">Upcoming Events</h2>
            <Link to="/events" className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors">View All</Link>
          </div>
          <div className="space-y-4">
            {upcomingEvents.length > 0 ? upcomingEvents.map((item) => (
              <div key={item._id} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex flex-col items-center justify-center text-purple-600 shrink-0">
                  <Calendar size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">{item.title}</h3>
                  <p className="text-sm text-slate-500">{formatDateForDisplay(item.date)} • {item.category}</p>
                </div>
              </div>
            )) : (
              <p className="text-center text-slate-500 py-4">No upcoming events</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
