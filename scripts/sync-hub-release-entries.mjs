import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const args=process.argv.slice(2),fromRunAt=args.indexOf('--from-run');
if(fromRunAt<0||!args[fromRunAt+1])throw new Error('Usage: node scripts/sync-hub-release-entries.mjs --from-run RUN_ID');
const runId=args[fromRunAt+1];let run;
for(const bucket of ['unchecked','checked']){try{run=JSON.parse(await fs.readFile(path.join(root,'toolbox','automation-results',bucket,`${runId}.json`),'utf8'));break;}catch(error){if(error.code!=='ENOENT')throw error;}}
if(!run?.selectedTools?.length)throw new Error(`Automation result or selectedTools not found: ${runId}`);
let updated=0,inspected=0;
for(const tool of run.selectedTools){
  const registryPath=path.join(root,'embed',tool,'modules.json');
  let registry;try{registry=JSON.parse(await fs.readFile(registryPath,'utf8'));}catch(error){if(error.code==='ENOENT')continue;throw error;}
  const manifest=JSON.parse(await fs.readFile(path.join(root,'outputs',tool,'versions.json'),'utf8'));
  const module=registry.modules?.find(item=>item.id===tool);inspected+=1;
  if(!module?.entry?.includes('release='))continue;
  const next=module.entry.replace(/([?&]release=)[^&]+/,`$1${manifest.latestVersion}`);
  if(next===module.entry)continue;
  module.entry=next;await fs.writeFile(registryPath,`${JSON.stringify(registry,null,2)}\n`);updated+=1;
}
console.log(`Synchronized ${updated} hub release entries in ${inspected} inspected registries.`);
