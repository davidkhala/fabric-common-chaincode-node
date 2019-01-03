const {shim, ClientIdentity} = require('./index');
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
	 * getPrivateData returns the value of the specified `key` from the specified
	 * `collection`. Note that GetPrivateData doesn't read data from the
	 * private writeset, which has not been committed to the `collection`. In
	 * other words, GetPrivateData doesn't consider data modified by PutPrivateData
	 * that has not been committed.
	 *
	 * @param {string} collection The collection name
	 * @param {string} key Private data variable key to retrieve from the state store
	 * @returns {string} value
	 */
	async getPrivateData(collection, key) {
		const raw = await this.stub.getPrivateData(collection, key);
		return raw.toString();
	}

	/**
	 * putPrivateData puts the specified `key` and `value` into the transaction's
	 * private writeSet. Note that only hash of the private writeSet goes into the
	 * transaction proposal response (which is sent to the client who issued the
	 * transaction) and the actual private writeSet gets temporarily stored in a
	 * transient store. PutPrivateData doesn't effect the `collection` until the
	 * transaction is validated and successfully committed. Simple keys must not be
	 * an empty string and must not start with null character (0x00), in order to
	 * avoid range query collisions with composite keys, which internally get
	 * prefixed with 0x00 as composite key namespace.
	 *
	 * @param {string} collection The collection name
	 * @param {string} key Private data variable key to set the value for
	 * @param {string} value Private data variable value
	 */
	async putPrivateData(collection, key, value) {
		return this.stub.putPrivateData(collection, key, Buffer.from(value));
	}

	static Success(data) {
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
			this.logger.debug(`Init: ${JSON.stringify(stub.getFunctionAndParameters())}`);
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
			this.logger.info(`Invoke: ${JSON.stringify(stub.getFunctionAndParameters())}`);
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