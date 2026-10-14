import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  Plus,
  Download,
  Eye,
  Edit2,
  Trash2,
  Phone,
  Mail,
  Building,
} from 'lucide-react';
import { studentService } from '../../services/api';
import { Student } from '../../types';
import { GlassCard } from '../../components/common/GlassCard';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Pagination } from '../../components/common/Pagination';
import { TableSkeleton } from '../../components/common/Skeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

export const StudentList: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    student_id: '',
    full_name: '',
    email: '',
    phone: '',
    gender: 'male',
    date_of_birth: '',
    department: 'Computer Science',
    course: 'B.Tech CS',
    academic_year: '1st Year',
    guardian_name: '',
    guardian_phone: '',
    address: '',
    admission_date: new Date().toISOString().split('T')[0],
    status: 'active',
  });

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await studentService.getStudents({
        page,
        limit: 10,
        search,
        department,
        status,
      });

      if (res.data?.success) {
        setStudents(res.data.data);
        setTotalPages(res.data.pagination.totalPages);
        setTotalRecords(res.data.pagination.total);
      }
    } catch (err: any) {
      toast.error('Failed to load student directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [page, department, status]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchStudents();
  };

  const resetForm = () => {
    setFormData({
      student_id: '',
      full_name: '',
      email: '',
      phone: '',
      gender: 'male',
      date_of_birth: '',
      department: 'Computer Science',
      course: 'B.Tech CS',
      academic_year: '1st Year',
      guardian_name: '',
      guardian_phone: '',
      address: '',
      admission_date: new Date().toISOString().split('T')[0],
      status: 'active',
    });
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (student: Student) => {
    setSelectedStudent(student);
    setFormData({
      student_id: student.student_id,
      full_name: student.full_name,
      email: student.email,
      phone: student.phone,
      gender: student.gender,
      date_of_birth: student.date_of_birth || '',
      department: student.department,
      course: student.course,
      academic_year: student.academic_year,
      guardian_name: student.guardian_name,
      guardian_phone: student.guardian_phone,
      address: student.address,
      admission_date: student.admission_date,
      status: student.status,
    });
    setIsEditModalOpen(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await studentService.createStudent(formData);
      if (res.data?.success) {
        toast.success(`Student ${formData.full_name} registered successfully!`);
        setIsAddModalOpen(false);
        resetForm();
        fetchStudents();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to register student.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    setIsSubmitting(true);
    try {
      const res = await studentService.updateStudent(selectedStudent.id, formData);
      if (res.data?.success) {
        toast.success('Student updated successfully.');
        setIsEditModalOpen(false);
        fetchStudents();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update student.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedStudent) return;
    setIsSubmitting(true);
    try {
      const res = await studentService.deleteStudent(selectedStudent.id);
      if (res.data?.success) {
        toast.success(res.data.message || 'Student record deleted.');
        setIsDeleteDialogOpen(false);
        fetchStudents();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Could not delete student.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportCsv = () => {
    window.open(studentService.exportCsvUrl(), '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header with Title and Actions (Matching Mockup) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            Students
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage hostel students and their details.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="glass"
            size="sm"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={handleExportCsv}
          >
            Export CSV
          </Button>

          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={handleOpenAddModal}
            className="btn-gradient-blue shadow-md"
          >
            Add Student
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <GlassCard className="p-4 sm:p-5">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <div className="sm:col-span-2 lg:col-span-2">
            <Input
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          <Select
            options={[
              { value: '', label: 'All Departments' },
              { value: 'Computer Science', label: 'Computer Science' },
              { value: 'Electrical Engineering', label: 'Electrical Engineering' },
              { value: 'Mechanical Engineering', label: 'Mechanical Engineering' },
              { value: 'Civil Engineering', label: 'Civil Engineering' },
              { value: 'Business Administration', label: 'Business Admin' },
              { value: 'Information Technology', label: 'Information Tech' },
            ]}
            value={department}
            onChange={(e) => {
              setDepartment(e.target.value);
              setPage(1);
            }}
          />

          <Select
            options={[
              { value: '', label: 'All Statuses' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
              { value: 'graduated', label: 'Graduated' },
              { value: 'suspended', label: 'Suspended' },
            ]}
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          />
        </form>
      </GlassCard>

      {/* Table Card */}
      <GlassCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6">
              <TableSkeleton rows={6} cols={6} />
            </div>
          ) : students.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={Users}
                title="No students found"
                description="No student profiles match your search criteria. Try modifying your filters or register a new student."
                actionLabel={user?.role === 'admin' ? 'Register Student' : undefined}
                onAction={user?.role === 'admin' ? handleOpenAddModal : undefined}
              />
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-white/40 dark:bg-white/[0.03] text-xs font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200/60 dark:border-white/10">
                <tr>
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Room No</th>
                  <th className="py-4 px-6">Course</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right"> </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-white/60 dark:hover:bg-white/5 transition-colors">
                    {/* Student Info */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-sky-400 flex items-center justify-center font-bold text-white text-xs shadow-sm flex-shrink-0">
                          {student.full_name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-white tracking-tight">{student.full_name}</p>
                          <p className="text-xs text-slate-400 font-mono mt-0.5">{student.student_id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Room No */}
                    <td className="py-4 px-6 font-medium text-slate-700 dark:text-slate-200 text-sm">
                      {student.room_number || 'N/A'}
                    </td>

                    {/* Course */}
                    <td className="py-4 px-6 font-medium text-slate-700 dark:text-slate-200 text-sm">
                      {student.course}
                    </td>

                    {/* Status Badge (Soft Mint Green Pill Matching Mockup) */}
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                        Active
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => navigate(`/students/${student.id}`)}
                          className="px-2.5 py-1 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10 text-sm font-bold tracking-widest transition-colors"
                          title="View Actions"
                        >
                          •••
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="p-4 border-t border-white/5">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalRecords={totalRecords}
            limit={10}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      </GlassCard>

      {/* Add Student Modal (Matching Middle-Right Mockup) */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Student"
        description="Enter student personal and enrollment details."
        size="lg"
      >
        <form onSubmit={handleAddSubmit} className="space-y-5">
          {/* Circular Camera Upload Photo */}
          <div className="flex flex-col items-center justify-center pt-2 pb-4">
            <div className="w-20 h-20 rounded-full border-2 border-dashed border-blue-400/60 dark:border-blue-400/40 bg-blue-50/50 dark:bg-blue-900/20 flex flex-col items-center justify-center text-blue-600 dark:text-blue-400 cursor-pointer hover:bg-blue-100/60 transition-all shadow-sm group">
              <svg className="w-7 h-7 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-2">
              Upload Photo
            </span>
          </div>

          {/* 2-Column Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name *"
              placeholder="Enter full name"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              required
            />
            <Input
              label="Email *"
              type="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Phone Number *"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
            <Select
              label="Course *"
              options={[
                { value: 'B.Tech CS', label: 'B.Tech CS' },
                { value: 'B.Sc. IT', label: 'B.Sc. IT' },
                { value: 'B.Tech ECE', label: 'B.Tech ECE' },
                { value: 'B.A. English', label: 'B.A. English' },
                { value: 'B.Tech ME', label: 'B.Tech ME' },
              ]}
              value={formData.course}
              onChange={(e) => setFormData({ ...formData, course: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Room No"
              options={[
                { value: 'B-204', label: 'B-204 (Olympus Hall)' },
                { value: 'A-101', label: 'A-101 (Athena Residence)' },
                { value: 'C-305', label: 'C-305 (Olympus Hall)' },
                { value: 'A-202', label: 'A-202 (Athena Residence)' },
                { value: 'C-108', label: 'C-108 (Olympus Hall)' },
              ]}
              value={formData.student_id ? 'B-204' : ''}
              onChange={() => {}}
            />
            <Input
              label="Guardian Name"
              placeholder="Enter guardian name"
              value={formData.guardian_name}
              onChange={(e) => setFormData({ ...formData, guardian_name: e.target.value })}
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl btn-gradient-blue text-sm font-semibold tracking-wide flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-md"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                'Save Student'
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Student Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Student Information"
        size="lg"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              required
            />
            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
            <Input
              label="Department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              required
            />
            <Select
              label="Status"
              options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'graduated', label: 'Graduated' },
                { value: 'suspended', label: 'Suspended' },
              ]}
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Guardian Name"
              value={formData.guardian_name}
              onChange={(e) => setFormData({ ...formData, guardian_name: e.target.value })}
            />
            <Input
              label="Guardian Phone"
              value={formData.guardian_phone}
              onChange={(e) => setFormData({ ...formData, guardian_phone: e.target.value })}
            />
          </div>

          <Input
            label="Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <Button variant="ghost" type="button" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={isSubmitting}>
              Update Record
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete / Archive Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Confirm Student Deletion / Archival"
        message={`Are you sure you want to delete or archive ${selectedStudent?.full_name} (${selectedStudent?.student_id})? If active financial records exist, the student will be safely archived to maintain accounting audit integrity.`}
        confirmLabel="Archive / Delete"
        isLoading={isSubmitting}
      />
    </div>
  );
};
