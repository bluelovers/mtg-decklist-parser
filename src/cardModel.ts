const _amountRegex = /^\d+/;
const _collectorRegex = /\d+$/;
const _setRegex = /(\(|\[)(.+)(\)|\])/;

export interface ICard
{
	amount: number,
	name: string,
	set?: string,
	collectors?: number,
	mtgoID?: string,
}

export class CardModel implements ICard
{
	name: string;
	amount: number;
	set?: string;
	collectors?: number;
	mtgoID?: string;

	constructor(rawInput)
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

	parseString(rawInput: string): ICard
	{
		rawInput.trim();

		const name = rawInput.replace(_amountRegex, '').replace(_setRegex, '').replace(_collectorRegex, '').trim();
		const amount = rawInput.match(_amountRegex);
		const set = rawInput.match(_setRegex);
		const collectors = rawInput.match(_collectorRegex);

		return {
			name,
			amount: amount ? parseInt(amount[0]) : undefined,
			// set code will be in second matched group
			set: set ? set[2] : undefined,
			collectors: collectors ? parseInt(collectors[0]) : undefined,
		}
	}

	parseObject(rawInput: {
		Quantity: string,
		Name: string,
		CatID: string,
	}): ICard
	{
		return {
			name: rawInput.Name,
			amount: parseInt(rawInput.Quantity),
			mtgoID: rawInput.CatID,
		};
	}
}
