import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProjectsAPI, createProjectAPI, deleteProjectAPI } from '../api/project.api';
import { Plus, Trash2, CalendarDays } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Loader from '../components/ui/Loader';
import { formatDate } from '../utils/formatters';

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [newProjectName, setNewProjectName] = useState('');
    const [newProjectDesc, setNewProjectDesc] = useState('');
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const data = await getProjectsAPI();
            setProjects(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();
        if (!newProjectName.trim()) return;
        
        try {
            setActionLoading(true);
            setError('');
            const newProject = await createProjectAPI({ 
                name: newProjectName, 
                description: newProjectDesc 
            });
            setProjects([newProject, ...projects]); 
            setNewProjectName(''); 
            setNewProjectDesc('');
        } catch (err) {
            setError(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteProject = async (id) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;
        try {
            await deleteProjectAPI(id);
            setProjects(projects.filter(project => project._id !== id));
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Create New Project</h2>
                {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
                
                <form onSubmit={handleCreateProject} className="flex flex-col md:flex-row gap-4 items-start">
                    <Input 
                        placeholder="Project Name (Required)" required
                        value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)}
                    />
                    <Input 
                        placeholder="Short Description (Optional)"
                        value={newProjectDesc} onChange={(e) => setNewProjectDesc(e.target.value)}
                    />
                    <Button type="submit" isLoading={actionLoading} className="md:mt-1 px-8">
                        <Plus size={18} className="mr-1" /> Create
                    </Button>
                </form>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Projects</h2>
            
            {loading ? <Loader /> : projects.length === 0 ? (
                <div className="text-center text-gray-500 py-16 bg-white rounded-xl border border-gray-200 border-dashed">
                    No projects yet. Create one above to get started!
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div key={project._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition group flex flex-col">
                            <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">{project.name}</h3>
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[2.5rem]">
                                {project.description || 'No description provided.'}
                            </p>
                            
                            <div className="flex items-center text-xs text-gray-500 mb-6 mt-auto">
                                <CalendarDays size={14} className="mr-1" />
                                Created: {formatDate(project.createdAt)}
                            </div>
                            
                            <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                                <Link 
                                    to={`/project/${project._id}`} 
                                    state={{ projectName: project.name }}
                                    className="text-blue-600 text-sm font-semibold hover:underline"
                                >
                                    Open Board &rarr;
                                </Link>
                                
                                <button 
                                    onClick={() => handleDeleteProject(project._id)}
                                    className="text-gray-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;