const shim = require('fabric-shim');
const {getLogger} = require('fabric-shim/lib/logger');
const ChaincodeStub = require('./ChaincodeStub');

const fcnNameFilter = (fcn) => {
	const lowerFcn = fcn.toLowerCase();
	return lowerFcn[0] !== '_' &&
		lowerFcn !== 'init' &&
		lowerFcn !== 'invoke';
};

class CommonChaincode {
	constructor(name) {
		this.name = name;
		this.logger = getLogger(name);
	}

	static Success(data = '') {
		if (typeof data === 'object') {
			data = JSON.stringify(data);
		}
		return shim.success(Buffer.from(data));
	}

	static Error(err, payload = Buffer.from(err.message)) {
		const shimError = shim.error(err.message);
		shimError.payload = payload;
		return shimError;
	}

	/**
	 * @param {CommonChaincode} chaincodeInstance
	 */
	static Start(chaincodeInstance) {
		shim.start(chaincodeInstance);
	}

	/**
	 *
	 * @param {ChaincodeStub} stub
	 * @returns {Promise<string|*>}
	 */
	async init(stub) {
		throw new Error('init() should be implement');
	}

	/**
	 *
	 * @param {ChaincodeStub} stub
	 * @returns {Promise<string|*>}
	 */
	async invoke(stub) {
		const {fcn, params} = stub.getFunctionAndParameters();
		if (typeof this[fcn] === 'function' && fcnNameFilter(fcn)) {
			return await this[fcn](stub, ...params);
		} else {
			throw Error('unknownTransaction');
		}
	}

	async Init(stub) {
		try {
			const {params, fcn} = stub.getFunctionAndParameters();
			this.logger.info('Init', fcn);
			this.logger.debug(fcn, params);
			this.stub = new ChaincodeStub(stub);
			const result = await this.init(this.stub);
			return CommonChaincode.Success(result);
		} catch (err) {
			this.logger.error(err.stack);
			return CommonChaincode.Error(err);
		}
	}

	async Invoke(stub) {
		try {
			const {params, fcn} = stub.getFunctionAndParameters();
			this.logger.info('Invoke', fcn);
			this.logger.debug(fcn, params);
			this.stub = new ChaincodeStub(stub);
			const result = await this.invoke(this.stub);
			return CommonChaincode.Success(result);
		} catch (err) {
			this.logger.error(err.stack);
			return CommonChaincode.Error(err);
		}
	}

}

module.exports = CommonChaincode;
