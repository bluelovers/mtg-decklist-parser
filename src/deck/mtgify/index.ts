import { AbstractDeck } from '../abstractDeck';
import { lineSplit } from 'crlf-normalize';
import { CardModel } from '../../cardModel';
import { EnumDecklistType, ICard, ICardXmlObject, SymDecklistType } from '../../types';

export class MtgifyDecklist<CARD extends CardModel = CardModel> extends AbstractDeck<CARD>
{
	readonly [SymDecklistType] = EnumDecklistType.mtgify as const;

	constructor(rawInput: string | Uint8Array, logError = true)
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
					this.deck.push(this._newCardModel(line));
				}
			});

			// @ts-ignore
			this.valid = this.deck.length > 0;
		}
		catch (error)
		{
			// @ts-ignore
			this.valid = false;
			if (logError)
			{
				console.error(error);
			}
		}

	}

	protected override _newCardModel(rawInput: string | ICardXmlObject | ICard, amount?: number)
	{
		return super._newCardModel(rawInput, amount)
	}

}
