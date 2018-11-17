/* eslint-env node */
/* global artifacts */

const Contract = artifacts.require('Contract');

function deployContracts(deployer) {
  deployer.deploy(Contract);
}

module.exports = deployContracts;
