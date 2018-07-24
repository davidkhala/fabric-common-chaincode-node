const shim = require('fabric-shim');
exports.shim = shim;
exports.Base = class {
	constructor(name) {
		this.name = name;
		this.logger = shim.newLogger(name ? name : '');
		this.logger.level = 'debug';// to CRITICAL, ERROR, WARNING, DEBUG
	}

	static Success(data) {
		return shim.success(Buffer.from(data));
	}

	async Init(stub) {
		this.logger.info(`########### ${this.name} Init: ${stub.getFunctionAndParameters()}`);
		return shim.success();
	}

	async Invoke(stub) {
		this.logger.info(`########### ${this.name} Invoke: ${stub.getFunctionAndParameters()}`);
		return shim.success(Buffer.from(''));
	}

};

