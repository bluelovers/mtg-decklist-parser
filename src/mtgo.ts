import { parse, validate, ValidationError } from 'fast-xml-parser';
import { CardModel } from './cardModel';
import { Deck } from './deck';
import { ICardXmlObject } from './types';

const _commanderAnnotation = '16777728';

export class MTGO extends Deck
{
	constructor(xml: string | Uint8Array, logError = true)
	{
		super();

		xml = xml.toString().trim();

		const output = validate(xml);

		// @ts-ignore
		this.valid = output === true;

		if (this.valid)
		{
			const parsed = parse(xml, {
				attributeNamePrefix: '',
				ignoreAttributes: false,
			}) as {
				Deck: {
					Cards: (ICardXmlObject & {
						Annotation?: typeof _commanderAnnotation,
						Sideboard?: 'true',
					})[]
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
