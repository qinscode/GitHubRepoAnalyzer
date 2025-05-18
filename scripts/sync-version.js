const fs = require("fs");
const path = require("path");

const newVersion = process.argv[2];
if (!newVersion) {
	console.error("❌ Please provide a version number, e.g.: pnpm release 1.2.3");
	process.exit(1);
}

// Update package.json
const pkgPath = path.join(__dirname, "../package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
pkg.version = newVersion;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));

// Update tauri.conf.json
const tauriPath = path.join(__dirname, "../src-tauri/tauri.conf.json");
const tauri = JSON.parse(fs.readFileSync(tauriPath, "utf-8"));
tauri.package.version = newVersion;
fs.writeFileSync(tauriPath, JSON.stringify(tauri, null, 2));

console.log(`✅ Synchronized version to: ${newVersion}`);
