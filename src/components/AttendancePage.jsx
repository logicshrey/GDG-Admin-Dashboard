import React, { useState, useEffect } from 'react';
import AttendanceTable from './AttendanceTable';
import { Loader2, Copy } from 'lucide-react';
import { formatAttendanceForSummary } from './GeminiSummaryUtils';

const AttendancePage = () => {
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    fetch('https://gdg-attendance-app.vercel.app/gdg/api/attendances/get_final_attendance')
      .then(response => response.json())
      .then(result => setAttendanceData(result.data));
  }, []);

  // Gemini summary feature state
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
      if (!attendanceData || attendanceData.length === 0) {
        setSummaryError('No approved attendance records to summarize.');
        setSummaryLoading(false);
        return;
      }
      const formatted = formatAttendanceForSummary(attendanceData);
      const response = await fetch('http://localhost:8000/api/ai-summary', {
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

  const handleCopy = () => {
    if (summary) {
      navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  return (
    <div>
      <div style={{margin: '24px 0'}}>
        <button className="ai-summary-btn" disabled={summaryLoading} onClick={handleGenerateSummary} style={{padding:'10px 18px', borderRadius:8, background:'#222', color:'#fff', fontWeight:600, fontSize:'1rem', marginRight:12}}>
          {summaryLoading ? <Loader2 className="spinner" /> : 'Generate Summary (Gemini AI)'}
        </button>
        {summaryLoading && <span style={{marginLeft:8, color:'#555'}}>Generating summary...</span>}
        {summary && (
          <div className="ai-summary-box" style={{marginTop:18, border:'1px solid #bbb', borderRadius:8, background:'#f9faff', padding:18, position:'relative', maxWidth:600}}>
            <span style={{fontWeight:600, color:'#1a237e'}}>Gemini Summary:</span>
            <p style={{margin:'12px 0', whiteSpace:'pre-line', color:'#222'}}>{summary}</p>
            <button onClick={handleCopy} style={{position:'absolute', top:12, right:12, background:'none', border:'none', cursor:'pointer', color:'#1565c0'}} title="Copy to clipboard">
              <Copy size={20} />
              {copied && <span style={{marginLeft:4, color:'green', fontWeight:500, fontSize:13}}>Copied!</span>}
            </button>
          </div>
        )}
        {summaryError && <div style={{color:'red', marginTop:10}}>{summaryError}</div>}
      </div>
      <AttendanceTable data={attendanceData} />
    </div>
  );
};

export default AttendancePage;