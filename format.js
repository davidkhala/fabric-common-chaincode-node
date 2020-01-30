//TODO
//func ParseHistory(iterator shim.HistoryQueryIteratorInterface, filter func(KeyModification) bool) []KeyModification {
// 	defer PanicError(iterator.Close())
// 	var result []KeyModification
// 	for iterator.HasNext() {
// 		keyModification, err := iterator.Next()
// 		PanicError(err)
// 		var timeStamp = keyModification.Timestamp
// 		var t = timeStamp.Seconds*1000 + int64(timeStamp.Nanos/1000000)
// 		var translated = KeyModification{
// 			keyModification.TxId,
// 			keyModification.Value,
// 			TimeLong(t),
// 			keyModification.IsDelete}
// 		if filter == nil || filter(translated) {
// 			result = append(result, translated)
// 		}
// 	}
// 	return result
// }


/**
 * @param {Iterators.StateQueryIterator} iterator
 * @param {function} [filter]
 * @return {Promise<KeyValue[]>}
 */
const parseStates = async (iterator, filter) => {

	const result = [];
	const loop = async () => {
		const {value: {namespace, key, value}, done} = await iterator.next();
		/**
		 * @type {KeyValue}
		 */
		const kv = {namespace, key, value: value.toString('utf8')};
		if (!filter || filter(kv)) {
			result.push(kv);
		}
		if (!done) {
			await loop();
		}
	};
	await loop();
	return result;
};

/**
 * @param {Iterators.HistoryQueryIterator} iterator
 * @param {function} [filter]
 * @return {Promise<KeyModification[]>}
 */
const parseHistory = async (iterator, filter) => {

};
exports.ParseStates = parseStates;
exports.ParseHistory = parseHistory;