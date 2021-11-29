import { Decklist } from './deck/decklist';
import { MTGO } from './deck/mtgo';
import { MtgifyDecklist } from './deck/mtgify/index';

export { CardModel } from './cardModel';
export { parseString, toCardString, toDeckListString, toCardStringWithoutAmount } from './util';

export { Decklist, MTGO, MtgifyDecklist };

export function autoParse(rawInput: string | Uint8Array): MTGO | Decklist | MtgifyDecklist
{
	let deck = new MTGO(rawInput, false);

	if (deck.valid)
	{
		return deck
	}

	// @ts-ignore
	deck = new Decklist(rawInput);

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
