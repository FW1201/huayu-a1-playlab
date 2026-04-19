const DEFAULT_GITHUB_ASSET_BASE =
  "https://raw.githubusercontent.com/FW1201/huayu-a1-playlab/main/public/assets";

export function assetPath(path: string) {
  const cleanPath = path.replace(/^\/+/, "");
  const localBase = "/assets";
  const githubBase =
    import.meta.env.VITE_GITHUB_ASSET_BASE || DEFAULT_GITHUB_ASSET_BASE;
  const base = import.meta.env.DEV ? localBase : githubBase;

  return `${base}/${cleanPath}`;
}
