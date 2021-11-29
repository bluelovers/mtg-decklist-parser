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
		// @ts-ignore
		let collectors = rawInputObject.collectors;

		if (typeof collectors === 'string')
		{
			collectors = parseInt(collectors)
		}

		// @ts-ignore
		let amount: number = parseInt(rawInputObject.Quantity ?? rawInputObject.amount) | 0;

		if (!amount || !Number.isInteger(amount) || amount < 0)
		{
			amount = void 0;
		}

		return {
			// @ts-ignore
			name: rawInputObject.Name ?? rawInputObject.name,
			// @ts-ignore
			amount,
			// @ts-ignore
			mtgoID: rawInputObject.CatID ?? rawInputObject.mtgoID,
			// @ts-ignore
			set: rawInputObject.set,
			// @ts-ignore
			collectors,
		};
	}

	toCardString()
	{
		return toCardString(this)
	}

}
