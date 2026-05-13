const API_URL = import.meta.env.VITE_API_URL + '/tasks';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const getTasksByProjectAPI = async (projectId) => {
    const response = await fetch(`${API_URL}/project/${projectId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch tasks');
    return data;
};

export const createTaskAPI = async (taskData) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(taskData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to create task');
    return data;
};

export const updateTaskStatusAPI = async (taskId, status) => {
    const response = await fetch(`${API_URL}/${taskId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update task status');
    return data;
};

export const deleteTaskAPI = async (taskId) => {
    const response = await fetch(`${API_URL}/${taskId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to delete task');
    return data;
};