# Practice Project: Advanced Concepts

## Working with Components, State, Styling, Refs & Portals

- Build a "Project Management" Web App
- Build, Style, Configure & Re-use Components
- Manage State
- Access DOM Elements & Browser APIs with Refs
- Manage JSX Rendering Positions with Portals
- Apply some Styles with Tailwind CSS

# Challenge Time!

Try building this project on your own - or at least try to get as far as possible

# Project's management application

1.  Build SideBar and Content components
    # Sidebar
    - Show a list of projects
    - Have an "Add Project" button that navigates
      to form to add to the list of project
    - List of projects should be navigatable to the
      project detail view
    # Content
    - main content window where you will display projects
    - should show fallback when there is no project to display
    - fallback should have a button to navigate to the
      new project form
2.  Project Detail components
    # New Project Form
    - a form to add a new project
    - should have a "title", "description", & "due date" fields
    - ultimately update your state in the App component with
      the new project information
    # Project Detail component
    - show the title and description of the project along with the due date of the project
    - show a delete button and handle the deletion
    # Tasks component
    - nested in the detail view
    - Show a list of tasks associated with the project
    - Facilitate the adding/removal of tasks through a
      form and button respectively
    - Again manage your tasks state associated with each
      project, likely in the App component as well

# Steps

## 0. Module Introduction & Starting Project

1. create a `README.md` file
2. run `npm install`
3. run `npm run dev`

## 1. Adding a "Projects Sidebar" Component

1. create `ProjectsSidebar.jsx` component
2. output `<ProjectsSidebar />` component in `App.js`

## 2. Styling the Sidebar & Button with Tailwind CSS

1. apply styles in `App.jsx`
2. apply styles in `ProjectsSidebar.jsx`

## 3. Adding the "New Project" Component & A Reusable "Input" Component

1. create `NewProject.jsx` component
2. create a reusable `Input.jsx` component
3. use this reusable `Input.jsx` component in `NewProject.jsx` component
4. use `NewProject.jsx` component in `App.jsx` component

## 4. Styling Buttons & Inputs with Tailwind CSS

1. apply styles in `NewProject.jsx` component
2. apply styles in `Input.jsx` component

## 5. Splitting Components to Split JSX & Tailwind Styles (for Higher Reusability)

1. create a `NoProjectSelected.jsx` component
2. create a reusable `Button.jsx` component
3. replace the button in `ProjectsSidebar.jsx` with the `<Button />` component
4. use the `<Button />` component in the `NoProjectSelected.jsx` component
5. replace the `<NewProject />` component with the `<NoProjectSelected />` component in `App.jsx`

## 6. Managing State to Switch Between Components

1. add a `ProjectsState` with `useState()` in `App.jsx`
2. create a `handleStartAddProject()` function, then use it on `<ProjectsSidebar />` & `< NoProjectSelected />`
3. use the `onStartAddProject` prop in `ProjectsSidebar.jsx` & `NoProjectSelected.jsx` components
4. add a `content` variable to conditonally output either the `<NoProjectSelected />` or the `<NewProject />` components

## 7. Collecting User Input with Refs & Forwarded Refs

1. collect user input values with `useRef()` in the `NewProject.jsx` component
2. import `forwardRef` from React & use it in `Input.jsx`
3. add a `handleSave()` function in `NewProject.jsx`
4. add a `handleAddProject()` function in `App.jsx`
5. invoke `handleAddProject()` inside `NewProject.jsx`

## 8. Handling Project Creation & Updating the UI

1. close the form if we click on `Save` button by setting `selectedId` to `undefined` in `handleAddProject()` in `App.js`
2. output the projects list in `ProjectsSidebar.jsx`

## 9. Validating User Input & Showing an Error Modal via useImperativeHandle

1. create a `Modal.jsx` component
2. write conditions for showing either error modal or validating the form in `NewProject.jsx`
3. use `createPortal()` from `react-dom` to render the modal in a different place from the DOM
4. use `forwardRef()` & `useImperativeHandle()` hooks from `react` to make the modal even more flexible
5. use the `<Modal />` component in `NewProject.jsx`

## 10. Styling the Modal via Tailwind CSS

1. apply styles in `NewProject.jsx` & `Modal.jsx`
2. make the `Cancel` button work in `NewProject.jsx` with help of the `handleCancelAddProject()` function

## 11. Making Projects Selectable & Viewing Project Details

1. add a new `SelectedProject.jsx` component
2. output the `<SelectedProject />` component in `ProjectsSidebar.jsx`
   1. make sure that the projects can be selected by adding a `handleSelectProject()` function in `App.jsx`
   2. extract the `onSelectProject` prop from `App.jsx` in `ProjectsSidebar.jsx` and connect it to the `button`
   3. highlight which project was selected with help of the `selectedProjectId`
3. use the `<SelectedProject />` and output it in `App.jsx` if a project was selected
4. configure the `onClick` prop in `ProjectsSidebar.jsx` so that you can pass the `project.id` to `onSelectProject` prop

## 12. Handling Project Deletion

1. add a `handleDeleteProject()` function in `App.jsx`
2. extract the `onDelete` prop from `App.jsx` and connect it to the `<button>` in `SelectedProject.jsx`

## 13. Adding "Project Tasks" & A Tasks Component

1. create a `Tasks.jsx` component
2. output the `<Tasks />` component in `SelectedProject.jsx`
3. create a `NewTask.jsx` component to add new tasks to the project
4. output the `<NewTask />` component in `Tasks.jsx`

## 14. Managing Tasks & Understanding Prop Drilling

1. extract the value entered by the user into the `<input />` in `NewTask.jsx` with help of `useState()`
2. when the `button` is clicked in `NewTask.jsx`, forward this task information in `App.jsx` to store it
3. use prop drilling to forward functions into several layers of components
4. output the tasks in the `Tasks.jsx` component
5. use prop drilling to forward the `tasks` prop to all the related components

## 15. Clearing Tasks & Fixing Minor Bugs

1. add a new `handleDeleteTask` in `App.jsx`
2. connect the function to the `<button>` in `Tasks.jsx`

## 16. Fixing More Bugs

1. make tasks unique for each project
