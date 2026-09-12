import { request } from 'node:https';
import { lookup } from 'node:dns/promises';

export class FetchV4Result {
	constructor(
		readonly ok: boolean,
		readonly status: number,
		private body: Buffer,
	) {}

	async json(): Promise<unknown> {
		return JSON.parse(this.body.toString('utf8'));
	}

	async text(): Promise<string> {
		return this.body.toString('utf8');
	}
}

/** GET over IPv4 only, bypassing any AAAA/egress issues in the serverless runtime. */
export function fetchV4(url: string, timeoutMs = 15_000): Promise<FetchV4Result> {
	return new Promise((resolve, reject) => {
		const target = new URL(url);
		const req = request(
			target,
			{
				family: 4,
				method: 'GET',
				headers: { accept: 'application/json', 'user-agent': 'rinnesite/1.0' },
			},
			(res) => {
				const chunks: Buffer[] = [];
				res.on('data', (chunk: Buffer) => chunks.push(chunk));
				res.on('end', () => {
					const body = Buffer.concat(chunks);
					const status = res.statusCode ?? 0;
					resolve(new FetchV4Result(status >= 200 && status < 300, status, body));
				});
			},
		);
		req.on('error', (error) => reject(error));
		req.setTimeout(timeoutMs, () => req.destroy(new Error('Request timed out')));
		req.end();
	});
}

/** Resolves the host's A/AAAA records for diagnostics. */
export async function reportDns(url: string): Promise<string> {
	const { hostname } = new URL(url);
	try {
		const addrs = await lookup(hostname, { all: true, verbatim: false });
		return addrs.map((addr) => addr.address).join(', ');
	} catch (error) {
		return `DNS lookup failed: ${(error as Error).message}`;
	}
}