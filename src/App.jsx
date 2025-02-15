import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GDGAdmin from './components/GDGAdmin.jsx'
import AttendancePage from './components/AttendancePage.jsx';

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<GDGAdmin />} />
      <Route path="/attendance_page" element={<AttendancePage />} />
    </Routes>
  </BrowserRouter>
  )

}

export default App
