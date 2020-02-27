# khala-fabric-contract-api

## TODO
- how to make mock test for contract-api


## Notes
- contract-api will wrap uncaught exception in this way
    `message=transaction returned with failure: Error: ${originalError.message}`
    
    This make error diagnose and handling harder 