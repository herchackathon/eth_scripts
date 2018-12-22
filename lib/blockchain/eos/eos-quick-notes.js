// eos [
// Usage [

// connect [

// Private key or keys (array) provided statically or by way of a function.
// For multiple keys, the get_required_keys API is used (more on that below).

    keyProvider: '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'
 
// Localhost Testnet (run ./docker/up.sh)

// Connect to a testnet or mainnet
    eos = Eos({httpEndpoint, chainId, keyProvider})

// Cold-storage
    eos = Eos({httpEndpoint: null, chainId, keyProvider})

// Add support for non-EOS public key prefixes, such as PUB, etc
    eos = Eos({keyPrefix: 'PUB'})

// Read-only instance when 'eosjs' is already a dependency
    eos = Eos.modules.api({/*config*/})

// Read-only instance when an application never needs to write (smaller library)
    EosApi = require('eosjs-api')
    eos = EosApi({/*config*/})

// connect ]
// eos.getBlock [

    getBlock - Fetch a block from the blockchain.
    
    PARAMETERS
    {
    "block_num_or_id": "string"
    }

    // If the last argument is a function it is treated as a callback
    eos.getBlock(1, (error, result) => {})
    
    // If a callback is not provided, a Promise is returned
    eos.getBlock(1) // @returns {Promise}
    
    // Parameters can be positional or an object
    eos.getBlock({block_num_or_id: 1})
    
    // An API with no parameters is invoked with an empty object or callback (avoids logging usage)
    eos.getInfo({}) // @returns {Promise}
    eos.getInfo((error, result) => { console.log(error, result) })

    // eos.getBlock ]
// docker [

    cd ./docker && ./up.sh

// docker ]

// Usage ]
// Configuration [

    Eos = require('eosjs')

    let config = {
        chainId: null, // 32 byte (64 char) hex string
        keyProvider: ['PrivateKeys...'], // WIF string or array of keys..
        httpEndpoint: 'http://127.0.0.1:8888',
        expireInSeconds: 60,
        broadcast: true,
        verbose: false, // API activity
        sign: true
    }

    eos = Eos(config)

// authorization [
    
    NOTE: authorization is for individual actions, it does not belong in Eos(config).

    options = {
        authorization: 'alice@active',
        broadcast: true,
        sign: true
    }
    eos.transfer('alice', 'bob', '1.0000 SYS', '', options)
      
// authorization ]

// Configuration ]
// Transaction [

    // only needed in cold-storage or for offline transactions
    const headers = {
        expiration: '2018-06-14T18:16:10'
        ref_block_num: 1,
        ref_block_prefix: 452435776
    }

    // Create and send (broadcast) a transaction
    
    /** @return {Promise} */
    eos.transaction(
    {
      // ...headers,
      // context_free_actions: [],
      actions: [
        {
          account: 'eosio.token',
          name: 'transfer',
          authorization: [{
            actor: 'inita',
            permission: 'active'
          }],
          data: {
            from: 'inita',
            to: 'initb',
            quantity: '7.0000 SYS',
            memo: ''
          }
        }
      ]
    }
    // config -- example: {broadcast: false, sign: true}
  )
// Transaction ]
// Named action functions [

    // Run with no arguments to print usage.
    eos.transfer()
    
    // Callback is last, when omitted a promise is returned
    eos.transfer('inita', 'initb', '1.0000 SYS', '', (error, result) => {})
    eos.transfer('inita', 'initb', '1.1000 SYS', '') // @returns {Promise}
    
    // positional parameters
    eos.transfer('inita', 'initb', '1.2000 SYS', '')
    
    // named parameters
    eos.transfer({from: 'inita', to: 'initb', quantity: '1.3000 SYS', memo: ''})
    
    // options appear after parameters
    options = {broadcast: true, sign: true}
    
    // `false` is a shortcut for {broadcast: false}
    eos.transfer('inita', 'initb', '1.4000 SYS', '', false)

    DecimalPad = Eos.modules.format.DecimalPad
    userInput = '10.2'
    precision = 4
    assert.equal('10.2000', DecimalPad(userInput, precision))

// Named action functions ]
// Shorthand [

    permission inita defaults inita@active
    authority 'EOS6MRy..' expands {threshold: 1, keys: [{key: 'EOS6MRy..', weight: 1}]}
    authority inita expands {threshold: 1, accounts: [{permission: {actor: 'inita', permission: 'active'}, weight: 1}]}
    

