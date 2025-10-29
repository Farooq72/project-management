import { useRef, useState } from 'react';

import Input from './Input.jsx';
import Modal from './Modal.jsx';
import { generateTasks, enhanceDescription, suggestDueDate } from '../services/grokService.js';

export default function NewProject({ onAdd, onCancel, hasApiKey, onOpenApiKeyModal }) {
  const modal = useRef();
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isSuggestingDate, setIsSuggestingDate] = useState(false);
  const [aiError, setAiError] = useState(null);

  const title = useRef();
  const description = useRef();
  const dueDate = useRef();

  async function handleEnhanceDescription() {
    if (!hasApiKey) {
      onOpenApiKeyModal();
      return;
    }

    const basicIdea = description.current.value.trim();
    if (!basicIdea) {
      setAiError('Please enter a basic project idea first');
      return;
    }

    setIsEnhancing(true);
    setAiError(null);

    try {
      const enhanced = await enhanceDescription(basicIdea);
      description.current.value = enhanced;
    } catch (error) {
      setAiError(error.message || 'Failed to enhance description');
    } finally {
      setIsEnhancing(false);
    }
  }

  async function handleSuggestDueDate() {
    if (!hasApiKey) {
      onOpenApiKeyModal();
      return;
    }

    const projectTitle = title.current.value.trim();
    const projectDescription = description.current.value.trim();

    if (!projectTitle || !projectDescription) {
      setAiError('Please enter title and description first');
      return;
    }

    setIsSuggestingDate(true);
    setAiError(null);

    try {
      const result = await suggestDueDate(projectTitle, projectDescription);
      dueDate.current.value = result.suggestedDate;
    } catch (error) {
      setAiError(error.message || 'Failed to suggest due date');
    } finally {
      setIsSuggestingDate(false);
    }
  }

  function handleSave() {
    const enteredTitle = title.current.value;
    const enteredDescription = description.current.value;
    const enteredDueDate = dueDate.current.value;

    if (
      enteredTitle.trim() === '' ||
      enteredDescription.trim() === '' ||
      enteredDueDate.trim() === ''
    ) {
      modal.current.open();
      return;
    }

    onAdd({
      title: enteredTitle,
      description: enteredDescription,
      dueDate: enteredDueDate
    });
  }

  return (
    <>
      <Modal ref={modal} buttonCaption="Okay">
        <h2 className="text-xl font-bold text-stone-700 my-4">Invalid Input</h2>
        <p className="text-stone-600 mb-4">
          Oops ... looks like you forgot to enter a value.
        </p>
        <p className="text-stone-600 mb-4">
          Please make sure you provide a valid value for every input field.
        </p>
      </Modal>
      <div className="w-[35rem] mt-16">
        <menu className="flex items-center justify-end gap-4 my-4">
          <li>
            <button
              className="text-stone-800 hover:text-stone-950"
              onClick={onCancel}
            >
              Cancel
            </button>
          </li>
          <li>
            <button
              className="px-6 py-2 rounded-md bg-stone-800 text-stone-50 hover:bg-stone-950"
              onClick={handleSave}
            >
              Save
            </button>
          </li>
        </menu>
        
        {aiError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {aiError}
          </div>
        )}
        
        <div>
          <Input type="text" ref={title} label="Title" />
          
          <div className="flex flex-col gap-1 my-4">
            <label className="text-sm font-bold uppercase text-stone-500">
              Description
            </label>
            <textarea
              ref={description}
              className="w-full p-1 border-b-2 rounded-sm border-stone-300 bg-stone-200 text-stone-600 focus:outline-none focus:border-stone-600"
              rows="4"
            />
            {hasApiKey && (
              <button
                onClick={handleEnhanceDescription}
                disabled={isEnhancing}
                className="mt-2 self-end px-4 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400"
              >
                {isEnhancing ? '✨ Enhancing...' : '✨ AI Enhance Description'}
              </button>
            )}
          </div>
          
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <Input type="date" ref={dueDate} label="Due Date" />
            </div>
            {hasApiKey && (
              <button
                onClick={handleSuggestDueDate}
                disabled={isSuggestingDate}
                className="mb-4 px-4 py-2 text-xs rounded bg-purple-600 text-white hover:bg-purple-700 disabled:bg-gray-400"
              >
                {isSuggestingDate ? '🤖 Suggesting...' : '🤖 AI Suggest Date'}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
