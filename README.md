# fabric-common-chaincode-node

`npm fabric-common-chaincode`


## Notes
- `/usr/local/src` is the place to hold nodejs chaincode in docker
- nodejs chaincode do not suffer from >100 iterator size limit   
- nodejs chaincode take longer time in install chaincode only.
- [FAB-9287] devDependencies and offline chaincode instantiate is not supported yet
- [contract-api] later contract in `index#exports.contracts` array will overlap to previous one, similar as `Object.assign()`
- [contract-api] multiple contract in index.js: for invoke function code split
    - contract name: defined in subclass of Contract constructor
        ``` super(`${contractName}`) ```
    - function namespace division: <contract name>:<function name>
    - ledger data is integral for multiple contract  
- [contract-api] minimum package.json
    ```json
  {
      "main": "index.js", 
      "scripts": {
          "start": "fabric-chaincode-node start"
      },
      "dependencies": {
          "fabric-contract-api": "latest-1.4",
          "fabric-shim": "latest-1.4"
      }
  }    
    ```
    property "name", "version" is useless

## TODO
- `fabric-shim` will wrap uncaught exception in this way
    `message=transaction returned with failure: Error: ${originalError.message}`
    This make error diagnose and handling harder.
    
    See in: https://github.com/hyperledger/fabric/blob/609ddf8ef338e86524b2603e4a00a903e9ed9d65/core/chaincode/chaincode_support.go#L266

## Reference
 - Golang counterPart: https://github.com/davidkhala/fabric-common-chaincode-golang/ 
