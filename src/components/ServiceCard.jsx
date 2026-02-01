import { Link } from 'react-router-dom';

export default function ServiceCard({ svc }) {
  return (
    <div className="bg-white rounded-xl shadow border border-blue-100 p-4 flex flex-col">
      <img src={svc.image_url || '/vite.svg'} alt={svc.name} className="w-full h-40 object-cover rounded mb-2 border border-blue-50 bg-blue-50" />
      <div className="font-bold text-blue-800 text-lg mb-1">{svc.name}</div>
      <div className="text-blue-600 mb-1">฿{svc.price}</div>
      <div className="text-blue-400 text-sm mb-2 line-clamp-2">{svc.description}</div>
      <Link to={`/services/${svc._id}`} className="btn btn-primary bg-blue-500 hover:bg-blue-600 text-white mt-auto">View</Link>
    </div>
  );
}
