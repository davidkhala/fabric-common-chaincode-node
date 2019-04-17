const {shim, ClientIdentity, ChaincodeStub} = require('./index');
const {getLogger} = require('fabric-shim/lib/logger');

class CommonChaincode {
	constructor(name) {
		this.name = name;
		this.logger = getLogger(name);
	}

	/**
	 * @param {string} name Name of the event
	 * @param {string} payload A payload can be used to include data about the event
	 */
	setEvent(name, payload) {
		this.stub.setEvent(name, Buffer.from(payload));
	}

	/**
	 * @async
	 * @param {string} key State variable key to retrieve from the state store
	 * @returns {Promise<string>} Promise for the current value of the state variable
	 */
	async getState(key) {
		const state = await this.stub.getState(key);
		return state.toString();
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

	static Success(data = '') {
		return shim.success(Buffer.from(data));
	}

	/**
	 *
	 * @param {ChaincodeStub} stub
	 * @returns {Promise<string>}
	 */
	async init(stub) {
		throw new Error('init() should be implement');
	}

	/**
	 *
	 * @param {ChaincodeStub} stub
	 * @returns {Promise<string>}
	 */
	async invoke(stub) {
		throw new Error('invoke() should be implement');
	}

	async Init(stub) {
		try {
			const {params, fcn} = stub.getFunctionAndParameters();
			this.logger.info('Init', fcn);
			this.logger.debug(fcn, params);
			this.stub = stub;
			const result = await this.init(stub);
			return CommonChaincode.Success(result);
		} catch (err) {
			this.logger.error(err);
			return shim.error(err.toString());
		}
	}

	async Invoke(stub) {
		try {
			const {params, fcn} = stub.getFunctionAndParameters();
			this.logger.info('Invoke', fcn);
			this.logger.debug(fcn, params);
			this.stub = stub;
			const result = await this.invoke(stub);
			return CommonChaincode.Success(result);
		} catch (err) {
			this.logger.error(err);
			return shim.error(err.toString());
		}
	}

}

module.exports = CommonChaincode;
