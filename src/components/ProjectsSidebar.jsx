import Button from './Button.jsx';

export default function ProjectsSidebar({
  onStartAddProject,
  projects,
  onSelectProject,
  selectedProjectId,
  hasApiKey,
  onOpenApiKeyModal
}) {
  return (
    <aside className="w-1/3 px-8 py-16 bg-stone-900 text-stone-50 md:w-72 rounded-r-xl">
      <h2 className="mb-8 font-bold uppercase md:text-xl text-stone-200">
        Your Projects
      </h2>
      <div className="space-y-2">
        <Button onClick={onStartAddProject}>+ Add Project</Button>
        <button
          onClick={onOpenApiKeyModal}
          className="w-full px-4 py-2 text-xs rounded-md bg-stone-700 text-stone-300 hover:bg-stone-600 hover:text-stone-100"
        >
          {hasApiKey ? '🔑 Update API Key' : '🔑 Set API Key'}
        </button>
      </div>
      <ul className="mt-8">
        {projects.map(project => {
          let cssClasses =
            'w-full text-left px-2 py-1 rounded-sm my-1 hover:text-stone-200 hover:bg-stone-800';

          if (project.id === selectedProjectId) {
            cssClasses += ' bg-stone-800 text-stone-200';
          } else {
            cssClasses += ' text-stone-400';
          }

          return (
            <li key={project.id}>
              <button
                className={cssClasses}
                onClick={() => onSelectProject(project.id)}
              >
                {project.title}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
