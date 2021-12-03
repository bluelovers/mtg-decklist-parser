import { CardModel } from './cardModel';

export interface ICardWithoutAmount
{
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

export interface ICard extends ICardWithoutAmount
{
	/**
	 * The name of the card specified within the deck.
	 */
	amount: number,
}

export interface ICardXmlObject
{
	Quantity: string,
	Name: string,
	CatID: string,
}

export interface IDeck<CARD extends CardModel = CardModel>
{
	/**
	 * deck name
	 */
	name?: string;

	/**
	 * An array of `CardModel` for the main deck.
	 */
	deck: CARD[];
	/**
	 * An array of `CardModel` for the sideboard.
	 */
	sideboard: CARD[];
	/**
	 * If a companion is specified in the input will be available, otherwise null.
	 */
	companion?: CARD;
	/**
	 * If a commander is specified in the input will be available, otherwise null.
	 */
	commander?: CARD;
}

export const SymDecklistType = Symbol.for(`DecklistType`)

export const enum EnumDecklistType
{
	mtgo = 'mtgo',
	mtga = 'mtga',
	mtgify = 'mtgify',
}
