/**
 * @class
 * @typedef {Context} ContextAlias
 * @property {ChaincodeStub} stub
 * @property {ClientIdentity} clientIdentity
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
 * @return {Logger}
 */

