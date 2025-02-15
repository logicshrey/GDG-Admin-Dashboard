import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ChevronDown, ChevronRight, Calendar, Clock } from 'lucide-react';
import './GDGAdmin.css';

const GDGAdmin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [actionLoading, setActionLoading] = useState('');
  const [expandedRows, setExpandedRows] = useState(new Set());

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

  useEffect(() => {
    fetchAttendanceRecords();
  }, []);

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
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <button style={{backgroundColor:"royalblue"}} disabled={loading} className="login-button" onClick={() => navigate('/attendance_page')}>
          {loading ? <Loader2 className="spinner" /> : 'Generate Final Record'}
        </button>
        <h1>Attendance Dashboard</h1>
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
};

export default GDGAdmin;


// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Loader2, ChevronDown, ChevronRight, Calendar, Clock } from 'lucide-react';
// import './GDGAdmin.css';

// const GDGAdmin = () => {

//   const navigate = useNavigate();
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [attendanceRecords, setAttendanceRecords] = useState([]);
//   const [actionLoading, setActionLoading] = useState('');
//   const [expandedRows, setExpandedRows] = useState(new Set());

//   const toggleRow = (id) => {
//     const newExpanded = new Set(expandedRows);
//     if (newExpanded.has(id)) {
//       newExpanded.delete(id);
//     } else {
//       newExpanded.add(id);
//     }
//     setExpandedRows(newExpanded);
//   };

//   const formatDate = (dateStr) => {
//     const [day, month, year] = dateStr.split('/');
//     return `${month}/${day}/${year}`;
//   };

//   useEffect(() => {
//         if (isLoggedIn) {
//           fetchAttendanceRecords();
//         }
//       }, [isLoggedIn]);
    
//       const fetchAttendanceRecords = async () => {
//         try {
//           const response = await fetch('https://gdg-attendance-app.vercel.app/gdg/api/attendances/get_all_attendance', {
//             credentials: 'include'
//           });
//           const data = await response.json();
//           if (response.ok) {
//             setAttendanceRecords(data.data);
//           } else {
//             setError(data.message);
//           }
//         } catch (err) {
//           setError('Failed to fetch attendance records');
//         }
//       };
    
//       const handleLogin = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError('');
    
//         try {
//           const response = await fetch('https://gdg-attendance-app.vercel.app/gdg/api/users/login', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             credentials: 'include',
//             body: JSON.stringify({ email, password })
//           });
    
//           const data = await response.json();
//           if (response.ok) {
//             setIsLoggedIn(true);
//           } else {
//             setError(data.message || 'Login failed');
//           }
//         } catch (err) {
//           setError('Login failed. Please try again.');
//         } finally {
//           setLoading(false);
//         }
//       };
    
//       const handleAttendanceAction = async (attendanceId, action) => {
//         setActionLoading(attendanceId);
//         try {
//           const response = await fetch(
//             `https://gdg-attendance-app.vercel.app/gdg/api/attendances/${action}_status/${attendanceId}`,
//             {
//               method: 'PATCH',
//               credentials: 'include'
//             }
//           );
    
//           if (response.ok) {
//             fetchAttendanceRecords();
//           } else {
//             setError(`Failed to ${action} attendance`);
//           }
//         } catch (err) {
//           setError(`Failed to ${action} attendance`);
//         } finally {
//           setActionLoading('');
//         }
//       };

//   if (!isLoggedIn) {
//     return (
//       <div className="login-container">
//         <div className="login-box">
//           <div>
//             <h2>GDG Admin Login</h2>
//           </div>
//           <form onSubmit={handleLogin}>
//             <div className="form-group">
//               <div>
//                 <label htmlFor="email">Email address</label>
//                 <input
//                   id="email"
//                   type="email"
//                   required
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                 />
//               </div>
//               <div>
//                 <label htmlFor="password">Password</label>
//                 <input
//                   id="password"
//                   type="password"
//                   required
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                 />
//               </div>
//             </div>

//             {error && <div className="error-message">{error}</div>}

//             <button type="submit" disabled={loading} className="login-button">
//               {loading ? <Loader2 className="spinner" /> : 'Sign in'}
//             </button>
//           </form>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="dashboard-container">
//       <div className="dashboard-content">
//         <button style={{backgroundColor:"royalblue"}} disabled={loading} className="login-button" onClick={() => navigate('/attendance_page')}>
//                 {loading ? <Loader2 className="spinner" /> : 'Generate Final Record'}
//               </button>
//         <h1>Attendance Dashboard</h1>
//         <div className="table-container">
//           <div className="table-wrapper">
//             <table>
//               <thead>
//                 <tr>
//                   <th></th>
//                   <th>Member</th>
//                   <th>Team</th>
//                   <th>Event Date</th>
//                   <th>Reason</th>
//                   <th>Status</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {attendanceRecords.map((record) => (
//                   <React.Fragment key={record._id}>
//                     <tr>
//                       <td>
//                         <button
//                           onClick={() => toggleRow(record._id)}
//                           className="expand-button"
//                         >
//                           {expandedRows.has(record._id) ? 
//                             <ChevronDown className="icon" /> : 
//                             <ChevronRight className="icon" />
//                           }
//                         </button>
//                       </td>
//                       <td>
//                         <div className="member-name">{record.member.fullName}</div>
//                         <div className="member-email">{record.member.email}</div>
//                       </td>
//                       <td>{record.member.team}</td>
//                       <td>{formatDate(record.eventDate)}</td>
//                       <td>{record.reason}</td>
//                       <td>
//                         <span className={`status-badge ${record.status}`}>
//                           {record.status}
//                         </span>
//                       </td>
//                       <td className="action-buttons">
//                         <button
//                           onClick={() => handleAttendanceAction(record._id, 'approve')}
//                           disabled={record.status !== 'requested' || actionLoading === record._id}
//                           className="approve-button"
//                         >
//                           {actionLoading === record._id ? (
//                             <Loader2 className="spinner" /> 
//                           ) : (
//                             'Approve'
//                           )}
//                         </button>
//                         <button
//                           onClick={() => handleAttendanceAction(record._id, 'reject')}
//                           disabled={record.status !== 'requested' || actionLoading === record._id}
//                           className="reject-button"
//                         >
//                           Reject
//                         </button>
//                       </td>
//                     </tr>
//                     {expandedRows.has(record._id) && (
//                       <tr className="expanded-row">
//                         <td colSpan="7">
//                           <div className="session-details">
//                             <div className="section-title">Session Details:</div>
//                             <div className="sessions-list">
//                               {record.sessionDetails.map((session) => (
//                                 <div key={session._id} className="session-item">
//                                   <span className="session-name">
//                                     <Calendar className="icon" />
//                                     {session.sessionName}
//                                   </span>
//                                   <span className="session-time">
//                                     <Clock className="icon" />
//                                     {session.startTime} - {session.endTime}
//                                   </span>
//                                 </div>
//                               ))}
//                             </div>
//                             {record.note && (
//                               <div className="note-section">
//                                 <div className="section-title">Note:</div>
//                                 <div className="note-content">{record.note}</div>
//                               </div>
//                             )}
//                             <div className="timestamps">
//                               <div>Created: {record.formattedCreatedAt}</div>
//                               <div>Last Updated: {record.formattedUpdatedAt}</div>
//                             </div>
//                           </div>
//                         </td>
//                       </tr>
//                     )}
//                   </React.Fragment>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };


// export default GDGAdmin;
