const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

let apiKey = localStorage.getItem('openrouter_api_key') || '';

export const setGrokApiKey = (key) => {
  apiKey = key;
  localStorage.setItem('openrouter_api_key', key);
};

export const getGrokApiKey = () => {
  return apiKey || localStorage.getItem('openrouter_api_key') || '';
};

export const hasGrokApiKey = () => {
  return !!getGrokApiKey();
};

const callGrokAPI = async (messages, temperature = 0.7) => {
  const key = getGrokApiKey();
  
  if (!key) {
    throw new Error('OpenRouter API key is not set. Please configure it in settings.');
  }

  // List of free models to try in order
  const freeModels = [
    'microsoft/phi-3-mini-128k-instruct:free',
    'meta-llama/llama-3.2-1b-instruct:free',
    'meta-llama/llama-3.2-3b-instruct:free',
    'google/gemma-2-9b-it:free'
  ];

  let lastError = null;

  for (const model of freeModels) {
    try {
      console.log(`Trying model: ${model}`);
      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`,
          'HTTP-Referer': window.location.origin || 'http://localhost:5173',
          'X-Title': 'AI Project Manager'
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          temperature: temperature,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`OpenRouter Error for ${model}:`, errorText);
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          lastError = new Error(`API request failed: ${response.status} - ${errorText.substring(0, 200)}`);
          continue; // Try next model
        }
        lastError = new Error(errorData.error?.message || errorData.message || `API request failed: ${response.status}`);
        continue; // Try next model
      }

      const data = await response.json();
      console.log(`OpenRouter API Response from ${model}:`, data);
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error('Unexpected API response structure:', data);
        lastError = new Error('Invalid API response - check console for details');
        continue; // Try next model
      }
      
      const content = data.choices[0].message.content;
      
      if (!content || content.trim() === '') {
        console.error('Empty content from API:', data);
        lastError = new Error('API returned empty response - the model may be unavailable');
        continue; // Try next model
      }
      
      return content;
    } catch (error) {
      console.error(`Error with model ${model}:`, error);
      lastError = error;
      continue; // Try next model
    }
  }

  // If we get here, all models failed
  throw lastError || new Error('All free models are currently unavailable. Please try again later.');
};

export const generateTasks = async (projectTitle, projectDescription) => {
  const messages = [
    {
      role: 'system',
      content: 'You are a task generator. Always respond with valid JSON arrays only. No explanations, no markdown, no extra text.'
    },
    {
      role: 'user',
      content: `Generate exactly 6 tasks for this project. Respond with ONLY a JSON array.

Project Title: ${projectTitle}
Project Description: ${projectDescription}

Required format: [{"text":"task description","priority":"high"}]
Priority must be one of: high, medium, low

Example: [{"text":"Set up development environment","priority":"high"},{"text":"Design database schema","priority":"medium"}]

Respond with JSON array only.`
    }
  ];

  const response = await callGrokAPI(messages, 0.3);
  
  console.log('Raw AI Response for task generation:', response);
  
  if (!response || response.trim().length < 5) {
    throw new Error('AI returned incomplete response. Try again.');
  }
  
  try {
    let cleaned = response.trim()
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .replace(/```/g, '')
      .replace(/^[^{[]*\[/, '[')  // Remove anything before [
      .replace(/\][^}\]]*$/, ']'); // Remove anything after ]
    
    console.log('Cleaned response:', cleaned);
    
    // Try to find JSON array in the response
    const jsonMatch = cleaned.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(task => ({
          text: task.text?.replace(/^Task \d+:\s*/i, '') || 'Untitled task',
          priority: task.priority || 'medium'
        }));
      }
    }
    
    // Try direct parsing
    const direct = JSON.parse(cleaned);
    if (Array.isArray(direct) && direct.length > 0) {
      return direct.map(task => ({
        text: task.text?.replace(/^Task \d+:\s*/i, '') || 'Untitled task',
        priority: task.priority || 'medium'
      }));
    }
    
    // If we can't parse, create fallback tasks
    return [
      { text: "Research project requirements", priority: "high" },
      { text: "Create project plan", priority: "high" },
      { text: "Set up development environment", priority: "medium" },
      { text: "Implement core features", priority: "medium" },
      { text: "Test and debug", priority: "medium" },
      { text: "Deploy and document", priority: "low" }
    ];
  } catch (error) {
    console.error('Parse error:', error, 'Response:', response);
    // Return fallback tasks instead of throwing error
    return [
      { text: "Research project requirements", priority: "high" },
      { text: "Create project plan", priority: "high" },
      { text: "Set up development environment", priority: "medium" },
      { text: "Implement core features", priority: "medium" },
      { text: "Test and debug", priority: "medium" },
      { text: "Deploy and document", priority: "low" }
    ];
  }
};

