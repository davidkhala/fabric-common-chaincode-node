const {getNanos, getMillis} = require('./protobuf.Timestamp');
const MIN_UNICODE_RUNE_VALUE = '\u0000';
const COMPOSITEKEY_NS = '\x00';
/**
 *
 * @param {StateQueryResponse<Iterators.StateQueryIterator>} stateQueryResponse
 * @return {Iterators.StateQueryIterator}
 */
const stateQueryResponseFlatten = (stateQueryResponse) => {
	const {metadata: {fetchedRecordsCount, bookmark: nextBookmark}, iterator} = stateQueryResponse;
	Object.assign(iterator, {fetchedRecordsCount, bookmark: nextBookmark});
	return iterator;
};

class ChaincodeStub {
	/**
	 * @param {shim.ChaincodeStub} stub
	 */
	constructor(stub) {
		this.stub = stub;
		this.transient = {};
		const transient = stub.getTransient();
		transient.forEach((value, key) => {
			this.transient[key] = value.toString('utf8');
		});
	}

	/**
	 * @param {string} name Name of the event
	 * @param {string} payload A payload can be used to include data about the event
	 */
	setEvent(name, payload) {
		this.stub.setEvent(name, Buffer.from(payload));
	}

	/**
	 * @param {string} key State variable key to retrieve from the state store
	 * @param {string} [collection] The collection name for Private Data Collection.
	 *        if unset, get state from public ledger
	 * @returns {Promise<string>} current value
	 */
	async getState(key, collection) {
		let state;
		if (collection) {
			state = await this.stub.getPrivateData(collection, key);
		} else {
			state = await this.stub.getState(key);
		}

		return state.toString();
	}

	/**
	 * @param {string} key
	 * @param {string} value
	 * @param {string} [collection] The collection name for Private Data Collection
	 */
	async putState(key, value, collection) {
		if (collection) {
			await this.stub.putPrivateData(collection, key, value);
		} else {
			await this.stub.putState(key, value);
		}
	}

	async deleteState(key, collection) {
		if (collection) {
			await this.stub.deleteState(key);
		} else {
			await this.stub.deletePrivateData(collection, key);
		}
	}


	/**
	 * @override
	 * Returns an object containing the chaincode function name to invoke, and the array of arguments to pass to the target function
	 * @return {{params:string,fcn:string}}
	 */
	getFunctionAndParameters() {
		return this.stub.getFunctionAndParameters();
	}

	/**
	 * the transient key-value that can be used by the chaincode but not saved in the ledger
	 * such as cryptographic information for encryption and decryption
	 * @param {string} key
	 * @return {string|void}
	 */
	getTransient(key) {
		return this.transient[key];
	}

	/**
	 * @override
	 * @return {string}
	 */
	getTxID() {
		return this.stub.getTxID();
	}

	/**
	 * @override
	 * @param {string} chaincodeName
	 * @param {string[]} args
	 * @param {string} [channel] If `channel` is falsy, the caller's channel is assumed.
	 * @return {Promise<{status:number,message:string,payload:string}>}
	 */
	async invokeChaincode(chaincodeName, args, channel) {
		const {status, message, payload} = await this.stub.invokeChaincode(chaincodeName, args, channel);
		const payloadString = payload.toString('utf8');
		if (status >= 400) {
			throw Error(JSON.stringify({status, message, payload: payloadString}));
		}

		return {status, message, payload: payloadString};
	}

	/**
	 * @param {boolean} asMilliSecond
	 * @return {Timestamp.Nanosecond|Timestamp.Millisecond}
	 */
	getTxTimestamp(asMilliSecond) {
		const s = this.stub.getTxTimestamp();
		return asMilliSecond ? getMillis(s) : getNanos(s);
	}

	/**
	 *
	 * @param {KeyParam} [keyParam]
	 * @param {string} [collection]
	 * @param {number} [pageSize]
	 * @param {string} [bookmark]
	 * @return {Promise<Iterators.StateQueryIterator>}
	 */
	async getStateByRange(keyParam = {}, collection, pageSize, bookmark) {
		const {startKey, endKey, objectType, attributes} = keyParam;
		if (objectType) {
			if (collection) {
				return await this.getPrivateDataByPartialCompositeKey(collection, objectType, attributes);
			} else {
				if (pageSize) {
					return await this.stub.getStateByPartialCompositeKeyWithPagination(objectType, attributes, pageSize, bookmark);
				} else {
					return await this.stub.getStateByPartialCompositeKey(objectType, attributes);
				}
			}

		} else {
			if (collection) {
				return await this.stub.getPrivateDataByRange(collection, startKey, endKey);
			} else {
				if (pageSize) {
					const result = await this.stub.getStateByRangeWithPagination(startKey, endKey, pageSize, bookmark);
					return stateQueryResponseFlatten(result);
				} else {
					return await this.stub.getStateByRange(startKey, endKey);
				}
			}
		}

	}

	/**
	 *
	 * @param {string} query
	 * @param {string} [collection]
	 * @param {number} [pageSize]
	 * @param {string} [bookmark]
	 * @return {Promise<Iterators.StateQueryIterator>}
	 */
	async getQueryResult(query, collection, pageSize, bookmark) {
		if (collection) {
			return await this.stub.getPrivateDataQueryResult(collection, query);
		} else {
			if (pageSize) {
				return await this.stub.getQueryResult(query);
			} else {
				const result = await this.stub.getQueryResultWithPagination(query, pageSize, bookmark);
				return stateQueryResponseFlatten(result);
			}
		}

	}

	/**
	 * @override
	 * @param {string} key
	 * @return {Promise<Iterators.HistoryQueryIterator>}
	 */
	async getHistoryForKey(key) {
		return await this.stub.getHistoryForKey(key);
	}

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
	static createCompositeKey(objectType, attributes) {


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
	}


	/**
	 * Splits the specified key into attributes on which the composite key was formed.
	 * Composite keys found during range queries or partial composite key queries can
	 * therefore be split into their original composite parts, essentially recovering
	 * the values of the attributes.
	 * @param {string} compositeKey The composite key to split
	 * @return {SplitCompositekey}
	 */
	static splitCompositeKey(compositeKey) {
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
	}

	// setPrivateDataValidationParameter(collection: string, key: string, ep: Buffer): Promise<void>;
	// getPrivateDataValidationParameter(collection: string, key: string): Promise<Buffer>;

}

module.exports = ChaincodeStub;
