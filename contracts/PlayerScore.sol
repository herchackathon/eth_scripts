pragma solidity 0.4.25;


/**
 * @dev A contract to manage players' top scores
 */
contract PlayerScore {
    // Represents the maximum amount of
    // stored top scores.
    uint256 private constant M_MAXSCORES = 5;

    // Represents the player-score entry.
    struct Score {
        address player;
        uint256 score;
    }

    /// Most relevant scores stored in this contract.
    Score[] public topScores;

    // Maps each player with its own score.
    mapping (address => uint256) public scores;

    /// Get the amount of top scores.
    function getTopScoresCount() external view returns (uint256) {
        return topScores.length;
    }

    /**
     * @dev Sets the score for current sender.
     * If no score exists, a new one is created.
     * @param score The score to set
     */
    /* TODO: This function needs to be more secure, maybe internal */
    function setScore(uint256 score) public {
        // Replace the old score with the new one,
        // if it is higher.
        if (score > scores[msg.sender]) {
            scores[msg.sender] = score;
        }

        // Now we populate the top scores array.
        if (topScores.length < M_MAXSCORES) {
            // If we didn't reach the maximum stored
            // scores coun yet, we simply add the new entry.
            topScores.push(
                Score({
                    player: msg.sender,
                    score: score
                })
            );
        } else {
            // If we reached the maximum stored scores count,
            // we have to verify if the new received score is
            // higher than the lowest one in the top scores array.
            uint256 lowestScore = topScores[0].score;
            uint256 lowestScoreIndex = 0;

            // We search for the lowest stored score.
            for (uint256 i = 1; i < topScores.length; i += 1) {
                if (lowestScore > topScores[i].score) {
                    lowestScore = topScores[i].score;
                    lowestScoreIndex = i;
                }
            }

            // Now we can check our new pushed score against
            // the lowest one.
            if (lowestScore < score) {
                topScores[lowestScoreIndex] = Score({
                    player: msg.sender,
                    score: score
                });
            }
        }
    }
}
