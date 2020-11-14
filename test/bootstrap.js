const CommonChaincode = require('../base');
const instance = new CommonChaincode('test');
describe('mock', () => {
	it('start', () => {
		CommonChaincode.Start(instance, {address: 'peer0', chaincodeIdName: 'test'});
	});
});
