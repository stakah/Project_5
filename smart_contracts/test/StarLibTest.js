const StarLib = artifacts.require('StarLib')

contract('StarLib', accounts => {
    beforeEach(async function() { 
        this.lib = await StarLib.new({from: accounts[0]})
    })

    describe('StarLib library', () => { 
        describe('strCompare', () => {
            it('comparing strings with different lengths', async function () { 
            
                let s1 = 'XYZ';
                let s2 = 'abcd';
                
                let res = await this.lib.strCompare(s1, s2);
                assert.isTrue(res.toNumber() < 0)

                res = await this.lib.strCompare(s2, s1);
                assert.isTrue(res.toNumber() > 0)
            })

            it('comparing strings same length', async function () { 
            
                let s1 = 'WXYZ';
                let s2 = 'abcd';
                
                let res = await this.lib.strCompare(s1, s2);
                assert.isTrue(res.toNumber() < 0)

                res = await this.lib.strCompare(s2, s1);
                assert.isTrue(res.toNumber() > 0)
            })

            it('comparing equal strings', async function () { 
            
                let s1 = 'abcd';
                let s2 = 'abcd';
                
                let res = await this.lib.strCompare(s1, s2);
                assert.isTrue(res.toNumber() == 0)
            })
        })
    })
})

