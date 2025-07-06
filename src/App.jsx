import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import GDGAdmin from './components/GDGAdmin.jsx';
import AttendancePage from './components/AttendancePage.jsx';
import LoginPage from './components/Login.jsx';
import SimpleAttendanceDashboard from './components/SimpleAttendanceDashboard.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin_dashboard" element={<GDGAdmin />} />
        <Route path="/attendance_page" element={<AttendancePage />} />
        <Route path="/simple_dashboard" element={<SimpleAttendanceDashboard />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
