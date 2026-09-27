import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

export const dataDir = path.resolve(import.meta.dirname, '../../data');

type ImageAsset = {
	_id: string;
	_type: 'sanity.imageAsset';
	originalFilename: string;
	extension: string;
	mimeType: string;
	size: number;
	sha1hash: string;
	path: string;
	url: string;
	metadata: {
		_type: 'sanity.imageMetadata';
		dimensions: {
			_type: 'sanity.imageDimensions';
			width: number;
			height: number;
			aspectRatio: number;
		};
		lqip: string;
	};
	creditLine?: string;
	/** Seed-only: absolute source path for upload. Stripped before import. */
	localPath: string;
};

type FileAsset = {
	_id: string;
	_type: 'sanity.fileAsset';
	originalFilename: string;
	extension: string;
	mimeType: string;
	size: number;
	sha1hash: string;
	path: string;
	url: string;
	localPath: string;
};

/**
 * Registry of every asset referenced by the dataset. Ids follow Sanity's own scheme
 * (`image-{sha1}-{w}x{h}-{ext}` / `file-{sha1}-{ext}`), so a later upload of the same
 * bytes resolves to the same id and all references stay valid.
 */
export class Assets {
	images = new Map<string, ImageAsset>();
	files = new Map<string, FileAsset>();

	async image(relPath: string, creditLine?: string): Promise<string> {
		const localPath = path.join(dataDir, relPath);
		const cached = [...this.images.values()].find((a) => a.localPath === localPath);
		if (cached) return cached._id;
		const buf = fs.readFileSync(localPath);
		const sha1 = crypto.createHash('sha1').update(buf).digest('hex');
		const meta = await sharp(buf).metadata();
		const ext = meta.format === 'jpeg' ? 'jpg' : (meta.format ?? 'webp');
		const w = meta.width ?? 0;
		const h = meta.height ?? 0;
		const lqip = await sharp(buf).resize(20).webp({ quality: 40 }).toBuffer();
		const id = `image-${sha1}-${w}x${h}-${ext}`;
		this.images.set(id, {
			_id: id,
			_type: 'sanity.imageAsset',
			originalFilename: path.basename(relPath),
			extension: ext,
			mimeType: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
			size: buf.length,
			sha1hash: sha1,
			path: `images/fixtures/${sha1}.${ext}`,
			url: `/fixtures/${relPath.replace(/\\/g, '/')}`,
			metadata: {
				_type: 'sanity.imageMetadata',
				dimensions: { _type: 'sanity.imageDimensions', width: w, height: h, aspectRatio: w / h },
				lqip: `data:image/webp;base64,${lqip.toString('base64')}`
			},
			creditLine,
			localPath
		});
		return id;
	}

	file(relPath: string): string {
		const localPath = path.join(dataDir, relPath);
		const buf = fs.readFileSync(localPath);
		const sha1 = crypto.createHash('sha1').update(buf).digest('hex');
		const ext = path.extname(relPath).slice(1);
		const id = `file-${sha1}-${ext}`;
		this.files.set(id, {
			_id: id,
			_type: 'sanity.fileAsset',
			originalFilename: path.basename(relPath),
			extension: ext,
			mimeType: ext === 'pdf' ? 'application/pdf' : 'application/octet-stream',
			size: buf.length,
			sha1hash: sha1,
			path: `files/fixtures/${sha1}.${ext}`,
			url: `/fixtures/${relPath.replace(/\\/g, '/')}`,
			localPath
		});
		return id;
	}

	size(fileId: string): number {
		return this.files.get(fileId)?.size ?? 0;
	}

	/** Sanity image field value. */
	static ref(assetId: string, alt: string, extra: Record<string, unknown> = {}) {
		return { _type: 'altImage', asset: { _type: 'reference', _ref: assetId }, alt, ...extra };
	}
}
