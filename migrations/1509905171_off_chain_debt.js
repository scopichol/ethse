const OffChainDebt = artifacts.require('./OffChainDebt.sol');
module.exports = function(deployer) {
  deployer.deploy(OffChainDebt);
};
