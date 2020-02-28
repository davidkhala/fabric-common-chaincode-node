# fabric-common-chaincode-node

home of 
- `npm fabric-common-chaincode`
- `npm khala-fabric-contract-api`


## Notes
- nodejs chaincode do not suffer from >100 iterator size limit   
- `fabric-shim` will wrap uncaught exception in this way
    `message=transaction returned with failure: Error: ${originalError.message}`
    This make error diagnose and handling harder
    
    See in: https://github.com/hyperledger/fabric/blob/609ddf8ef338e86524b2603e4a00a903e9ed9d65/core/chaincode/chaincode_support.go#L266

## Reference
 - Golang counterPart: https://github.com/davidkhala/fabric-common-chaincode-golang/ 
