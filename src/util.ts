import { ICard } from './types';

const _amountRegex = /^\d+/;
const _collectorRegex = /\d+$/;
const _setRegex = /(\(|\[)(.+)(\)|\])/;

export function parseString(rawInput: string): ICard
{
	rawInput = rawInput.trim();

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

