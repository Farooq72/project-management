import { useRef, forwardRef, useImperativeHandle } from 'react';
import { createPortal } from 'react-dom';

const ApiKeyModal = forwardRef(function ApiKeyModal({ onSave }, ref) {
  const dialog = useRef();
  const apiKeyInput = useRef();

  useImperativeHandle(ref, () => ({
    open() {
      dialog.current.showModal();
    }
  }));

  const handleSave = () => {
    const key = apiKeyInput.current.value.trim();
    if (key) {
      onSave(key);
      dialog.current.close();
    }
  };

  return createPortal(
    <dialog ref={dialog} className="backdrop:bg-stone-900/90 p-4 rounded-md shadow-md">
      <h2 className="text-xl font-bold text-stone-700 my-4">Configure OpenRouter API Key</h2>
      <p className="text-stone-600 mb-4">
        To use AI features, please enter your OpenRouter API key from openrouter.ai
      </p>
      <input
        ref={apiKeyInput}
        type="password"
        placeholder="sk-or-v1-..."
        className="w-full p-2 border-b-2 rounded-sm border-stone-300 bg-stone-200 text-stone-600 focus:outline-none focus:border-stone-600"
      />
      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={() => dialog.current.close()}
          className="text-stone-800 hover:text-stone-950"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 rounded-md bg-stone-800 text-stone-50 hover:bg-stone-950"
        >
          Save
        </button>
      </div>
    </dialog>,
    document.getElementById('modal-root')
  );
});

export default ApiKeyModal;
