import { CardModel } from './cardModel';

export class Deck
{
	readonly valid: boolean = false;
	deck: CardModel[] = [];
	sideboard: CardModel[] = [];
	companion?: CardModel = null;
	commander?: CardModel = null;
}
