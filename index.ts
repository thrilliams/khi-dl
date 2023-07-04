import { Command } from 'https://deno.land/x/cliffy@v0.25.7/command/mod.ts';
import puppeteer from 'https://deno.land/x/puppeteer@16.2.0/mod.ts';

import { formatType } from './formatType.ts';
import { loadPage } from './loadPage.ts';
import { downloadSongs } from './downloadSongs.ts';

const command = new Command()
	.name('khi-dl')
	.version('2.0')
	.description('Stick it to the man by downloading music from KHI')
	.option('-o, --out-path <path:string>', 'Specify the output directory.', {
		default: './out'
	})
	.type('format', formatType)
	.option('-f, --format <format:format>', 'Choose between MP3 and FLAC.', {
		default: 'mp3'
	})
	.arguments('<url>')
	.help({ hints: false })
	.action(async ({ outPath, format }, url) => {
		// conform to cliffy formatting style
		console.log();

		console.log(`  🔄 starting browser...\n`);

		const browser = await puppeteer.launch();

		const [title, urls] = await loadPage(browser, url);
		console.log(
			`  ✅ found ${urls.length} song${urls.length === 1 ? '' : 's'} from ${title}\n`
		);

		await downloadSongs(browser, urls, outPath, format as 'mp3' | 'flac');
		await browser.close();

		console.log(`\n  ✅ all songs downloaded to ${outPath}`);

		// conform to cliffy formatting style
		console.log();
	});

await command.parse(Deno.args);
