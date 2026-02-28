"use client";

import { useState, useMemo } from "react";
import { CopyButton } from "@/components/CopyButton";

interface DockerService {
  image: string;
  containerName: string;
  ports: string[];
  volumes: string[];
  environment: string[];
  envFile: string[];
  networks: string[];
  restart: string;
  command: string;
  entrypoint: string;
  labels: string[];
  capAdd: string[];
  capDrop: string[];
  devices: string[];
  privileged: boolean;
  networkMode: string;
  hostname: string;
  user: string;
  workdir: string;
  memory: string;
  cpus: string;
  links: string[];
  dependsOn: string[];
  extra: string[];
}

function tokenize(cmd: string): string[] {
  const tokens: string[] = [];
  let current = "";
  let inSingle = false;
  let inDouble = false;

  for (let i = 0; i < cmd.length; i++) {
    const c = cmd[i];
    if (c === "'" && !inDouble) { inSingle = !inSingle; }
    else if (c === '"' && !inSingle) { inDouble = !inDouble; }
    else if (c === " " && !inSingle && !inDouble) {
      if (current) { tokens.push(current); current = ""; }
    } else { current += c; }
  }
  if (current) tokens.push(current);
  return tokens;
}

function parseDockerRun(cmd: string): { service: DockerService; name: string; error?: string } {
  const svc: DockerService = {
    image: "", containerName: "app", ports: [], volumes: [], environment: [],
    envFile: [], networks: [], restart: "", command: "", entrypoint: "", labels: [],
    capAdd: [], capDrop: [], devices: [], privileged: false, networkMode: "",
    hostname: "", user: "", workdir: "", memory: "", cpus: "", links: [],
    dependsOn: [], extra: [],
  };

  // Strip leading 'docker run' or 'docker container run'
  let cleaned = cmd.trim().replace(/^docker\s+(?:container\s+)?run\s+/, "");
  const tokens = tokenize(cleaned);
  let i = 0;
  const take = () => tokens[++i] ?? "";

  while (i < tokens.length) {
    const t = tokens[i];

    const getVal = (flag: string): string | null => {
      if (t === flag) return take();
      if (t.startsWith(flag + "=")) return t.slice(flag.length + 1);
      return null;
    };

    const tryFlag = (flag: string): string | null => {
      const v = getVal(flag);
      if (v !== null) return v;
      // short form for single-char flags
      return null;
    };

    let v: string | null;

    if ((v = tryFlag("-p")) !== null || (v = tryFlag("--publish")) !== null) {
      svc.ports.push(v!);
    } else if ((v = tryFlag("-v")) !== null || (v = tryFlag("--volume")) !== null) {
      svc.volumes.push(v!);
    } else if ((v = tryFlag("-e")) !== null || (v = tryFlag("--env")) !== null) {
      svc.environment.push(v!);
    } else if ((v = tryFlag("--env-file")) !== null) {
      svc.envFile.push(v!);
    } else if ((v = tryFlag("--name")) !== null) {
      svc.containerName = v!;
    } else if ((v = tryFlag("--network")) !== null || (v = tryFlag("--net")) !== null) {
      if (v === "host" || v === "none" || v === "bridge") {
        svc.networkMode = v!;
      } else {
        svc.networks.push(v!);
      }
    } else if ((v = tryFlag("--restart")) !== null) {
      svc.restart = v!;
    } else if ((v = tryFlag("--entrypoint")) !== null) {
      svc.entrypoint = v!;
    } else if ((v = tryFlag("-l")) !== null || (v = tryFlag("--label")) !== null) {
      svc.labels.push(v!);
    } else if ((v = tryFlag("--cap-add")) !== null) {
      svc.capAdd.push(v!);
    } else if ((v = tryFlag("--cap-drop")) !== null) {
      svc.capDrop.push(v!);
    } else if ((v = tryFlag("--device")) !== null) {
      svc.devices.push(v!);
    } else if ((v = tryFlag("-h")) !== null || (v = tryFlag("--hostname")) !== null) {
      svc.hostname = v!;
    } else if ((v = tryFlag("-u")) !== null || (v = tryFlag("--user")) !== null) {
      svc.user = v!;
    } else if ((v = tryFlag("-w")) !== null || (v = tryFlag("--workdir")) !== null) {
      svc.workdir = v!;
    } else if ((v = tryFlag("-m")) !== null || (v = tryFlag("--memory")) !== null) {
      svc.memory = v!;
    } else if ((v = tryFlag("--cpus")) !== null) {
      svc.cpus = v!;
    } else if ((v = tryFlag("--link")) !== null) {
      svc.links.push(v!);
    } else if (t === "--privileged") {
      svc.privileged = true;
    } else if (t === "-d" || t === "--detach" || t === "-it" || t === "-i" || t === "-t" || t === "--rm") {
      // Ignore: handled by compose mode
    } else if (!t.startsWith("-")) {
      // First non-flag token is the image (if image not set yet)
      if (!svc.image) {
        svc.image = t;
      } else {
        // Everything after image is the command
        svc.command = tokens.slice(i).join(" ");
        break;
      }
    } else {
      // Unknown flag — skip it with its value if next token doesn't start with -
      if (i + 1 < tokens.length && !tokens[i + 1].startsWith("-")) {
        svc.extra.push(`# unknown flag: ${t} ${tokens[i + 1]}`);
        i++;
      } else {
        svc.extra.push(`# unknown flag: ${t}`);
      }
    }
    i++;
  }

  if (!svc.image) {
    return { service: svc, name: "app", error: "No image found. Make sure the command starts with 'docker run'." };
  }

  // Derive service name from container name or image
  const name = svc.containerName || svc.image.split("/").pop()?.split(":")[0] || "app";

  return { service: svc, name };
}

