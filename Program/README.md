# buildspace Solana GIF Portal Project

### How to deploy rust program on Solana BC **

1. Run `npm install @project-serum/anchor @solana/web3.js` at the root of your directory
2. Run `anchor test`
3. Run `anchor build`
4. Run `anchor deploy`
5. anchor idl init  -f target/idl/myepicproject.json `solana address -k target/deploy/myepicproject-^Cypair.json`
or
6. anchor idl upgrade -f target/idl/myepicproject.json `solana address -k target/deploy/myepicproject-keypair.json`
7. Start coding!


