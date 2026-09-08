# Stage 1 is now inside the continuing workbook; the optional brief covers all stages.
import runpy
from pathlib import Path
runpy.run_path(str(Path(__file__).with_name('build-capstone-docs-v2.py')), run_name='__main__')
