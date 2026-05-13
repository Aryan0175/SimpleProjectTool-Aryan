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
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchTasks();
    }, [projectId]);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const data = await getTasksByProjectAPI(projectId);
            setTasks(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;
        try {
            setActionLoading(true);
            const newTask = await createTaskAPI({ title: newTaskTitle, projectId });
            setTasks([...tasks, newTask]);
            setNewTaskTitle('');
        } catch (err) {
            alert(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (!window.confirm('Delete this task?')) return;
        try {
            await deleteTaskAPI(taskId);
            setTasks(tasks.filter(t => t._id !== taskId));
        } catch (err) {
            alert(err.message);
        }
    };

    const onDragStart = (e, taskId) => {
        e.dataTransfer.setData('taskId', taskId);
    };

    const onDragOver = (e) => {
        e.preventDefault(); 
    };

    const onDrop = async (e, newStatus) => {
        const taskId = e.dataTransfer.getData('taskId');
        const taskToMove = tasks.find(t => t._id === taskId);
        
        if (taskToMove && taskToMove.status !== newStatus) {
            setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
            
            try {
                await updateTaskStatusAPI(taskId, newStatus);
            } catch (err) {
                alert("Failed to move task");
                fetchTasks();
            }
        }
    };

    const getTasksByStatus = (status) => tasks.filter(t => t.status === status);

    const TaskCard = ({ task }) => (
        <div 
            draggable
            onDragStart={(e) => onDragStart(e, task._id)}
            className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 flex justify-between items-start group mb-3 cursor-grab active:cursor-grabbing hover:border-blue-300 transition"
        >
            <div className="flex items-start">
                <GripVertical size={16} className="text-gray-400 mr-2 mt-0.5" />
                <p className={`font-medium text-sm ${task.status === 'Done' ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                    {task.title}
                </p>
            </div>
            <button 
                onClick={() => handleDeleteTask(task._id)}
                className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition ml-2"
            >
                <Trash2 size={14} />
            </button>
        </div>
    );

    const Column = ({ title, status, bgColor, borderColor }) => (
        <div 
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, status)}
            className={`p-4 rounded-xl border-2 border-dashed ${bgColor} ${borderColor} min-h-[500px] transition-colors`}
        >
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-700 uppercase tracking-wide text-sm">{title}</h3>
                <span className="bg-white px-2 py-0.5 rounded-full text-xs font-bold text-gray-500 shadow-sm">
                    {getTasksByStatus(status).length}
                </span>
            </div>
            {getTasksByStatus(status).map(task => <TaskCard key={task._id} task={task} />)}
        </div>
    );

    return (
        <div className="animate-fade-in">
            <Link to="/dashboard" className="inline-flex items-center text-gray-500 hover:text-blue-600 transition mb-6 font-medium">
                <ArrowLeft size={18} className="mr-1" /> Back to Dashboard
            </Link>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        {projectName}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Drag and drop tasks to update their status.</p>
                </div>
                
                <form onSubmit={handleCreateTask} className="flex gap-2 w-full md:w-auto">
                    <Input 
                        placeholder="What needs to be done?" required className="w-full md:w-64"
                        value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)}
                    />
                    <Button type="submit" isLoading={actionLoading} className="px-6 mt-1 md:mt-0">
                        <Plus size={18} />
                    </Button>
                </form>
            </div>

            {loading ? <Loader /> : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Column title="To Do" status="Todo" bgColor="bg-gray-50" borderColor="border-gray-200" />
                    <Column title="In Progress" status="In Progress" bgColor="bg-blue-50/50" borderColor="border-blue-200" />
                    <Column title="Done" status="Done" bgColor="bg-green-50/50" borderColor="border-green-200" />
                </div>
            )}
        </div>
    );
};

export default ProjectTasks;