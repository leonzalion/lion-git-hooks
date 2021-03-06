#!/usr/bin/env node

/**
 * A CLI tool to change the git hooks to commands from config
 */
import isHeroku from 'is-heroku';
import minimist from 'minimist';
import process from 'node:process';

import { getConfig } from '~/utils/config.js';
import { setHooksFromConfig } from '~/utils/git-hooks.js';

if (isHeroku) {
	console.info('[INFO] Skipped setting hooks on Heroku.');
	process.exit(0);
}

const argv = minimist(process.argv.slice(2));

try {
	const result = setHooksFromConfig({
		...getConfig(),
		...(argv['no-ci'] && { noCi: argv['no-ci'] as boolean }),
		...(argv['ci-only'] && { noCi: argv['ci-only'] as boolean }),
	});

	if (result.hooksSet) {
		console.info('[INFO] Successfully set all git hooks');
	} else {
		console.info(`[INFO] ${result.reason}`);
	}
} catch (error: unknown) {
	console.error(
		'[ERROR], Was not able to set git hooks. Error: ' + (error as Error).message
	);
}
