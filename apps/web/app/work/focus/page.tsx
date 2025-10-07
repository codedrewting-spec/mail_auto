const sessions = [
  {
    task: 'Draft product spec',
    start: '09:00',
    end: '09:50',
    status: 'completed'
  },
  {
    task: 'Sprint planning',
    start: '10:15',
    end: '10:40',
    status: 'interrupted'
  }
];

export default function WorkFocusPage() {
  return (
    <section className="focus">
      <header>
        <h2>Focus Calendar</h2>
        <p>Drop tasks onto the calendar and auto-capture Proof-of-Focus telemetry.</p>
      </header>
      <table>
        <thead>
          <tr>
            <th>Task</th>
            <th>Start</th>
            <th>End</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session) => (
            <tr key={`${session.task}-${session.start}`}>
              <td>{session.task}</td>
              <td>{session.start}</td>
              <td>{session.end}</td>
              <td>{session.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <style jsx>{`
        .focus {
          padding: 3rem 1.5rem;
          max-width: 960px;
          margin: 0 auto;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 16px;
          overflow: hidden;
        }
        th,
        td {
          padding: 1rem;
          text-align: left;
        }
        tbody tr:nth-child(even) {
          background: rgba(15, 23, 42, 0.05);
        }
      `}</style>
    </section>
  );
}
