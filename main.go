package main

import "github.com/hyperledger/fabric/core/chaincode/shim"

var logger = shim.NewLogger("common-chaincode")

func main() {
	//stub.GetStateByPartialCompositeKey()
	//stub.GetStateByRange()
	}
func LogQueryIterator(iterator shim.StateQueryIteratorInterface) {
	for {
		if iterator.HasNext() {
			kv, _ := iterator.Next()
			logger.Info("kv==", kv)
		} else {
			iterator.Close()
			break
		}
	}
}

