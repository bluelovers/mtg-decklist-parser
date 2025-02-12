import FastGlob from '@bluelovers/fast-glob';
import { join, posix, relative } from 'path';
import { readFile } from 'fs-extra';
import autoParse from '../src/index';
import { __root } from './__root';

describe(`deck`, () =>
{

	FastGlob.sync<string>([
			'../example/*.{dek,txt}',
			'./deck/*.{dek,txt}',
		], {
			cwd: join(__root, 'test'),
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

				expect(actual.toDeckListString()).toMatchSnapshot();

			});

		})
	;

})
