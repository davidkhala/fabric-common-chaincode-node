const {getNanos, getMillis} = require('./protobuf.Timestamp');

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
	 * 		if unset, get state from public ledger
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
	 * @param {string} [startKey]
	 * @param {string} [endKey]
	 * @param {string} [collection]
	 * @return {Promise<Iterators.StateQueryIterator>}
	 */
	async getStateByRange(startKey = '', endKey = '', collection) {
		if (collection) {
			return await this.stub.getPrivateDataByRange(collection, startKey, endKey);
		} else {
			return await this.stub.getStateByRange(startKey, endKey);
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

	// getStateByRangeWithPagination(startKey: string, endKey: string, pageSize: number, bookmark?: string): Promise<StateQueryResponse<Iterators.StateQueryIterator>>;
	// getStateByPartialCompositeKey(objectType: string, attributes: string[]): Promise<Iterators.StateQueryIterator>;
	// getStateByPartialCompositeKeyWithPagination(objectType: string, attributes: string[], pageSize: number, bookmark?: string): Promise<StateQueryResponse<Iterators.StateQueryIterator>>;
	//
	// getQueryResult(query: string): Promise<Iterators.StateQueryIterator>;
	// getQueryResultWithPagination(query: string, pageSize: number, bookmark?: string): Promise<StateQueryResponse<Iterators.StateQueryIterator>>;


	// setEvent(name: string, payload: Buffer): void;
	//
	// createCompositeKey(objectType: string, attributes: string[]): string;
	// splitCompositeKey(compositeKey: string): SplitCompositekey;
	//

	// deletePrivateData(collection: string, key: string): Promise<void>;
	// setPrivateDataValidationParameter(collection: string, key: string, ep: Buffer): Promise<void>;
	// getPrivateDataValidationParameter(collection: string, key: string): Promise<Buffer>;
	// getPrivateDataByRange(collection: string, startKey: string, endKey: string): Promise<Iterators.StateQueryIterator>;
	// getPrivateDataByPartialCompositeKey(collection: string, objectType: string, attributes: string[]): Promise<Iterators.StateQueryIterator>;
	// getPrivateDataQueryResult(collection: string, query: string): Promise<Iterators.StateQueryIterator>;
}

module.exports = ChaincodeStub;
