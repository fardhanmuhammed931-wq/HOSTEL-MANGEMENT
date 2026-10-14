import React, { useEffect, useState } from 'react';
import {
  CalendarCheck,
  Calendar,
  Check,
  X,
  Clock,
  Building,
  Users,
  CheckCheck,
} from 'lucide-react';
import { attendanceService, hostelService } from '../../services/api';
import { AttendanceRecord, Hostel } from '../../types';
import { GlassCard } from '../../components/common/GlassCard';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Badge } from '../../components/common/Badge';
import { TableSkeleton, CardSkeleton } from '../../components/common/Skeleton';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

export const AttendancePage: React.FC = () => {
  const toast = useToast();
  const { user } = useAuth();

  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [hostelId, setHostelId] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await attendanceService.getAttendance({
        date,
        hostel_id: hostelId,
      });

      if (res.data?.success) {
        setRecords(res.data.data);
        setSummary(res.data.summary);
      }
    } catch (err) {
      toast.error('Failed to load daily attendance sheet.');
    } finally {
      setLoading(false);
    }
  };

  const fetchHostels = async () => {
    try {
      const res = await hostelService.getHostels();
      if (res.data?.success) {
        setHostels(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [date, hostelId]);

  useEffect(() => {
    fetchHostels();
  }, []);

  const handleMarkStatus = async (studentId: number, newStatus: 'present' | 'absent' | 'on_leave') => {
    setIsUpdating(true);
    try {
      const res = await attendanceService.markAttendance({
        student_id: studentId,
        date,
        status: newStatus,
      });
      if (res.data?.success) {
        // Optimistically update record in UI
        setRecords((prev) =>
          prev.map((r) =>
            r.student_id === studentId ? { ...r, attendance_status: newStatus } : r
          )
        );
        toast.success(`Marked as ${newStatus}`);
        fetchAttendance();
      }
    } catch (err: any) {
      toast.error('Failed to update attendance.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMarkAllPresent = async () => {
    if (records.length === 0) return;
    setIsUpdating(true);
    try {
      const entries = records.map((r) => ({
        student_id: r.student_id,
        status: 'present',
      }));

      const res = await attendanceService.markBulkAttendance({
        date,
        entries,
      });

      if (res.data?.success) {
        toast.success(res.data.message || 'All students marked Present.');
        fetchAttendance();
      }
    } catch (err: any) {
      toast.error('Bulk attendance update failed.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Daily Attendance & Roll Call
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor residential hostel presence, curfew verification, and leave requests.
          </p>
        </div>

        {user?.role !== 'student' && (
          <Button
            variant="primary"
            size="sm"
            leftIcon={<CheckCheck className="w-4 h-4" />}
            onClick={handleMarkAllPresent}
            isLoading={isUpdating}
          >
            Mark All Present
          </Button>
        )}
      </div>

      {/* Date & Hostel Filters Card */}
      <GlassCard className="p-4 sm:p-5 rounded-3xl border border-black/5 dark:border-white/10 shadow-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Attendance Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            leftIcon={<Calendar className="w-4 h-4" />}
          />

          <Select
            label="Filter Hostel Wing"
            options={[
              { value: '', label: 'All Hostel Buildings' },
              ...hostels.map((h) => ({ value: h.id, label: h.name })),
            ]}
            value={hostelId}
            onChange={(e) => setHostelId(e.target.value)}
          />
        </div>
      </GlassCard>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {loading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          <>
            <GlassCard className="p-5 text-center rounded-3xl border border-black/5 dark:border-white/10 shadow-md">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Total Students</p>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1 font-mono">{summary?.totalStudents || 0}</h3>
            </GlassCard>

            <GlassCard className="p-5 text-center rounded-3xl border border-emerald-500/20 bg-emerald-500/5 shadow-md">
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">Present</p>
              <h3 className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">{summary?.present || 0}</h3>
            </GlassCard>

            <GlassCard className="p-5 text-center rounded-3xl border border-rose-500/20 bg-rose-500/5 shadow-md">
              <p className="text-xs text-rose-600 dark:text-rose-400 font-bold uppercase tracking-wider">Absent</p>
              <h3 className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 mt-1 font-mono">{summary?.absent || 0}</h3>
            </GlassCard>

            <GlassCard className="p-5 text-center rounded-3xl border border-amber-500/20 bg-amber-500/5 shadow-md">
              <p className="text-xs text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider">On Leave</p>
              <h3 className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 mt-1 font-mono">{summary?.onLeave || 0}</h3>
            </GlassCard>
          </>
        )}
      </div>

      {/* Attendance Sheet Table */}
      <div className="liquid-glass rounded-3xl overflow-hidden border border-black/5 dark:border-white/10 shadow-xl">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6">
              <TableSkeleton rows={6} cols={5} />
            </div>
          ) : records.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-400">
              No students enrolled in this hostel wing.
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-black/[0.02] dark:bg-white/[0.03] text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold border-b border-black/5 dark:border-white/10">
                <tr>
                  <th className="py-4 px-5">Student Name</th>
                  <th className="py-4 px-5">Student ID</th>
                  <th className="py-4 px-5">Hostel & Room</th>
                  <th className="py-4 px-5">Status for {date}</th>
                  {user?.role !== 'student' && <th className="py-4 px-5 text-right">Quick Mark</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5">
                {records.map((r) => (
                  <tr key={r.student_id} className="liquid-table-row text-xs">
                    <td className="py-4 px-5">
                      <p className="font-semibold text-slate-900 dark:text-white">{r.student_name}</p>
                      <p className="text-slate-400 text-[11px]">{r.department}</p>
                    </td>

                    <td className="py-4 px-5 font-mono font-semibold text-primary-600 dark:text-primary-300">
                      {r.student_code}
                    </td>

                    <td className="py-4 px-5">
                      {r.room_number ? (
                        <div className="flex items-center gap-1.5 text-slate-900 dark:text-white font-medium">
                          <Building className="w-3.5 h-3.5 text-primary-500" />
                          <span>{r.hostel_name} &bull; Room {r.room_number}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">No Room Allocated</span>
                      )}
                    </td>

                    <td className="py-4 px-5">
                      <Badge status={r.attendance_status} size="sm" />
                    </td>

                    {user?.role !== 'student' && (
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleMarkStatus(r.student_id, 'present')}
                            className={`p-1.5 rounded-xl border transition-all duration-200 active:scale-95 ${
                              r.attendance_status === 'present'
                                ? 'bg-emerald-500 text-white border-emerald-400 shadow-sm shadow-emerald-500/30'
                                : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500/30'
                            }`}
                            title="Mark Present"
                            aria-label="Mark present"
                          >
                            <Check className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleMarkStatus(r.student_id, 'absent')}
                            className={`p-1.5 rounded-xl border transition-all duration-200 active:scale-95 ${
                              r.attendance_status === 'absent'
                                ? 'bg-rose-500 text-white border-rose-400 shadow-sm shadow-rose-500/30'
                                : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-500/30'
                            }`}
                            title="Mark Absent"
                            aria-label="Mark absent"
                          >
                            <X className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleMarkStatus(r.student_id, 'on_leave')}
                            className={`p-1.5 rounded-xl border transition-all duration-200 active:scale-95 ${
                              r.attendance_status === 'on_leave'
                                ? 'bg-amber-500 text-white border-amber-400 shadow-sm shadow-amber-500/30'
                                : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-slate-400 hover:text-amber-600 dark:hover:text-amber-300 hover:border-amber-500/30'
                            }`}
                            title="Mark On Leave"
                            aria-label="Mark on leave"
                          >
                            <Clock className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
