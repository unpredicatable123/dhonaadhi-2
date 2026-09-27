// Imports seed/data into a Sanity dataset. Requires PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN.
import fs from 'node:fs';
import path from 'node:path';
import { loadEnvFile } from 'node:process';
import { createClient } from '@sanity/client';
import { dataDir } from './lib/assets.js';

const rootEnv = path.resolve(dataDir, '../../.env');
if (fs.existsSync(rootEnv)) loadEnvFile(rootEnv);

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!projectId || !token) {
	console.log(
		'Skipping Sanity import: set PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN in .env.'
	);
	console.log('The site runs on the fixture dataset (seed/data/dataset.ndjson) until then.');
	process.exit(0);
}

const client = createClient({
	projectId,
	dataset: process.env.PUBLIC_SANITY_DATASET || 'production',
	apiVersion: process.env.PUBLIC_SANITY_API_VERSION || '2026-09-01',
	token,
	useCdn: false
});

type AssetEntry = {
	_id: string;
	_type: 'sanity.imageAsset' | 'sanity.fileAsset';
	file: string;
	creditLine?: string;
};
const manifest: AssetEntry[] = JSON.parse(
	fs.readFileSync(path.join(dataDir, 'assets.json'), 'utf8')
);
const remap = new Map<string, string>();

const existing = new Set<string>(
	await client.fetch(`*[_type in ["sanity.imageAsset","sanity.fileAsset"]]._id`)
);
let uploaded = 0;
for (const a of manifest) {
	if (existing.has(a._id)) continue;
	const kind = a._type === 'sanity.imageAsset' ? 'image' : 'file';
	const doc = await client.assets.upload(kind, fs.createReadStream(path.join(dataDir, a.file)), {
		filename: path.basename(a.file),
		creditLine: a.creditLine
	});
	if (doc._id !== a._id) remap.set(a._id, doc._id);
	uploaded++;
	if (uploaded % 25 === 0) console.log(`uploaded ${uploaded} assets…`);
}
console.log(
	`assets: ${uploaded} uploaded, ${manifest.length - uploaded} already present, ${remap.size} remapped`
);

const docs = fs
	.readFileSync(path.join(dataDir, 'dataset.ndjson'), 'utf8')
	.trim()
	.split('\n')
	.map((l) => JSON.parse(l) as { _id: string; _type: string })
	.filter((d) => !d._type.startsWith('sanity.'));

const fix = (json: string) =>
	remap.size
		? json.replace(/"_ref":"([^"]+)"/g, (m, id: string) =>
				remap.has(id) ? `"_ref":"${remap.get(id)}"` : m
			)
		: json;

for (let i = 0; i < docs.length; i += 50) {
	const tx = client.transaction();
	for (const d of docs.slice(i, i + 50)) tx.createOrReplace(JSON.parse(fix(JSON.stringify(d))));
	await tx.commit({ visibility: 'async' });
	console.log(`documents ${Math.min(i + 50, docs.length)}/${docs.length}`);
}
console.log('Import complete.');
