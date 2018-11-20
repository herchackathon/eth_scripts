/* eslint-env node */
/* global artifacts */

const PlayerScore = artifacts.require('PlayerScore');

function deployContracts(deployer) {
  deployer.deploy(PlayerScore);
}

module.exports = deployContracts;
