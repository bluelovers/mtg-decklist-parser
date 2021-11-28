import { Decklist } from './deck/decklist';
import { MTGO } from './deck/mtgo';
export { CardModel } from './cardModel';
export { parseString, toCardString, toDeckListString, toCardStringWithoutAmount } from './util';

export { Decklist, MTGO };

export function autoParse(rawInput: string | Uint8Array): MTGO | Decklist
{
	const deck = new MTGO(rawInput, false);

	return deck.valid ? deck : new Decklist(rawInput);
}

export default autoParse
