/* eslint-env node */
/* global artifacts */

const PlayerScore = artifacts.require('PlayerScore');
const PuzzleManager = artifacts.require('PuzzleManager');

function deployContracts(deployer) {
  deployer.deploy(PlayerScore);
  deployer.deploy(PuzzleManager);
}

module.exports = deployContracts;