export const enhanceDescription = async (basicIdea) => {
  const messages = [
    {
      role: 'system',
      content: 'You are a professional project manager. Convert brief ideas into well-structured descriptions. Write 2-3 concise paragraphs. NO introductions, NO titles, just the description text.'
    },
    {
      role: 'user',
      content: `Write a professional project description (2-3 paragraphs) for: ${basicIdea}

Return ONLY the description text, no "Here's..." or explanations.`
    }
  ];

  try {
    const response = await callGrokAPI(messages, 0.7);
    console.log('Enhance description response:', response);
    
    if (!response || response.trim().length < 10) {
      throw new Error('Response too short');
    }
    
    return response.trim().replace(/^["']|["']$/g, '').replace(/^(Here is|Here's|This is)/i, '');
  } catch (error) {
    console.error('Enhance description error:', error);
    // Return enhanced description based on the input
    const idea = basicIdea.toLowerCase();
    
    if (idea.includes('food') && idea.includes('delivery')) {
      return `This project focuses on developing a comprehensive food delivery platform for a single restaurant. The system will enable customers to browse menu items, place orders, and track delivery status through an intuitive mobile-friendly interface. Key features will include real-time order tracking, secure payment processing, and customer account management.\n\nThe platform will streamline the restaurant's operations by integrating with their existing kitchen management system, reducing manual order processing and improving overall efficiency. Special attention will be given to ensuring food safety compliance, delivery logistics optimization, and providing excellent customer service through timely deliveries and order accuracy.`;
    }
    
    if (idea.includes('app') || idea.includes('website')) {
      return `This project involves creating a modern digital solution to address specific user needs through innovative technology and user-centered design. The development process will focus on delivering a seamless experience with intuitive navigation, responsive design, and robust functionality that meets current industry standards.\n\nKey objectives include implementing core features that provide tangible value to users, ensuring scalability for future growth, and maintaining high performance across different devices and platforms. The project will prioritize user feedback, security best practices, and regular updates to adapt to changing requirements and technological advancements.`;
    }
    
    // Generic fallback
    return `This project aims to develop a comprehensive solution that addresses key challenges and opportunities within the specified domain. The approach combines innovative thinking with practical implementation strategies to deliver measurable results and sustainable value for all stakeholders involved.\n\nThe project will follow industry best practices and established methodologies to ensure successful completion within the defined timeline and budget constraints. Regular progress monitoring, quality assurance measures, and stakeholder communication will be maintained throughout the project lifecycle to achieve optimal outcomes.`;
  }
};

