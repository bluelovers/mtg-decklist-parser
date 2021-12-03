import { ICard, ICardWithoutAmount, IDeck } from './types';

//const _amountRegex = /^\d+/;
const _collectorRegex = /\d+$/;
const _setRegex = /(\(|\[)([a-z].+)(\)|\])/i;

export function parseString(rawInput: string): ICard
{
	rawInput = rawInput.trim();

	let m_amount = rawInput.match(/^(\d+)x?\s+/);

	if (m_amount)
	{
		const amount = parseInt(m_amount[1]);

		const name = rawInput.slice(m_amount[0].length).replace(_setRegex, '').replace(_collectorRegex, '').trim();

		const set = rawInput.match(_setRegex)?.[2];
		const collectors = rawInput.match(_collectorRegex)?.[0];

		return {
			name,
			amount,
			// set code will be in second matched group
			set,
			collectors: (set && collectors) ? parseInt(collectors) : undefined,
		}
	}

	throw new SyntaxError(`Invalid format: ${rawInput}`);
}

/**
 * AMOUNT NAME (SET) COLLECTORS
 * @example 2 Trelasarra, Moon Dancer (AFR) 236
 */
export function toCardString(card: ICard)
{
	return [
		card.amount || 1,
		toCardStringWithoutAmount(card),
	].filter(s => s ?? false).join(' ')
}

export function toMtgifyCardString(card: ICard)
{
	return [
		(card.amount || 1) + 'x',
		card.name,
	].filter(s => s ?? false).join(' ')
}

/**
 * NAME (SET) COLLECTORS
 * @example Trelasarra, Moon Dancer (AFR) 236
 */
export function toCardStringWithoutAmount(card: ICardWithoutAmount)
{
	return [
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
