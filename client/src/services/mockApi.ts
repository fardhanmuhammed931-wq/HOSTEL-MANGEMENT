import { INITIAL_MOCK_DATA, MockStoreState } from './mockData';
import {
  Student,
  Hostel,
  Room,
  RoomAllocation,
  FeeRecord,
  Payment,
  VisitorLog,
  MaintenanceRequest,
} from '../types';

const STORAGE_KEY = 'hms_cloud_store_v2';

function getStore(): MockStoreState {
  try {
    // Clear legacy v1 cache if present
    if (typeof localStorage !== 'undefined' && localStorage.getItem('hms_cloud_store_v1')) {
      localStorage.removeItem('hms_cloud_store_v1');
    }

    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (raw) {
      const parsed: MockStoreState = JSON.parse(raw);
      // Ensure all initial demo users (including rahul.sharma) are present
      if (parsed.users && Array.isArray(parsed.users)) {
        const hasRahul = parsed.users.some(
          (u) => u.email.toLowerCase() === 'rahul.sharma@hostel.com'
        );
        if (!hasRahul) {
          parsed.users = INITIAL_MOCK_DATA.users;
          saveStore(parsed);
        }
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load store from localStorage', e);
  }
  saveStore(INITIAL_MOCK_DATA);
  return JSON.parse(JSON.stringify(INITIAL_MOCK_DATA));
}

function saveStore(store: MockStoreState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (e) {
    console.error('Failed to save store to localStorage', e);
  }
}

function mockResponse(data: any, status = 200) {
  return {
    data,
    status,
    statusText: 'OK',
    headers: { 'content-type': 'application/json' },
    config: {},
  };
}

function mockError(message: string, status = 400) {
  const error: any = new Error(message);
  error.response = {
    data: { success: false, message },
    status,
    statusText: status === 401 ? 'Unauthorized' : 'Bad Request',
    headers: {},
    config: {},
  };
  return Promise.reject(error);
}

export function handleMockApi(config: any): Promise<any> {
  const method = (config.method || 'get').toLowerCase();
  // Strip baseURL or leading /api if present
  let url = config.url || '';
  if (url.startsWith('/api')) {
    url = url.substring(4);
  }
  if (!url.startsWith('/')) {
    url = '/' + url;
  }

  // Extract query parameters if any
  let queryParams: any = config.params || {};
  if (url.includes('?')) {
    const parts = url.split('?');
    url = parts[0];
    const searchParams = new URLSearchParams(parts[1]);
    searchParams.forEach((v, k) => {
      queryParams[k] = v;
    });
  }

  let body: any = {};
  if (typeof config.data === 'string') {
    try {
      body = JSON.parse(config.data);
    } catch {
      body = {};
    }
  } else if (config.data) {
    body = config.data;
  }

  const store = getStore();

  // -------------------------------------------------------------
  // 1. AUTH ROUTES
  // -------------------------------------------------------------
  if (url === '/auth/login' && method === 'post') {
    const { email, password } = body;
    const cleanInput = (email || '').trim().toLowerCase();

    // Map common demo usernames/aliases
    let targetEmail = cleanInput;
    if (cleanInput === 'student') targetEmail = 'rahul.sharma@hostel.com';
    if (cleanInput === 'admin') targetEmail = 'admin@hostel.com';
    if (cleanInput === 'warden') targetEmail = 'warden.boys@hostel.com';

    let user = store.users.find(
      (u) =>
        u.email.toLowerCase() === targetEmail ||
        (targetEmail === 'rahul.sharma@hostel.com' && u.email.toLowerCase() === 'alex.turner@hostel.com') ||
        (targetEmail === 'alex.turner@hostel.com' && u.email.toLowerCase() === 'rahul.sharma@hostel.com') ||
        (cleanInput === 'student@hostel.com' && u.role === 'student')
    );

    // Guaranteed fallback if demo account is requested
    if (!user && (targetEmail === 'rahul.sharma@hostel.com' || targetEmail === 'student@hostel.com' || cleanInput === 'student')) {
      user = {
        id: 4,
        email: 'rahul.sharma@hostel.com',
        password: 'password123',
        full_name: 'Rahul Sharma',
        role: 'student',
        phone: '+91 98765 43210',
        status: 'active',
        student_id: 'B-0016',
        studentRecordId: 1,
        hostel_id: 1,
        hostel_name: 'Olympus Hall (North Wing)',
        room_id: 1,
        room_number: 'B-204',
        department: 'Computer Science',
        course: 'B.Tech CS',
        created_at: '2024-01-01T00:00:00Z',
      };
      store.users.push(user);
      saveStore(store);
    }

    if (!user) {
      return mockError('Invalid email or password.', 401);
    }

    const isPasswordValid =
      !user.password ||
      user.password === password ||
      password === 'password123' ||
      password === 'admin123' ||
      password === 'student123';

    if (!isPasswordValid) {
      return mockError('Invalid email or password.', 401);
    }

    const { password: _, ...userSafe } = user;
    const token = `mock-jwt-token-${user.id}-${Date.now()}`;
    return Promise.resolve(
      mockResponse({
        success: true,
        message: 'Login successful.',
        data: {
          token,
          user: userSafe,
        },
      })
    );
  }

  if (url === '/auth/register' && method === 'post') {
    const { email, password, full_name, role = 'student', phone, gender, department, course, academic_year } = body;
    if (!email || !password || !full_name) {
      return mockError('Email, password, and full name are required.');
    }

    const exists = store.users.some(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (exists) {
      return mockError('An account with this email address already exists.', 409);
    }

    const newUserId = store.users.length ? Math.max(...store.users.map((u) => u.id)) + 1 : 1;
    let studentRecordId: number | null = null;
    let studentIdCode: string | null = null;

    if (role === 'student') {
      const newStudentId = store.students.length ? Math.max(...store.students.map((s) => s.id)) + 1 : 1;
      studentRecordId = newStudentId;
      studentIdCode = `STU-2024-${String(newStudentId).padStart(3, '0')}`;

      store.students.push({
        id: newStudentId,
        user_id: newUserId,
        student_id: studentIdCode,
        full_name,
        email,
        phone: phone || '+1 (555) 000-0000',
        gender: gender || 'male',
        date_of_birth: '2004-01-01',
        department: department || 'Computer Science',
        course: course || 'B.Tech CS',
        academic_year: academic_year || '1st Year',
        guardian_name: 'Guardian of ' + full_name,
        guardian_phone: phone || '+1 (555) 000-0000',
        address: 'Campus Hostel Complex',
        admission_date: new Date().toISOString().split('T')[0],
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    const newUser: any = {
      id: newUserId,
      email,
      password,
      full_name,
      role,
      phone: phone || '',
      status: 'active',
      student_id: studentIdCode,
      studentRecordId,
      created_at: new Date().toISOString(),
    };

    store.users.push(newUser);
    saveStore(store);

    const { password: _, ...userSafe } = newUser;
    const token = `mock-jwt-token-${newUserId}-${Date.now()}`;
    return Promise.resolve(
      mockResponse({
        success: true,
        message: 'Account created successfully.',
        data: {
          token,
          user: userSafe,
        },
      })
    );
  }

  if (url === '/auth/me' && method === 'get') {
    const rawUser = localStorage.getItem('hms_auth_user');
    let currentUser = rawUser ? JSON.parse(rawUser) : store.users[0];
    const freshUser = store.users.find((u) => u.id === currentUser?.id) || currentUser;
    const { password: _, ...userSafe } = freshUser;
    return Promise.resolve(
      mockResponse({
        success: true,
        data: userSafe,
      })
    );
  }

  if (url === '/auth/logout' && method === 'post') {
    return Promise.resolve(
      mockResponse({
        success: true,
        message: 'Logged out successfully.',
      })
    );
  }

  if (url === '/auth/change-password' && method === 'post') {
    return Promise.resolve(
      mockResponse({
        success: true,
        message: 'Password updated successfully.',
      })
    );
  }

  // -------------------------------------------------------------
  // 2. DASHBOARD ROUTES
  // -------------------------------------------------------------
  if (url === '/dashboard/stats' && method === 'get') {
    const totalStudents = store.students.filter((s) => s.status === 'active').length;
    const totalRooms = store.rooms.length;
    const totalCapacity = store.rooms.reduce((acc, r) => acc + (r.capacity || 0), 0);
    const totalOccupancy = store.rooms.reduce((acc, r) => acc + (r.current_occupancy || 0), 0);
    const occupiedRooms = store.rooms.filter((r) => r.current_occupancy > 0).length;
    const availableRooms = store.rooms.filter((r) => r.status === 'available').length;
    const totalPendingFees = store.fees.reduce(
      (acc, f) => acc + Math.max(0, (f.amount_due || 0) - (f.amount_paid || 0)),
      0
    );
    const totalCollectedFees = store.fees.reduce((acc, f) => acc + (f.amount_paid || 0), 0);
    const pendingMaintenance = store.maintenance.filter(
      (m) => m.status === 'submitted' || m.status === 'in_progress'
    ).length;
    const todayVisitors = store.visitorLogs.length;
    const occupancyPercentage =
      totalCapacity > 0 ? Math.round((totalOccupancy / totalCapacity) * 100) : 0;

    return Promise.resolve(
      mockResponse({
        success: true,
        data: {
          totalStudents,
          totalRooms,
          occupiedRooms,
          availableRooms,
          totalCapacity,
          totalOccupancy,
          totalPendingFees,
          totalCollectedFees,
          pendingMaintenance,
          todayVisitors,
          occupancyPercentage,
        },
      })
    );
  }

  if (url === '/dashboard/charts' && method === 'get') {
    const monthlyFees = [
      { month: 'May 2024', collected: 5200 },
      { month: 'Jun 2024', collected: 6800 },
      { month: 'Jul 2024', collected: 7400 },
      { month: 'Aug 2024', collected: 11080 },
      { month: 'Sep 2024', collected: 8900 },
      { month: 'Oct 2024', collected: 9480 },
    ];

    const hostelOccupancy = store.hostels.map((h) => {
      const hRooms = store.rooms.filter((r) => r.hostel_id === h.id);
      const capacity = hRooms.reduce((acc, r) => acc + (r.capacity || 0), 0);
      const occupied = hRooms.reduce((acc, r) => acc + (r.current_occupancy || 0), 0);
      return {
        hostelName: h.name,
        hostelCode: h.code,
        capacity,
        occupied,
      };
    });

    const maintenanceByCategory = [
      { category: 'electrical', count: 4 },
      { category: 'plumbing', count: 3 },
      { category: 'internet', count: 2 },
      { category: 'furniture', count: 2 },
    ];

    const maintenanceByStatus = [
      { status: 'resolved', count: 8 },
      { status: 'in_progress', count: 2 },
      { status: 'submitted', count: 3 },
    ];

    return Promise.resolve(
      mockResponse({
        success: true,
        data: {
          monthlyFees,
          hostelOccupancy,
          maintenanceByCategory,
          maintenanceByStatus,
        },
      })
    );
  }

  if (url === '/dashboard/recent-activity' && method === 'get') {
    const recentStudents = store.students.slice(0, 5);
    const recentPayments = store.payments.slice(0, 5);
    const recentVisitors = store.visitorLogs.slice(0, 5);
    const recentMaintenance = store.maintenance.slice(0, 5);

    return Promise.resolve(
      mockResponse({
        success: true,
        data: {
          recentStudents,
          recentPayments,
          recentVisitors,
          recentMaintenance,
        },
      })
    );
  }

  // -------------------------------------------------------------
  // 3. STUDENTS ROUTES
  // -------------------------------------------------------------
  if (url === '/students' && method === 'get') {
    let list = [...store.students];
    const search = (queryParams.search || '').toLowerCase();
    const department = queryParams.department || '';
    const status = queryParams.status || '';
    const hostel_id = queryParams.hostel_id;

    if (search) {
      list = list.filter(
        (s) =>
          s.full_name.toLowerCase().includes(search) ||
          s.student_id.toLowerCase().includes(search) ||
          s.email.toLowerCase().includes(search) ||
          s.department.toLowerCase().includes(search)
      );
    }
    if (department) list = list.filter((s) => s.department === department);
    if (status) list = list.filter((s) => s.status === status);
    if (hostel_id) list = list.filter((s) => String(s.hostel_id) === String(hostel_id));

    const page = parseInt(queryParams.page || '1', 10);
    const limit = parseInt(queryParams.limit || '10', 10);
    const total = list.length;
    const paginated = list.slice((page - 1) * limit, page * limit);

    return Promise.resolve(
      mockResponse({
        success: true,
        data: paginated,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.max(1, Math.ceil(total / limit)),
        },
      })
    );
  }

  if (url.startsWith('/students/') && method === 'get') {
    const id = parseInt(url.split('/')[2], 10);
    const student = store.students.find((s) => s.id === id);
    if (!student) return mockError('Student not found.', 404);
    return Promise.resolve(mockResponse({ success: true, data: student }));
  }

  if (url === '/students' && method === 'post') {
    const newId = store.students.length ? Math.max(...store.students.map((s) => s.id)) + 1 : 1;
    const newStudent: Student = {
      id: newId,
      student_id: body.student_id || `STU-2024-${String(newId).padStart(3, '0')}`,
      full_name: body.full_name,
      email: body.email,
      phone: body.phone,
      gender: body.gender || 'male',
      date_of_birth: body.date_of_birth || null,
      department: body.department || 'General',
      course: body.course || 'B.Tech',
      academic_year: body.academic_year || '1st Year',
      guardian_name: body.guardian_name || '',
      guardian_phone: body.guardian_phone || '',
      address: body.address || '',
      admission_date: body.admission_date || new Date().toISOString().split('T')[0],
      status: body.status || 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    store.students.unshift(newStudent);
    saveStore(store);
    return Promise.resolve(
      mockResponse({
        success: true,
        message: 'Student created successfully.',
        data: newStudent,
      })
    );
  }

  if (url.startsWith('/students/') && method === 'put') {
    const id = parseInt(url.split('/')[2], 10);
    const idx = store.students.findIndex((s) => s.id === id);
    if (idx === -1) return mockError('Student not found.', 404);
    store.students[idx] = { ...store.students[idx], ...body, updated_at: new Date().toISOString() };
    saveStore(store);
    return Promise.resolve(
      mockResponse({
        success: true,
        message: 'Student updated successfully.',
        data: store.students[idx],
      })
    );
  }

  if (url.startsWith('/students/') && method === 'delete') {
    const id = parseInt(url.split('/')[2], 10);
    store.students = store.students.filter((s) => s.id !== id);
    saveStore(store);
    return Promise.resolve(
      mockResponse({
        success: true,
        message: 'Student deleted successfully.',
      })
    );
  }

  // -------------------------------------------------------------
  // 4. HOSTELS ROUTES
  // -------------------------------------------------------------
  if (url === '/hostels' && method === 'get') {
    const hostelsWithOccupancy = store.hostels.map((h) => {
      const hRooms = store.rooms.filter((r) => r.hostel_id === h.id);
      return {
        ...h,
        total_rooms: hRooms.length,
        total_capacity: hRooms.reduce((acc, r) => acc + (r.capacity || 0), 0),
        total_occupants: hRooms.reduce((acc, r) => acc + (r.current_occupancy || 0), 0),
      };
    });
    return Promise.resolve(mockResponse({ success: true, data: hostelsWithOccupancy }));
  }

  if (url === '/hostels' && method === 'post') {
    const newId = store.hostels.length ? Math.max(...store.hostels.map((h) => h.id)) + 1 : 1;
    const newHostel: Hostel = {
      id: newId,
      name: body.name,
      code: body.code.toUpperCase(),
      type: body.type || 'co-ed',
      total_floors: parseInt(body.total_floors || '1', 10),
      warden_id: body.warden_id || null,
      contact_number: body.contact_number || '',
      address: body.address || '',
      description: body.description || '',
      status: body.status || 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    store.hostels.push(newHostel);
    saveStore(store);
    return Promise.resolve(
      mockResponse({
        success: true,
        message: 'Hostel building registered successfully.',
        data: newHostel,
      })
    );
  }

  if (url.startsWith('/hostels/') && method === 'put') {
    const id = parseInt(url.split('/')[2], 10);
    const idx = store.hostels.findIndex((h) => h.id === id);
    if (idx === -1) return mockError('Hostel not found.', 404);
    store.hostels[idx] = { ...store.hostels[idx], ...body, updated_at: new Date().toISOString() };
    saveStore(store);
    return Promise.resolve(
      mockResponse({
        success: true,
        message: 'Hostel updated successfully.',
        data: store.hostels[idx],
      })
    );
  }

  // -------------------------------------------------------------
  // 5. ROOMS ROUTES
  // -------------------------------------------------------------
  if (url === '/rooms' && method === 'get') {
    let list = [...store.rooms];
    if (queryParams.hostel_id) {
      list = list.filter((r) => String(r.hostel_id) === String(queryParams.hostel_id));
    }
    if (queryParams.floor) {
      list = list.filter((r) => String(r.floor) === String(queryParams.floor));
    }
    if (queryParams.status) {
      list = list.filter((r) => r.status === queryParams.status);
    }
    if (queryParams.room_type) {
      list = list.filter((r) => r.room_type === queryParams.room_type);
    }
    if (queryParams.search) {
      const term = queryParams.search.toLowerCase();
      list = list.filter(
        (r) =>
          r.room_number.toLowerCase().includes(term) ||
          (r.hostel_name && r.hostel_name.toLowerCase().includes(term))
      );
    }
    return Promise.resolve(mockResponse({ success: true, data: list }));
  }

  if (url.startsWith('/rooms/') && method === 'get') {
    const id = parseInt(url.split('/')[2], 10);
    const room = store.rooms.find((r) => r.id === id);
    if (!room) return mockError('Room not found.', 404);
    return Promise.resolve(mockResponse({ success: true, data: room }));
  }

  if (url === '/rooms' && method === 'post') {
    const newId = store.rooms.length ? Math.max(...store.rooms.map((r) => r.id)) + 1 : 1;
    const hostel = store.hostels.find((h) => h.id === parseInt(body.hostel_id, 10));
    const cap = parseInt(body.capacity || '2', 10);
    const newRoom: Room = {
      id: newId,
      hostel_id: parseInt(body.hostel_id, 10),
      hostel_name: hostel?.name || 'Main Hall',
      hostel_code: hostel?.code || 'MAIN',
      room_number: body.room_number,
      floor: parseInt(body.floor || '1', 10),
      room_type: body.room_type || 'double',
      capacity: cap,
      current_occupancy: 0,
      fee_per_month: parseFloat(body.fee_per_month || '450'),
      status: 'available',
      amenities: body.amenities || 'Wi-Fi, Attached Bath',
      description: body.description || '',
      available_beds: cap,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    store.rooms.push(newRoom);
    saveStore(store);
    return Promise.resolve(
      mockResponse({
        success: true,
        message: 'Room registered successfully.',
        data: newRoom,
      })
    );
  }

  if (url.startsWith('/rooms/') && method === 'put') {
    const id = parseInt(url.split('/')[2], 10);
    const idx = store.rooms.findIndex((r) => r.id === id);
    if (idx === -1) return mockError('Room not found.', 404);
    store.rooms[idx] = { ...store.rooms[idx], ...body, updated_at: new Date().toISOString() };
    saveStore(store);
    return Promise.resolve(
      mockResponse({
        success: true,
        message: 'Room updated successfully.',
        data: store.rooms[idx],
      })
    );
  }

  // -------------------------------------------------------------
  // 6. ALLOCATIONS ROUTES
  // -------------------------------------------------------------
  if (url === '/allocations' && method === 'get') {
    let list = [...store.allocations];
    if (queryParams.status) list = list.filter((a) => a.status === queryParams.status);
    if (queryParams.hostel_id) list = list.filter((a) => String(a.hostel_id) === String(queryParams.hostel_id));
    return Promise.resolve(mockResponse({ success: true, data: list }));
  }

  if (url === '/allocations' && method === 'post') {
    const newId = store.allocations.length ? Math.max(...store.allocations.map((a) => a.id)) + 1 : 1;
    const student = store.students.find((s) => s.id === parseInt(body.student_id, 10));
    const room = store.rooms.find((r) => r.id === parseInt(body.room_id, 10));

    if (!room || room.current_occupancy >= room.capacity) {
      return mockError('Selected room is already at full capacity.', 400);
    }

    const newAlloc: RoomAllocation = {
      id: newId,
      student_id: parseInt(body.student_id, 10),
      student_name: student?.full_name || 'Student',
      student_code: student?.student_id || 'STU-NEW',
      student_email: student?.email || '',
      room_id: parseInt(body.room_id, 10),
      room_number: room?.room_number || '',
      room_type: room?.room_type || 'double',
      floor: room?.floor || 1,
      hostel_id: room?.hostel_id || 1,
      hostel_name: room?.hostel_name || 'Main Hostel',
      bed_number: body.bed_number || `${room?.room_number}-A`,
      start_date: body.start_date || new Date().toISOString().split('T')[0],
      end_date: body.end_date || null,
      checkout_date: null,
      status: 'active',
      notes: body.notes || 'Room allocated.',
      created_at: new Date().toISOString(),
    };

    store.allocations.unshift(newAlloc);

    // Update room occupancy
    room.current_occupancy += 1;
    room.status = room.current_occupancy >= room.capacity ? 'full' : 'partially_occupied';
    room.available_beds = Math.max(0, room.capacity - room.current_occupancy);

    // Update student
    if (student) {
      student.hostel_id = room.hostel_id;
      student.hostel_name = room.hostel_name;
      student.room_id = room.id;
      student.room_number = room.room_number;
      student.allocation_id = newId;
      student.bed_number = newAlloc.bed_number;
      student.allocated_since = newAlloc.start_date;
    }

    saveStore(store);
    return Promise.resolve(
      mockResponse({
        success: true,
        message: 'Room allocated successfully.',
        data: newAlloc,
      })
    );
  }

  if (url.includes('/allocations/') && url.endsWith('/check-out') && method === 'post') {
    const id = parseInt(url.split('/')[2], 10);
    const alloc = store.allocations.find((a) => a.id === id);
    if (!alloc) return mockError('Allocation record not found.', 404);

    alloc.status = 'checked_out';
    alloc.checkout_date = new Date().toISOString().split('T')[0];

    const room = store.rooms.find((r) => r.id === alloc.room_id);
    if (room) {
      room.current_occupancy = Math.max(0, room.current_occupancy - 1);
      room.status = room.current_occupancy === 0 ? 'available' : 'partially_occupied';
      room.available_beds = Math.max(0, room.capacity - room.current_occupancy);
    }

    const student = store.students.find((s) => s.id === alloc.student_id);
    if (student) {
      student.room_id = null;
      student.room_number = null;
      student.allocation_id = null;
    }

    saveStore(store);
    return Promise.resolve(
      mockResponse({
        success: true,
        message: 'Student checked out successfully.',
      })
    );
  }

  // -------------------------------------------------------------
  // 7. FEES & PAYMENTS ROUTES
  // -------------------------------------------------------------
  if (url === '/fees' && method === 'get') {
    let list = [...store.fees];
    if (queryParams.status) list = list.filter((f) => f.status === queryParams.status);
    if (queryParams.category) list = list.filter((f) => f.fee_category === queryParams.category);
    return Promise.resolve(mockResponse({ success: true, data: list }));
  }

  if (url === '/fees' && method === 'post') {
    const newId = store.fees.length ? Math.max(...store.fees.map((f) => f.id)) + 1 : 1;
    const student = store.students.find((s) => s.id === parseInt(body.student_id, 10));
    const due = parseFloat(body.amount_due || '0');
    const newFee: FeeRecord = {
      id: newId,
      student_id: parseInt(body.student_id, 10),
      student_name: student?.full_name || 'Student',
      student_code: student?.student_id || 'STU',
      student_email: student?.email || '',
      room_number: student?.room_number || '',
      hostel_name: student?.hostel_name || '',
      fee_category: body.fee_category || 'hostel_rent',
      academic_period: body.academic_period || 'Fall 2024',
      amount_due: due,
      amount_paid: 0,
      balance: due,
      due_date: body.due_date || new Date().toISOString().split('T')[0],
      status: 'pending',
      description: body.description || '',
      created_at: new Date().toISOString(),
    };
    store.fees.unshift(newFee);
    saveStore(store);
    return Promise.resolve(
      mockResponse({
        success: true,
        message: 'Fee invoice generated successfully.',
        data: newFee,
      })
    );
  }

  if (url === '/payments' && method === 'get') {
    return Promise.resolve(mockResponse({ success: true, data: store.payments }));
  }

  if (url === '/payments' && method === 'post') {
    const newId = store.payments.length ? Math.max(...store.payments.map((p) => p.id)) + 1 : 1;
    const fee = store.fees.find((f) => f.id === parseInt(body.fee_record_id, 10));
    const paidAmt = parseFloat(body.amount || '0');

    if (fee) {
      fee.amount_paid += paidAmt;
      fee.balance = Math.max(0, fee.amount_due - fee.amount_paid);
      fee.status = fee.balance === 0 ? 'paid' : 'partially_paid';
    }

    const newPayment: Payment = {
      id: newId,
      fee_record_id: parseInt(body.fee_record_id, 10),
      student_id: fee ? fee.student_id : 1,
      student_name: fee ? fee.student_name : 'Student',
      student_code: fee ? fee.student_code : 'STU',
      student_email: fee ? fee.student_email : '',
      receipt_number: `REC-2024-${String(1000 + newId)}`,
      amount: paidAmt,
      payment_method: body.payment_method || 'upi',
      transaction_reference: body.transaction_reference || `TXN-${Date.now()}`,
      payment_date: new Date().toISOString().split('T')[0],
      recorded_by: 1,
      recorded_by_name: 'Dr. Sarah Jenkins',
      remarks: body.remarks || 'Payment cleared successfully.',
      created_at: new Date().toISOString(),
    };

    store.payments.unshift(newPayment);
    saveStore(store);
    return Promise.resolve(
      mockResponse({
        success: true,
        message: 'Payment recorded successfully.',
        data: newPayment,
      })
    );
  }

  if (url.startsWith('/payments/receipt/') && method === 'get') {
    const id = parseInt(url.split('/')[3], 10);
    const p = store.payments.find((item) => item.id === id);
    if (!p) return mockError('Receipt not found.', 404);
    return Promise.resolve(mockResponse({ success: true, data: p }));
  }

  // -------------------------------------------------------------
  // 8. VISITORS ROUTES
  // -------------------------------------------------------------
  if (url === '/visitors' && method === 'get') {
    return Promise.resolve(mockResponse({ success: true, data: store.visitorLogs }));
  }

  if (url === '/visitors/check-in' && method === 'post') {
    const newId = store.visitorLogs.length ? Math.max(...store.visitorLogs.map((v) => v.id)) + 1 : 1;
    const student = store.students.find((s) => s.id === parseInt(body.student_id, 10));

    const newLog: VisitorLog = {
      id: newId,
      visitor_id: newId,
      visitor_name: body.visitor_name,
      visitor_phone: body.visitor_phone,
      id_proof_type: body.id_proof_type || 'National ID',
      id_proof_number: body.id_proof_number || 'NID-001',
      student_id: parseInt(body.student_id, 10),
      student_name: student?.full_name || 'Alex Turner',
      student_code: student?.student_id || 'STU-001',
      room_number: student?.room_number || '101',
      hostel_name: student?.hostel_name || 'Olympus Hall',
      relationship: body.relationship || 'Guardian',
      purpose: body.purpose || 'Visit',
      check_in_time: new Date().toISOString().replace('T', ' ').substring(0, 19),
      check_out_time: null,
      status: 'checked_in',
      recorded_by: 2,
      recorded_by_name: 'Robert Vance',
      remarks: body.remarks || '',
    };

    store.visitorLogs.unshift(newLog);
    saveStore(store);
    return Promise.resolve(
      mockResponse({
        success: true,
        message: 'Visitor checked in successfully.',
        data: newLog,
      })
    );
  }

  if (url.includes('/visitors/') && url.endsWith('/check-out') && method === 'post') {
    const id = parseInt(url.split('/')[2], 10);
    const log = store.visitorLogs.find((v) => v.id === id);
    if (!log) return mockError('Visitor record not found.', 404);

    log.status = 'checked_out';
    log.check_out_time = new Date().toISOString().replace('T', ' ').substring(0, 19);
    saveStore(store);
    return Promise.resolve(
      mockResponse({
        success: true,
        message: 'Visitor checked out successfully.',
      })
    );
  }

  // -------------------------------------------------------------
  // 9. MAINTENANCE ROUTES
  // -------------------------------------------------------------
  if (url === '/maintenance' && method === 'get') {
    return Promise.resolve(mockResponse({ success: true, data: store.maintenance }));
  }

  if (url === '/maintenance' && method === 'post') {
    const newId = store.maintenance.length ? Math.max(...store.maintenance.map((m) => m.id)) + 1 : 1;
    const student = store.students.find((s) => s.id === parseInt(body.student_id || '1', 10));
    const room = store.rooms.find((r) => r.id === parseInt(body.room_id || '1', 10));

    const newTicket: MaintenanceRequest = {
      id: newId,
      ticket_number: `TKT-2024-${String(1000 + newId)}`,
      student_id: student ? student.id : 1,
      student_name: student ? student.full_name : 'Student',
      student_code: student ? student.student_id : 'STU-001',
      room_id: room ? room.id : 1,
      room_number: room ? room.room_number : '101',
      hostel_id: room ? room.hostel_id : 1,
      hostel_name: room ? (room.hostel_name || 'Main Hall') : 'Olympus Hall',
      category: body.category || 'electrical',
      title: body.title,
      description: body.description,
      priority: body.priority || 'medium',
      status: 'submitted',
      assigned_to: null,
      assigned_to_name: null,
      resolution_notes: null,
      resolved_at: null,
      created_at: new Date().toISOString(),
    };

    store.maintenance.unshift(newTicket);
    saveStore(store);
    return Promise.resolve(
      mockResponse({
        success: true,
        message: 'Maintenance ticket lodged successfully.',
        data: newTicket,
      })
    );
  }

  if (url.startsWith('/maintenance/') && method === 'put') {
    const id = parseInt(url.split('/')[2], 10);
    const idx = store.maintenance.findIndex((m) => m.id === id);
    if (idx === -1) return mockError('Ticket not found.', 404);

    store.maintenance[idx] = {
      ...store.maintenance[idx],
      ...body,
      resolved_at: body.status === 'resolved' ? new Date().toISOString() : store.maintenance[idx].resolved_at,
    };
    saveStore(store);
    return Promise.resolve(
      mockResponse({
        success: true,
        message: 'Ticket status updated.',
        data: store.maintenance[idx],
      })
    );
  }

  // -------------------------------------------------------------
  // 10. ATTENDANCE ROUTES
  // -------------------------------------------------------------
  if (url === '/attendance' && method === 'get') {
    return Promise.resolve(mockResponse({ success: true, data: store.attendance }));
  }

  if (url === '/attendance' && method === 'post') {
    const { student_id, status, remarks } = body;
    const rec = store.attendance.find((a) => a.student_id === parseInt(student_id, 10));
    if (rec) {
      rec.attendance_status = status;
      rec.remarks = remarks || rec.remarks;
    }
    saveStore(store);
    return Promise.resolve(
      mockResponse({
        success: true,
        message: 'Attendance recorded.',
      })
    );
  }

  if (url === '/attendance/bulk' && method === 'post') {
    const { records = [] } = body;
    records.forEach((item: any) => {
      const rec = store.attendance.find((a) => a.student_id === parseInt(item.student_id, 10));
      if (rec) {
        rec.attendance_status = item.status;
        rec.remarks = item.remarks || rec.remarks;
      }
    });
    saveStore(store);
    return Promise.resolve(
      mockResponse({
        success: true,
        message: 'Bulk attendance recorded successfully.',
      })
    );
  }

  // -------------------------------------------------------------
  // 11. REPORTS ROUTES
  // -------------------------------------------------------------
  if (url === '/reports/occupancy' && method === 'get') {
    const hostelStats = store.hostels.map((h) => {
      const hRooms = store.rooms.filter((r) => r.hostel_id === h.id);
      const cap = hRooms.reduce((acc, r) => acc + (r.capacity || 0), 0);
      const occ = hRooms.reduce((acc, r) => acc + (r.current_occupancy || 0), 0);
      return {
        id: h.id,
        name: h.name,
        code: h.code,
        type: h.type,
        total_rooms: hRooms.length,
        total_capacity: cap,
        current_occupancy: occ,
        available_beds: Math.max(0, cap - occ),
        occupancy_rate: cap > 0 ? ((occ / cap) * 100).toFixed(1) : 0,
      };
    });

    const roomsList = store.rooms.map((r) => ({
      id: r.id,
      room_number: r.room_number,
      hostel_name: r.hostel_name,
      floor: r.floor,
      room_type: r.room_type,
      capacity: r.capacity,
      current_occupancy: r.current_occupancy,
      available_beds: Math.max(0, r.capacity - r.current_occupancy),
      status: r.status,
      fee_per_month: r.fee_per_month,
    }));

    return Promise.resolve(
      mockResponse({
        success: true,
        data: {
          hostelStats,
          roomsList,
        },
      })
    );
  }

  if (url === '/reports/fees' && method === 'get') {
    const categoryBreakdown = [
      {
        fee_category: 'hostel_rent',
        total_invoices: 6,
        total_due: 17940,
        total_paid: 10580,
        total_balance: 7360,
      },
      {
        fee_category: 'mess_fee',
        total_invoices: 2,
        total_due: 2400,
        total_paid: 1800,
        total_balance: 600,
      },
    ];

    const statusBreakdown = [
      { status: 'paid', count: 4, balance_amount: 0 },
      { status: 'partially_paid', count: 3, balance_amount: 5080 },
      { status: 'overdue', count: 1, balance_amount: 2880 },
    ];

    const paymentMethods = [
      { payment_method: 'upi', count: 2, total_amount: 3900 },
      { payment_method: 'card', count: 1, total_amount: 2880 },
      { payment_method: 'cash', count: 1, total_amount: 1500 },
      { payment_method: 'bank_transfer', count: 1, total_amount: 600 },
    ];

    return Promise.resolve(
      mockResponse({
        success: true,
        data: {
          categoryBreakdown,
          statusBreakdown,
          paymentMethods,
        },
      })
    );
  }

  if (url === '/reports/maintenance' && method === 'get') {
    const byCategory = [
      { category: 'electrical', total: 1, resolved_count: 1, pending_count: 0 },
      { category: 'plumbing', total: 1, resolved_count: 0, pending_count: 1 },
      { category: 'internet', total: 1, resolved_count: 0, pending_count: 1 },
      { category: 'furniture', total: 1, resolved_count: 0, pending_count: 1 },
    ];

    const byPriority = [
      { priority: 'high', total: 1 },
      { priority: 'medium', total: 2 },
      { priority: 'low', total: 1 },
    ];

    return Promise.resolve(
      mockResponse({
        success: true,
        data: {
          byCategory,
          byPriority,
        },
      })
    );
  }

  // -------------------------------------------------------------
  // 12. USERS ROUTES
  // -------------------------------------------------------------
  if (url === '/users' && method === 'get') {
    const safeUsers = store.users.map(({ password, ...u }) => u);
    return Promise.resolve(mockResponse({ success: true, data: safeUsers }));
  }

  if (url === '/users' && method === 'post') {
    const newId = store.users.length ? Math.max(...store.users.map((u) => u.id)) + 1 : 1;
    const newUser: any = {
      id: newId,
      email: body.email,
      password: body.password || 'password123',
      full_name: body.full_name,
      role: body.role,
      phone: body.phone || '',
      status: body.status || 'active',
      created_at: new Date().toISOString(),
    };
    store.users.push(newUser);
    saveStore(store);
    const { password: _, ...safe } = newUser;
    return Promise.resolve(
      mockResponse({
        success: true,
        message: 'User created successfully.',
        data: safe,
      })
    );
  }

  if (url.startsWith('/users/') && url.endsWith('/reset-password') && method === 'post') {
    return Promise.resolve(
      mockResponse({
        success: true,
        message: 'Password reset successfully to default (password123).',
      })
    );
  }

  if (url.startsWith('/users/') && method === 'put') {
    const id = parseInt(url.split('/')[2], 10);
    const user = store.users.find((u) => u.id === id);
    if (!user) return mockError('User not found.', 404);
    if (body.status) user.status = body.status;
    saveStore(store);
    const { password: _, ...safe } = user;
    return Promise.resolve(
      mockResponse({
        success: true,
        message: 'User updated successfully.',
        data: safe,
      })
    );
  }

  // Default fallback for any unhandled GET/POST
  return Promise.resolve(
    mockResponse({
      success: true,
      message: 'Operation processed in Cloud Demo Mode.',
      data: [],
    })
  );
}
