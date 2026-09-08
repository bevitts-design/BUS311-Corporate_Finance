"""Rebuild every active capstone deliverable without publishing."""
import os,subprocess,tempfile,shutil
from pathlib import Path
root=Path(__file__).resolve().parents[1]
runtime=Path.home()/'.cache/codex-runtimes/codex-primary-runtime/dependencies'
node=os.environ.get('RUNTIME_NODE',str(runtime/'node/bin/node'))
python=os.environ.get('RUNTIME_PYTHON',str(runtime/'python/bin/python3'))
skills=Path.home()/'.codex/plugins/cache/openai-primary-runtime'
documents=Path(os.environ.get('DOCUMENTS_SKILL_DIR',str(skills/'documents/26.904.11930/skills/documents')))
qa=Path(tempfile.mkdtemp(prefix='bus311-capstone-build-'))
env=dict(os.environ,CAPSTONE_QA_DIR=str(qa),RUNTIME_NODE=node,RUNTIME_PYTHON=python,RUNTIME_NODE_MODULES=str(runtime/'node/node_modules'))
env['PATH']=str(runtime/'bin/override')+os.pathsep+env.get('PATH','')
def run(*args):subprocess.run(args,cwd=root,env=env,check=True)
run(node,'scripts/build-capstone-workbook.mjs')
run(node,'scripts/build-capstone-presentation.mjs')
run(python,'scripts/build-capstone-docs-v2.py')
run(python,str(documents/'render_docx.py'),'CAPSTONE/bus311-capstone-assignment.docx','--output_dir',str(qa/'assignment'),'--emit_pdf')
shutil.copyfile(qa/'assignment/bus311-capstone-assignment.pdf',root/'CAPSTONE/bus311-capstone-assignment.pdf')
run(node,'scripts/build-capstone.mjs')
run(node,'scripts/build-bus311-intro-m01-l01.mjs')
run(python,'scripts/validate-capstone-v2.py')
print('Complete local build. Review rendered artifacts in '+str(qa)+' before any authorized publication.')
