const Nanosecond = 1;
const Microsecond = 1000 * Nanosecond;
const Millisecond = 1000 * Microsecond;
const Second = 1000 * Millisecond;
const Minute = 60 * Second;
const Hour = 60 * Minute;
/**
 * google.protobuf.Timestamp
 * @typedef Timestamp.AsObject
 * @type {Object}
 * @property {number} seconds
 * @property {number} nanos
 */

/**
 * The nanoseconds elapsed since unix epoch
 * @typedef Timestamp.Nanosecond
 * @type {number}
 */
/**
 * The microseconds elapsed since unix epoch
 * @typedef Timestamp.Microsecond
 * @type {number}
 */

/**
 * The milliseconds elapsed since unix epoch.
 * @typedef Timestamp.Millisecond
 * @type {number}
 */

/**
 *
 * @param {Timestamp.AsObject} timestamp
 * @return {Timestamp.Nanosecond}
 */
const getNanos = (timestamp) => {
	return timestamp.seconds * Second + timestamp.nanos;
};
/**
 *
 * @param {Timestamp.AsObject} timestamp
 * @return {Timestamp.Microsecond}
 */
const getMicros = (timestamp) => {
	return timestamp.seconds * 1000000 + (timestamp.nanos / Microsecond);
};
/**
 * @param {Timestamp.AsObject} timestamp
 * @return {Timestamp}
 */
const getMillis = (timestamp) => {
	return timestamp.seconds * 1000 + (timestamp.nanos / Millisecond);
};
module.exports = {
	getNanos,
	getMicros,
	getMillis,
	Nanosecond,
	Microsecond,
	Millisecond,
	Second,
	Minute,
	Hour,
};
