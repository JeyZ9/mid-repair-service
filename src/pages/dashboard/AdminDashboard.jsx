import { useEffect, useState } from 'react';
import { getServices, deleteService } from '../../services/service.service';
import { createService, updateService, updateUserRole, assignBookingForAdmin } from '../../services/admin.service';
import { getAllUsers } from '../../services/user.service';
import { getBookings } from '../../services/booking.service';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-100 bg-opacity-60">
      <div className="bg-white rounded-xl shadow-xl p-6 min-w-[320px] max-w-[90vw] relative animate-fadeIn border border-blue-200">
        <button className="absolute top-2 right-2 text-blue-400 hover:text-blue-700 text-2xl" onClick={onClose}>&times;</button>
        {children}
      </div>
    </div>
  );
}

export default function AdminDashboard(){
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newService, setNewService] = useState({ name: '', price: '', description: '' });
  const [newServiceImage, setNewServiceImage] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editService, setEditService] = useState({ name: '', price: '', description: '' });
  const [editServiceImage, setEditServiceImage] = useState(null);
  const [showRole, setShowRole] = useState(false);
  const [roleUserId, setRoleUserId] = useState('');
  const [role, setRole] = useState('user');
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [showAssign, setShowAssign] = useState(false);
  const [assignBookingId, setAssignBookingId] = useState(null);
  const [technicians, setTechnicians] = useState([]);
  const [selectedTechnician, setSelectedTechnician] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);

  function load(){
    setLoading(true);
    getServices()
      .then(data => setServices(data || []))
      .catch(err => setMsg(err.message || 'Failed to load'))
      .finally(()=>setLoading(false));
    getBookings()
      .then(data => setBookings(data || []))
      .catch(()=>{})
      .finally(()=>{});
  }
  useEffect(() => {
    if (showAssign) {
      getAllUsers()
        .then(data => setTechnicians((data || []).filter(u => u.role === 'technician')))
        .catch(()=>setTechnicians([]));
    }
  }, [showAssign]);
  async function handleAssignTechnician(e) {
    e.preventDefault();
    if (!assignBookingId || !selectedTechnician) return;
    setAssignLoading(true);
    try {
      await assignBookingForAdmin(assignBookingId, selectedTechnician);
      setShowAssign(false);
      setAssignBookingId(null);
      setSelectedTechnician('');
      load();
      Swal.fire('Assigned!', 'Technician assigned successfully.', 'success');
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message || 'Assign failed', 'error');
    } finally {
      setAssignLoading(false);
    }
  }

  useEffect(()=>{ load(); }, []);

  useEffect(()=>{
    if(showRole){
      setUsersLoading(true);
      getAllUsers()
        .then(data => setUsers(data || []))
        .catch(()=>setUsers([]))
        .finally(()=>setUsersLoading(false));
    }
  }, [showRole]);

  async function remove(id){
    const result = await Swal.fire({
      title: 'Delete this service?',
      text: 'Are you sure you want to delete?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#d1d5db',
      confirmButtonText: 'Yes, delete it!'
    });
    if(!result.isConfirmed) return;
    deleteService(id)
      .then(()=> {load(); Swal.fire('Deleted!','Service has been deleted.','success');})
      .catch(err=> Swal.fire('Error', err.response?.data?.message || err.message || 'Delete failed', 'error'));
  }

  async function handleAdd() {
    try {
      const formData = new FormData();
      formData.append('name', newService.name);
      formData.append('price', newService.price);
      formData.append('description', newService.description);
      if (newServiceImage) {
        formData.append('image', newServiceImage);
      }
      await createService(formData);
      setShowAdd(false);
      setNewService({ name: '', price: '', description: '' });
      setNewServiceImage(null);
      load();
      Swal.fire('Created!', 'Service has been created.', 'success');
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message || 'Create failed', 'error');
    }
  }

  async function handleEdit() {
    try {
      const formData = new FormData();
      formData.append('name', editService.name);
      formData.append('price', editService.price);
      formData.append('description', editService.description);
      if (editServiceImage) {
        formData.append('image', editServiceImage);
      }
      await updateService(editId, formData);
      setEditId(null);
      setEditService({ name: '', price: '', description: '' });
      setEditServiceImage(null);
      load();
      Swal.fire('Updated!', 'Service has been updated.', 'success');
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message || 'Update failed', 'error');
    }
  }

  function handleRoleChange(){
    updateUserRole(roleUserId, role)
      .then(()=>{ setShowRole(false); setRoleUserId(''); setRole('user'); load(); Swal.fire('Role updated!','User role has been updated.','success'); })
      .catch(err=> {
        if (err.message === 'Network Error' || !err.response) {
          Swal.fire('Network Error', 'Cannot connect to server. Please try again later.', 'error');
        } else {
          Swal.fire('Error', err.response?.data?.message || err.message || 'Role update failed', 'error');
        }
      });
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-4 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6 text-blue-700 drop-shadow">Admin Dashboard</h1>
        <div className="flex flex-wrap gap-2 mb-6">
          <button className="rounded px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow transition" onClick={()=>setShowAdd(true)}>+ Add Service</button>
          <button className="rounded px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold border border-blue-200 shadow transition" onClick={()=>setShowRole(true)}>Change User Role</button>
        </div>
        {msg && <div className="alert alert-error mb-4 bg-blue-100 text-blue-700 border-blue-300">{msg}</div>}
        <div className="bg-white rounded-xl shadow p-4 border border-blue-100 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Services</h2>
          {loading ? <div className="text-blue-400">Loading...</div> : (
            <div className="divide-y divide-blue-100">
              {services.map(s => (
                <div key={s._id} className="flex justify-between items-center py-3">
                  <div>
                    <div className="font-bold text-lg text-blue-800">{s.name}</div>
                    <div className="text-sm text-blue-500">฿{s.price}</div>
                    <div className="text-xs text-blue-300 max-w-xs truncate">{s.description}</div>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn btn-outline btn-sm border-blue-400 text-blue-600 hover:bg-blue-50" onClick={()=>{setEditId(s._id); setEditService({ name: s.name, price: s.price, description: s.description });}}>Edit</button>
                    <button className="btn btn-error btn-sm bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200" onClick={()=>remove(s._id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow p-4 border border-blue-100 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Bookings (Assign Technician)</h2>
          <div className="divide-y divide-blue-100">
            {bookings.length === 0 ? <div className="text-blue-400">No bookings found</div> : bookings.map(b => (
              <div key={b._id} className="flex justify-between items-center py-3">
                <div>
                  <div className="font-bold text-blue-800">{b.service_id?.name || '-'}</div>
                  <div className="text-blue-600">Appointment: {new Date(b.appointment_datetime).toLocaleString()}</div>
                  <div className="text-blue-400">Status: {b.status}</div>
                  <div className="text-blue-400 text-xs">User: {b.user_id?.name || '-'}</div>
                  <div className="text-blue-400 text-xs">Technician: {b.technician_id?.name || '-'}</div>
                </div>
                <div className="flex flex-col gap-2">
                  <button className="btn btn-sm bg-blue-500 hover:bg-blue-600 text-white" onClick={()=>{setShowAssign(true); setAssignBookingId(b._id);}}>Assign Technician</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Modal open={showAssign} onClose={()=>{setShowAssign(false); setAssignBookingId(null); setSelectedTechnician('');}}>
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-blue-100 mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-blue-700 text-center">Assign Technician</h2>
            <form className="flex flex-col gap-4" onSubmit={handleAssignTechnician}>
              <select className="input input-bordered border-blue-200 focus:border-blue-400 text-blue-800 bg-white w-full h-12 rounded-lg" value={selectedTechnician} onChange={e=>setSelectedTechnician(e.target.value)} required>
                <option value="">Select technician</option>
                {technicians.map(t => (
                  <option key={t._id} value={t._id}>{t.name} ({t.email})</option>
                ))}
              </select>
              <button className="btn btn-primary bg-blue-500 hover:bg-blue-600 text-white text-lg h-12 rounded-lg mt-2 shadow-none" type="submit" disabled={assignLoading || !selectedTechnician}>{assignLoading ? 'Assigning...' : 'Assign'}</button>
            </form>
          </div>
        </Modal>
        <Modal open={showAdd} onClose={()=>setShowAdd(false)}>
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-blue-100 mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-blue-700 text-center">Add Service</h2>
            <form className="flex flex-col gap-4" onSubmit={e => { e.preventDefault(); handleAdd(); }}>
              <input className="input input-bordered border-blue-200 focus:border-blue-400 placeholder-blue-300 text-blue-800 bg-white w-full h-12 rounded-lg" placeholder="Name" value={newService.name} onChange={e=>setNewService(s=>({...s, name: e.target.value}))} required />
              <input className="input input-bordered border-blue-200 focus:border-blue-400 placeholder-blue-300 text-blue-800 bg-white w-full h-12 rounded-lg" placeholder="Price" type="number" value={newService.price} onChange={e=>setNewService(s=>({...s, price: e.target.value}))} required min="0" step="0.01" />
              <textarea className="input input-bordered border-blue-200 focus:border-blue-400 placeholder-blue-300 text-blue-800 bg-white w-full rounded-lg min-h-20" placeholder="Description" value={newService.description} onChange={e=>setNewService(s=>({...s, description: e.target.value}))} />
              <input className="input input-bordered border-blue-200 focus:border-blue-400 text-blue-800 bg-white w-full rounded-lg" type="file" accept="image/*" onChange={e=>setNewServiceImage(e.target.files[0])} required />
              <button className="btn btn-primary bg-blue-500 hover:bg-blue-600 text-white text-lg h-12 rounded-lg mt-2 shadow-none" type="submit">Create</button>
            </form>
          </div>
        </Modal>
        <Modal open={!!editId} onClose={()=>setEditId(null)}>
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-blue-100 mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-blue-700 text-center">Edit Service</h2>
            <form className="flex flex-col gap-4" onSubmit={e => { e.preventDefault(); handleEdit(); }}>
              <input className="input input-bordered border-blue-200 focus:border-blue-400 placeholder-blue-300 text-blue-800 bg-white w-full h-12 rounded-lg" placeholder="Name" value={editService.name} onChange={e=>setEditService(s=>({...s, name: e.target.value}))} required />
              <input className="input input-bordered border-blue-200 focus:border-blue-400 placeholder-blue-300 text-blue-800 bg-white w-full h-12 rounded-lg" placeholder="Price" type="number" value={editService.price} onChange={e=>setEditService(s=>({...s, price: e.target.value}))} required min="0" step="0.01" />
              <textarea className="input input-bordered border-blue-200 focus:border-blue-400 placeholder-blue-300 text-blue-800 bg-white w-full rounded-lg min-h-20" placeholder="Description" value={editService.description} onChange={e=>setEditService(s=>({...s, description: e.target.value}))} />
              <input className="input input-bordered border-blue-200 focus:border-blue-400 text-blue-800 bg-white w-full rounded-lg" type="file" accept="image/*" onChange={e=>setEditServiceImage && setEditServiceImage(e.target.files[0])} />
              <button className="btn btn-primary bg-blue-500 hover:bg-blue-600 text-white text-lg h-12 rounded-lg mt-2 shadow-none" type="submit">Save</button>
            </form>
          </div>
        </Modal>
        <Modal open={showRole} onClose={()=>setShowRole(false)}>
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-blue-100 mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-blue-700 text-center">Change User Role</h2>
            <form className="flex flex-col gap-4" onSubmit={e => { e.preventDefault(); handleRoleChange(); }}>
              {usersLoading ? (
                <div className="text-blue-400 mb-2 text-center">Loading users...</div>
              ) : (
                <select className="input input-bordered border-blue-200 focus:border-blue-400 text-blue-800 bg-white w-full h-12 rounded-lg" value={roleUserId} onChange={e=>setRoleUserId(e.target.value)} required>
                  <option value="">Select user</option>
                  {users.map(u => (
                    <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                  ))}
                </select>
              )}
              <select className="input input-bordered border-blue-200 focus:border-blue-400 text-blue-800 bg-white w-full h-12 rounded-lg" value={role} onChange={e=>setRole(e.target.value)} required>
                <option value="user">user</option>
                <option value="technician">technician</option>
                <option value="admin">admin</option>
              </select>
              <button className="btn btn-primary bg-blue-500 hover:bg-blue-600 text-white text-lg h-12 rounded-lg mt-2 shadow-none" type="submit" disabled={!roleUserId}>Change Role</button>
            </form>
          </div>
        </Modal>
      </div>
    </div>
  );
}
