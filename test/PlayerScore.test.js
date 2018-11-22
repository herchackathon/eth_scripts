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

  it('Should get the length of the topScores array', () => instance.getTopScoresCount()
    .then((length) => {
      assert.equal(length, 0, 'Length is wrong');
    }));

  it('Should set 5 scores', () => {
    for (let i = 0; i < 5; i += 1) {
      instance.setScore(i, {
        from: accounts[i],
      });
    }
  });

  it('Should get the length of the topScores array', () => instance.getTopScoresCount()
    .then((length) => {
      assert.equal(length.toNumber(), 5, 'Length is wrong');
    }));

  it('Should get the top scores', () => {
    for (let i = 0; i < 5; i += 1) {
      instance.topScores.call(i)
        .then((data) => {
          assert.equal(data[0], accounts[i], 'Score address is wrong');
          assert.equal(data[1].toNumber(), i, 'Score amount is wrong');
        });
    }
  });

  it('Should get the score of account #9', () => instance.scores.call((accounts[9]))
    .then((score) => {
      assert.equal(score.toNumber(), 0, 'Account #9 score is wrong');
    }));

  it('Should set a new score for account #9', () => instance.setScore(10, {
    from: accounts[9],
  }));

  it('Should get the new score of account #9', () => instance.scores.call(accounts[9])
    .then((score) => {
      assert.equal(score.toNumber(), 10, 'Account #9 new score is wrong');
    }));

  it('Should set a new higher score for account #9', () => instance.setScore(100, {
    from: accounts[9],
  }));

  it('Should get the new higher score of account #9', () => instance.scores.call(accounts[9])
    .then((score) => {
      assert.equal(score.toNumber(), 100, 'Account #9 new higher score is wrong');
    }));
});
