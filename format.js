const {getNanos} = require('./protobuf.Timestamp');

/**
 * @param {Iterators.StateQueryIterator} iterator
 * @param {function} [filter]
 * @return {Promise<KeyValue[]>}
 */
const parseStates = async (iterator, filter) => {

	const result = [];
	const loop = async () => {
		const {value: {namespace, key, value}, done} = await iterator.next();
		/**
		 * @type {KeyValue}
		 */
		const kv = {namespace, key, value: value.toString('utf8')};
		if (!filter || filter(kv)) {
			result.push(kv);
		}
		if (!done) {
			await loop();
		}
	};
	await loop();
	return result;
};

/**
 * @param {Iterators.HistoryQueryIterator} iterator
 * @param {function} [filter]
 * @return {Promise<KeyModification[]>}
 */
const parseHistory = async (iterator, filter) => {
	const result = [];
	const loop = async () => {
		const {value: {is_delete, value, timestamp, tx_id}, done} = await iterator.next();
		/**
		 * @type {KeyModification}
		 */
		const km = {is_delete, tx_id, value: value.toString('utf8'), timestamp: getNanos(timestamp)};
		if (!filter || filter(km)) {
			result.push(km);
		}

		if (!done) {
			await loop();
		}
	};
	await loop();

	return result;
};
exports.ParseStates = parseStates;
exports.ParseHistory = parseHistory;