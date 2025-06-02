import React, { useState } from 'react';
import KanbanBoard from '../components/KanbanBoard';

const initialTasks = [
  { id: 1, title: 'Task 1', status: 'To Do' },
  { id: 2, title: 'Task 2', status: 'In Progress' },
  { id: 3, title: 'Task 3', status: 'Done' },
];

const DashboardPage = () => {
  const [tasks, setTasks] = useState(initialTasks);

  return (
    <div>
      <h1>Project Dashboard</h1>
      <KanbanBoard tasks={tasks} />
    </div>
  );
};

export default DashboardPage;
