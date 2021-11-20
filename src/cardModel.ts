import { parseString } from './util';
import { ICard, ICardXmlObject } from './types';

export class CardModel implements ICard
{
	name: string;
	amount: number;
	set?: string;
	collectors?: number;
	mtgoID?: string;

	constructor(rawInput: string | ICardXmlObject)
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

	protected parseObject(rawInputObject: ICardXmlObject): ICard
	{
		return {
			name: rawInputObject.Name,
			amount: parseInt(rawInputObject.Quantity),
			mtgoID: rawInputObject.CatID,
		};
	}

}
