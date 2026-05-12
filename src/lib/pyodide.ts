/**
 * Pyodide loader. Loads from JSDelivr the first time it's needed.
 *
 * Why a singleton: Pyodide is ~10MB. We lazy-load on the first CodeCell run
 * and reuse the same interpreter across cells in the same session.
 */

declare global {
  interface Window {
    loadPyodide?: (opts: { indexURL: string }) => Promise<PyodideInterface>;
  }
}

export interface PyodideInterface {
  runPythonAsync: (src: string) => Promise<unknown>;
  loadPackage: (names: string | string[]) => Promise<void>;
  globals: {
    get: (name: string) => unknown;
    set: (name: string, value: unknown) => void;
  };
  setStdout: (opts: { batched: (s: string) => void }) => void;
  setStderr: (opts: { batched: (s: string) => void }) => void;
}

const PYODIDE_VERSION = "0.26.4";
const PYODIDE_CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

let pyodidePromise: Promise<PyodideInterface> | null = null;

async function injectScript(): Promise<void> {
  if (typeof window === "undefined") throw new Error("Pyodide requires browser env");
  if (window.loadPyodide) return;
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `${PYODIDE_CDN}pyodide.js`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Pyodide script"));
    document.head.appendChild(script);
  });
}

export async function getPyodide(): Promise<PyodideInterface> {
  if (pyodidePromise) return pyodidePromise;
  pyodidePromise = (async () => {
    await injectScript();
    if (!window.loadPyodide) throw new Error("loadPyodide unavailable after script inject");
    const py = await window.loadPyodide({ indexURL: PYODIDE_CDN });
    return py;
  })();
  return pyodidePromise;
}

export interface RunResult {
  ok: boolean;
  output: string;
  error?: string;
  testsPassed?: boolean;
}

export async function runUserCode(
  userCode: string,
  testCode: string,
  packages: string[] = [],
): Promise<RunResult> {
  let stdout = "";
  let stderr = "";
  try {
    const py = await getPyodide();
    if (packages.length > 0) await py.loadPackage(packages);
    py.setStdout({ batched: (s) => (stdout += s) });
    py.setStderr({ batched: (s) => (stderr += s) });

    await py.runPythonAsync(userCode);
    let testsPassed = true;
    if (testCode.trim()) {
      try {
        await py.runPythonAsync(testCode);
      } catch (e) {
        testsPassed = false;
        stderr += `\n${(e as Error).message}`;
      }
    }
    return {
      ok: !stderr || testsPassed,
      output: stdout,
      error: stderr || undefined,
      testsPassed,
    };
  } catch (e) {
    return {
      ok: false,
      output: stdout,
      error: stderr + "\n" + (e as Error).message,
      testsPassed: false,
    };
  }
}
