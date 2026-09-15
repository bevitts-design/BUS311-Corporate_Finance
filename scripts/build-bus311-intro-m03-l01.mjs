import fs from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const source=JSON.parse(await fs.readFile(path.join(root,'scripts/decks/bus311-intro-m03-l01-content.json'),'utf8'));
const notes='<script type="application/json" id="speaker-notes">'+JSON.stringify(source.slides.map(s=>s.note)).replaceAll('<','\u003c')+'</script>\n';
const html=source.head.replace('</head>',notes+'</head>')+source.slides.map(s=>s.html).join('\n\n')+source.tail;
const dest=path.join(root,'01-INTRO/M03/bus311-intro-m03-l01-slides.html');
await fs.mkdir(path.dirname(dest),{recursive:true});await fs.writeFile(dest,html);
console.log(`Built M03: ${source.slides.length} slides and matching speaker notes.`);