function indent(n: number, s: string): string {
  return " ".repeat(n) + s;
}

function toCompose(cmd: string): string {
  const { service: svc, name, error } = parseDockerRun(cmd);
  if (error) return `# Error: ${error}`;

  const lines: string[] = ["services:"];
  lines.push(`  ${name}:`);
  lines.push(indent(4, `image: ${svc.image}`));

  if (svc.containerName) lines.push(indent(4, `container_name: ${svc.containerName}`));
  if (svc.hostname)      lines.push(indent(4, `hostname: ${svc.hostname}`));
  if (svc.user)          lines.push(indent(4, `user: "${svc.user}"`));
  if (svc.workdir)       lines.push(indent(4, `working_dir: ${svc.workdir}`));
  if (svc.restart)       lines.push(indent(4, `restart: ${svc.restart}`));
  if (svc.privileged)    lines.push(indent(4, `privileged: true`));
  if (svc.networkMode)   lines.push(indent(4, `network_mode: "${svc.networkMode}"`));
  if (svc.command)       lines.push(indent(4, `command: ${svc.command}`));
  if (svc.entrypoint)    lines.push(indent(4, `entrypoint: ${svc.entrypoint}`));

  if (svc.ports.length) {
    lines.push(indent(4, "ports:"));
    svc.ports.forEach((p) => lines.push(indent(6, `- "${p}"`)));
  }

  if (svc.volumes.length) {
    lines.push(indent(4, "volumes:"));
    svc.volumes.forEach((v) => lines.push(indent(6, `- ${v}`)));
  }

  if (svc.environment.length) {
    lines.push(indent(4, "environment:"));
    svc.environment.forEach((e) => {
      if (e.includes("=")) {
        const [k, ...rest] = e.split("=");
        lines.push(indent(6, `${k}: "${rest.join("=")}"`));
      } else {
        lines.push(indent(6, `${e}: ""`));
      }
    });
  }

  if (svc.envFile.length) {
    lines.push(indent(4, "env_file:"));
    svc.envFile.forEach((f) => lines.push(indent(6, `- ${f}`)));
  }

  if (svc.labels.length) {
    lines.push(indent(4, "labels:"));
    svc.labels.forEach((l) => lines.push(indent(6, `- "${l}"`)));
  }

  if (svc.capAdd.length) {
    lines.push(indent(4, "cap_add:"));
    svc.capAdd.forEach((c) => lines.push(indent(6, `- ${c}`)));
  }

  if (svc.capDrop.length) {
    lines.push(indent(4, "cap_drop:"));
    svc.capDrop.forEach((c) => lines.push(indent(6, `- ${c}`)));
  }

  if (svc.devices.length) {
    lines.push(indent(4, "devices:"));
    svc.devices.forEach((d) => lines.push(indent(6, `- "${d}"`)));
  }

  if (svc.links.length) {
    lines.push(indent(4, "links:"));
    svc.links.forEach((l) => lines.push(indent(6, `- ${l}`)));
  }

  if (svc.memory || svc.cpus) {
    lines.push(indent(4, "deploy:"));
    lines.push(indent(6, "resources:"));
    lines.push(indent(8, "limits:"));
    if (svc.memory) lines.push(indent(10, `memory: ${svc.memory}`));
    if (svc.cpus)   lines.push(indent(10, `cpus: "${svc.cpus}"`));
  }

  if (svc.networks.length) {
    lines.push(indent(4, "networks:"));
    svc.networks.forEach((n) => lines.push(indent(6, `- ${n}`)));
    lines.push("");
    lines.push("networks:");
    svc.networks.forEach((n) => lines.push(`  ${n}:`));
  }

  if (svc.extra.length) {
    lines.push("");
    svc.extra.forEach((e) => lines.push(indent(4, e)));
  }

  return lines.join("\n");
}

const EXAMPLES = [
  {
    label: "nginx",
    cmd: "docker run -d --name nginx -p 80:80 -p 443:443 -v /var/www:/usr/share/nginx/html:ro -v /etc/nginx/nginx.conf:/etc/nginx/nginx.conf:ro --restart always nginx:alpine",
  },
  {
    label: "Postgres",
    cmd: "docker run -d --name postgres -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=secret -e POSTGRES_DB=myapp -p 5432:5432 -v pgdata:/var/lib/postgresql/data --restart unless-stopped postgres:16",
  },
  {
    label: "Redis",
    cmd: "docker run -d --name redis -p 6379:6379 --restart always redis:7-alpine",
  },
  {
    label: "Node app",
    cmd: "docker run -d --name myapp -p 3000:3000 -e NODE_ENV=production -e DATABASE_URL=postgres://localhost/myapp --restart on-failure --network app-network mycompany/myapp:latest",
  },
];

