import { CardModel } from '../cardModel';
import { IDeck } from '../types';
import { toDeckListString } from '../util';

export abstract class AbstractDeck<CARD extends CardModel = CardModel> implements IDeck<CARD>
{
	/**
	 * deck name
	 */
	name?: string;

	/**
	 * If the parsing of the decklist was successful. Note: this does not necessarily mean the input was well formed.
	 */
	readonly valid: boolean = false;
	/**
	 * An array of `CardModel` for the main deck.
	 */
	deck: CARD[] = [];
	/**
	 * An array of `CardModel` for the sideboard.
	 */
	sideboard: CARD[] = [];
	/**
	 * If a companion is specified in the input will be available, otherwise null.
	 */
	companion?: CARD = null;
	/**
	 * If a commander is specified in the input will be available, otherwise null.
	 */
	commander?: CARD = null;

	protected constructor()
	{
		this.valid = false;
	}

	toDeckListString()
	{
		return toDeckListString(this);
	}

	protected _newCardModel(rawInput: any, amount?: number)
	{
		const card = new CardModel(rawInput) as CARD

		card.amount = amount ?? card.amount;

		return card
	}

}
