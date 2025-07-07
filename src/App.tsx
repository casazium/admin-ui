// src/App.tsx
import { Routes, Route, Link } from 'react-router-dom';
import IssueLicense from './pages/IssueLicense';
import LicenseList from './pages/LicenseList';

export default function App() {
  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <nav className="mb-6 space-x-4">
        <Link to="/" className="underline">
          Dashboard
        </Link>
        <Link to="/licenses" className="underline">
          Licenses
        </Link>
        <Link to="/issue" className="underline">
          Issue License
        </Link>
      </nav>

      <Routes>
        <Route path="/" element={<div>Dashboard</div>} />
        <Route path="/licenses" element={<LicenseList />} />
        <Route path="/issue" element={<IssueLicense />} />
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </div>
  );
}
