import { createSignal, onMount } from 'solid-js';
import Help from './Help'; // Import the Help component for displaying help information
import processGcode from './process_gcode'; // Import the G-code processing function

// Main SolidJS App component
function App() {
  // State variables for managing application data and UI
  const [gcodeContent, setGcodeContent] = createSignal(''); // Stores the raw content of the uploaded G-code file
  const [modifiedGcode, setModifiedGcode] = createSignal(''); // Stores the processed G-code content
  const [outputMessages, setOutputMessages] = createSignal([]); // Stores messages to display to the user
  const [fileName, setFileName] = createSignal(''); // Stores the name of the uploaded file
  const [downloadLink, setDownloadLink] = createSignal(''); // Stores the URL for the downloadable modified file
  const [isLoading, setIsLoading] = createSignal(false); // Indicates if the processing is in progress
  const [error, setError] = createSignal(''); // Stores any error messages
  const [showHelp, setShowHelp] = createSignal(false); // Controls the visibility of the help modal

  /**
   * Appends a message to the outputMessages signal.
   * @param {string} message - The message to append.
   */
  const logMessage = (message) => {
    setOutputMessages((prev) => [...prev, message]);
  };

  /**
   * Handles the file selection event. Reads the file content and updates the state.
   * @param {Event} event - The file input change event.
   */
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    setFileName(file.name);
    setError('');
    setOutputMessages([]); // Clear previous messages

    const reader = new FileReader();
    reader.onload = (e) => {
      setGcodeContent(e.target.result);
    };
    reader.onerror = () => {
      setError('Failed to read file.');
      setIsLoading(false);
    };
    reader.readAsText(file);
  };

  const _processGcode = async () => {
    if (!gcodeContent()) {
      setError('Please upload a G-code file first.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setOutputMessages([]); // Clear previous messages

    try {
      const { newGcodeContent, netExtrude, netVol } = processGcode(gcodeContent(), logMessage);
      setModifiedGcode(newGcodeContent);
      logMessage(`Total extrusion is ${netExtrude.toFixed(3)} mm, or ${netVol.toFixed(3)} mL`);
      // Create a Blob for the modified content and a downloadable URL
      const blob = new Blob([newGcodeContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      setDownloadLink(url);
    } catch (err) {
      console.error('Error processing G-code:', err);
      setError(`An error occurred during processing: ${err.message}`);
    } finally {
      setIsLoading(false);
    }

  };

  // Clean up the object URL when the component unmounts or downloadLink changes
  onMount(() => {
    return () => {
      if (downloadLink()) {
        URL.revokeObjectURL(downloadLink());
      }
    };
  });

  return (
    <div class="min-h-screen flex items-center justify-center p-4 font-sans">
      <div class="bg-white p-8 rounded-lg shadow-xl w-full max-w-3xl border border-gray-200">
        {/* Header Section */}
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-3xl font-extrabold text-gray-800">Printess Extrusion Compiler</h1>
          <button
            onClick={() => setShowHelp(true)}
            class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            title="Help"
          >
            ?
          </button>
        </div>

        {/* File Upload Section */}
        <div class="mb-6 border-b pb-6 border-gray-200">
          <label for="gcode-file" class="block text-lg font-medium text-gray-700 mb-2">
            Upload G-code File (.txt)
          </label>
          <input
            type="file"
            id="gcode-file"
            accept=".txt"
            onChange={handleFileChange}
            class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-2"
          />
          {fileName() && (
            <p class="mt-2 text-sm text-gray-600">Selected file: <span class="font-semibold">{fileName()}</span></p>
          )}
        </div>

        {/* Process Button */}
        <div class="mb-6">
          <button
            onClick={_processGcode}
            disabled={isLoading() || !gcodeContent()}
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading() ? 'Processing...' : 'Process G-code'}
          </button>
        </div>

        {/* Error Display */}
        {error() && (
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
            <strong class="font-bold">Error!</strong>
            <span class="block sm:inline"> {error()}</span>
          </div>
        )}

        {/* Output Messages */}
        {outputMessages().length > 0 && (
          <div class="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-60 overflow-y-auto">
            <h2 class="text-xl font-semibold text-gray-800 mb-3">Output:</h2>
            <pre class="text-sm text-gray-700 whitespace-pre-wrap break-words">
              {outputMessages().join('\n')}
            </pre>
          </div>
        )}

        {/* Download Link */}
        {modifiedGcode() && (
          <div class="mt-6 pt-6 border-t border-gray-200 text-center">
            <h2 class="text-xl font-semibold text-gray-800 mb-3">Modified G-code Ready!</h2>
            <a
              href={downloadLink()}
              download={`modified_${fileName() || 'gcode.txt'}`}
              class="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              Download Modified G-code
            </a>
          </div>
        )}

        {/* Help Modal */}
        {showHelp() && (
          <Help setShowHelp={setShowHelp} />
        )}
      </div>
    </div>
  );
}

export default App;
