import { CardModel } from '../cardModel';
import { AbstractDeck } from './abstractDeck';
import { lineSplit } from 'crlf-normalize';
import { EnumDecklistType, ICard, ICardXmlObject, SymDecklistType } from '../types';

const enum SECTIONS
{
	unstarted = 0,
	commander = 1,
	companion = 2,
	deck = 3,
	sideboard = 4,
};

const _deckRegex = /^deck$/i;
const _sideboardRegex = /^sideboard$/i;
const _commanderRegex = /^commander$/i;
const _companionRegex = /^companion$/i;

export class Decklist<CARD extends CardModel = CardModel> extends AbstractDeck<CARD>
{
	readonly [SymDecklistType] = EnumDecklistType.mtga as const;

	constructor(rawInput: string | Uint8Array, logError = true)
	{
		super();

		let splitData = lineSplit(rawInput.toString().trim());
		let currentSection = SECTIONS.unstarted;

		try
		{
			splitData.forEach(line =>
			{
				line = line.trim();

				if (line.match(_commanderRegex))
				{
					currentSection = SECTIONS.commander;
					return;
				}
				else if (line.match(_companionRegex))
				{
					currentSection = SECTIONS.companion;
					return;
				}
				else if (line.match(_deckRegex))
				{
					currentSection = SECTIONS.deck;
					return;
				}
				else if (currentSection === SECTIONS.unstarted && line.length > 0)
				{
					currentSection = SECTIONS.deck;
				}
				else if (line.match(_sideboardRegex) || currentSection === SECTIONS.deck && line.length === 0)
				{
					currentSection = SECTIONS.sideboard;
					return;
				}
				else if (line.length === 0)
				{
					return;
				}

				let card = this._newCardModel(line);

				switch (currentSection)
				{
					case SECTIONS.commander:
						this.commander = card;
						break;
					case SECTIONS.companion:
						this.companion = card;
						break;
					case SECTIONS.deck:
						this.deck.push(card);
						break;
					case SECTIONS.sideboard:
						this.sideboard.push(card);
						break;
				}

				// @ts-ignore
				this.valid = true;
			});
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