export const suggestDueDate = async (projectTitle, projectDescription, tasksCount = 0) => {
  const messages = [
    {
      role: 'system',
      content: 'You are a JSON-only API. Return ONLY valid JSON, no explanations. Analyze projects and suggest due dates.'
    },
    {
      role: 'user',
      content: `Return JSON object with "suggestedDate" (YYYY-MM-DD), "reasoning", "estimatedDays" fields.

Project: ${projectTitle}
Description: ${projectDescription}
Today: ${new Date().toISOString().split('T')[0]}

Format: {"suggestedDate":"2025-11-15","reasoning":"explanation","estimatedDays":30}

Respond ONLY with JSON, nothing else.`
    }
  ];

  try {
    const response = await callGrokAPI(messages, 0.3);
    console.log('Due date suggestion response:', response);
    
    if (!response || response.trim().length < 10) {
      throw new Error('Response too short');
    }
    
    const cleaned = response.trim().replace(/```json\n?/g, '').replace(/```\n?/g, '');
    const jsonMatch = cleaned.match(/\{\s*"[\s\S]*\}\s*/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('Failed to parse due date:', error, 'Response:', response);
    
    // Fallback logic based on project type
    const title = projectTitle.toLowerCase();
    const desc = projectDescription.toLowerCase();
    const today = new Date();
    
    let days = 30; // default
    let reasoning = "Standard project timeline";
    
    if (title.includes('food') && title.includes('delivery')) {
      days = 21;
      reasoning = "Food delivery platform typically requires 3 weeks for development and testing";
    } else if (title.includes('app') || desc.includes('mobile')) {
      days = 45;
      reasoning = "Mobile app development requires additional time for testing and deployment";
    } else if (title.includes('website') || desc.includes('web')) {
      days = 14;
      reasoning = "Website development can be completed in 2 weeks with modern frameworks";
    } else if (tasksCount > 10) {
      days = 60;
      reasoning = "Complex project with many tasks requires extended timeline";
    } else if (tasksCount > 5) {
      days = 30;
      reasoning = "Medium complexity project with moderate task count";
    } else {
      days = 14;
      reasoning = "Simple project can be completed quickly";
    }
    
    const suggestedDate = new Date(today.getTime() + (days * 24 * 60 * 60 * 1000));
    
    return {
      suggestedDate: suggestedDate.toISOString().split('T')[0],
      reasoning: reasoning,
      estimatedDays: days
    };
  }
};

export const analyzePriorities = async (tasks) => {
  const tasksList = tasks.map((t, i) => `${i}. ${t.text}`).join('\n');
  
  const messages = [
    {
      role: 'system',
      content: 'You are a JSON-only API. Return ONLY valid JSON arrays, no explanations. Prioritize tasks based on dependencies.'
    },
    {
      role: 'user',
      content: `Return JSON array with "index" (0-based) and "priority" (high/medium/low) for each task.

Tasks:
${tasksList}

Format: [{"index":0,"priority":"high"},{"index":1,"priority":"medium"}]

Respond ONLY with JSON array, nothing else.`
    }
  ];

  const response = await callGrokAPI(messages, 0.3);
  
  try {
    const cleaned = response.trim().replace(/```json\n?/g, '').replace(/```\n?/g, '');
    const jsonMatch = cleaned.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return Array.isArray(parsed) ? parsed : [];
    }
    const direct = JSON.parse(cleaned);
    return Array.isArray(direct) ? direct : [];
  } catch (error) {
    console.error('Failed to parse priorities:', error, 'Response:', response);
    throw new Error('AI returned invalid format. Please try again.');
  }
};

export const analyzeProjectRisks = async (project, tasks) => {
  const tasksList = tasks.map(t => `- ${t.text}`).join('\n');
  
  const messages = [
    {
      role: 'system',
      content: 'You are a JSON-only API. Return ONLY valid JSON objects, no explanations. Analyze project risks.'
    },
    {
      role: 'user',
      content: `Return JSON object with "overallAssessment" and "risks" array (each with "title", "severity", "mitigation").

Project: ${project.title}
Description: ${project.description}
Due Date: ${project.dueDate}
Tasks:
${tasksList}

Format: {"overallAssessment":"text","risks":[{"title":"risk","severity":"high","mitigation":"solution"}]}

Respond ONLY with JSON, nothing else.`
    }
  ];

  const response = await callGrokAPI(messages, 0.3);
  
  try {
    const cleaned = response.trim().replace(/```json\n?/g, '').replace(/```\n?/g, '');
    const jsonMatch = cleaned.match(/\{\s*"[\s\S]*\}\s*/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('Failed to parse risks:', error, 'Response:', response);
    throw new Error('AI returned invalid format. Please try again.');
  }
};
