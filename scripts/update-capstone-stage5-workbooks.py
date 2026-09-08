import os, subprocess
from pathlib import Path
subprocess.run([os.environ.get('RUNTIME_NODE', 'node'), str(Path(__file__).with_name('build-capstone-workbook.mjs'))], check=True)
