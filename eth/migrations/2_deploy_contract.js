const MLContract = artifacts.require("MLContract");

module.exports = function (deployer) {
  deployer.deploy(MLContract);
};
