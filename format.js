//TODO
//func ParseStates(iterator shim.StateQueryIteratorInterface, filter func(StateKV) bool) []StateKV {
// 	defer PanicError(iterator.Close())
// 	var kvs []StateKV
// 	for iterator.HasNext() {
// 		kv, err := iterator.Next()
// 		PanicError(err)
// 		var stateKV = StateKV{kv.Namespace, kv.Key, string(kv.Value)}
// 		if filter == nil || filter(stateKV) {
// 			kvs = append(kvs, stateKV)
// 		}
// 	}
// 	return kvs
// }

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
 * @param {Iterators.HistoryQueryIterator} iterator
 * @param {function} filter
 * @return {Promise<KV[]>}
 */
const ParseStates = async (iterator, filter) => {

};

/**
 *
 * @param {Iterators.StateQueryIterator} iterator
 * @param {function} filter
 * @return {Promise<KeyModification[]>}
 */
const ParseHistory = async (iterator, filter) => {

};
exports.ParseStates = ParseStates;
exports.ParseHistory = ParseHistory;