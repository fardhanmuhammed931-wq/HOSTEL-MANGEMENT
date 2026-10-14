import React, { useState } from 'react';
import {
  Bell,
  Plus,
  Send,
  Calendar,
  Sparkles,
  Megaphone,
  AlertTriangle,
  Utensils,
  BookOpen,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface Notice {
  id: number;
  title: string;
  description: string;
  date: string;
  category: 'maintenance' | 'mess' | 'exam' | 'guideline';
  author: string;
}

export const NoticesPage: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [notices, setNotices] = useState<Notice[]>([
    {
      id: 1,
      title: 'Hostel Maintenance Schedule',
      description: 'Water supply will be interrupted on 28th April from 10 AM to 2 PM.',
      date: 'Apr 24, 2025',
      category: 'maintenance',
      author: 'Hostel Warden Office',
    },
    {
      id: 2,
      title: 'Mess Menu Update',
      description: 'New mess menu is available from 22nd April 2025.',
      date: 'Apr 21, 2025',
      category: 'mess',
      author: 'Mess Committee',
    },
    {
      id: 3,
      title: 'Exam Hall Notice',
      description: 'All students are informed about the upcoming internal exams.',
      date: 'Apr 18, 2025',
      category: 'exam',
      author: 'Academic Dean',
    },
    {
      id: 4,
      title: 'General Guidelines',
      description: 'Keep your rooms clean and maintain hostel rules.',
      date: 'Apr 15, 2025',
      category: 'guideline',
      author: 'Chief Proctor',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState<'maintenance' | 'mess' | 'exam' | 'guideline'>('maintenance');

  const handlePostNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;

    const notice: Notice = {
      id: Date.now(),
      title: newTitle,
      description: newDescription,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      category: newCategory,
      author: user?.full_name || 'Hostel Admin',
    };

    setNotices([notice, ...notices]);
    setNewTitle('');
    setNewDescription('');
    setIsModalOpen(false);
    toast.success('Notice published to all students.');
  };

  const getIcon = (category: string) => {
    switch (category) {
      case 'maintenance':
        return <Megaphone className="w-5 h-5 text-rose-500" />;
      case 'mess':
        return <Utensils className="w-5 h-5 text-amber-500" />;
      case 'exam':
        return <BookOpen className="w-5 h-5 text-blue-500" />;
      default:
        return <ShieldCheck className="w-5 h-5 text-emerald-500" />;
    }
  };

  const getIconBg = (category: string) => {
    switch (category) {
      case 'maintenance':
        return 'bg-rose-100 dark:bg-rose-900/40 text-rose-600';
      case 'mess':
        return 'bg-amber-100 dark:bg-amber-900/40 text-amber-600';
      case 'exam':
        return 'bg-blue-100 dark:bg-blue-900/40 text-blue-600';
      default:
        return 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header (Matching Bottom-Right Mockup) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            Notices
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Stay updated with hostel announcements.
          </p>
        </div>

        {user?.role !== 'student' && (
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsModalOpen(true)}
            className="btn-gradient-blue shadow-md"
          >
            Post Notice
          </Button>
        )}
      </div>

      {/* Notices List Cards (Matching Mockup) */}
      <div className="rounded-3xl bg-white/75 dark:bg-slate-900/60 border border-white/80 dark:border-white/10 shadow-sm p-4 sm:p-6 space-y-3">
        {notices.map((notice) => (
          <div
            key={notice.id}
            className="flex items-start sm:items-center justify-between p-4 rounded-2xl bg-white/40 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 border border-white/60 dark:border-white/5 transition-all gap-4"
          >
            <div className="flex items-start gap-4">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0 ${getIconBg(notice.category)}`}>
                {getIcon(notice.category)}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-white">
                  {notice.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {notice.description}
                </p>
                <p className="text-[11px] text-slate-400 mt-1 sm:hidden">
                  {notice.date} • {notice.author}
                </p>
              </div>
            </div>

            <div className="hidden sm:block text-right flex-shrink-0 text-xs text-slate-400 font-medium">
              <p>{notice.date}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{notice.author}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Post Notice Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Post New Announcement"
        description="Broadcast an important announcement or memo to all hostel residents."
        size="md"
      >
        <form onSubmit={handlePostNotice} className="space-y-4">
          <Input
            label="Notice Title *"
            placeholder="e.g. Water Supply Maintenance"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
              Category *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'maintenance', label: 'Maintenance' },
                { id: 'mess', label: 'Mess & Dining' },
                { id: 'exam', label: 'Exams & Academics' },
                { id: 'guideline', label: 'Hostel Rules' },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setNewCategory(c.id as any)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all border ${
                    newCategory === c.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white/50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
              Announcement Message *
            </label>
            <textarea
              rows={4}
              placeholder="Write the full notice description..."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-2xl bg-white/50 dark:bg-white/5 border border-white/80 dark:border-white/10 text-slate-800 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl btn-gradient-blue text-sm font-semibold tracking-wide flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-md"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast Notice</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
