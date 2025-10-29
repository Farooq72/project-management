
# AI-Powered Project Management Application 🚀

## Overview
A modern **React-based project management application** enhanced with **5 AI features** powered by **Grok AI**, demonstrating practical LLM integration, intelligent automation, and professional full-stack development skills.

## 🎯 Key Features

### Core Functionality
- ✅ Create and manage multiple projects
- ✅ Add, organize, and track tasks per project
- ✅ Set project deadlines and descriptions
- ✅ Delete projects and tasks
- ✅ Priority-based task organization

### 🤖 AI-Powered Features (Google Gemini Integration)
1. **AI Task Generator** - Auto-generate 5-8 relevant tasks from project context
2. **Smart Description Writer** - Transform brief ideas into professional descriptions
3. **Intelligent Due Date Suggestions** - Get realistic timelines based on project complexity
4. **Task Priority Recommender** - Automatically prioritize tasks by importance
5. **Project Risk Analysis** - Identify potential blockers and mitigation strategies


## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)


### Installation
```bash
# Clone the repository
git clone https://github.com/Farooq72/project-managment

# Navigate to project directory
cd project-management-main

# Install dependencies
npm install

# Start development server
npm run dev
```


### AI Features in Action
- **Task Generation:** Create comprehensive task lists in seconds
- **Description Enhancement:** Professional project descriptions from brief ideas
- **Smart Prioritization:** Automatic task organization by importance
- **Risk Detection:** Proactive identification of project challenges


### Technical Challenges Solved
1. **JSON Parsing:** Robust extraction from natural language AI responses
2. **State Management:** Complex multi-level prop drilling and state updates
3. **Error Handling:** Graceful degradation when API fails
4. **UX Design:** Loading states, visual feedback, and intuitive AI integration

### Architecture Decisions
- Service layer pattern for AI logic separation
- Component composition for reusability
- Optimistic UI updates with loading indicators
- Client-side caching of API configuration



## 📁 Project Structure
```
src/
├── components/
│   ├── ApiKeyModal.jsx       # API key configuration
│   ├── NewProject.jsx         # Project creation with AI features
│   ├── SelectedProject.jsx    # Project details with AI actions
│   ├── Tasks.jsx              # Task management with AI prioritization
│   ├── ProjectsSidebar.jsx    # Project navigation
│   └── ...
├── services/
│   └── grokService.js         # Grok AI integration layer
└── App.jsx                    # Main application logic
```

