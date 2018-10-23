const StarNotary = artifacts.require('StarNotaryTest')

const catcher = require("./exceptions.js");

contract('StarNotary', accounts => { 

    beforeEach(async function() { 
        this.contract = await StarNotary.new({from: accounts[0]})
    })
    
    describe('mint', () => {
        it('user1 can mint a star to user2', async function() {
            let owner = accounts[1], starId = 0x12, receiver = accounts[2];

            await this.contract.mint(receiver, starId, {from: owner});

            assert.equal(await this.contract.ownerOf(starId), receiver);
        })

        it('user1 cannot mint a star that already exists', async function() {
            let owner = accounts[1], starId = 0x12, receiver = accounts[2];

            await this.contract.createStar('awesome star!'
            , 'story', 'ra','dec','mag','cent', starId, {from: owner})    

            assertStarExists.call(this, starId, 'awesome star!', 'story', 'ra', 'dec', 'mag', 'cent');

            await catcher.catchRevert(this.contract.mint(receiver, starId, {from: owner}));

        })
    })

    describe('Empty StarNotary', () =>{
        it('no stars created', async function () { 
            assert.isFalse(await this.contract.checkIfStarExist('ra2','dec2','mag2','cent2'))
        })
    })

    describe('Checking if a star was already claimed', () =>{
        let user1 = accounts[1]
        let starId = 1

        beforeEach(async function () { 
            await this.contract.createStar('awesome star!'
            , 'story', 'ra','dec','mag','cent', starId, {from: user1})    
        })

        it('star already created', async function () { 
            assert.isTrue(await this.contract.checkIfStarExist('ra','dec','mag','cent'))
        })

        it('new star. Still not created', async function () { 
            assert.isFalse(await this.contract.checkIfStarExist('ra2','dec2','mag2','cent2'))
        })

    })
    
    assertStarExists = async function(tokenId, ... info) {
        let starInfo = await this.contract.tokenIdToStarInfo(tokenId);
        for (let i=0; i<info.length; i++) {
            assert.equal(starInfo[i], info[i]);
        }
    }

    describe('can create a star', () => { 
        it('can create a star and get its name', async function () { 
            
            await this.contract.createStar('awesome star!'
            ,'story', 'ra3','dec3', 'mag3', 'cent3', 3, {from: accounts[0]})

            assertStarExists(3, 'awesome star!', 'story', 'ra3', 'dec3', 'mag3', 'cent3');
        })

        it('cannot create a star twice', async function () { 
            
            await this.contract.createStar('awesome star!'
            ,'story', 'ra4','dec4', 'mag4', 'cent4', 4, {from: accounts[0]})

            assertStarExists.call(this, 4, 'awesome star!', 'story', 'ra4', 'dec4', 'mag4', 'cent4');

            try { 
                await this.contract.createStar('awesome star!'
                    ,'story', 'ra4','dec4', 'mag4', 'cent4', 4, {from: accounts[0]})
            } catch (error) { 
                assert.exists(error)
                return
            }
        
            assert.fail('Expected an error but didnt see one!')

        })
    })

    
    describe('buying and selling stars', () => { 
        let user1 = accounts[1]
        let user2 = accounts[2]
        let randomMaliciousUser = accounts[3]
        
        let starId = 5
        let starPrice = web3.toWei(.01, "ether")

        beforeEach(async function () { 
            await this.contract.createStar('awesome star!'
            , 'story', 'ra5','dec5','mag5','cent5', starId, {from: user1})    
        })

        it('user1 can put up their star for sale', async function () { 
            assert.equal(await this.contract.ownerOf(starId), user1)
            await this.contract.putStarUpForSale(starId, starPrice, {from: user1})
            
            assert.equal(await this.contract.starsForSale(starId), starPrice)
        })

        describe('user2 can buy a star that was put up for sale', () => { 
            beforeEach(async function () { 
                await this.contract.putStarUpForSale(starId, starPrice, {from: user1})
            })

            it('user2 is the owner of the star after they buy it', async function() { 
                await this.contract.buyStar(starId, {from: user2, value: starPrice, gasPrice: 0})
                assert.equal(await this.contract.ownerOf(starId), user2)
            })

            it('user2 ether balance changed correctly', async function () { 
                let overpaidAmount = web3.toWei(.05, 'ether')
                const balanceBeforeTransaction = web3.eth.getBalance(user2)
                await this.contract.buyStar(starId, {from: user2, value: overpaidAmount, gasPrice: 0})
                const balanceAfterTransaction = web3.eth.getBalance(user2)

                assert.equal(balanceBeforeTransaction.sub(balanceAfterTransaction), starPrice)
            })
        })

        describe('stars for sale', () => {
            it('no stars for sale', async function() {
                let starsForSale = await this.contract.StarsForSale()

                assert.equal(starsForSale.length, 0)
            })

            it('some stars for sale', async function() {
                await this.contract.createStar('awesome star!'
                    , 'story', 'ra6','dec6','mag6','cent6', 6, {from: user1});

                await this.contract.createStar('awesome star!'
                    , 'story', 'ra7','dec7','mag7','cent7', 7, {from: user1});

                assertStarExists.call(this, 6, 'awesome star!', 'story', 'ra6', 'dec6', 'mag6', 'cent6');
                assertStarExists.call(this, 7, 'awesome star!', 'story', 'ra7', 'dec7', 'mag7', 'cent7');

                await this.contract.putStarUpForSale(6, starPrice, {from: user1});
                await this.contract.putStarUpForSale(7, starPrice, {from: user1});

                let starsForSale = await this.contract.StarsForSale();

                assert.equal(starsForSale.length, 2)
            })
        })

        describe('approve', () => {
            it('owner of star can approve it\'s transfer', async function() {
                let owner = user1, starId = 8;
                await this.contract.createStar('awesome star!'
                    , 'story', 'ra8','dec8','mag8','cent8', starId, {from: owner});

                assertStarExists.call(this, starId, 'awesome star!', 'story', 'ra8', 'dec8', 'mag8', 'cent8');

                try {
                    await this.contract.approve(user2, starId, {from: owner});
                    let addr = await this.contract.getApproved(starId);
                    
                    assert.equal(addr, user2);
                }
                catch (error) {
                    assert.ifError(error);
                }
            })

            it('owner of star cannnot approve transfer to herself', async function() {
                await this.contract.createStar('awesome star!'
                    , 'story', 'ra9','dec9','mag9','cent9', 9, {from: user1});

                assertStarExists.call(this, 9, 'awesome star!', 'story', 'ra9', 'dec9', 'mag9', 'cent9');

                await catcher.catchRevert(this.contract.approve(user1, 9, {from: user1}));
            })

            it('only the owner of star can approve it\'s transfer', async function() {
                await this.contract.createStar('awesome star!'
                    , 'story', 'raA','decA','magA','centA', 0xA, {from: user1});

                assertStarExists.call(this, 0xA, 'awesome star!', 'story', 'raA', 'decA', 'magA', 'centA');

                await catcher.catchRevert(this.contract.approve(user2, 0xA, {from: randomMaliciousUser}));
            })

            describe('getApproved', () => {
                it('getApproved reverts if star Id not found', async function() {
                    let starId = 0xA;
                    await catcher.catchRevert(this.contract.getApproved(starId));
                })

                it('user2 is not approved from user1', async function() {
                    let owner = user1, starId = 8;
                    await this.contract.createStar('awesome star!'
                        , 'story', 'ra8','dec8','mag8','cent8', starId, {from: owner});
    
                    assertStarExists.call(this, starId, 'awesome star!', 'story', 'ra8', 'dec8', 'mag8', 'cent8');
    
                    let addr = await this.contract.getApproved(starId, {from: owner});
                        
                    assert.equal(addr, 0);

                })
            })
    
        })

        describe('SafeTransferFrom', () => {
            it('The owner of star can safely transfer to another user', async function() {
                let starId = 0xB, owner = user1;
                await this.contract.createStar('awesome star!'
                    , 'story', 'raB','decB','magB','centB', starId, {from: owner});

                assertStarExists.call(this, starId, 'awesome star!', 'story', 'raB', 'decB', 'magB', 'centB');

                let msgSender = user1, receiver = user2;
                await this.contract.safeTransferFrom(owner, receiver, starId, {from: msgSender});

                assert.equal(await this.contract.ownerOf(starId), receiver)
            })

            it('Only the owner of star can safely transfer to another user', async function() {
                let starId = 0xC, owner = user1;
                await this.contract.createStar('awesome star!'
                    , 'story', 'raC','decC','magC','centC', starId, {from: owner});

                assertStarExists.call(this, starId, 'awesome star!', 'story', 'raC', 'decC', 'magC', 'centC');

                let msgSender = user2, receiver = user1;
                await catcher.catchRevert(this.contract.safeTransferFrom(owner, receiver, starId, {from: msgSender}))
            })

            it('Approved user can safely transfer a star to another user', async function() {
                let starId = 0xB, owner = user1;
                await this.contract.createStar('awesome star!'
                    , 'story', 'raB','decB','magB','centB', starId, {from: owner});

                assertStarExists.call(this, starId, 'awesome star!', 'story', 'raB', 'decB', 'magB', 'centB');

                await this.contract.approve(user2, starId, {from: owner});

                assert.equal(await this.contract.getApproved(starId), user2);
                assert.equal(await this.contract.ownerOf(starId), owner);

                let msgSender=user2, receiver=accounts[3]
                await this.contract.safeTransferFrom(owner, receiver, starId, {from: msgSender});

                assert.equal(await this.contract.ownerOf(starId), receiver)
            })

            it('Only approved users can safely transfer a star to another user', async function() {
                let starId = 0xD, owner = user1;
                await this.contract.createStar('awesome star!'
                    , 'story', 'raD','decD','magD','centD', starId, {from: owner});

                assertStarExists.call(this, starId, 'awesome star!', 'story', 'raD', 'decD', 'magD', 'centD');

                await this.contract.approve(user2, starId, {from: owner});

                assert.equal(await this.contract.getApproved(starId), user2);
                assert.equal(await this.contract.ownerOf(starId), owner);

                let msgSender = accounts[3], receiver = accounts[4];
                await catcher.catchRevert(this.contract.safeTransferFrom(owner, receiver, starId, {from: msgSender}));
                assert.equal(await this.contract.ownerOf(starId), owner);
                assert.notEqual(await this.contract.ownerOf(starId), receiver);
            })
        })

        describe('SetApprovalForAll / IsApprovedForAll', () => {
            it('user1 gives approval for user2', async function() {
                let owner = user1, operator = user2, approved = true;
                await this.contract.setApprovalForAll(operator, approved, {from: owner});

                assert.isTrue(await this.contract.isApprovedForAll(owner, operator));
            })
            it('user1 removes approval from user2', async function() {
                let owner = user1, operator = user2, approved = true;
                await this.contract.setApprovalForAll(operator, approved, {from: owner});

                assert.isTrue(await this.contract.isApprovedForAll(owner, operator));
                
                approved = false;
                await this.contract.setApprovalForAll(operator, approved, {from: owner});

                assert.isNotTrue(await this.contract.isApprovedForAll(owner, operator));
            })
            it('user1 cannot give approval for herself', async function() {
                let owner = user1, operator = user1, approved = true;
                await catcher.catchRevert(this.contract.setApprovalForAll(operator, approved, {from: owner}));

            })
        })

        describe('OwnerOf', () => {
            it('user1 owns a star', async function() {
                let owner = user1, starId = 0xE;

                await this.contract.createStar('awesome star!'
                    , 'story', 'raE','decE','magE','centE', starId, {from: owner});

                assertStarExists.call(this, starId, 'awesome star!', 'story', 'raE', 'decE', 'magE', 'centE');

                assert.equal(await this.contract.ownerOf(starId, {from: owner}), owner);
            })
            it('user2 doesn\'t own a star', async function() {
                let owner = user2, starId = 0xF;

                await catcher.catchRevert(this.contract.ownerOf(starId, {from: owner}));
            })
        })


        describe('TokenIdToStarInfo', () => {
            it('can get star info from it\'s token Id', async function() {
                let owner = user1, starId = 0x10;

                await this.contract.createStar('awesome star!'
                    , 'story', 'raE','decE','magE','centE', starId, {from: owner});

                assertStarExists.call(this, starId, 'awesome star!', 'story', 'raE', 'decE', 'magE', 'centE');
                
            })

            it('no info for unknown token Id', async function() {
                let starId = 0x11;

                let info = await this.contract.tokenIdToStarInfo(starId);

                assert.isArray(info, 'star info expected to be an array');
                assert.equal(info.length, 7);
                for (let i=0; i<info.length-1; i++) {
                    assert.equal(info[i], '');
                }
                assert.isObject(info[6], 'BigNumber');
            })
        })

    })


})