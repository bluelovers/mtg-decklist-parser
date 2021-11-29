import { parseString, toCardString } from './util';
import { ICard, ICardXmlObject } from './types';

export class CardModel implements ICard
{
	name: string;
	amount: number;
	set?: string;
	collectors?: number;
	mtgoID?: string;

	constructor(rawInput: string | ICardXmlObject | ICard)
	{
		const { amount, name, set, collectors, mtgoID } = typeof rawInput === 'string' ?
			this.parseString(rawInput) :
			this.parseObject(rawInput);

		this.name = name;
		this.amount = amount;
		this.set = set;
		this.collectors = collectors;
		this.mtgoID = mtgoID;
	}

	protected parseString(rawInput: string): ICard
	{
		return parseString(rawInput)
	}

	protected parseObject<T extends ICardXmlObject | ICard>(rawInputObject: T): ICard
	{
		return {
			// @ts-ignore
			name: rawInputObject.Name ?? rawInputObject.name,
			// @ts-ignore
			amount: parseInt(rawInputObject.Quantity ?? rawInputObject.amount),
			// @ts-ignore
			mtgoID: rawInputObject.CatID ?? rawInputObject.mtgoID,
			// @ts-ignore
			set: rawInputObject.set,
			// @ts-ignore
			collectors: rawInputObject.collectors,
		};
	}

	toCardString()
	{
		return toCardString(this)
	}

}
