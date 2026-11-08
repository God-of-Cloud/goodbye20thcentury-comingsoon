import { readdir, stat, rm, readFile } from "node:fs/promises";
import path from "node:path";

// Keep the untouched local source film; publish only its web delivery copy.
await rm("dist/assets/35mm/film.mp4", { force: true });
const files=[];
async function walk(directory){
  for(const entry of await readdir(directory,{withFileTypes:true})){
    const file=path.join(directory,entry.name);
    if(entry.isDirectory())await walk(file);
    else {
      const size=(await stat(file)).size;
      if(size>25*1024*1024)throw new Error(`${file} exceeds Cloudflare Pages' 25 MiB asset limit.`);
      files.push({file,bytes:size});
    }
  }
}
await walk("dist");
if(files.length>20000)throw new Error("Cloudflare Pages file count limit exceeded.");
const html=await readFile("dist/index.html","utf8");
if(!html.includes('id="root"')||!html.includes('/assets/'))throw new Error("Pages entrypoint is incomplete.");
console.log(`Cloudflare Pages build verified: ${files.length} files, all below 25 MiB.`);
