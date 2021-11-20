import FastGlob from '@bluelovers/fast-glob';
import { relative, join, posix } from 'path';
import { readFile } from 'fs-extra';
import autoParse from '../src/index';

const __root = join(__dirname, '..');

describe(`deck`, () =>
{

	FastGlob.sync<string>([
			'../example/*.{dek,txt}',
			'./deck/*.{dek,txt}',
		], {
			cwd: __dirname,
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
				});

			});

		})
	;

})
