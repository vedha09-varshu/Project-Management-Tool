import React from 'react';

const KanbanBoard = ({ tasks }) => {
  const columns = ['To Do', 'In Progress', 'Done'];

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      {columns.map((col) => (
        <div key={col} style={{ border: '1px solid black', padding: '10px', width: '200px' }}>
          <h3>{col}</h3>
          {tasks
            .filter(task => task.status === col)
            .map(task => (
              <div key={task.id} style={{ background: '#eee', margin: '5px 0', padding: '5px' }}>
                {task.title}
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;
