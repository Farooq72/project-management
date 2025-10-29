import { useState } from 'react';
import Tasks from './Tasks.jsx';
import { generateTasks, analyzeProjectRisks } from '../services/grokService.js';

export default function SelectedProject({
  project,
  onDelete,
  onAddTask,
  onDeleteTask,
  onUpdateTask,
  onUpdateProject,
  onAddMultipleTasks,
  tasks,
  hasApiKey,
  onOpenApiKeyModal
}) {
  const [isGeneratingTasks, setIsGeneratingTasks] = useState(false);
  const [isAnalyzingRisks, setIsAnalyzingRisks] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [aiSuccess, setAiSuccess] = useState(null);
  const [showRiskAnalysis, setShowRiskAnalysis] = useState(true);

  const formattedDate = project.dueDate ?
    new Date(project.dueDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }) : 'No due date set';

  async function handleGenerateTasks() {
    if (!hasApiKey) {
      onOpenApiKeyModal();
      return;
    }

    setIsGeneratingTasks(true);
    setAiError(null);
    setAiSuccess(null);

    try {
      const generatedTasks = await generateTasks(project.title, project.description);
      onAddMultipleTasks(generatedTasks);
      setAiSuccess(`Successfully generated ${generatedTasks.length} tasks!`);
    } catch (error) {
      setAiError(error.message || 'Failed to generate tasks');
    } finally {
      setIsGeneratingTasks(false);
    }
  }

  async function handleAnalyzeRisks() {
    if (!hasApiKey) {
      onOpenApiKeyModal();
      return;
    }

    setIsAnalyzingRisks(true);
    setAiError(null);

    try {
      const riskAnalysis = await analyzeProjectRisks(project, tasks);
      onUpdateProject(project.id, { riskAnalysis });
    } catch (error) {
      setAiError(error.message || 'Failed to analyze risks');
    } finally {
      setIsAnalyzingRisks(false);
    }
  }

  const getPriorityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 border-red-400 text-red-800';
      case 'medium':
        return 'bg-yellow-100 border-yellow-400 text-yellow-800';
      case 'low':
        return 'bg-green-100 border-green-400 text-green-800';
      default:
        return 'bg-gray-100 border-gray-400 text-gray-800';
    }
  };

  return (
    <div className="w-[35rem] mt-16">
      <header className="pb-4 mb-4 border-b-2 border-stone-300">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-stone-600 mb-2">
            {project.title}
          </h1>
          <button
            className="text-stone-600 hover:text-red-500"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
        <p className="mb-4 text-stone-400">{formattedDate}</p>
        <p className="text-stone-600 whitespace-pre-wrap">
          {project.description}
        </p>
      </header>

      {aiError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {aiError}
        </div>
      )}

      {aiSuccess && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {aiSuccess}
        </div>
      )}

      {hasApiKey && (
        <div className="mb-6 flex gap-2 flex-wrap">
          <button
            onClick={handleGenerateTasks}
            disabled={isGeneratingTasks}
            className="px-4 py-2 text-sm rounded bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400"
          >
            {isGeneratingTasks ? '🤖 Generating...' : '🤖 AI Generate Tasks'}
          </button>
          <button
            onClick={handleAnalyzeRisks}
            disabled={isAnalyzingRisks}
            className="px-4 py-2 text-sm rounded bg-orange-600 text-white hover:bg-orange-700 disabled:bg-gray-400"
          >
            {isAnalyzingRisks ? '📊 Analyzing...' : '📊 AI Risk Analysis'}
          </button>
        </div>
      )}

      {project.riskAnalysis && showRiskAnalysis && (
        <div className="mb-6 p-4 bg-stone-100 rounded-lg">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-bold text-stone-700">Risk Analysis</h3>
            <button
              onClick={() => setShowRiskAnalysis(false)}
              className="text-stone-500 hover:text-stone-700"
            >
              ✕
            </button>
          </div>
          <p className="text-sm text-stone-600 mb-4">
            {project.riskAnalysis.overallAssessment}
          </p>
          <div className="space-y-2">
            {project.riskAnalysis.risks.map((risk, index) => (
              <div
                key={index}
                className={`p-3 border rounded ${getPriorityColor(risk.severity)}`}
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold">{risk.title}</h4>
                  <span className="text-xs uppercase font-bold">
                    {risk.severity}
                  </span>
                </div>
                <p className="text-sm mt-1">{risk.mitigation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <Tasks
        tasks={tasks}
        onAdd={onAddTask}
        onDelete={onDeleteTask}
        onUpdateTask={onUpdateTask}
        hasApiKey={hasApiKey}
        onOpenApiKeyModal={onOpenApiKeyModal}
      />
    </div>
  );
}
