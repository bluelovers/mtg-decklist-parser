import { Decklist } from './deck/decklist';
import { MTGO } from './deck/mtgo';
import { MtgifyDecklist } from './deck/mtgify/index';
import { SymDecklistType } from './types';
import { AbstractDeck } from './deck/abstractDeck';

export { CardModel } from './cardModel';

export {
	parseString,
	toCardString,
	toDeckListString,
	toCardStringWithoutAmount,
	toMtgifyCardString,
} from './util';

export { SymDecklistType, AbstractDeck }

export { Decklist, MTGO, MtgifyDecklist };

export function autoParse(rawInput: string | Uint8Array): MTGO | Decklist | MtgifyDecklist
{
	let deck = new MTGO(rawInput, false);

	if (deck.valid)
	{
		return deck
	}

	// @ts-ignore
	deck = new Decklist(rawInput, false);

	if (deck.valid)
	{
		return deck as any as Decklist
	}

	let deck3 = new MtgifyDecklist(rawInput);

	if (deck3.valid)
	{
		return deck3
	}

	return deck as any as Decklist;
}

export default autoParse
