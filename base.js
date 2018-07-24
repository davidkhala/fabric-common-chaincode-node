const shim = require('fabric-shim');

class Base {
	constructor(name) {
		this.name = name;
		this.logger = shim.newLogger(name ? name : '');
		this.logger.level = 'info';// to CRITICAL, ERROR, WARNING, DEBUG
	}

	static Success(data) {
		return shim.success(Buffer.from(''));
	}

	static Error(msg) {
		return shim.error(Buffer.from(msg));
	}

	async Init(stub) {
		logger.info(`########### ${this.name} Init: ${stub.getFunctionAndParameters()}`);
		return shim.success();
	}

	async Invoke(stub) {
		logger.info(`########### ${this.name} Invoke: ${stub.getFunctionAndParameters()}`);
		return shim.success(Buffer.from(''));
	}

};
module.exports = Base;
