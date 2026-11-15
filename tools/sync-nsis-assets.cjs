const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const root = path.resolve(__dirname, '..');
const logo = path.join(root, 'frontend/images/Logo.jpeg');
async function main() {
  const files = [];
  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    for (const item of fs.readdirSync(dir, {withFileTypes:true})) {
      if (['build', '.gradle', 'Pods', 'node_modules'].includes(item.name)) continue;
      const file = path.join(dir, item.name);
      if (item.isDirectory()) walk(file);
      else if (/\.(png|webp)$/.test(item.name) && (/ic_launcher|splash/i.test(item.name) || /AppIcon\.appiconset|Splash\.imageset/.test(file))) files.push(file);
    }
  }
  for (const dir of ['android', 'ios', 'Final-Apps']) walk(path.join(root, dir));
  files.push(path.join(root,'assets/icon.png'), path.join(root,'assets/splash.png'));
  for (const item of fs.readdirSync(path.join(root,'icons'))) files.push(path.join(root,'icons',item));
  for (const file of files) {
    const meta = await sharp(file).metadata();
    const background = /ic_launcher_background/.test(file);
    let pipeline = background
      ? sharp({create:{width:meta.width,height:meta.height,channels:3,background:'#ffffff'}})
      : sharp(logo).resize(meta.width, meta.height, {fit:'contain', background:'#ffffff'});
    const buffer = await (file.endsWith('.webp') ? pipeline.webp({quality:90}) : pipeline.png()).toBuffer();
    fs.writeFileSync(file, buffer);
  }
  // Keep mobile source bundles aligned with the current web source where present.
  for (const dir of ['ios/App/App/public', 'Final-Apps/iPhone/App/App/public', 'android/app/src/main/assets/public']) {
    const target = path.join(root,dir);
    if (fs.existsSync(target)) fs.cpSync(path.join(root,'frontend'), target, {recursive:true});
  }
  console.log(`Updated ${files.length} app icons and splash assets.`);
}
main().catch(error => {console.error(error.message); process.exitCode=1;});
