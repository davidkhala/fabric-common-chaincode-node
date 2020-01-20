const Microsecond = 1000;
const Millisecond = 1000 * Microsecond;
const Second = 1000 * Millisecond;

class ChaincodeStub {
	/**
	 * @param {shim.ChaincodeStub} stub
	 */
	constructor(stub) {
		this.stub = stub;
		this.transient = {};
		const transient = stub.getTransient();
		for (const key of Object.keys(transient.map)) {
			this.transient[key] = transient.get(key).toString('utf8');
		}
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
	 * @override
	 * Returns an object containing the chaincode function name to invoke, and the array of arguments to pass to the target function
	 * @return {{params:string,fcn:string}}
	 */
	getFunctionAndParameters() {
		return this.stub.getFunctionAndParameters();
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
	 * @async
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
	 *
	 * @return {number} Unix elapsed nanoseconds
	 */
	getTxTimestamp() {
		const s = this.stub.getTxTimestamp();
		return s.getSeconds() * Second + s.getNanos();
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

	// setEvent(name: string, payload: Buffer): void;
	//
	// createCompositeKey(objectType: string, attributes: string[]): string;
	// splitCompositeKey(compositeKey: string): SplitCompositekey;
	//


	/**
	 * @override
	 * @param collection
	 * @param key
	 * @param value
	 * @return {Promise<void>}
	 */
	async putPrivateData(collection, key, value) {
		await this.stub.putPrivateData(collection, key, value);
	}


	// deletePrivateData(collection: string, key: string): Promise<void>;
	// setPrivateDataValidationParameter(collection: string, key: string, ep: Buffer): Promise<void>;
	// getPrivateDataValidationParameter(collection: string, key: string): Promise<Buffer>;
	// getPrivateDataByRange(collection: string, startKey: string, endKey: string): Promise<Iterators.StateQueryIterator>;
	// getPrivateDataByPartialCompositeKey(collection: string, objectType: string, attributes: string[]): Promise<Iterators.StateQueryIterator>;
	// getPrivateDataQueryResult(collection: string, query: string): Promise<Iterators.StateQueryIterator>;
}

module.exports = ChaincodeStub;