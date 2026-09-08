import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
execFileSync(process.env.RUNTIME_PYTHON || 'python3', [fileURLToPath(new URL('./validate-capstone-v2.py', import.meta.url))], {stdio:'inherit'});
