import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/sheets');
      const data = await res.json();
      setTasks(data);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  if (loading) return <div style={{padding: '40px', textAlign: 'center', color: '#fff', background: '#1e293b', minHeight: '100vh'}}>Cargando...</div>;

  const completed = tasks.filter(t => t['Status'] === 'Completado').length;
  const urgent = tasks.filter(t => t['Prioridad'] === '1' && t['Status'] !== 'Completado').length;

  return (
    <div style={{background: '#1e293b', color: '#fff', padding: '20px', minHeight: '100vh', fontFamily: 'sans-serif'}}>
      <h1>📊 Dashboard Tareas</h1>
      
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '30px'}}>
        <div style={{background: '#334155', padding: '20px', borderRadius: '8px'}}>
          <p style={{margin: '0 0 10px 0', fontSize: '14px', color: '#cbd5e1'}}>Total</p>
          <p style={{margin: 0, fontSize: '28px', fontWeight: 'bold'}}>{tasks.length}</p>
        </div>
        <div style={{background: '#7f1d1d', padding: '20px', borderRadius: '8px'}}>
          <p style={{margin: '0 0 10px 0', fontSize: '14px', color: '#fca5a5'}}>Urgentes</p>
          <p style={{margin: 0, fontSize: '28px', fontWeight: 'bold'}}>{urgent}</p>
        </div>
        <div style={{background: '#065f46', padding: '20px', borderRadius: '8px'}}>
          <p style={{margin: '0 0 10px 0', fontSize: '14px', color: '#86efac'}}>Completadas</p>
          <p style={{margin: 0, fontSize: '28px', fontWeight: 'bold'}}>{completed}</p>
        </div>
      </div>

      <div style={{background: '#334155', padding: '20px', borderRadius: '8px', overflowX: 'auto'}}>
        <h2 style={{marginTop: 0}}>📋 Todas las Tareas</h2>
        <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '14px'}}>
          <thead>
            <tr style={{borderBottom: '2px solid #475569'}}>
              <th style={{textAlign: 'left', padding: '10px', fontWeight: 'bold'}}>Tarea</th>
              <th style={{textAlign: 'left', padding: '10px', fontWeight: 'bold'}}>Proyecto</th>
              <th style={{textAlign: 'left', padding: '10px', fontWeight: 'bold'}}>Prioridad</th>
              <th style={{textAlign: 'left', padding: '10px', fontWeight: 'bold'}}>Deadline</th>
              <th style={{textAlign: 'left', padding: '10px', fontWeight: 'bold'}}>Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, i) => (
              <tr key={i} style={{borderBottom: '1px solid #475569'}}>
                <td style={{padding: '10px'}}>{task['Tarea']}</td>
                <td style={{padding: '10px'}}>{task['Proyecto']}</td>
                <td style={{padding: '10px'}}><span style={{background: task['Prioridad'] === '1' ? '#dc2626' : task['Prioridad'] === '2' ? '#f59e0b' : '#10b981', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'}}>P{task['Prioridad']}</span></td>
                <td style={{padding: '10px'}}>{task['Deadline']}</td>
                <td style={{padding: '10px'}}>{task['Status']}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
