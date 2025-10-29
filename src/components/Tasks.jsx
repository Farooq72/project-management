import { useState } from 'react';
import NewTask from './NewTask.jsx';
import { analyzePriorities } from '../services/grokService.js';

export default function Tasks({ tasks, onAdd, onDelete, onUpdateTask, hasApiKey, onOpenApiKeyModal }) {
  const [isAnalyzingPriorities, setIsAnalyzingPriorities] = useState(false);
  const [aiError, setAiError] = useState(null);

  async function handleAnalyzePriorities() {
    if (!hasApiKey) {
      onOpenApiKeyModal();
      return;
    }

    if (tasks.length === 0) {
      setAiError('Add some tasks first before analyzing priorities');
      return;
    }

    setIsAnalyzingPriorities(true);
    setAiError(null);

    try {
      const priorities = await analyzePriorities(tasks);
      priorities.forEach((priorityUpdate) => {
        const task = tasks[priorityUpdate.index];
        if (task) {
          onUpdateTask(task.id, { priority: priorityUpdate.priority });
        }
      });
    } catch (error) {
      setAiError(error.message || 'Failed to analyze priorities');
    } finally {
      setIsAnalyzingPriorities(false);
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 font-bold';
      case 'medium':
        return 'text-yellow-600 font-semibold';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-stone-600';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return '🔴';
      case 'medium':
        return '🟡';
      case 'low':
        return '🟢';
      default:
        return '⚪';
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <section>
      <h2 className="text-2xl font-bold text-stone-700 mb-4">Tasks</h2>
      
      <NewTask onAdd={onAdd} />

      {aiError && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
          {aiError}
        </div>
      )}

      {hasApiKey && tasks.length > 0 && (
        <button
          onClick={handleAnalyzePriorities}
          disabled={isAnalyzingPriorities}
          className="mt-4 px-4 py-2 text-sm rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-400"
        >
          {isAnalyzingPriorities ? '🎯 Analyzing...' : '🎯 AI Prioritize Tasks'}
        </button>
      )}

      {tasks.length === 0 && (
        <p className="text-stone-800 my-4">
          This project does not have any task yet.
        </p>
      )}
      
      {tasks.length > 0 && (
        <ul className="p-4 mt-8 rounded-md bg-stone-100">
          {sortedTasks.map((task) => (
            <li key={task.id} className="flex justify-between items-center my-4">
              <div className="flex items-center gap-2 flex-1">
                <span className="text-lg">{getPriorityBadge(task.priority)}</span>
                <span className={task.completed ? 'line-through text-stone-500' : ''}>
                  {task.text}
                </span>
                <span className={`text-xs uppercase ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  className="text-stone-700 hover:text-blue-500 text-sm"
                  onClick={() => onUpdateTask(task.id, { completed: !task.completed })}
                >
                  {task.completed ? '↩️' : '✓'}
                </button>
                <button
                  className="text-stone-700 hover:text-red-500"
                  onClick={() => onDelete(task.id)}
                >
                  Clear
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
