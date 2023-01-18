# buildspace Solana GIF Portal Project

### How to deploy rust program on Solana BC **

1. Run `npm install @project-serum/anchor @solana/web3.js` at the root of your directory
2. Run `anchor test`
3. Run `anchor build`
4. Run `anchor deploy`
5. anchor idl init  -f target/idl/myepicproject.json `solana address -k target/deploy/myepicproject-keypair.json`
or
6. anchor idl upgrade -f target/idl/myepicproject.json `solana address -k target/deploy/myepicproject-keypair.json`
7. Start coding!

### How to reset

Delete target folder in Anchor program

cargo clean

anchor build

solana address -k target/deploy/myepicproject-keypair.json


Modify programs/myepicproject/src/lib.rs & Anchor.toml with this address

anchor build

anchor deploy

anchor idl init  -f target/idl/myepicproject.json `solana address -k target/deploy/myepicproject-keypair.json`

#If error :
```Error: Deploying program failed: Error processing Instruction 1: custom program error: 0x1
There was a problem deploying: Output { status: ExitStatus(unix_wait_status(256)), stdout: "", stderr: "" }.
```
solana airdrop 2 # In your current solana address, not program address !

anchor deploy

anchor idl init  -f target/idl/myepicproject.json `solana address -k target/deploy/myepicproject-keypair.json`