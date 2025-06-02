import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState('In Progress');
  const [taskInputs, setTaskInputs] = useState({});
  const [commentInputs, setCommentInputs] = useState({});

  // Fetch projects with tasks and comments
  const fetchProjects = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/projects');
      setProjects(res.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Add Project
  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/projects', {
        name, description, deadline, status
      });
      setName('');
      setDescription('');
      setDeadline('');
      setStatus('In Progress');
      fetchProjects(); // refresh list
    } catch (err) {
      console.error('Error adding project:', err);
    }
  };

  // Add Task
  const handleAddTask = async (e, projectId) => {
    e.preventDefault();
    const { taskName = '', taskStatus = 'To Do' } = taskInputs[projectId] || {};
    if (!taskName.trim()) return;

    console.log('Adding task:', { name: taskName, status: taskStatus }); // Debug log

    try {
      await axios.post(`http://localhost:5000/api/projects/${projectId}/tasks`, {
        name: taskName,
        status: taskStatus
      });
      setTaskInputs(prev => ({ ...prev, [projectId]: { taskName: '', taskStatus: 'To Do' } }));
      fetchProjects(); // refresh projects list
    } catch (err) {
      console.error('Error adding task:', err);
    }
  };

  // Update task input per project
  const updateTaskInput = (projectId, field, value) => {
    setTaskInputs(prev => ({
      ...prev,
      [projectId]: {
        ...(prev[projectId] || {}),
        [field]: value
      }
    }));
  };

  // Add Comment
  const handleAddComment = async (e, projectId) => {
    e.preventDefault();
    const { author = '', text = '' } = commentInputs[projectId] || {};
    if (!author.trim() || !text.trim()) return;

    console.log('Adding comment:', { author, text }); // Debug log

    try {
      await axios.post(`http://localhost:5000/api/projects/${projectId}/comments`, {
        author,
        text,
        timestamp: new Date().toISOString()
      });
      setCommentInputs(prev => ({ ...prev, [projectId]: { author: '', text: '' } }));
      fetchProjects(); // refresh projects list
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  // Update comment input per project
  const updateCommentInput = (projectId, field, value) => {
    setCommentInputs(prev => ({
      ...prev,
      [projectId]: {
        ...(prev[projectId] || {}),
        [field]: value
      }
    }));
  };

  // Project analytics: simple counts of tasks by status and comments count
  const getProjectAnalytics = (project) => {
    const taskCounts = { 'To Do': 0, 'In Progress': 0, 'Done': 0 };
    (project.tasks || []).forEach(t => {
      if (taskCounts[t.status] !== undefined) taskCounts[t.status]++;
    });
    const commentsCount = (project.comments || []).length;
    return { taskCounts, commentsCount };
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>🚀 Project Handler (Kanban View)</h1>

      {/* Add Project */}
      <form onSubmit={handleAddProject} style={styles.form}>
        <input
          type="text"
          placeholder="Project Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          style={styles.input}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          style={styles.textarea}
        />
        <input
          type="date"
          value={deadline}
          onChange={e => setDeadline(e.target.value)}
          style={styles.input}
        />
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          style={styles.input}
        >
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="On Hold">On Hold</option>
        </select>
        <button type="submit" style={styles.button}>Add Project</button>
      </form>

      {/* List of Projects */}
      {projects.map(project => {
        const analytics = getProjectAnalytics(project);

        return (
          <div key={project._id} style={styles.projectCard}>
            <h2>{project.name}</h2>
            <p><strong>Description:</strong> {project.description}</p>
            <p><strong>Status:</strong> {project.status}</p>
            <p><strong>Deadline:</strong> {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'N/A'}</p>

            {/* Project Analytics */}
            <div style={styles.analyticsBox}>
              <h4>📊 Analytics</h4>
              <p>To Do Tasks: {analytics.taskCounts['To Do']}</p>
              <p>In Progress Tasks: {analytics.taskCounts['In Progress']}</p>
              <p>Done Tasks: {analytics.taskCounts['Done']}</p>
              <p>Total Comments: {analytics.commentsCount}</p>
            </div>

            {/* Add Task */}
            <form onSubmit={e => handleAddTask(e, project._id)} style={{ ...styles.form, marginTop: '20px' }}>
              <h4>Add Task to "{project.name}"</h4>
              <input
                type="text"
                placeholder="Task Name"
                value={taskInputs[project._id]?.taskName || ''}
                onChange={e => updateTaskInput(project._id, 'taskName', e.target.value)}
                required
                style={styles.input}
              />
              <select
                value={taskInputs[project._id]?.taskStatus || 'To Do'}
                onChange={e => updateTaskInput(project._id, 'taskStatus', e.target.value)}
                style={styles.input}
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
              <button type="submit" style={styles.button}>Add Task</button>
            </form>

            {/* Kanban Columns */}
            <div style={styles.kanbanContainer}>
              {['To Do', 'In Progress', 'Done'].map(column => (
                <div key={column} style={styles.kanbanColumn}>
                  <h4>{column}</h4>
                  {(project.tasks || []).filter(t => t.status === column).map(task => (
                    <div key={task._id} style={styles.taskCard}>
                      {task.name}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Comments */}
            <div style={{ marginTop: '20px' }}>
              <h4>💬 Comments</h4>
              {(project.comments || []).map((comment, i) => (
                <div key={i} style={styles.commentBox}>
                  <strong>{comment.author}:</strong> {comment.text} <br />
                  <small>{new Date(comment.timestamp).toLocaleString()}</small>
                </div>
              ))}

              <form onSubmit={e => handleAddComment(e, project._id)} style={styles.commentForm}>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={commentInputs[project._id]?.author || ''}
                  onChange={e => updateCommentInput(project._id, 'author', e.target.value)}
                  required
                  style={styles.input}
                />
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={commentInputs[project._id]?.text || ''}
                  onChange={e => updateCommentInput(project._id, 'text', e.target.value)}
                  required
                  style={styles.input}
                />
                <button type="submit" style={styles.button}>Add Comment</button>
              </form>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Arial',
    padding: '30px',
    backgroundColor: '#f4f6f9',
    minHeight: '100vh',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '20px',
  },
  input: {
    padding: '8px',
    fontSize: '1rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  textarea: {
    padding: '8px',
    fontSize: '1rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    resize: 'vertical',
    minHeight: '60px',
  },
  button: {
    padding: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  projectCard: {
    backgroundColor: 'white',
    padding: '20px',
    marginBottom: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  kanbanContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
    gap: '10px',
  },
  kanbanColumn: {
    flex: 1,
    backgroundColor: '#e1e5ea',
    borderRadius: '6px',
    padding: '10px',
    minHeight: '100px',
  },
  taskCard: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '8px',
    marginBottom: '8px',
    borderRadius: '4px',
  },
  analyticsBox: {
    backgroundColor: '#d1ecf1',
    padding: '15px',
    borderRadius: '6px',
    marginTop: '15px',
  },
  commentBox: {
    backgroundColor: '#f0f0f0',
    padding: '10px',
    borderRadius: '6px',
    marginBottom: '8px',
  },
  commentForm: {
    marginTop: '10px',
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
};

export default App;
