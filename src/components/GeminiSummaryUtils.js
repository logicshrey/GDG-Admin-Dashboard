
export function formatAttendanceForSummary(attendanceRecords) {
  if (!attendanceRecords || attendanceRecords.length === 0) return '';
  return attendanceRecords.map((rec, idx) => {
    const name = rec.member?.fullName || 'Unknown';
    const date = rec.eventDate || 'Unknown date';
    const lecturesMissed = rec.lecturesMissed || rec.sessionDetails?.length || 'N/A';
    const reason = rec.reason || 'No reason provided';
    return `${idx + 1}. ${name} missed ${lecturesMissed} lecture(s) on ${date}. Reason: ${reason}.`;
  }).join('\n');
}
