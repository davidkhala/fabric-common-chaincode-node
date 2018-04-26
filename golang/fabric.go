package golang

import (
	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/hyperledger/fabric/protos/ledger/queryresult"
	"encoding/json"
)

func WorldStates(stub shim.ChaincodeStubInterface) ([]queryresult.KV, error) {
	keysIterator, err := stub.GetStateByRange("", "")
	if err != nil {
		return nil, err
	}
	defer keysIterator.Close()

	var kvs []queryresult.KV
	for keysIterator.HasNext() {
		kv, iterErr := keysIterator.Next()
		if iterErr != nil {
			return nil, iterErr
		}
		kvs = append(kvs, *kv)
	}
	return kvs, nil
}
func KV2Json(kv queryresult.KV) (string) {
	type KVJson struct {
		Namespace string
		Key       string
		Value     string
	}
	kvJson:= KVJson{Namespace:kv.Namespace,Key:kv.Key,Value:string(kv.Value)}
	jsonString,_:=  json.Marshal(kvJson)
	return string(jsonString)
}
