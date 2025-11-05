const cache = new Map<string, string>();
const isProd = typeof (window as any).templates !== 'undefined';

export async function loadHtml(path: string): Promise<string> {
  if (cache.has(path)) return cache.get(path)!;

  let html = '';

  if (isProd) {
    const templates = (window as any).templates;
    if (templates[path]) html = templates[path];
  }

  if (!html) {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Failed to load ${path}`);
    html = await response.text();
  }

  const includeRegex = /<include\s+src=["'](.+?)["']\s*><\/include>/g;
  const matches = [...html.matchAll(includeRegex)];

  for (const match of matches) {
    const includePath = match[1];
    console.log(`Including HTML from ${includePath}`);
    const includeHtml = await loadHtml(includePath);
    html = html.replace(match[0], includeHtml);
  }

  cache.set(path, html);
  return html;
}