// Shorthand ]
// New Account [

    wif = '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'
    pubkey = 'EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV'
     
    eos.transaction(tr => {
      tr.newaccount({
        creator: 'eosio',
        name: 'myaccount',
        owner: pubkey,
        active: pubkey
      })
     
      tr.buyrambytes({
        payer: 'eosio',
        receiver: 'myaccount',
        bytes: 8192
      })
     
      tr.delegatebw({
        from: 'eosio',
        receiver: 'myaccount',
        stake_net_quantity: '10.0000 SYS',
        stake_cpu_quantity: '10.0000 SYS',
        transfer: 0
      })
    })
    
// New Account ]
// Contract [

    Deploy and call smart contracts.

    // Compile [

    If you're loading a wasm file, you do not need binaryen. If you're loading a wast file you can include and configure the binaryen compiler, this is used to compile to wasm automatically when calling setcode.
    

    Versions of binaryen may be problematic.

    $ npm install binaryen@37.0.0

    binaryen = require('binaryen')
    eos = Eos({keyProvider, binaryen})

    // Compile ]
    // Deploy [

    wasm = fs.readFileSync(`docker/contracts/eosio.token/eosio.token.wasm`)
    abi = fs.readFileSync(`docker/contracts/eosio.token/eosio.token.abi`)
    
    // Publish contract to the blockchain
    eos.setcode('myaccount', 0, 0, wasm) // @returns {Promise}
    eos.setabi('myaccount', JSON.parse(abi)) // @returns {Promise}

    // Deploy ]
    // Fetch a smart contract [

    // @returns {Promise}
    eos.contract('myaccount', [options], [callback])
    
    // Run immediately, `myaction` returns a Promise
    eos.contract('myaccount').then(myaccount => myaccount.myaction(..))
    
    // Group actions. `transaction` returns a Promise but `myaction` does not
    eos.transaction('myaccount', myaccount => { myaccount.myaction(..) })
    
    // Transaction with multiple contracts
    eos.transaction(['myaccount', 'myaccount2'], ({myaccount, myaccount2}) => {
    myaccount.myaction(..)
    myaccount2.myaction(..)
    })

    // Fetch a smart contract ]
    // Offline or cold-storage contract [

    eos = Eos({httpEndpoint: null})
     
    abi = fs.readFileSync(`docker/contracts/eosio.token/eosio.token.abi`)
    eos.fc.abiCache.abi('myaccount', JSON.parse(abi))
     
    // Check that the ABI is available (print usage)
    eos.contract('myaccount').then(myaccount => myaccount.create())
    
    // Offline or cold-storage contract ]
    // Offline or cold-storage transaction [

    // ONLINE
     
    // Prepare headers
    expireInSeconds = 60 * 60 // 1 hour
     
    eos = Eos(/* {httpEndpoint: 'https://..'} */)
     
    info = await eos.getInfo({})
    chainDate = new Date(info.head_block_time + 'Z')
    expiration = new Date(chainDate.getTime() + expireInSeconds * 1000)
    expiration = expiration.toISOString().split('.')[0]
     
    block = await eos.getBlock(info.last_irreversible_block_num)
     
    transactionHeaders = {
      expiration,
      ref_block_num: info.last_irreversible_block_num & 0xFFFF,
      ref_block_prefix: block.ref_block_prefix
    }
     
    // OFFLINE (bring `transactionHeaders`)
     
    // All keys in keyProvider will sign.
    eos = Eos({httpEndpoint: null, chainId, keyProvider, transactionHeaders})
     
    transfer = await eos.transfer('inita', 'initb', '1.0000 SYS', '')
    transferTransaction = transfer.transaction
     
    // ONLINE (bring `transferTransaction`)
     
    eos = Eos(/* {httpEndpoint: 'https://..'} */)
     
    processedTransaction = await eos.pushTransaction(transferTransaction)
    
    // Offline or cold-storage transaction ]
    
    // Custom Token [

    // more on the contract / transaction syntax
    
    await eos.transaction('myaccount', myaccount => {
    
    // Create the initial token with its max supply
    // const options = {authorization: 'myaccount'} // default
    myaccount.create('myaccount', '10000000.000 PHI')//, options)
    
    // Issue some of the max supply for circulation into an arbitrary account
    myaccount.issue('myaccount', '10000.000 PHI', 'issue')
    })
    
    const balance = await eos.getCurrencyBalance('myaccount', 'myaccount', 'PHI')
    console.log('Currency Balance', balance)

    // Custom Token ]
    // Calling Actions [

    Other ways to use contracts and transactions.

    // if either transfer fails, both will fail (1 transaction, 2 messages)
    await eos.transaction(eos =>
    {
        eos.transfer('inita', 'initb', '1.0000 SYS', ''/*memo*/)
        eos.transfer('inita', 'initc', '1.0000 SYS', ''/*memo*/)
        // Returning a promise is optional (but handled as expected)
    }
    // [options],
    // [callback]
    )
    
    // transaction on a single contract
    await eos.transaction('myaccount', myaccount => {
    myaccount.transfer('myaccount', 'inita', '10.000 PHI', '')
    })
    
    // mix contracts in the same transaction
    await eos.transaction(['myaccount', 'eosio.token'], ({myaccount, eosio_token}) => {
    myaccount.transfer('inita', 'initb', '1.000 PHI', '')
    eosio_token.transfer('inita', 'initb', '1.0000 SYS', '')
    })
    
    // The contract method does not take an array so must be called once for
    // each contract that is needed.
    const myaccount = await eos.contract('myaccount')
    await myaccount.transfer('myaccount', 'inita', '1.000 PHI', '')
    
    // a transaction to a contract instance can specify multiple actions
    await myaccount.transaction(myaccountTr => {
    myaccountTr.transfer('inita', 'initb', '1.000 PHI', '')
    myaccountTr.transfer('initb', 'inita', '1.000 PHI', '')
    })

    // Calling Actions ]
    // Development [

    From time-to-time the eosjs and nodeos binary format will change between releases so you may need to start nodeos with the --skip-transaction-signatures parameter to get your transactions to pass.

    Note, package.json has a "main" pointing to ./lib. The ./lib folder is for es2015 code built in a separate step. If you're changing and testing code, import from ./src instead.

    Eos = require('./src')
    
    // forceActionDataHex = false helps transaction readability but may trigger back-end bugs
    config = {verbose: true, debug: false, broadcast: true, forceActionDataHex: true, keyProvider}
    
    eos = Eos(config)
    Fcbuffer
    The eos instance can provide serialization:

    // 'asset' is a type but could be any struct or type like: transaction or uint8
    type = {type: 1, data: '00ff'}
    buffer = eos.fc.toBuffer('extensions_type', type)
    assert.deepEqual(type, eos.fc.fromBuffer('extensions_type', buffer))
    
    // ABI Serialization
    eos.contract('eosio.token', (error, eosio_token) => {
    create = {issuer: 'inita', maximum_supply: '1.0000 SYS'}
    buffer = eosio_token.fc.toBuffer('create', create)
    assert.deepEqual(create, eosio_token.fc.fromBuffer('create', buffer))
    })

    // Development ]
    // Related Libraries [

    var {format, api, ecc, json, Fcbuffer} = Eos.modules

    format ./format.md
    Blockchain name validation
    Asset string formatting

    eosjs-api [Github, NPM]
    Remote API to an EOS blockchain node (nodeos)
    Use this library directly if you need read-only access to the blockchain (don't need to sign transactions).

    eosjs-ecc [Github, NPM]
    Private Key, Public Key, Signature, AES, Encryption / Decryption
    Validate public or private keys
    Encrypt or decrypt with EOS compatible checksums
    Calculate a shared secret

    json {api, schema},
    Blockchain definitions (api method names, blockchain schema)

    eosjs-keygen [Github, NPM]
    private key storage and key management

    Fcbuffer [Github, NPM]

    Binary serialization used by the blockchain
    Clients sign the binary form of the transaction
    Allows client to know what it is signing

    // Related Libraries ]
// Contract ]
// eos ]

// _review [
// 0 [

//  eos.transfer('alice', 'bob', '1.0000 SYS', '', options)
// await eos.anyAction('args', {keyProvider})
// await eos.transaction(tr => { tr.anyAction() }, {keyProvider})

/*
// only needed in cold-storage or for offline transactions
const headers = {
  expiration: '2018-06-14T18:16:10'
  ref_block_num: 1,
  ref_block_prefix: 452435776
}*/

/** @return {Promise} */
/*eos.transaction(
    {
      // ...headers,
      // context_free_actions: [],
      actions: [
        {
          account: 'eosio.token',
          name: 'transfer',
          authorization: [{
            actor: 'inita',
            permission: 'active'
          }],
          data: {
            from: 'inita',
            to: 'initb',
            quantity: '7.0000 SYS',
            memo: ''
          }
        }
      ]
    }
    // config -- example: {broadcast: false, sign: true}
  )
*/
/*
// Run with no arguments to print usage.
eos.transfer()
 
// Callback is last, when omitted a promise is returned
eos.transfer('inita', 'initb', '1.0000 SYS', '', (error, result) => {})
eos.transfer('inita', 'initb', '1.1000 SYS', '') // @returns {Promise}
 
// positional parameters
eos.transfer('inita', 'initb', '1.2000 SYS', '')
 
// named parameters
eos.transfer({from: 'inita', to: 'initb', quantity: '1.3000 SYS', memo: ''})
 
// options appear after parameters
options = {broadcast: true, sign: true}
 
// `false` is a shortcut for {broadcast: false}
eos.transfer('inita', 'initb', '1.4000 SYS', '', false)
*/
/*
DecimalPad = Eos.modules.format.DecimalPad
userInput = '10.2'
precision = 4
assert.equal('10.2000', DecimalPad(userInput, precision))
*/

// 0 ]
// 1 [

    chainId hex - Unique ID for the blockchain you're connecting to. This is required for valid transaction signing. The chainId is provided via the get_info API call.

    Identifies a chain by its initial genesis block. All transactions signed will only be valid the blockchain with this chainId. Verify the chainId for security reasons.
    
    keyProvider [array<string>|string|function] - Provides private keys used to sign transactions. If multiple private keys are found, the API get_required_keys is called to discover which signing keys to use. If a function is provided, this function is called for each transaction.
    
    If a keyProvider is not provided here, one may be provided on a per-action or per-transaction basis in Options.
    
    keyPrefix [string='EOS'] - Change the public key prefix.
    
    httpEndpoint string - http or https location of a nodeosd server providing a chain API. When using eosjs from a browser remember to configure the same origin policy in nodeosd or proxy server. For testing, nodeosd configuration access-control-allow-origin = * could be used.
    
    Set this value to null for a cold-storage (no network) configuration.
    
    expireInSeconds number - number of seconds before the transaction will expire. The time is based on the nodeosd's clock. An unexpired transaction that may have had an error is a liability until the expiration is reached, this time should be brief.
    
    broadcast [boolean=true] - post the transaction to the blockchain. Use false to obtain a fully signed transaction.
    
    verbose [boolean=false] - verbose logging such as API activity.
    
    debug [boolean=false] - low level debug logging (serialization).
    
    sign [boolean=true] - sign the transaction with a private key. Leaving a transaction unsigned avoids the need to provide a private key.
    
    mockTransactions (advanced)
    
    mockTransactions: () => null // 'pass', or 'fail'
    pass - do not broadcast, always pretend that the transaction worked
    fail - do not broadcast, pretend the transaction failed
    null|undefined - broadcast as usual
    transactionHeaders (advanced) - manually calculate transaction header. This may be provided so eosjs does not need to make header related API calls to nodeos. Used in environments like cold-storage. This callback is called for every transaction. Headers are documented here eosjs-api#headers.
    
    transactionHeaders: (expireInSeconds, callback) => {callback(null/*error*/, headers)}
    logger - default logging configuration.
    
    logger: {
      log: config.verbose ? console.log : null,  // null to disable
      error: config.verbose ? console.error : null,
    }
    For example, redirect error logs: config.logger = {error: (...args) => ..}
    
    authorization - replace the default eosjs authorization on actions. An authorization provided here may still be over-written by specifying an authorization for each individual action.
    
    For example, if most actions in an dapp are based on the posting key, this would replace the default active authorization with a posting authorization:
    
    {authorization: '@posting'}

// 1 ]
// 2 [

    authorization [array<auth>|auth] - identifies the signing account and permission typically in a multisig configuration. Authorization may be a string formatted as account@permission or an object<{actor: account, permission}>.

    If missing default authorizations will be calculated.
    If provided additional authorizations will not be added.
    Performs deterministic sorting by account name
    If a default authorization is calculated the action's 1st field must be an account_name. The account_name in the 1st field gets added as the active key authorization for the action.
    
    broadcast [boolean=true] - post the transaction to the blockchain. Use false to obtain a fully signed transaction.
    
    sign [boolean=true] - sign the transaction with a private key. Leaving a transaction unsigned avoids the need to provide a private key.
    
    keyProvider [array<string>|string|function] - just like the global keyProvider except this provides a temporary key for a single action or transaction.
    
    await eos.anyAction('args', {keyProvider})
    await eos.transaction(tr => { tr.anyAction() }, {keyProvider})
// 2 ]
// _review ]

