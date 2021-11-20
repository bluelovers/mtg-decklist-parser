import { Decklist } from './decklist';
import { MTGO } from './mtgo';
import { CardModel } from './cardModel';
import { parseString } from './util';

export { Decklist, MTGO, CardModel, parseString };

export function autoParse(rawInput: string | Uint8Array): MTGO | Decklist
{
	const deck = new MTGO(rawInput, false);

	return deck.valid ? deck : new Decklist(rawInput);
}

export default autoParse
