const CommonChaincode = require('../base');
const instance = new CommonChaincode('test');
CommonChaincode.Start(instance, {address: 'peer0', chaincodeIdName: 'test'});
