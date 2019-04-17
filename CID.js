const shim = require('fabric-shim');

class CID extends shim.ClientIdentity {
	constructor(stub) {
		super(stub);
	}

	toString() {
		return JSON.stringify({
			mspId: this.mspId,
			cert: this.cert,
			attrs: this.attrs,
			id: this.id
		});
	}
}

module.exports = CID;
