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

  it('Should get the original metrics of puzzle 0', () => instance.getPuzzleOriginalMetrics(0)
    .then((metrics) => {
      assert.equal(metrics, 'puzzle', 'Metrics are wrong');
    }));

  it('Should push good secure metrics to puzzle 0 from account #1', () => instance.pushSecureMetrics(
    0,
    web3.utils.utf8ToHex('puzzle'), {
      from: accounts[1],
    },
  ));

  it('Should compare good secure metrics for puzzle 0 from account #1', () => instance.compareSecureMetrics(
    0,
    true, {
      from: accounts[1],
    },
  )
    .then((result) => {
      assert.equal(result, true, 'Metrics should be identical');
    }));

  it('Should push wrong secure metrics to puzzle 0 from account #2', () => instance.pushSecureMetrics(
    0,
    web3.utils.utf8ToHex('puzzle2'), {
      from: accounts[2],
    },
  ));

  it('Should compare wrong secure metrics for puzzle 0', () => instance.compareSecureMetrics(
    0,
    true, {
      from: accounts[2],
    },
  )
    .then((result) => {
      assert.equal(result, false, 'Metrics should not be identical');
    }));

  it.skip('Should get the hashed metrics for puzzle 0 and account 1', () => instance.getPuzzleMetrics(0)
    .then((metrics) => {
      assert.equal(metrics, web3.utils.utf8ToHex('puzzle') + web3.utils.utf8ToHex('puzzle'), 'Metrics are wrong');
    }));

  /**
   * Tests for a non-secure puzzle
   */

  it('Should create a non-secure puzzle from account #0', () => instance.createPuzzle(
    'puzzle',
    'uniqueId',
  ));

  it('Should push good metrics to puzzle 1 from account #1', () => instance.pushMetrics(
    1,
    'puzzle', {
      from: accounts[1],
    },
  ));

  it('Should compare good metrics for puzzle 1 from accounts #1', () => instance.compareMetrics(1, {
    from: accounts[1],
  })
    .then((result) => {
      assert.equal(result, true, 'Metrics should be identical');
    }));

  it('Should push wrong metrics for puzzle 1 from accounts #2', () => instance.pushMetrics(
    1,
    'puzzle2', {
      from: accounts[2],
    },
  ));

  it('Should compare wrong metrics for puzzle 1 from account #2', () => instance.compareMetrics(1, {
    from: accounts[2],
  })
    .then((result) => {
      assert.equal(result, false, 'Metrics should not be identical');
    }));

  /**
   * All these tests are meant to revert
   */
  it('Should not push secure metrics to non-secure puzzle #1', () => instance.pushSecureMetrics(
    1,
    web3.utils.utf8ToHex('puzzle2'),
  )
    .then(assert.fail)
    .catch((error) => {
      assert.include(error.message, 'Puzzle is not secure', 'Pushing secure metrics to a non secure puzzle should revert');
    }));

  /**
   * Let's try to ban an account
   */
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
