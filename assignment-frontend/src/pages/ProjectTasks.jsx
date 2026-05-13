import { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { getTasksByProjectAPI, createTaskAPI, updateTaskStatusAPI, deleteTaskAPI } from '../api/task.api';
import { ArrowLeft, Plus, Trash2, GripVertical } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Loader from '../components/ui/Loader';

const ProjectTasks = () => {
    const { projectId } = useParams();
    const location = useLocation();
    const projectName = location.state?.projectName || 'Project Board';
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchTasks(); }, [projectId]);

    const fetchTasks = async () => {
        try {
            const data = await getTasksByProjectAPI(projectId);
            setTasks(data);
        } catch (err) { console.error(err); } 
        finally { setLoading(false); }
    };

    const onDragStart = (e, taskId) => { e.dataTransfer.setData('taskId', taskId); };
    const onDragOver = (e) => { e.preventDefault(); };
    const onDrop = async (e, newStatus) => {
        const taskId = e.dataTransfer.getData('taskId');
        handleUpdateStatus(taskId, newStatus);
    };

    const handleUpdateStatus = async (taskId, newStatus) => {
        setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
        try { await updateTaskStatusAPI(taskId, newStatus); } 
        catch (err) { fetchTasks(); }
    };

    const TaskCard = ({ task }) => (
        <div 
            draggable onDragStart={(e) => onDragStart(e, task._id)}
            className="bg-white p-3 rounded-lg shadow-sm border mb-3 group"
        >
            <div className="flex justify-between items-start">
                <div className="flex items-center">
                    <GripVertical size={14} className="text-gray-300 mr-2 hidden md:block" />
                    <span className="text-sm font-medium">{task.title}</span>
                </div>
                <button onClick={() => deleteTaskAPI(task._id).then(fetchTasks)} className="text-red-400 opacity-0 group-hover:opacity-100"><Trash2 size={14}/></button>
            </div>
            <select 
                className="mt-2 text-xs border rounded md:hidden w-full p-1"
                value={task.status}
                onChange={(e) => handleUpdateStatus(task._id, e.target.value)}
            >
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
            </select>
        </div>
    );

    const Column = ({ title, status, color }) => (
        <div onDragOver={onDragOver} onDrop={(e) => onDrop(e, status)} className={`p-4 rounded-xl bg-gray-50 border-t-4 ${color} min-h-[400px]`}>
            <h3 className="font-bold mb-4 text-gray-600">{title}</h3>
            {tasks.filter(t => t.status === status).map(task => <TaskCard key={task._id} task={task} />)}
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{projectName}</h2>
                <Link to="/dashboard" className="text-blue-600 flex items-center"><ArrowLeft size={16}/> Back</Link>
            </div>
            {loading ? <Loader /> : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Column title="TO DO" status="Todo" color="border-gray-400" />
                    <Column title="IN PROGRESS" status="In Progress" color="border-blue-400" />
                    <Column title="DONE" status="Done" color="border-green-400" />
                </div>
            )}
        </div>
    );
};
export default ProjectTasks;