/**
 * @typedef KeyValue
 * @type {Object}
 * @property {string} namespace
 * @property {string} key
 * @property {string} value
 */

/**
 * @typedef KeyModification
 * @type {Object}
 * @property {boolean} is_delete
 * @property {string} value
 * @property {Timestamp.Nanosecond} timestamp
 * @property {string} tx_id
 */

/**
 * @typedef ClientIdentityData
 * @type {Object}
 * @property {MspId} MspID
 * @property {string} CertificatePem
 * @property {Attributes} Attrs
 * @property {string} [id]
 */


/**
 * @typedef Attributes
 * @type {Object}
 * @property {Map<string,string>} attrs
 */

