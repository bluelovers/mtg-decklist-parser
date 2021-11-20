import parser, { ValidationError } from 'fast-xml-parser';
import { CardModel } from './cardModel';
import { Deck } from './deck';

const _commanderAnnotation = '16777728';

export class MTGO extends Deck
{
	constructor(xml: string, logError = true)
	{
		super();

		xml = xml.trim();

		const output = parser.validate(xml);

		// @ts-ignore
		this.valid = output === true;

		if (this.valid)
		{
			const parsed = parser.parse(xml, {
				attributeNamePrefix: '',
				ignoreAttributes: false,
			}) as {
				Deck: {
					Cards: {
						Annotation?: typeof _commanderAnnotation,
						Sideboard?: 'true',
						Quantity: string,
						Name: string,
						CatID: string,
					}[]
				}
			};

			parsed.Deck.Cards.forEach(card =>
			{
				if (card.Annotation === _commanderAnnotation)
				{
					this.commander = new CardModel(card);
				}
				else if (card.Sideboard === 'true')
				{
					this.sideboard.push(new CardModel(card));
				}
				else
				{
					this.deck.push(new CardModel(card));
				}
			});
		}
		else if (logError)
		{
			console.error((output as ValidationError).err);
		}
	}
}
