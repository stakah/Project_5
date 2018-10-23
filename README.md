# README.md

## Udacity Blockchain nanodegree Project 5 - Decentralized Star Notary Project


### Deployment of contract to Rinkeby network

Transaction Id: `0xa6079bb333581b69e5dc65371e160383fb7df6620812c806579364c0bb08b541`


Contract Id: `0x2763A7209d0854F74F3FBFD4DC99fB5fb195942C`

```
λ truffle deploy --network rinkeby
Using network 'rinkeby'.

Running migration: 1_initial_migration.js
  Deploying Migrations...
  ... 0x77c33bf2a4228261d135a0c5f5bac29149b8d7232b7844071af505eb7d32444a
  Migrations: 0x07dd3c36ac87b69f3e90f071e795e9fb8e6d7a69
Saving successful migration to network...
  ... 0x171fa4f530babd03d169517ff91a2eadeddc89d60b9dbac284d360e843e8675d
Saving artifacts...
Running migration: 2_deploy_contracts.js
  Deploying StarLib...
  ... 0x758d0214f7124c699189614b5d42a6fbeafcc852bb03ca22f9fbe253ac4ae58e
  StarLib: 0x964b3e6aa8dc6abfda582c35c258de22b356009f
  Linking StarLib to StarNotary
  Deploying StarNotary...
  ... 0xa6079bb333581b69e5dc65371e160383fb7df6620812c806579364c0bb08b541
  StarNotary: 0x2763a7209d0854f74f3fbfd4dc99fb5fb195942c
Saving successful migration to network...
  ... 0x7e78697d1be54936b86ed78afbdc3b342d37c5914b5c13463629276af980f20a
Saving artifacts...
```


### Creating a star in the contract

```
truffle console --network rinkeby

truffle(rinkeby)> StarNotary.at("0x2763a7209d0854f74f3fbfd4dc99fb5fb195942c")
.createStar("Beta Librae", "Also named ubeneschamali",
 "ra_15h_17m_00.41382s", "dec_-09deg_22min_58.4919sec", "mag_2.61", "cent_Libra",
  1, {from: 0xdd3ac497e1f80cbaf4b08ce68a22db9a598fcdd5"});  
{ tx: '0xcbbb0706ffb837bf3f94efc6375bdc6e8f98069637f942501bcb67d3c95f78ca',                
  receipt:                                                                                 
   { blockHash: '0x02b74302a29662a3277f06f8ca20dec2167f9be8b1f51ba31cb91c4fc8392431',      
     blockNumber: 3208272,                                                                 
     contractAddress: null,                                                                
     cumulativeGasUsed: 384162,                                                            
     from: '0xdd3ac497e1f80cbaf4b08ce68a22db9a598fcdd5',                                   
     gasUsed: 384162,                                                                      
     logs: [ [Object] ],                                                                   
     logsBloom: '0x000000000000000000000000000000000000000000000000000000000000000000000000
0000000000000000000000000000000000000000000200000004000000208000000000000000000800010000000
0000000040000000000000000000000000000020000000000000000000800000000000000000000000010000000
0000000000000000000000000000000000020000000000000000000000000000000000000000000000800000000
0000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000
0000000060000000000000000000000000000000000000000000000000000000000000000000',             
     status: '0x1',                                                                        
     to: '0x2763a7209d0854f74f3fbfd4dc99fb5fb195942c',                                     
     transactionHash: '0xcbbb0706ffb837bf3f94efc6375bdc6e8f98069637f942501bcb67d3c95f78ca',
     transactionIndex: 0 },                                                                
  logs:                                                                                    
   [ { address: '0x2763a7209d0854f74f3fbfd4dc99fb5fb195942c',                              
       blockHash: '0x02b74302a29662a3277f06f8ca20dec2167f9be8b1f51ba31cb91c4fc8392431',    
       blockNumber: 3208272,                                                               
       logIndex: 0,                                                                        
       removed: false,                                                                     
       transactionHash: '0xcbbb0706ffb837bf3f94efc6375bdc6e8f98069637f942501bcb67d3c95f78ca
',                                                                                         
       transactionIndex: 0,                                                                
       event: 'Transfer',                                                                  
       args: [Object] } ] }                                                                
truffle(rinkeby)>                                                                          
```
### Puting the star for sale

```
truffle(rinkeby)> StarNotary.at("0x2763a7209d0854f74f3fbfd4dc99fb5fb195942c")
.putStarUpForSale(1, web3.toWei(.01, "ether"),
 {from: "0xdd3ac497e1f80cbaf4b08ce68a22db9a598fcdd5"});
{ tx: '0xffa58351380df3497713dbd6ff51f7e3438284b734eed526c8c9ace80504503d',
  receipt:
   { blockHash: '0x1edb7ebba3642fa16e5a48df87f6c4a940ffee76e1294361e6b55e1bd660e959',
     blockNumber: 3208275,
     contractAddress: null,
     cumulativeGasUsed: 44975,
     from: '0xdd3ac497e1f80cbaf4b08ce68a22db9a598fcdd5',
     gasUsed: 44975,
     logs: [],
     logsBloom: '0x000000000000000000000000000000000000000000000000000000000000000
     000000000000000000000000000000000000000000000000000000000000000000
     000000000000000000000000000000000000000000000000000000000000000000
     000000000000000000000000000000000000000000000000000000000000000000
     000000000000000000000000000000000000000000000000000000000000000000
     000000000000000000000000000000000000000000000000000000000000000000
     000000000000000000000000000000000000000000000000000000000000000000
     00000000000000000000000000000000000000000000000000000',
     status: '0x1',
     to: '0x2763a7209d0854f74f3fbfd4dc99fb5fb195942c',
     transactionHash: '0xffa58351380df3497713dbd6ff51f7e3438284b734eed526c8c9ace80504503d',
     transactionIndex: 0 },
  logs: [] }
truffle(rinkeby)>
```
### Running the client web app

From the terminal execute:

```
http-server
```

Access the client at [http://localhost:8080]().

