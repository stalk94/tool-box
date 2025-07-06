import { parentPort, workerData } from 'worker_threads';
import parseComponentProps from './services/type-parser.js';


try {
    const result = parseComponentProps(workerData.filePath, workerData.name);
    parentPort?.postMessage(result);
}
catch (err) {
    parentPort?.postMessage({ error: err.message });
}