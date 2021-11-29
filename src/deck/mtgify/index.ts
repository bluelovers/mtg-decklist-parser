import { Deck } from '../deck';
import { lineSplit } from 'crlf-normalize';
import { CardModel } from '../../cardModel';
import { EnumDecklistType, SymDecklistType } from '../../types';

export class MtgifyDecklist extends Deck
{
	readonly [SymDecklistType] = EnumDecklistType.mtgify as const;

	constructor(rawInput: string | Uint8Array)
	{
		super();

		let splitData = lineSplit(rawInput.toString().trim());

		//let currentSection = SECTIONS.unstarted;

		try
		{

			splitData.forEach(line =>
			{
				line = line.trim();

				let _m = line.match(/^(\d+)x\s+(.+)$/)

				if (_m?.[1]?.length)
				{
					this.deck.push(new CardModel(line));
				}
			});

			// @ts-ignore
			this.valid = this.deck.length > 0;
		}
		catch (error)
		{
			// @ts-ignore
			this.valid = false;
			console.error(error);
		}

	}

}
