class ChaincodeStub {
	/**
	 * @param {shim.ChaincodeStub} stub
	 */
	constructor(stub) {
		this.stub = stub;
		this.transient = {};
		for (const [key, value] of Object.entries(stub.getTransient().map)) {
			this.transient[key] = value.value.buffer.toString().split('\u0012\u0001')[1];
			//TODO "\n�\u0006\nr\b\u0003\u0010\u0001\u001a\f\b�̎�\u0005\u0010����\u0001\"\nallchannel*@33b52566abb75271cc2d69a46e351835d09c74d1065bae3267a4b6e5d830e548:\u0010\u0012\u000e\u0012\fnodeDiagnose\u0012�\u0005\n�\u0005\n\bASTRIMSP\u0012�\u0005-----BEGIN CERTIFICATE-----\nMIIB5DCCAYqgAwIBAgIUPHlucPVhDBmiqh3/2kMZIUid3dEwCgYIKoZIzj0EAwIw\nYTELMAkGA1UEBhMCVVMxFzAVBgNVBAgTDk5vcnRoIENhcm9saW5hMRQwEgYDVQQK\nEwtIeXBlcmxlZGdlcjEPMA0GA1UECxMGRmFicmljMRIwEAYDVQQDEwlhc3RyaS5v\ncmcwHhcNMjAwMTE5MDAzODAwWhcNMjEwMTE4MDA0MzAwWjAhMQ8wDQYDVQQLEwZj\nbGllbnQxDjAMBgNVBAMTBUFkbWluMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE\nDto1cSQlquPkacSUhFyxX02SXp+RNylnXQl1OX+aIbrr6xXxHk/3n7OAHMsy1yp0\nYY9zIBbzKKKJ4y94aKtnu6NgMF4wDgYDVR0PAQH/BAQDAgeAMAwGA1UdEwEB/wQC\nMAAwHQYDVR0OBBYEFP/yAN0NthnUplt0ceB9hVOxeIJGMB8GA1UdIwQYMBaAFENE\nnvGYa2N5uRFUJigi7NCZocKMMAoGCCqGSM49BAMCA0gAMEUCIQDBMr821jPgOAMG\nJ1EMrDIc5OOOKRFvSQ5mdXvdRaejgAIgMrFM6gsXr5/wUKL5Nyx06cDMTplvbD82\nyN1s+vfy0nw=\n-----END CERTIFICATE-----\n\u0012\u0018H\u0007�7\"������%�x�Ԅ�1pt��\u0012#\n\u0019\n\u0017\b\u0001\u0012\u000e\u0012\fnodeDiagnose\u001a\u0003\n\u0001-\u0012\u0006\n\u0001a\u0012\u0001b"
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
	 * @return {Promise<{params:string,fcn:string}>}
	 */
	async getFunctionAndParameters() {
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