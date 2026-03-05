const assetRegistry = new Map<string, string>();

export function registerAsset(key: string, url: string): void {
  assetRegistry.set(key, url);
}

export function getAssetUrl(key: string): string | undefined {
  return assetRegistry.get(key);
}

export function hasAsset(key: string): boolean {
  return assetRegistry.has(key);
}
