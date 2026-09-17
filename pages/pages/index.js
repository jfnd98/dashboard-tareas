import { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = {
  'Por iniciar': '#EF4444',
  'En proceso': '#F59E0B',
  'Completado': '#10B981',
  'Prioridad 1': '#DC2626',
  'Prioridad 2': '#FBBF24',
  'Prioridad 3': '#34D399'
};

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 10000); // Refresh cada 10 segundos
    return () => clearInterval(interval);
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/sheets');
      const data = await res.json();
      setTasks(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Cargando...</div>;

  // Procesar datos para gráficos
  const statusData = tasks.reduce((acc, task) => {
    const status = task['Status'] || 'Desconocido';
    const existing = acc.find(item => item.name === status);
    if (existing) existing.value += 1;
    else acc.push({ name: status, value: 1 });
    return acc;
  }, []);

  const priorityData = tasks.reduce((acc, task) => {
    const prio = task['Prioridad'] || 'Desconocido';
    const existing = acc.find(item => item.name === prio);
    if (existing) existing.value += 1;
    else acc.push({ name: prio, value: 1 });
    return acc;
  }, []);

  const projectData = tasks.reduce((acc, task) => {
    const project = task['Proyecto'] || 'Desconocido';
    const existing = acc.find(item => item.name === project);
    if (existing) existing.value += 1;
    else acc.push({ name: project, value: 1 });
    return acc;
  }, []);

  // Filtrar tareas por urgencia
  const urgentTasks = tasks.filter(t => t['Prioridad'] === '1' && t['Status'] !== 'Completado');
  const todayTasks = tasks.filter(t => t['Status'] === 'Por iniciar');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">📊 Dashboard Tareas</h1>
          <p className="text-slate-400">Última actualización: {new Date().toLocaleTimeString()}</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-700 rounded-lg p-4">
            <p className="text-slate-400 text-sm">Total Tareas</p>
            <p className="text-2xl font-bold text-white">{tasks.length}</p>
          </div>
          <div className="bg-red-900 rounded-lg p-4">
            <p className="text-slate-300 text-sm">Urgentes</p>
            <p className="text-2xl font-bold text-red-300">{urgentTasks.length}</p>
          </div>
          <div className="bg-blue-900 rounded-lg p-4">
            <p className="text-slate-300 text-sm">Por Iniciar</p>
            <p className="text-2xl font-bold text-blue-300">{todayTasks.length}</p>
          </div>
          <div className="bg-green-900 rounded-lg p-4">
            <p className="text-slate-300 text-sm">Completadas</p>
            <p className="text-2xl font-bold text-green-300">{tasks.filter(t => t['Status'] === 'Completado').length}</p>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Status Chart */}
          <div className="bg-slate-700 rounded-lg p-4">
            <h2 className="text-white font-bold mb-4">Por Estado</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" labelLine={false} label outerRadius={80} fill="#8884d8" dataKey="value">
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#888'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Priority Chart */}
          <div className="bg-slate-700 rounded-lg p-4">
            <h2 className="text-white font-bold mb-4">Por Prioridad</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Projects Chart */}
          <div className="bg-slate-700 rounded-lg p-4">
            <h2 className="text-white font-bold mb-4">Por Proyecto</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip />
                <Bar dataKey="value" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tareas Urgentes */}
        {urgentTasks.length > 0 && (
          <div className="bg-red-900 rounded-lg p-6 mb-8 border-l-4 border-red-500">
            <h2 className="text-white font-bold text-lg mb-4">⚠️ Tareas Urgentes</h2>
            <div className="space-y-2">
              {urgentTasks.map((task, i) => (
                <div key={i} className="bg-red-800 p-3 rounded flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-white font-semibold">{task['Tarea']}</p>
                    <p className="text-red-200 text-sm">{task['Proyecto']} • {task['Deadline']}</p>
                  </div>
                  <span className="bg-red-600 text-white px-2 py-1 rounded text-xs">{task['Status']}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lista de Tareas */}
        <div className="bg-slate-700 rounded-lg p-6">
          <h2 className="text-white font-bold text-lg mb-4">📋 Todas las Tareas</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-600">
                <tr>
                  <th className="px-4 py-2 text-white">Tarea</th>
                  <th className="px-4 py-2 text-white">Proyecto</th>
                  <th className="px-4 py-2 text-white">Prioridad</th>
                  <th className="px-4 py-2 text-white">Deadline</th>
                  <th className="px-4 py-2 text-white">Status</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task, i) => (
                  <tr key={i} className="border-b border-slate-600 hover:bg-slate-600">
                    <td className="px-4 py-2 text-slate-200">{task['Tarea']}</td>
                    <td className="px-4 py-2 text-slate-300">{task['Proyecto']}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${task['Prioridad'] === '1' ? 'bg-red-600' : task['Prioridad'] === '2' ? 'bg-yellow-600' : 'bg-green-600'} text-white`}>
                        Prio {task['Prioridad']}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-slate-300">{task['Deadline']}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${task['Status'] === 'Completado' ? 'bg-green-600' : task['Status'] === 'En proceso' ? 'bg-blue-600' : 'bg-gray-600'} text-white`}>
                        {task['Status']}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Tailwind CSS */}
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
