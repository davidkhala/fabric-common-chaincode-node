class ChaincodeStub {
	/**
	 * @param {shim.ChaincodeStub} stub
	 */
	constructor(stub) {
		this.stub = stub;
		this.transient = stub.getTransient();
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
	 * @returns {Promise<string>} Promise for the current value of the state variable
	 */
	async getState(key) {
		const state = await this.stub.getState(key);
		return state.toString();
	}

	/**
	 * @override
	 * @param key
	 * @param value
	 * @return {Promise<void>}
	 */
	async putState(key, value) {
		await this.stub.putState(key, value);
	}

	/**
	 * @param {string} collection The collection name
	 * @param {string} key Private data variable key to retrieve from the state store
	 * @returns {string} value
	 */
	async getPrivateData(collection, key) {
		const raw = await this.stub.getPrivateData(collection, key);
		return raw.toString();
	}


	/**
	 * the transient key-value that can be used by the chaincode but not saved in the ledger
	 * such as cryptographic information for encryption and decryption
	 * @param {string} key
	 * @return {string}
	 */
	getTransient(key) {
		return this.transient[key].toString();
	}

	// getStateByRange(startKey: string, endKey: string): Promise<Iterators.StateQueryIterator>;
	// getStateByRangeWithPagination(startKey: string, endKey: string, pageSize: number, bookmark?: string): Promise<StateQueryResponse<Iterators.StateQueryIterator>>;
	// getStateByPartialCompositeKey(objectType: string, attributes: string[]): Promise<Iterators.StateQueryIterator>;
	// getStateByPartialCompositeKeyWithPagination(objectType: string, attributes: string[], pageSize: number, bookmark?: string): Promise<StateQueryResponse<Iterators.StateQueryIterator>>;
	//
	// getQueryResult(query: string): Promise<Iterators.StateQueryIterator>;
	// getQueryResultWithPagination(query: string, pageSize: number, bookmark?: string): Promise<StateQueryResponse<Iterators.StateQueryIterator>>;
	// getHistoryForKey(key: string): Promise<Iterators.HistoryQueryIterator>;
	//
	// invokeChaincode(chaincodeName: string, args: string[], channel: string): Promise<ChaincodeResponse>;
	// setEvent(name: string, payload: Buffer): void;
	//
	// createCompositeKey(objectType: string, attributes: string[]): string;
	// splitCompositeKey(compositeKey: string): SplitCompositekey;
	//
	// getPrivateData(collection: string, key: string): Promise<Buffer>;
	// putPrivateData(collection: string, key: string, value: Buffer): Promise<void>;
	// deletePrivateData(collection: string, key: string): Promise<void>;
	// setPrivateDataValidationParameter(collection: string, key: string, ep: Buffer): Promise<void>;
	// getPrivateDataValidationParameter(collection: string, key: string): Promise<Buffer>;
	// getPrivateDataByRange(collection: string, startKey: string, endKey: string): Promise<Iterators.StateQueryIterator>;
	// getPrivateDataByPartialCompositeKey(collection: string, objectType: string, attributes: string[]): Promise<Iterators.StateQueryIterator>;
	// getPrivateDataQueryResult(collection: string, query: string): Promise<Iterators.StateQueryIterator>;
}

module.exports = ChaincodeStub;