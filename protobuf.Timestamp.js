const Microsecond = 1000;
const Millisecond = 1000 * Microsecond;
const Second = 1000 * Millisecond;

/**
 * google.protobuf.Timestamp
 * @typedef Timestamp.AsObject
 * @type {Object}
 * @property {number} seconds
 * @property {number} nanos
 */

/**
 * Number of nanoseconds since epoch.
 * @typedef Timestamp.Nanosecond
 * @type {number}
 */

/**
 *
 * @param {Timestamp.AsObject} timestamp
 * @return {Timestamp.Nanosecond}
 */
exports.getNanos = (timestamp) => {
	return timestamp.seconds * Second + timestamp.nanos;
};
/**
 * @param {Timestamp.AsObject} timestamp
 * @return {Timestamp}
 */
exports.getMillis = (timestamp) => {
	return timestamp.seconds * 1000 + (timestamp.nanos / 1000000);
};