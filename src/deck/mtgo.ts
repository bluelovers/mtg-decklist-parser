import { parse, validate, ValidationError } from 'fast-xml-parser';
import { CardModel } from '../cardModel';
import { AbstractDeck } from './abstractDeck';
import { EnumDecklistType, ICardXmlObject, SymDecklistType } from '../types';

const _commanderAnnotation = '16777728';

export class MTGO<CARD extends CardModel = CardModel> extends AbstractDeck<CARD>
{
	readonly [SymDecklistType] = EnumDecklistType.mtgo as const;

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
				let cm = this._newCardModel(card);

				if (card.Annotation === _commanderAnnotation)
				{
					this.commander = cm;
				}
				else if (card.Sideboard === 'true')
				{
					this.sideboard.push(cm);
				}
				else
				{
					this.deck.push(cm);
				}
			});
		}
		else if (logError)
		{
			console.error((output as ValidationError).err);
		}
	}
}
