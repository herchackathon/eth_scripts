/* eslint-env node, mocha */
/* global artifacts, contract, it, assert, web3 */

/**
 * This is the main test for the PuzzleManager contract
 */

const PuzzleManager = artifacts.require('PuzzleManager');

let instance;

contract('PuzzleManager', (accounts) => {
  it('Should deploy an instance of the PuzzleManager contract', () => PuzzleManager.deployed()
    .then((deployed) => {
      instance = deployed;
    }));
});
