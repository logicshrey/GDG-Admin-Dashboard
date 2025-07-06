import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

const SimpleAttendanceDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [actionLoading, setActionLoading] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchAttendanceRecords();
      } else {
        navigate('/login');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchAttendanceRecords = async () => {
    try {
      const response = await fetch('https://gdg-attendance-app.vercel.app/gdg/api/attendances/get_all_attendance', {
        credentials: 'include'
      });
      const data = await response.json();
      if (response.ok && Array.isArray(data.data)) {
        setAttendanceRecords(data.data);
      } else {
        setError(data.message || 'Failed to load attendance records.');
      }
    } catch (err) {
      setError('Failed to fetch attendance records');
    }
  };

  const handleAttendanceAction = async (attendanceId, action) => {
    setActionLoading(attendanceId);
    try {
      const response = await fetch(
        `https://gdg-attendance-app.vercel.app/gdg/api/attendances/${action}_status/${attendanceId}`,
        {
          method: 'PATCH',
          credentials: 'include'
        }
      );
      if (response.ok) {
        fetchAttendanceRecords();
      } else {
        setError(`Failed to ${action} attendance`);
      }
    } catch (err) {
      setError(`Failed to ${action} attendance`);
    } finally {
      setActionLoading('');
    }
  };

  if (loading) {
    return <div style={{textAlign:'center',marginTop:60}}>Checking authentication...</div>;
  }

  return (
    <div style={{maxWidth:700,margin:'40px auto',padding:24,background:'#fff',borderRadius:8,boxShadow:'0 2px 8px rgba(0,0,0,0.1)'}}>
      <button style={{float:'right',background:'#f44336',color:'#fff',border:'none',borderRadius:6,padding:'8px 16px',fontWeight:600,cursor:'pointer'}} onClick={async()=>{await signOut(auth);navigate('/login')}}>
        Logout
      </button>
      <button style={{background:'royalblue',color:'#fff',border:'none',borderRadius:6,padding:'8px 16px',fontWeight:600,cursor:'pointer',marginBottom:24,marginRight:12}} onClick={()=>navigate('/attendance_page')}>
        Generate Final Record
      </button>
      <h2 style={{marginBottom:24}}>Attendance Records</h2>
      {error && <div style={{color:'red',marginBottom:16}}>{error}</div>}
      {attendanceRecords.length === 0 ? (
        <div style={{color:'gray'}}>No attendance records found.</div>
      ) : (
        <ul style={{padding:0,listStyle:'none'}}>
          {attendanceRecords.map(record => (
            <li key={record._id} style={{marginBottom:16,padding:16,border:'1px solid #eee',borderRadius:6,position:'relative'}}>
              <div><b>Name:</b> {record.member.fullName}</div>
              <div><b>Email:</b> {record.member.email}</div>
              <div><b>Team:</b> {record.member.team}</div>
              <div><b>Date:</b> {record.eventDate}</div>
              <div><b>Status:</b> {record.status}</div>
              <div><b>Reason:</b> {record.reason}</div>
              {record.note && <div><b>Note:</b> {record.note}</div>}
              <div><b>Sessions:</b>
                <ul style={{margin:0,paddingLeft:16}}>
                  {record.sessionDetails.map(ses => (
                    <li key={ses._id}>{ses.sessionName} ({ses.startTime} - {ses.endTime})</li>
                  ))}
                </ul>
              </div>
              {record.status === 'requested' && (
                <div style={{marginTop:12,display:'flex',gap:8}}>
                  <button
                    disabled={actionLoading === record._id}
                    style={{background:'#22c55e',color:'#fff',border:'none',borderRadius:4,padding:'6px 14px',fontWeight:500,cursor:'pointer'}}
                    onClick={()=>handleAttendanceAction(record._id,'approve')}
                  >
                    {actionLoading === record._id ? 'Approving...' : 'Approve'}
                  </button>
                  <button
                    disabled={actionLoading === record._id}
                    style={{background:'#ef4444',color:'#fff',border:'none',borderRadius:4,padding:'6px 14px',fontWeight:500,cursor:'pointer'}}
                    onClick={()=>handleAttendanceAction(record._id,'reject')}
                  >
                    {actionLoading === record._id ? 'Rejecting...' : 'Reject'}
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SimpleAttendanceDashboard;
