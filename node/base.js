
const shim = require('fabric-shim');

class Base {
    constructor(name) {
        this.name = name;
        this.logger = shim.newLogger(name ? name : base);
        this.logger.level = 'info';// to CRITICAL, ERROR, WARNING, DEBUG
    }
    async Init(stub) {
        logger.info(`########### ${this.name} Init: ${stub.getFunctionAndParameters()}`);
        return shim.success();
    }

    async Invoke(stub) {
        logger.info(`########### ${this.name} Invoke: ${stub.getFunctionAndParameters()}`);
        return shim.success();
    }
   
};
module.exports = Base
