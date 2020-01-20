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
		/**
		 * @type {ClientIdentityData}
		 */
		const cidData = {
			MspID: this.mspId,
			CertificatePem: this.getCertPem(),
			Attrs: {attrs: this.attrs},
			id: this.id
		};
		return JSON.stringify(cidData);
	}
}

module.exports = CID;
