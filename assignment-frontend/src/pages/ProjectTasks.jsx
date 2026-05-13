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

    // --- DESKTOP DRAG LOGIC (UNCHANGED) ---
    const onDragStart = (e, taskId) => {
        e.dataTransfer.setData('taskId', taskId);
    };

    const onDragOver = (e) => {
        e.preventDefault();
    };

    const onDrop = async (e, newStatus) => {
        const taskId = e.dataTransfer.getData('taskId');
        if (!taskId) return;
        handleStatusChange(taskId, newStatus);
    };

    const handleStatusChange = async (taskId, newStatus) => {
        const taskToMove = tasks.find(t => t._id === taskId);
        if (taskToMove && taskToMove.status !== newStatus) {
            // Optimistic Update
            setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
            try {
                await updateTaskStatusAPI(taskId, newStatus);
            } catch (err) {
                fetchTasks();
            }
        }
    };

    const getTasksByStatus = (status) => tasks.filter(t => t.status === status);

    // --- REUSABLE TASK CARD ---
    const TaskCard = ({ task }) => {
        const [showMobileOptions, setShowMobileOptions] = useState(false);

        return (
            <div 
                draggable
                onDragStart={(e) => onDragStart(e, task._id)}
                onClick={() => { if(window.innerWidth < 768) setShowMobileOptions(!showMobileOptions) }}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 group mb-3 cursor-grab active:cursor-grabbing hover:border-blue-400 transition-all border-l-4 border-l-blue-500"
            >
                <div className="flex justify-between items-start">
                    <div className="flex items-start flex-1">
                        <GripVertical size={16} className="text-gray-300 mr-2 mt-1 hidden md:block" />
                        <p className="text-sm font-semibold text-gray-700">{task.title}</p>
                    </div>
                    <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteTask(task._id); }}
                        className="text-gray-400 hover:text-red-500 md:opacity-0 group-hover:opacity-100 transition px-1"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>

                {/* MOBILE ONLY: QUICK ACTION BUTTONS */}
                {showMobileOptions && (
                    <div className="mt-3 flex gap-2 flex-wrap md:hidden border-t pt-3 animate-in fade-in slide-in-from-top-1">
                        <p className="w-full text-[10px] text-gray-400 font-bold uppercase mb-1">Move to:</p>
                        {['Todo', 'In Progress', 'Done'].filter(s => s !== task.status).map(status => (
                            <button
                                key={status}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusChange(task._id, status);
                                    setShowMobileOptions(false);
                                }}
                                className="text-[10px] bg-blue-50 text-blue-700 font-bold px-3 py-1.5 rounded-md border border-blue-100 active:bg-blue-100"
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const Column = ({ title, status, bgColor, borderColor, accentColor }) => (
        <div 
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, status)}
            className={`p-4 rounded-xl border ${bgColor} ${borderColor} min-h-[450px] flex flex-col`}
        >
            <div className="flex justify-between items-center mb-5 pb-2 border-b">
                <h3 className={`font-bold uppercase tracking-wider text-xs ${accentColor}`}>{title}</h3>
                <span className="bg-white px-2 py-0.5 rounded-full text-xs font-bold text-gray-400 border">
                    {getTasksByStatus(status).length}
                </span>
            </div>
            <div className="flex-1">
                {getTasksByStatus(status).map(task => <TaskCard key={task._id} task={task} />)}
            </div>
        </div>
    );

    return (
        <div className="animate-fade-in max-w-7xl mx-auto px-4 py-6">
            {/* Header with Title and Create Form */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
                <div>
                    <Link to="/dashboard" className="text-sm font-medium text-blue-600 hover:underline flex items-center mb-2">
                        <ArrowLeft size={14} className="mr-1" /> Dashboard
                    </Link>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">{projectName}</h2>
                </div>
                
                <form onSubmit={handleCreateTask} className="flex gap-2 w-full lg:w-auto bg-white p-2 rounded-xl shadow-sm border border-gray-200">
                    <input 
                        placeholder="Add a new task..." 
                        required 
                        className="flex-1 lg:w-72 px-4 py-2 text-sm outline-none"
                        value={newTaskTitle} 
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                    />
                    <Button type="submit" isLoading={actionLoading} className="!rounded-lg !py-2.5 !px-5">
                        <Plus size={20} />
                    </Button>
                </form>
            </div>

            {/* Main Kanban Board */}
            {loading ? <Loader /> : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Column 
                        title="To Do" status="Todo" 
                        bgColor="bg-gray-50/50" borderColor="border-gray-200" accentColor="text-gray-500" 
                    />
                    <Column 
                        title="In Progress" status="In Progress" 
                        bgColor="bg-blue-50/30" borderColor="border-blue-100" accentColor="text-blue-600" 
                    />
                    <Column 
                        title="Done" status="Done" 
                        bgColor="bg-green-50/30" borderColor="border-green-100" accentColor="text-green-600" 
                    />
                </div>
            )}
        </div>
    );
};

export default ProjectTasks;