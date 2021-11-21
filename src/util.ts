import { ICard, IDeck } from './types';

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

export function toCardString(card: ICard)
{
	return [
		card.amount || 1,
		card.name,
		card.set?.length ? `(${card.set})` : undefined,
		card.collectors,
	].filter(s => s ?? false).join(' ')
}

export function toDeckListString(deck: IDeck)
{
	let output: string[] = [];

	if (deck.commander)
	{
		output.push(`Commander`);
		output.push(deck.commander.toCardString());
		output.push('');
	}

	if (deck.companion)
	{
		output.push(`Companion`);
		output.push(deck.companion.toCardString());
		output.push('');
	}

	if (deck.deck?.length)
	{
		output.push(`Deck`);
		deck.deck.forEach(card =>
		{
			output.push(card.toCardString());
		});
		output.push('');
	}

	if (deck.sideboard?.length)
	{
		output.push(`Sideboard`);
		deck.sideboard.forEach(card =>
		{
			output.push(card.toCardString());
		});
		output.push('');
	}

	return output.join('\n');
}
