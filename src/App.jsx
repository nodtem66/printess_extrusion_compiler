import { createSignal, onMount } from 'solid-js';
import Help from './Help'; // Import the Help component for displaying help information

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
   * Finds the first sequence of digits (with optional decimal) in a given line.
   * Equivalent to Python's `re.search('\d+\.?\d*', line)`.
   * @param {string} line - The input string line.
   * @returns {RegExpMatchArray | null} - The match object or null if no digits are found.
   */
  const headerFindDigit = (line) => {
    // Regular expression to find one or more digits, optionally followed by a decimal and more digits.
    const matchArray = line.match(/\d+\.?\d*/);
    if (matchArray === null) {
      logMessage(`No digits were found in: ${line}`);
      return null;
    }
    logMessage(line); // Log the original line as in Python
    return matchArray;
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

  /**
   * Processes the G-code content based on the Python script's logic.
   * This function is the SolidJS equivalent of the Python `main` function.
   */
  const processGcode = async () => {
    if (!gcodeContent()) {
      setError('Please upload a G-code file first.');
      return;
    }

    setIsLoading(true);
    setError('');
    setOutputMessages([]); // Clear previous messages

    try {
      const content = gcodeContent().split('\n'); // Split content into lines

      // Determine coordinate type (G90 Absolute or G91 Relative)
      const coordinate_type = content[0].includes('G90') ? 0 : 1;
      if (coordinate_type === 0) {
        logMessage('You are currently in G90 ABSOLUTE mode.');
      } else {
        logMessage('You are currently in G91 RELATIVE mode.');
      }

      // Extract header values using headerFindDigit
      const Z_syringe_line = headerFindDigit(content[1]);
      const A_syringe_line = headerFindDigit(content[2]);
      const Z_nozzle_line = headerFindDigit(content[3]);
      const A_nozzle_line = headerFindDigit(content[4]);
      const extrusion_coefficient_line = headerFindDigit(content[5]);

      // Parse extracted header values to floats
      const Z_syringe_diameter = Z_syringe_line ? parseFloat(Z_syringe_line[0]) : 0;
      const A_syringe_diameter = A_syringe_line ? parseFloat(A_syringe_line[0]) : 0;
      const Z_nozzle_diameter = Z_nozzle_line ? parseFloat(Z_nozzle_line[0]) : 0;
      const A_nozzle_diameter = A_nozzle_line ? parseFloat(A_nozzle_line[0]) : 0;
      let extrusion_coefficient = extrusion_coefficient_line ? parseFloat(extrusion_coefficient_line[0]) : 0;

      const gcode = content.slice(6); // G-code commands start from line 6
      let extruder = 0; // Current extruder (0 or 1)
      let netExtrude = 0; // Total extrusion length
      let b_extrusion = false; // Flag for B-axis extrusion
      let c_extrusion = false; // Flag for C-axis extrusion

      let newGcodeContent = ''; // String to build the new G-code file content

      // Write initial G-code mode to the new file
      if (coordinate_type === 0) {
        newGcodeContent += 'G90\n';
      } else {
        newGcodeContent += 'G91\n';
      }
      // newGcodeContent += 'G21\n'; // Commented out as in Python script

      // Initialize values for G90 relative coordinate difference calculations
      let x1 = 0;
      let y1 = 0;
      let e1 = 0;
      let a1 = 0;
      let z1 = 0;

      // Process each line of the G-code
      for (const line of gcode) {
        // Trim whitespace from the line for consistent processing
        const trimmedLine = line.trim();

        // Handle G92 E0 to reset relative E calculations in G90
        if (trimmedLine.includes('G92 E0')) {
          x1 = 0;
          y1 = 0;
          e1 = 0;
          a1 = 0;
          z1 = 0;
          newGcodeContent += line + '\n'; // Keep original line for G92 E0
          continue;
        }

        // Skip/copy lines that are empty or comments, or specific G-code commands
        if (
          trimmedLine.startsWith(';') ||
          trimmedLine === '' ||
          trimmedLine.includes('G90') ||
          trimmedLine.includes('G91') ||
          trimmedLine.includes('G92') ||
          trimmedLine.includes('G21') ||
          trimmedLine.includes('M2') ||
          trimmedLine.includes('G4')
        ) {
          newGcodeContent += line + '\n';
          continue;
        }

        // Handle tool changes (T0, T1)
        if (trimmedLine.includes('T0')) {
          newGcodeContent += 'T0\n';
          extruder = 0;
          continue;
        }
        if (trimmedLine.includes('T1')) {
          newGcodeContent += 'T1\n';
          extruder = 1;
          continue;
        }

        // Handle 'K' command to change extrusion coefficient
        if (trimmedLine.startsWith('K') || trimmedLine.startsWith('k')) {
          const new_k_parts = trimmedLine.split(' = ');
          if (new_k_parts.length > 1) {
            extrusion_coefficient = parseFloat(new_k_parts[new_k_parts.length - 1]);
            logMessage(`Extrusion coefficient changed to = ${extrusion_coefficient}`);
            newGcodeContent += `; extrusion coefficient changed to = ${extrusion_coefficient}\n`;
          }
          continue;
        }

        // Handle 'B' and 'C' extrusion mode commands
        if (trimmedLine.startsWith('B') || trimmedLine.startsWith('b')) {
          b_extrusion = true;
          c_extrusion = false;
          continue;
        }
        if (trimmedLine.startsWith('C') || trimmedLine.startsWith('c')) {
          c_extrusion = true;
          b_extrusion = false;
          continue;
        }

        // Parse G-code commands into a dictionary-like object
        const letters = {
          G: null, X: null, Y: null, Z: null, A: null, I: null, J: null, R: null, T: null, E: null, F: null,
        };
        let varFound = false; // Flag to stop parsing if an inline comment is found

        for (let command of trimmedLine.split(' ')) {
          if (command.startsWith(';')) { // Fixes bug where script tries to read inline comments.
            break;
          }
          if (command.endsWith(';')) {
            command = command.slice(0, -1); // Remove ; if it's at the end of an element
            varFound = true; // Set flag to break after this command
          }
          if (command.length > 1 && letters.hasOwnProperty(command[0].toUpperCase())) {
            letters[command[0].toUpperCase()] = parseFloat(command.slice(1));
          }
          if (varFound) {
            break;
          }
        }

        // If line contains only G, E, and F, it is probably a pressurization line, so ignore.
        const hasMovement = ['X', 'Y', 'Z', 'A', 'I', 'J', 'R', 'T'].some(
          (c) => letters[c] !== null
        );
        if (!hasMovement) {
          newGcodeContent += line + '\n';
          continue;
        }

        // Destructure values from letters object
        const { G: g, X: x, Y: y, Z: z, A: a, I: i, J: j, R: r, E: e_val, F: f } = letters;

        let l = 0; // Length of line
        let e = null; // Extrusion value

        // Use 0 if value is null for calculations
        const a_val = a !== null ? a : 0;
        const i_val = i !== null ? i : 0;
        const j_val = j !== null ? j : 0;
        const x_val = x !== null ? x : 0;
        const y_val = y !== null ? y : 0;
        const z_val = z !== null ? z : 0;

        // Calculate relative values for absolute mode (G90)
        const a_rel = a !== null ? a - a1 : 0;
        const x_rel = x !== null ? x - x1 : 0;
        const y_rel = y !== null ? y - y1 : 0;
        const z_rel = z !== null ? z - z1 : 0;

        // G1 (Linear Move) calculation
        if (g === 1) {
          if (coordinate_type === 1) { // Relative mode (G91)
            l = Math.sqrt(x_val ** 2 + y_val ** 2 + a_val ** 2 + z_val ** 2);
          } else { // Absolute mode (G90)
            l = Math.sqrt(x_rel ** 2 + y_rel ** 2 + a_rel ** 2 + z_rel ** 2);
          }
        } else if (g === 2 || g === 3) { // G2/G3 (Arc Move) calculation
          let full_circle = false;
          let radius = r;

          if (radius === null) {
            radius = Math.sqrt(i_val ** 2 + j_val ** 2);
          }

          let theta;
          if (coordinate_type === 1) { // Relative mode (G91)
            if (x_val !== 0 || y_val !== 0 || z_val !== 0 || a_val !== 0) {
              const d = Math.sqrt(x_val ** 2 + y_val ** 2 + a_val ** 2 + z_val ** 2);
              // Ensure argument to acos is within [-1, 1] to prevent NaN
              const acosArg = (1 - (d ** 2 / (2 * radius ** 2)));
              theta = 2 * Math.PI - Math.acos(Math.max(-1, Math.min(1, acosArg)));
            } else {
              theta = 2 * Math.PI; // Full circle
              full_circle = true;
            }
          } else { // Absolute mode (G90)
            if (x !== null || y !== null || z !== null || a !== null) { // Check original values, not rel_vals
              const d = Math.sqrt(x_rel ** 2 + y_rel ** 2 + a_rel ** 2 + z_rel ** 2);
              // Ensure argument to acos is within [-1, 1] to prevent NaN
              const acosArg = (1 - (d ** 2 / (2 * radius ** 2)));
              theta = 2 * Math.PI - Math.acos(Math.max(-1, Math.min(1, acosArg)));
            } else {
              theta = 2 * Math.PI;
              full_circle = true;
            }
          }
          l = radius * theta; // Arc length

          if (g === 3 && full_circle === false) {
            l = 2 * Math.PI * radius - l; // Counter-clockwise
          }
        }

        // Calculate extrusion 'E' value
        if (coordinate_type === 1) { // Relative mode (G91)
          if (extruder === 0) {
            e = (extrusion_coefficient * l * Z_nozzle_diameter ** 2) / (Z_syringe_diameter ** 2);
          } else if (extruder === 1) {
            e = (extrusion_coefficient * l * A_nozzle_diameter ** 2) / (A_syringe_diameter ** 2);
          }
          if (e !== null && !isNaN(e)) { // Only add if e is a valid number
            netExtrude += e;
          }
        } else { // Absolute mode (G90)
          if (extruder === 0) {
            e = e1 + (extrusion_coefficient * l * Z_nozzle_diameter ** 2) / (Z_syringe_diameter ** 2);
          } else if (extruder === 1) {
            e = e1 + (extrusion_coefficient * l * A_nozzle_diameter ** 2) / (A_syringe_diameter ** 2);
          }
          if (e !== null && !isNaN(e)) { // Only add if e is a valid number
            netExtrude += e;
          }
        }

        let write_line = '';
        if (g !== null) {
          write_line += `G${parseInt(g)}`;
        }
        if (x !== null) {
          write_line += ` X${x}`;
        }
        if (y !== null) {
          write_line += ` Y${y}`;
        }
        if (g === 2 || g === 3) {
          if (r !== null) {
            write_line += ` R${r}`;
          }
          if (i !== null) {
            write_line += ` I${i}`;
          }
          if (j !== null) {
            write_line += ` J${j}`;
          }
        }
        if (z !== null) {
          write_line += ` Z${z}`;
        }
        if (a !== null) {
          write_line += ` A${a}`;
        }
        if (e !== null && g !== 0 && !isNaN(e)) { // Only add E if it's a valid number and G is not 0
          if (b_extrusion) {
            write_line += ` B${e.toFixed(3)}`;
          } else if (c_extrusion) {
            write_line += ` C${e.toFixed(3)}`;
          } else {
            write_line += ` E${e.toFixed(3)}`;
          }
        }
        if (f !== null) {
          write_line += ` F${f}`;
        }

        // Override write_line if 'NO E' is present in the original line
        if (line.includes('NO E')) {
          newGcodeContent += line + '\n';
          // Undo the E value increment for lines that don't have extrusion (relevant for G90)
          // This logic is slightly different from Python as `e` is calculated before this check.
          // In Python, `e` is calculated, then `netExtrude` is incremented. If 'NO E' is found,
          // `e` is then decremented from `netExtrude`.
          // Here, we ensure `netExtrude` is correctly adjusted if 'NO E' is present.
          if (coordinate_type === 0 && e !== null && !isNaN(e)) {
            let undo_e_val = 0;
            if (extruder === 0) {
              undo_e_val = (extrusion_coefficient * l * Z_nozzle_diameter ** 2) / (Z_syringe_diameter ** 2);
            } else if (extruder === 1) {
              undo_e_val = (extrusion_coefficient * l * A_nozzle_diameter ** 2) / (A_syringe_diameter ** 2);
            }
            netExtrude -= undo_e_val;
          } else if (coordinate_type === 1 && e !== null && !isNaN(e)) {
             // For G91, if 'NO E' is present, the calculated 'e' should not have been added to netExtrude.
             // Since it was already added, we subtract it.
             netExtrude -= e;
          }
        } else {
          newGcodeContent += write_line + '\n';
        }

        // Update current coordinates for absolute mode calculations
        x1 = x !== null ? x_val : x1;
        y1 = y !== null ? y_val : y1;
        z1 = z !== null ? z_val : z1;
        a1 = a !== null ? a_val : a1;
        e1 = e !== null && !isNaN(e) ? e : e1; // Update e1 only if e is a valid number
      }

      setModifiedGcode(newGcodeContent);

      // Calculate total volume extruded
      const netVol = (netExtrude * Math.PI * (Z_syringe_diameter / 2) ** 2) / 1000;
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
            onClick={processGcode}
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
