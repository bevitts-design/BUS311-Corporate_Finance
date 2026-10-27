"""Current capstone validation entry point."""
import runpy
from pathlib import Path
for name in ["validate-capstone-m02.py", "validate-capstone-m03.py"]:
 runpy.run_path(str(Path(__file__).parent/name),run_name="__main__")
