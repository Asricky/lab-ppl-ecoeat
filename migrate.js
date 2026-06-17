const fs = require('fs');

try {
  fs.mkdirSync('app/dashboard/kurir/home', { recursive: true });
  fs.mkdirSync('app/dashboard/kurir/tasks', { recursive: true });
  fs.mkdirSync('app/dashboard/kurir/history', { recursive: true });
  fs.mkdirSync('app/dashboard/kurir/earnings', { recursive: true });
  fs.mkdirSync('app/dashboard/kurir/settings', { recursive: true });

  fs.renameSync('app/dashboard/page.tsx', 'app/dashboard/kurir/home/page.tsx');
  fs.renameSync('app/tasks/[id]', 'app/dashboard/kurir/tasks/[id]');
  fs.renameSync('app/history/page.tsx', 'app/dashboard/kurir/history/page.tsx');
  fs.renameSync('app/earnings/page.tsx', 'app/dashboard/kurir/earnings/page.tsx');
  fs.renameSync('app/settings/page.tsx', 'app/dashboard/kurir/settings/page.tsx');

  fs.rmSync('app/tasks', { recursive: true, force: true });
  fs.rmSync('app/history', { recursive: true, force: true });
  fs.rmSync('app/earnings', { recursive: true, force: true });
  fs.rmSync('app/settings', { recursive: true, force: true });
  
  console.log("Migration successful");
} catch(e) {
  console.error("Migration error:", e);
}
