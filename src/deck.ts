import { CardModel } from './cardModel';

export abstract class Deck
{
	/**
	 * If the parsing of the decklist was successful. Note: this does not necessarily mean the input was well formed.
	 */
	readonly valid: boolean = false;
	/**
	 * An array of `CardModel` for the main deck.
	 */
	deck: CardModel[] = [];
	/**
	 * An array of `CardModel` for the sideboard.
	 */
	sideboard: CardModel[] = [];
	/**
	 * If a companion is specified in the input will be available, otherwise null.
	 */
	companion?: CardModel = null;
	/**
	 * If a commander is specified in the input will be available, otherwise null.
	 */
	commander?: CardModel = null;
}
