/* eslint-env node, mocha */
/* global artifacts, contract, it, assert, web3 */

/**
 * This is the main test for the PlayerScore contract
 */

const PlayerScore = artifacts.require('PlayerScore');

let instance;

contract('PlayerScore', (accounts) => {
  it('Should deploy an instance of the PlayerScore contract', () => PlayerScore.deployed()
    .then((deployed) => {
      instance = deployed;
    }));
});
