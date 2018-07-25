exports.shim = require('fabric-shim');
exports.ClientIdentity = require('fabric-shim/lib/chaincode').ClientIdentity;

exports.Base = class {
	constructor(name) {
		this.name = name;
		this.logger = exports.shim.newLogger(name ? name : '');
		this.logger.level = 'debug';// to CRITICAL, ERROR, WARNING, DEBUG
	}

	static Success(data) {
		return exports.shim.success(Buffer.from(data));
	}

	/**
	 *
	 * @param {ChaincodeStub} stub
	 * @param {ClientIdentity} clientIdentity
	 * @returns {Promise<string>}
	 */
	async init(stub, clientIdentity) {
		throw new Error('init() should be implement');
	}
	/**
	 *
	 * @param {ChaincodeStub} stub
	 * @param {ClientIdentity} clientIdentity
	 * @returns {Promise<string>}
	 */
	async invoke(stub, clientIdentity) {
		throw new Error('invoke() should be implement');
	}

	async Init(stub) {
		try {
			this.logger.debug(`########### ${this.name} Init: ${stub.getFunctionAndParameters()}`);
			const clientIdentity = new exports.ClientIdentity(stub);
			const result = await this.init(stub, clientIdentity);
			return this.constructor.Success(result);
		} catch (err) {
			this.logger.error(err);
			return exports.shim.error(err.toString());
		}

	}

	async Invoke(stub) {
		try {
			this.logger.info(`########### ${this.name} Invoke: ${stub.getFunctionAndParameters()}`);
			const clientIdentity = new exports.ClientIdentity(stub);
			const result = await this.invoke(stub, clientIdentity);
			return this.constructor.Success(result);
		}catch (err) {
			this.logger.error(err);
			return exports.shim.error(err.toString());
		}
	}

};

