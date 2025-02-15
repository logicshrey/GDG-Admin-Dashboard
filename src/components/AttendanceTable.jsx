import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import './AttendanceTable.css';

const AttendanceTable = ({ data }) => {
  const generatePDF = () => {
    const doc = new jsPDF();

    const tableColumn = ["Name", "Team", "Email", "Attendances"];
    const tableRows = [];

    data.forEach(({ member, attendances }) => {
      const attendanceDetails = attendances.map((attendance) =>
        `${attendance.eventDate}: ${attendance.sessionDetails
          .map(session => `${session.sessionName} (${session.startTime}-${session.endTime})`)
          .join(', ')} - ${attendance.reason}`
      ).join('\n');

      tableRows.push([
        member.fullName,
        member.team,
        member.email,
        attendanceDetails
      ]);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 8, cellPadding: 3 },
      columnStyles: {
        3: { cellWidth: 'auto' }
      }
    });

    doc.save('attendance_report.pdf');
  };

  const generateExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet_data = [];


    worksheet_data.push([
      "Name",
      "Team",
      "Email",
      "Attendances"
    ]);


    data.forEach(({ member, attendances }) => {
      const attendanceDetails = attendances.map((attendance) =>
        `${attendance.eventDate}: ${attendance.sessionDetails
          .map(session => `${session.sessionName} (${session.startTime}-${session.endTime})`)
          .join(', ')} - ${attendance.reason}`
      ).join(' | ');

      worksheet_data.push([
        member.fullName,
        member.team,
        member.email,
        attendanceDetails
      ]);
    });

    const worksheet = XLSX.utils.aoa_to_sheet(worksheet_data);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    XLSX.writeFile(workbook, "attendance_report.xlsx");
  };

  return (
    <div className="attendance-container">
      <div className="button-container">
        <button onClick={generatePDF} className="export-button">
          Export to PDF
        </button>
        <button onClick={generateExcel} className="export-button">
          Export to Excel
        </button>
      </div>

      <table className="attendance-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Team</th>
            <th>Email</th>
            <th>Attendances</th>
          </tr>
        </thead>
        <tbody>
          {data.map(({ member, attendances }) => (
            <tr key={member._id}>
              <td>{member.fullName}</td>
              <td>{member.team}</td>
              <td>{member.email}</td>
              <td>
                {attendances.map((attendance, index) => (
                  <div key={index} className="attendance-detail">
                    <strong>{attendance.eventDate}</strong>:{' '}
                    {attendance.sessionDetails.map((session, idx) => (
                      <div key={idx} className="session-detail">
                        {session.sessionName}
                        <br />
                        <span className="time">
                          {session.startTime} - {session.endTime}
                        </span>
                      </div>
                    ))}
                    <div className="reason">{attendance.reason}</div>
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;
