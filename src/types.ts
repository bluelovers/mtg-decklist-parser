import { CardModel } from './cardModel';

export interface ICard
{
	/**
	 * The name of the card specified within the deck.
	 */
	amount: number,
	/**
	 * The amount of the card specified within the deck.
	 */
	name: string,
	/**
	 * The set code of the card.
	 */
	set?: string,
	/**
	 * The collector number of the card within the specific set.
	 */
	collectors?: number,
	/**
	 * The ID of the card specific to MTG Online.
	 */
	mtgoID?: string,
}

export interface ICardXmlObject
{
	Quantity: string,
	Name: string,
	CatID: string,
}

export interface IDeck
{
	/**
	 * An array of `CardModel` for the main deck.
	 */
	deck: CardModel[];
	/**
	 * An array of `CardModel` for the sideboard.
	 */
	sideboard: CardModel[];
	/**
	 * If a companion is specified in the input will be available, otherwise null.
	 */
	companion?: CardModel;
	/**
	 * If a commander is specified in the input will be available, otherwise null.
	 */
	commander?: CardModel;
}