export default function DockerComposeConverter() {
  const [input, setInput] = useState(EXAMPLES[0].cmd);

  const output = useMemo(() => (input.trim() ? toCompose(input) : ""), [input]);

  return (
    <div className="tool-page">
      <h1>Docker Run → Compose Converter</h1>
      <p className="desc">Convert a <code>docker run</code> command to a <code>docker-compose.yml</code> service definition. Supports ports, volumes, environment variables, networks, and more.</p>

      <div className="btn-group mb-3" style={{ flexWrap: "wrap" }}>
        {EXAMPLES.map((ex) => (
          <button key={ex.label} className={`btn ${input === ex.cmd ? "btn-primary" : ""}`} onClick={() => setInput(ex.cmd)}>{ex.label}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
            <label style={{ margin: 0 }}>docker run command</label>
            <button className="btn" style={{ fontSize: "12px" }} onClick={() => setInput("")}>Clear</button>
          </div>
          <textarea
            className="tool-input font-mono"
            rows={12}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="docker run -d --name myapp -p 8080:80 ..."
            spellCheck={false}
          />
        </div>

        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
            <label style={{ margin: 0 }}>docker-compose.yml</label>
            <CopyButton text={output} />
          </div>
          <pre className="output-box font-mono" style={{ fontSize: "13px", minHeight: "260px", whiteSpace: "pre-wrap" }}>
            {output || "Enter a docker run command to convert…"}
          </pre>
        </div>
      </div>

      <section className="tool-prose">
        <h2>About the Docker Run to Compose Converter</h2>
        <p>The <code>docker run</code> command is a powerful one-liner for starting containers with a full set of options — but as services grow more complex, managing them with raw <code>docker run</code> commands becomes unwieldy. Docker Compose solves this by declaring all service configurations in a <code>docker-compose.yml</code> file that can be committed to source control, reviewed, and run with a single <code>docker compose up -d</code>. This tool converts any <code>docker run</code> command into the equivalent Compose service definition automatically.</p>
        <p>The converter handles the most common flags: <code>-p</code> (ports), <code>-v</code> (volumes), <code>-e</code> / <code>--env-file</code> (environment), <code>--restart</code>, <code>--network</code>, <code>--name</code>, <code>--hostname</code>, <code>--user</code>, <code>--workdir</code>, <code>--privileged</code>, <code>--cap-add</code>, <code>--cap-drop</code>, <code>--device</code>, <code>--memory</code>, <code>--cpus</code>, <code>--link</code>, and <code>--entrypoint</code>. Flags that Compose handles differently (<code>-d</code>, <code>--rm</code>, <code>-it</code>) are intentionally omitted.</p>
        <p>All conversion runs locally in your browser. No Docker commands or secrets are sent to any server. After converting, review the generated YAML carefully — some flags may require additional configuration (like named volume declarations or custom network definitions) that Compose requires at the top-level.</p>
      </section>

      <section className="tool-faq">
        <h2>Frequently Asked Questions</h2>
        <details>
          <summary>What is Docker Compose?</summary>
          <p>Docker Compose is a tool for defining and running multi-container Docker applications. You describe services, networks, and volumes in a <code>docker-compose.yml</code> file, then use <code>docker compose up</code> to start everything. It replaces long <code>docker run</code> commands with readable, version-controlled configuration.</p>
        </details>
        <details>
          <summary>What is the difference between <code>docker-compose</code> and <code>docker compose</code>?</summary>
          <p><code>docker-compose</code> is the original standalone tool (v1, written in Python). <code>docker compose</code> (no hyphen) is the newer plugin integrated into the Docker CLI (v2, written in Go). Docker v2 is the current standard and ships with Docker Desktop. Both use the same YAML format.</p>
        </details>
        <details>
          <summary>What happens to <code>--rm</code> and <code>-d</code> flags?</summary>
          <p>The <code>--rm</code> flag (remove container on exit) has no direct Compose equivalent — Compose services are expected to be persistent. The <code>-d</code> (detached) flag is the default behavior when running <code>docker compose up -d</code>. These flags are intentionally dropped during conversion.</p>
        </details>
        <details>
          <summary>How do I add multiple services to my compose file?</summary>
          <p>Convert each <code>docker run</code> command separately and combine the results under a single <code>services:</code> key. If services share a network or volumes, declare them in the top-level <code>networks:</code> and <code>volumes:</code> sections. Services can reference each other by name as hostnames within the same Compose network.</p>
        </details>
        <details>
          <summary>Why should I use Compose instead of <code>docker run</code>?</summary>
          <p>Compose files are declarative, versionable, and reproducible. They make it easy to spin up entire stacks (<code>docker compose up</code>), tear them down (<code>docker compose down</code>), view logs (<code>docker compose logs</code>), and share configurations with teammates. A <code>docker run</code> command in your shell history is fragile; a Compose file in your repository is permanent.</p>
        </details>
      </section>
    </div>
  );
}
