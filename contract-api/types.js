const shim = require('fabric-shim');
/**
 * @class
 * @typedef {Context} ContextAlias
 * @property {shim.ChaincodeStub} stub
 * @property {shim.ClientIdentity} clientIdentity
 * @property {{setLevel:SetLevel, getLogger:GetLogger}} logging
 *
 */

/**
 * @typedef {function} SetLevel
 * @param {string} level
 */
/**
 * @typedef {function} GetLogger
 * @param {string} [name]
 * @return {winston.Logger}
 */

