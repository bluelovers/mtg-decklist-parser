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
