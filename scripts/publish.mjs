import fs from "node:fs";
import http from "isomorphic-git/http/node";
import git from "isomorphic-git";

const dir = process.cwd();
const remoteUrl = process.env.SITES_REMOTE_URL;
const token = process.env.SITES_GIT_TOKEN;
const branch = process.env.SITES_BRANCH || "main";

if (!remoteUrl || !token) throw new Error("Missing temporary Sites repository credentials.");

await git.init({ fs, dir, defaultBranch: branch });
await git.setConfig({ fs, dir, path: "user.name", value: "Codex" });
await git.setConfig({ fs, dir, path: "user.email", value: "codex@openai.com" });

const matrix = await git.statusMatrix({ fs, dir });
for (const [filepath, head, workdir, stage] of matrix) {
  if (workdir === 0) await git.remove({ fs, dir, filepath });
  else if (head !== workdir || stage !== workdir) await git.add({ fs, dir, filepath });
}

const oid = await git.commit({
  fs,
  dir,
  message: "Build interactive wedding invitation",
  author: { name: "Codex", email: "codex@openai.com" }
});

try {
  await git.addRemote({ fs, dir, remote: "origin", url: remoteUrl });
} catch {
  await git.setConfig({ fs, dir, path: "remote.origin.url", value: remoteUrl });
}

await git.push({
  fs,
  http,
  dir,
  remote: "origin",
  ref: branch,
  force: true,
  onAuth: () => ({ username: "x-access-token", password: token })
});

process.stdout.write(oid);
