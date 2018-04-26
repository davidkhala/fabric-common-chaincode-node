package golang

import (
	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/hyperledger/fabric/protos/ledger/queryresult"
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
