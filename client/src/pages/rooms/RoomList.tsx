import React, { useEffect, useState } from 'react';
import {
  Bed,
  Plus,
  Search,
  Filter,
  Grid,
  List,
  Users,
  DollarSign,
  Building,
  CheckCircle,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { roomService, hostelService } from '../../services/api';
import { Room, Hostel } from '../../types';
import { GlassCard } from '../../components/common/GlassCard';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { TableSkeleton, CardSkeleton } from '../../components/common/Skeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

export const RoomList: React.FC = () => {
  const toast = useToast();
  const { user } = useAuth();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [hostelId, setHostelId] = useState('');
  const [status, setStatus] = useState('');
  const [roomType, setRoomType] = useState('');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isOccupantsModalOpen, setIsOccupantsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add Room form state
  const [formData, setFormData] = useState({
    hostel_id: '',
    room_number: '',
    floor: 1,
    room_type: 'double',
    capacity: 2,
    fee_per_month: 450,
    status: 'available',
    amenities: 'Wi-Fi, Study Table, AC, Wardrobe',
    description: '',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [roomsRes, hostelsRes] = await Promise.all([
        roomService.getRooms({
          hostel_id: hostelId,
          status,
          room_type: roomType,
          search,
        }),
        hostelService.getHostels(),
      ]);

      if (roomsRes.data?.success) setRooms(roomsRes.data.data);
      if (hostelsRes.data?.success) {
        setHostels(hostelsRes.data.data);
        if (!formData.hostel_id && hostelsRes.data.data.length > 0) {
          setFormData((prev) => ({ ...prev, hostel_id: String(hostelsRes.data.data[0].id) }));
        }
      }
    } catch (err) {
      toast.error('Failed to load rooms inventory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [hostelId, status, roomType]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await roomService.createRoom(formData);
      if (res.data?.success) {
        toast.success(`Room ${formData.room_number} added successfully.`);
        setIsAddModalOpen(false);
        setFormData({
          ...formData,
          room_number: '',
        });
        fetchData();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Could not add room.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewOccupants = async (roomId: number) => {
    try {
      const res = await roomService.getRoomById(roomId);
      if (res.data?.success) {
        setSelectedRoom(res.data.data);
        setIsOccupantsModalOpen(true);
      }
    } catch (err) {
      toast.error('Could not fetch room occupant details.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      {/* Header (Matching Mockup) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            Rooms
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            View and manage hostel rooms.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {user?.role === 'admin' && (
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setIsAddModalOpen(true)}
              className="btn-gradient-blue shadow-md"
            >
              Add Room
            </Button>
          )}
        </div>
      </div>

      {/* Filter Tabs & Search Bar (Matching Mockup: All, Occupied, Available, Maintenance) */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white/70 dark:bg-slate-900/60 border border-white/80 dark:border-white/10 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: '', label: 'All' },
              { id: 'full', label: 'Occupied' },
              { id: 'available', label: 'Available' },
              { id: 'under_maintenance', label: 'Maintenance' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatus(tab.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  status === tab.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white/60 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-white/90'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="w-full sm:w-64">
            <Input
              placeholder="Search rooms..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
        </div>
      </div>

      {/* View Content */}
      {loading ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : (
          <GlassCard className="p-6">
            <TableSkeleton rows={5} cols={5} />
          </GlassCard>
        )
      ) : rooms.length === 0 ? (
        <EmptyState
          icon={Bed}
          title="No rooms found"
          description="No rooms match the selected filter criteria. Modify your filters or add a new room."
        />
      ) : (
        /* Visual Room Cards Grid (Matching Mockup) */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {rooms.map((room) => {
            const isOccupied = room.current_occupancy >= room.capacity || room.status === 'full';
            const isMaintenance = room.status === 'under_maintenance';

            return (
              <div
                key={room.id}
                className="rounded-3xl p-5 bg-white/75 dark:bg-slate-900/60 border border-white/80 dark:border-white/10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Bed Icon & Status Pill */}
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-sky-100 dark:bg-sky-900/50 flex items-center justify-center text-sky-600 dark:text-sky-400">
                      <Bed className="w-5 h-5" />
                    </div>

                    {isOccupied ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">
                        Occupied
                      </span>
                    ) : isMaintenance ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300">
                        Maintenance
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                        Available
                      </span>
                    )}
                  </div>

                  <div className="mt-3">
                    <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                      {room.room_number}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium capitalize mt-0.5">
                      {room.room_type} Room
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono text-sm">
                    ₹{room.fee_per_month} / mo
                  </span>
                  <button
                    onClick={() => handleViewOccupants(room.id)}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    Occupants ({room.current_occupancy}/{room.capacity})
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Room Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Room to Inventory"
        size="md"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <Select
            label="Assigned Hostel *"
            options={hostels.map((h) => ({ value: h.id, label: `${h.name} (${h.code})` }))}
            value={formData.hostel_id}
            onChange={(e) => setFormData({ ...formData, hostel_id: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Room Number *"
              placeholder="e.g. 101, 204"
              value={formData.room_number}
              onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
              required
            />
            <Input
              label="Floor Number *"
              type="number"
              min={0}
              value={formData.floor}
              onChange={(e) => setFormData({ ...formData, floor: parseInt(e.target.value, 10) || 1 })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Room Type *"
              options={[
                { value: 'single', label: 'Single Occupancy (1 Bed)' },
                { value: 'double', label: 'Double Occupancy (2 Beds)' },
                { value: 'triple', label: 'Triple Occupancy (3 Beds)' },
                { value: 'quad', label: 'Quad Occupancy (4 Beds)' },
                { value: 'dormitory', label: 'Dormitory Hall (6+ Beds)' },
              ]}
              value={formData.room_type}
              onChange={(e) => {
                const type = e.target.value;
                let defaultCap = 2;
                if (type === 'single') defaultCap = 1;
                else if (type === 'triple') defaultCap = 3;
                else if (type === 'quad') defaultCap = 4;
                else if (type === 'dormitory') defaultCap = 8;
                setFormData({ ...formData, room_type: type as any, capacity: defaultCap });
              }}
            />
            <Input
              label="Bed Capacity *"
              type="number"
              min={1}
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value, 10) || 1 })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Monthly Fee (₹) *"
              type="number"
              step="0.01"
              value={formData.fee_per_month}
              onChange={(e) => setFormData({ ...formData, fee_per_month: parseFloat(e.target.value) || 0 })}
              required
            />
            <Select
              label="Initial Status *"
              options={[
                { value: 'available', label: 'Available' },
                { value: 'under_maintenance', label: 'Under Maintenance' },
              ]}
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            />
          </div>

          <Input
            label="Amenities"
            placeholder="e.g. AC, Attached Bath, Wi-Fi, Balcony"
            value={formData.amenities}
            onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/5 dark:border-white/10">
            <Button variant="ghost" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={isSubmitting}>
              Create Room
            </Button>
          </div>
        </form>
      </Modal>

      {/* Room Occupants Modal */}
      <Modal
        isOpen={isOccupantsModalOpen}
        onClose={() => setIsOccupantsModalOpen(false)}
        title={`Room #${selectedRoom?.room_number} Occupants`}
        description={`${selectedRoom?.hostel_name} • Floor ${selectedRoom?.floor} • ${selectedRoom?.capacity} Beds Total`}
        size="md"
      >
        <div className="space-y-4">
          {selectedRoom?.occupants?.length === 0 ? (
            <p className="text-center py-6 text-sm text-slate-400">
              This room currently has no registered student occupants.
            </p>
          ) : (
            <div className="space-y-3">
              {selectedRoom?.occupants?.map((occ: any) => (
                <div
                  key={occ.student_id}
                  className="p-3.5 rounded-2xl liquid-well border border-black/5 dark:border-white/10 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500/20 to-indigo-500/20 text-primary-600 dark:text-primary-400 border border-primary-500/20 flex items-center justify-center font-bold">
                      {occ.full_name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{occ.full_name}</p>
                      <p className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">{occ.student_code} &bull; {occ.department}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-primary-600 dark:text-primary-300 font-semibold liquid-glass px-2.5 py-1 rounded-xl border border-primary-500/20 text-[11px]">
                      Bed: {occ.bed_number || 'Standard'}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1">Since {occ.start_date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end pt-3 border-t border-black/5 dark:border-white/10">
            <Button variant="ghost" onClick={() => setIsOccupantsModalOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
