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

  /**
   * Tests for a secure puzzle
   */

  it('Should create a new secure puzzle', () => instance.createSecurePuzzle(
    accounts[0],
    'puzzle',
    web3.utils.utf8ToHex('puzzle'),
    true,
    'uniqueId',
  ));

  it('Should add secure metrics to puzzle 0 from account #1', () => instance.pushSecureMetrics(
    0,
    web3.utils.utf8ToHex('puzzle'), {
      from: accounts[1],
    },
  ));

  it('Should compare secure metrics for puzzle 0 from account #1', () => instance.compareSecureMetrics(
    0,
    true, {
      from: accounts[1],
    },
  )
    .then((result) => {
      assert.equal(result, true, 'Metrics are wrong');
    }));

  it('Should add secure metrics to puzzle 0 from account #2', () => instance.pushSecureMetrics(
    0,
    web3.utils.utf8ToHex('puzzle2'), {
      from: accounts[2],
    },
  ));

  it('Should compare secure metrics for puzzle 0', () => instance.compareSecureMetrics(
    0,
    true, {
      from: accounts[2],
    },
  )
    .then((result) => {
      assert.equal(result, false, 'Metrics are wrong');
    }));

  /**
   * Tests for a non-secure puzzle
   */

  it('Should create a non-secure puzzle', () => instance.createPuzzle(
    'puzzle',
    'uniqueId',
  ));

  it('Should ban account #0', () => instance.ban(accounts[0]));

  it('Should NOT create a non-secure puzzle', () => instance.createPuzzle(
    'puzzle',
    'uniqueId',
  )
    .then(assert.fail)
    .catch((error) => {
      assert.include(error.message, 'Player is banned', 'Create puzzle function should revert');
    }));
});
