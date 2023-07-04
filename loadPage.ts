import { Browser } from 'https://deno.land/x/puppeteer@16.2.0/mod.ts';

export const loadPage = async (browser: Browser, url: string): Promise<[string, string[]]> => {
	const page = await browser.newPage();
	await page.goto(url);

	const title = (await page.evaluate(
		`document.querySelector('#pageContent > h2:nth-child(2)').innerText`
	)) as string;

	const downloadLinks = (await page.evaluate(
		`[...document.querySelectorAll('#songlist > tbody > tr:not(#songlist_header, #songlist_footer) > .playlistDownloadSong > a')]
			.map(e => e.href)`
	)) as string[];

	await page.close();
	return [title, downloadLinks];
};
