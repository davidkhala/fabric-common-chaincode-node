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
		/**
		 * @type {ChaincodeStub}
		 */
		this.stub = undefined;
	}

	static Success(data = '') {
		switch (typeof data) {
			case 'number':
				data = `${data}`;
				break;
			case 'object':
				data = JSON.stringify(data);
				break;
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
	 * @returns {Promise<string|*>}
	 */
	async init() {
		throw new Error('init() should be implement');
	}

	async Init(stub) {
		try {
			const {params, fcn} = stub.getFunctionAndParameters();
			this.logger.info('Init', fcn);
			this.logger.debug(fcn, params);
			this.stub = new ChaincodeStub(stub);
			const result = await this.init();
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
			let result;
			if (typeof this[fcn] === 'function' && fcnNameFilter(fcn)) {
				result = await this[fcn](...params);
			} else {
				throw Error('unknownTransaction');
			}
			return CommonChaincode.Success(result);
		} catch (err) {
			this.logger.error(err.stack);
			return CommonChaincode.Error(err);
		}
	}

}

module.exports = CommonChaincode;
