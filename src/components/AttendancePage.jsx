import React, { useState, useEffect } from 'react';
import AttendanceTable from './AttendanceTable';

const AttendancePage = () => {
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    fetch('https://gdg-attendance-app.vercel.app/gdg/api/attendances/get_final_attendance')
      .then(response => response.json())
      .then(result => setAttendanceData(result.data));
  }, []);

  return <AttendanceTable data={attendanceData} />;
};

export default AttendancePage;