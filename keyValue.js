/**
 * @class
 * @property {string} namespace
 * @property {string} key
 * @property {string} value
 */
class KeyValue {
	/**
	 *
	 * @param {Iterators.KV} raw
	 */
	constructor(raw) {
		const {namespace, key, value} = raw;
		this.namespace = namespace;
		this.key = key;
		this.value = value.toString('utf8');
	}
}

module.exports = KeyValue;