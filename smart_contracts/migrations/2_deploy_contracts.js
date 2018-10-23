var StarNotary = artifacts.require ("./StarNotary.sol");
var StarNotaryTest = artifacts.require ("./StarNotaryTest.sol");
var StarLib = artifacts.require ("./StarLib.sol");

module.exports = function(deployer, network) {
      deployer.deploy(StarLib)
      deployer.link(StarLib, StarNotary);
      deployer.deploy(StarNotary)

      if (network == "development") {
            deployer.link(StarLib, StarNotaryTest);
            deployer.deploy(StarNotaryTest);
      }
}

