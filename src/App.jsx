import { useState, useRef } from 'react';

import NewProject from './components/NewProject.jsx';
import NoProjectSelected from './components/NoProjectSelected.jsx';
import ProjectsSidebar from './components/ProjectsSidebar.jsx';
import SelectedProject from './components/SelectedProject.jsx';
import ApiKeyModal from './components/ApiKeyModal.jsx';
import { setGrokApiKey, hasGrokApiKey } from './services/grokService.js';

function App() {
  const apiKeyModal = useRef();
  const [projectsState, setProjectsState] = useState({
    selectedProjectId: undefined,
    projects: [],
    tasks: [],
    hasApiKey: hasGrokApiKey()
  });

  function handleAddTask(text, priority = 'medium') {
    setProjectsState(prevState => {
      const taskId = Math.random();
      const newTask = {
        text: text,
        projectId: prevState.selectedProjectId,
        id: taskId,
        priority: priority,
        completed: false
      };
      return {
        ...prevState,
        tasks: [newTask, ...prevState.tasks]
      };
    });
  }

  function handleUpdateTask(taskId, updates) {
    setProjectsState(prevState => {
      return {
        ...prevState,
        tasks: prevState.tasks.map(task =>
          task.id === taskId ? { ...task, ...updates } : task
        )
      };
    });
  }

  function handleAddMultipleTasks(tasksArray) {
    setProjectsState(prevState => {
      const newTasks = tasksArray.map(task => ({
        text: task.text,
        priority: task.priority || 'medium',
        projectId: prevState.selectedProjectId,
        id: Math.random(),
        completed: false
      }));
      return {
        ...prevState,
        tasks: [...newTasks, ...prevState.tasks]
      };
    });
  }

  function handleDeleteTask(id) {
    setProjectsState(prevState => {
      return {
        ...prevState,
        tasks: prevState.tasks.filter(task => task.id !== id)
      };
    });
  }

  function handleSelectProject(id) {
    setProjectsState(prevState => {
      return {
        ...prevState,
        selectedProjectId: id
      };
    });
  }

  function handleStartAddProject() {
    setProjectsState(prevState => {
      return {
        ...prevState,
        selectedProjectId: null
      };
    });
  }

  function handleCancelAddProject() {
    setProjectsState(prevState => {
      return {
        ...prevState,
        selectedProjectId: undefined
      };
    });
  }

  function handleAddProject(projectData) {
    setProjectsState(prevState => {
      const projectId = Math.random();
      const newProject = {
        ...projectData,
        id: projectId,
        riskAnalysis: null
      };
      return {
        ...prevState,
        selectedProjectId: undefined,
        projects: [...prevState.projects, newProject]
      };
    });
  }

  function handleUpdateProject(projectId, updates) {
    setProjectsState(prevState => {
      return {
        ...prevState,
        projects: prevState.projects.map(project =>
          project.id === projectId ? { ...project, ...updates } : project
        )
      };
    });
  }

  function handleSaveApiKey(key) {
    setGrokApiKey(key);
    setProjectsState(prevState => ({
      ...prevState,
      hasApiKey: true
    }));
  }

  function handleOpenApiKeyModal() {
    apiKeyModal.current.open();
  }

  function handleDeleteProject() {
    setProjectsState(prevState => {
      return {
        ...prevState,
        selectedProjectId: undefined,
        projects: prevState.projects.filter(
          project => project.id !== prevState.selectedProjectId
        )
      };
    });
  }

  const selectedProject = projectsState.projects.find(
    project => project.id === projectsState.selectedProjectId
  );

  const selectedTask = projectsState.tasks.filter(
    task => task.projectId === projectsState.selectedProjectId
  );

  let content = (
    <SelectedProject
      project={selectedProject}
      onDelete={handleDeleteProject}
      onAddTask={handleAddTask}
      onDeleteTask={handleDeleteTask}
      onUpdateTask={handleUpdateTask}
      onUpdateProject={handleUpdateProject}
      onAddMultipleTasks={handleAddMultipleTasks}
      tasks={selectedTask}
      hasApiKey={projectsState.hasApiKey}
      onOpenApiKeyModal={handleOpenApiKeyModal}
    />
  );

  if (projectsState.selectedProjectId === null) {
    content = (
      <NewProject 
        onAdd={handleAddProject} 
        onCancel={handleCancelAddProject}
        hasApiKey={projectsState.hasApiKey}
        onOpenApiKeyModal={handleOpenApiKeyModal}
      />
    );
  } else if (projectsState.selectedProjectId === undefined) {
    content = <NoProjectSelected onStartAddProject={handleStartAddProject} />;
  }

  return (
    <>
      <ApiKeyModal ref={apiKeyModal} onSave={handleSaveApiKey} />
      <main className="h-screen my-8 flex gap-8">
        <ProjectsSidebar
          onStartAddProject={handleStartAddProject}
          projects={projectsState.projects}
          onSelectProject={handleSelectProject}
          selectedProjectId={projectsState.selectedProjectId}
          hasApiKey={projectsState.hasApiKey}
          onOpenApiKeyModal={handleOpenApiKeyModal}
        />
        {content}
      </main>
    </>
  );
}

export default App;
