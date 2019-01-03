const shim = require('fabric-shim');
exports.shim = shim;
exports.ClientIdentity = shim.ClientIdentity;
exports.ChaincodeStub = shim.ChaincodeStub;
exports.CommonChaincode = require('./base');