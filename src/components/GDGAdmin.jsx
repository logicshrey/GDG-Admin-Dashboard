import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ChevronDown, ChevronRight, Calendar, Clock, Copy, LogOut } from 'lucide-react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import './GDGAdmin.css';
import { formatAttendanceForSummary } from './GeminiSummaryUtils';

const GDGAdmin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // true until auth check
  const [error, setError] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [actionLoading, setActionLoading] = useState('');
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [summaryError, setSummaryError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerateSummary = async () => {
    setSummaryError('');
    setCopied(false);
    setSummary('');
    setSummaryLoading(true);
    try {
      // Filter approved records
      const approved = attendanceRecords.filter(r => r.status === 'approved');
      if (approved.length === 0) {
        setSummaryError('No approved attendance records to summarize.');
        setSummaryLoading(false);
        return;
      }
      const formatted = formatAttendanceForSummary(approved);
      const response = await fetch('http://localhost:5050/api/ai-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formattedAttendance: formatted })
      });
      const data = await response.json();
      if (response.ok && data.summary) {
        setSummary(data.summary);
      } else {
        setSummaryError(data.error || 'Failed to generate summary.');
      }
    } catch (err) {
      setSummaryError('Failed to contact Gemini AI server.');
    } finally {
      setSummaryLoading(false);
    }
  };

  const toggleRow = (id) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const formatDate = (dateStr) => {
    const [day, month, year] = dateStr.split('/');
    return `${month}/${day}/${year}`;
  };

  // Auth protection and data fetch
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
      if (response.ok) {
        setAttendanceRecords(data.data);
      } else {
        setError(data.message);
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

  if (loading) {
    return (
      <div className="login-container">
        <div className="login-box">
          <h2>GDG Admin Login</h2>
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <button
          className="logout-btn"
          style={{position:'absolute', top:20, right:20, background:'#f44336', color:'#fff', border:'none', borderRadius:6, padding:'8px 16px', fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:8}}
          onClick={async () => { await signOut(auth); navigate('/login'); }}
        >
          <LogOut size={18} style={{marginRight:6}} /> Logout
        </button>
        <button style={{backgroundColor:"royalblue"}} disabled={loading} className="login-button" onClick={() => navigate('/attendance_page')}>
                {loading ? <Loader2 className="spinner" /> : 'Generate Final Record'}
              </button>
        <h1>Attendance Dashboard</h1>

          {error && <div style={{ color: 'red', margin: '16px 0', fontWeight: 500 }}>{error}</div>}
          {attendanceRecords.length === 0 && !loading && !error && (
            <div style={{ color: 'gray', margin: '20px 0', fontSize: 18 }}>
              No attendance records found.
            </div>
          )}

          {/* DEBUG: Print attendanceRecords as JSON */}
          <pre style={{color: "black", background: "#eee", padding: 10}}>
            {JSON.stringify(attendanceRecords, null, 2)}
          </pre>

          {/* DEBUG: Simple list rendering */}
          <ul style={{margin: '20px 0', fontSize: 16}}>
            {attendanceRecords.map(r => (
              <li key={r._id}>{r.member.fullName} - {r.status}</li>
            ))}
          </ul>

          <div className="table-container">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>Member</th>
                  <th>Team</th>
                  <th>Event Date</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.map((record) => (
                  <React.Fragment key={record._id}>
                    <tr>
                      <td>
                        <button
                          onClick={() => toggleRow(record._id)}
                          className="expand-button"
                        >
                          {expandedRows.has(record._id) ? 
                            <ChevronDown className="icon" /> : 
                            <ChevronRight className="icon" />
                          }
                        </button>
                      </td>
                      <td>
                        <div className="member-name">{record.member.fullName}</div>
                        <div className="member-email">{record.member.email}</div>
                      </td>
                      <td>{record.member.team}</td>
                      <td>{formatDate(record.eventDate)}</td>
                      <td>{record.reason}</td>
                      <td>
                        <span className={`status-badge ${record.status}`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="action-buttons">
                        <button
                          onClick={() => handleAttendanceAction(record._id, 'approve')}
                          disabled={record.status !== 'requested' || actionLoading === record._id}
                          className="approve-button"
                        >
                          {actionLoading === record._id ? (
                            <Loader2 className="spinner" /> 
                          ) : (
                            'Approve'
                          )}
                        </button>
                        <button
                          onClick={() => handleAttendanceAction(record._id, 'reject')}
                          disabled={record.status !== 'requested' || actionLoading === record._id}
                          className="reject-button"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                    {expandedRows.has(record._id) && (
                      <tr className="expanded-row">
                        <td colSpan="7">
                          <div className="session-details">
                            <div className="section-title">Session Details:</div>
                            <div className="sessions-list">
                              {record.sessionDetails.map((session) => (
                                <div key={session._id} className="session-item">
                                  <span className="session-name">
                                    <Calendar className="icon" />
                                    {session.sessionName}
                                  </span>
                                  <span className="session-time">
                                    <Clock className="icon" />
                                    {session.startTime} - {session.endTime}
                                  </span>
                                </div>
                              ))}
                            </div>
                            {record.note && (
                              <div className="note-section">
                                <div className="section-title">Note:</div>
                                <div className="note-content">{record.note}</div>
                              </div>
                            )}
                            <div className="timestamps">
                              <div>Created: {record.formattedCreatedAt}</div>
                              <div>Last Updated: {record.formattedUpdatedAt}</div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
}

export default GDGAdmin
