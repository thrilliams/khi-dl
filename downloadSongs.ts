import { basename, join } from 'https://deno.land/std@0.193.0/path/mod.ts';
import { ensureDir } from 'https://deno.land/std@0.193.0/fs/mod.ts';
import ProgressBar from 'https://deno.land/x/progress@v1.3.8/mod.ts';
import { Browser } from 'https://deno.land/x/puppeteer@16.2.0/mod.ts';

let completed = 0;

const downloadSong = async (
	browser: Browser,
	url: string,
	outPath: string,
	format: 'mp3' | 'flac',
	progress: ProgressBar
) => {
	const page = await browser.newPage();
	await page.goto(url);

	const [mp3, flac] = (await page.evaluate(
		`[...document.querySelectorAll('#pageContent > p > a:has(.songDownloadLink)')].map(e => e.href)`
	)) as string[];

	const fileUrl = format === 'mp3' ? mp3 : flac;
	const fileName = decodeURIComponent(basename(fileUrl));

	const resPromise = fetch(fileUrl);
	const filePath = join(outPath, fileName);
	const filePromise = Deno.open(filePath, { write: true, create: true });
	const [res, file] = await Promise.all([resPromise, filePromise]);

	await res.body?.pipeTo(file.writable);
	progress.render(++completed);
	await page.close();
};

export const downloadSongs = async (
	browser: Browser,
	urls: string[],
	outPath: string,
	format: 'mp3' | 'flac'
) => {
	await ensureDir(outPath);

	const progress = new ProgressBar({
		total: urls.length,
		complete: '=',
		incomplete: '-',
		display: '  🔄 :completed/:total songs downloaded [:bar]  '
	});

	completed = 0;
	progress.render(0);

	const downloadPromises: Promise<void>[] = [];
	for (const url of urls) {
		downloadPromises.push(downloadSong(browser, url, outPath, format, progress));
	}

	await Promise.all(downloadPromises);
};
