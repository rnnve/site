/**
 * Runtime env without Cloudflare Workers bindings.
 * Prefer process.env (Vercel / Node); fall back to import.meta.env for local Vite.
 */
export function getEnv(key: string): string | undefined {
	const fromProcess =
		typeof process !== 'undefined' ? process.env?.[key] : undefined;
	if (fromProcess) return fromProcess;

	const meta = import.meta.env as Record<string, string | undefined>;
	return meta[key];
}
