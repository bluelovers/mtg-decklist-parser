import { join, posix, relative } from 'path';
import FastGlob from '@bluelovers/fast-glob';
import { readFile } from 'fs-extra';
import autoParse from '../src/index';
import { __root } from './__root';
import { EnumDecklistType, SymDecklistType } from '../src/types';

describe(`deck:mtgify`, () =>
{

	FastGlob.sync<string>([
			'*.{dec,txt}',
		], {
			cwd: join(__root, 'test', 'deck', 'mtgify'),
			absolute: true,
		})
		.forEach(file =>
		{

			test(posix.normalize(relative(__root, file)), async () =>
			{

				let rawInput = await readFile(file)

				let actual = autoParse(rawInput);

				expect(actual).toMatchSnapshot({
					valid: true,
					[SymDecklistType]: EnumDecklistType.mtgify,
				});

			});

		})
	;

});
