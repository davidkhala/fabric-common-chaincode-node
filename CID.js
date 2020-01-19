const shim = require('fabric-shim');

class CID extends shim.ClientIdentity {
	/**
	 * @param {shim.ChaincodeStub} stub
	 */
	constructor(stub) {
		super(stub);
	}

	getCertPem() {
		return this.stub.getCreator().id_bytes.toString('utf8');
	}

	toString() {
		return JSON.stringify({
			mspId: this.mspId,
			certPem: this.getCertPem(),
			attrs: this.attrs,
			id: this.id
		});
	}
}

module.exports = CID;
