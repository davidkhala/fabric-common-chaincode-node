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
/**
 * Creates a composite key by combining the objectType string and the given `attributes` to form a composite
 * key. The objectType and attributes are expected to have only valid utf8 strings and should not contain
 * U+0000 (nil byte) and U+10FFFF (biggest and unallocated code point).
 *
 * @param {string} objectType A string used as the prefix of the resulting key
 * @param {string[]} attributes List of attribute values to concatenate into the key
 * @return {string} A composite key with the <code>objectType</code> and the array of <code>attributes</code>
 * joined together with special delimiters that will not be confused with values of the attributes
 */
const createCompositeKey = (objectType, attributes) => {


	const validateCompositeKeyAttribute = (attr) => {
		if (!attr || typeof attr !== 'string' || attr.length === 0) {
			throw new Error('object type or attribute not a non-zero length string');
		}
	};
	validateCompositeKeyAttribute(objectType);
	if (!Array.isArray(attributes)) {
		throw new Error('attributes must be an array');
	}

	let compositeKey = COMPOSITEKEY_NS + objectType + MIN_UNICODE_RUNE_VALUE;
	attributes.forEach((attribute) => {
		validateCompositeKeyAttribute(attribute);
		compositeKey = compositeKey + attribute + MIN_UNICODE_RUNE_VALUE;
	});
	return compositeKey;
};

/**
 * Splits the specified key into attributes on which the composite key was formed.
 * Composite keys found during range queries or partial composite key queries can
 * therefore be split into their original composite parts, essentially recovering
 * the values of the attributes.
 * @param {string} compositeKey The composite key to split
 * @return {SplitCompositekey}
 */
const splitCompositeKey = (compositeKey) => {
	const result = {objectType: null, attributes: []};
	if (compositeKey && compositeKey.length > 1 && compositeKey.charAt(0) === COMPOSITEKEY_NS) {
		const splitKey = compositeKey.substring(1).split(MIN_UNICODE_RUNE_VALUE);
		result.objectType = splitKey[0];
		splitKey.pop();
		if (splitKey.length > 1) {
			splitKey.shift();
			result.attributes = splitKey;
		}
	}
	return result;
};
module.exports = {
	ParseStates,
	ParseHistory,
	createCompositeKey,
	splitCompositeKey,
};
