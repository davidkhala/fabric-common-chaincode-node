const KeyModification = require('./keyModification');
const KeyValue = require('./keyValue');
/**
 * @param {Iterators.StateQueryIterator} iterator
 * @param {function(KeyValue):boolean} [filter]
 * @param {function(KeyValue,KeyValue[]):boolean} [paginator] return falsy to break the loop
 * @return {Promise<KeyValue[]>}
 */
const parseStates = async (iterator, filter, paginator) => {
	if (!paginator) {
		paginator = _ => true;
	}
	const result = [];
	const loop = async () => {
		const {value, done} = await iterator.next();
		const kv = new KeyValue(value);
		if (!filter || filter(kv)) {
			result.push(kv);
		}
		if (!done && paginator(kv, result)) {
			await loop();
		}
	};
	await loop();
	return result;
};

/**
 * @param {Iterators.HistoryQueryIterator} iterator
 * @param {function(KeyModification):boolean} [filter]
 * @param {function(KeyModification,KeyModification[]):boolean} [paginator]
 * @return {Promise<KeyModification[]>}
 */
const parseHistory = async (iterator, filter, paginator) => {
	const result = [];
	if (!paginator) {
		paginator = _ => true;
	}
	const loop = async () => {
		const {value, done} = await iterator.next();

		const km = new KeyModification(value);
		if (!filter || filter(km)) {
			result.push(km);
		}

		if (!done && paginator(km, result)) {
			await loop();
		}
	};
	await loop();

	return result;
};
exports.ParseStates = parseStates;
exports.ParseHistory = parseHistory;