const {getNanos} = require('./protobuf.Timestamp');

/**
 * @class
 * @property {boolean} is_delete
 * @property {string} value
 * @property {Timestamp.Nanosecond} timestamp
 * @property {string} tx_id
 */
class KeyModification {
	/**
	 * @param {Iterators.KeyModification} raw
	 */
	constructor(raw) {
		const {is_delete, value, timestamp, tx_id} = raw;
		this.is_delete = is_delete;
		this.tx_id = tx_id;
		this.value = value.toString('utf8');
		this.timestamp = getNanos(timestamp);
	}
}

module.exports = KeyModification;