const shim = require('fabric-shim');
exports.shim = shim;
exports.ClientIdentity = shim.ClientIdentity;
exports.ChaincodeStub = shim.ChaincodeStub;
exports.KeyEndorsementPolicy = shim.KeyEndorsementPolicy;

const ENDORSER_ROLES = {
	MEMBER: 'MEMBER',
	PEER: 'PEER'
};
exports.ENDORSER_ROLES = ENDORSER_ROLES;
exports.CommonChaincode = require('./base');
const format = require('./format');
exports.format = format;