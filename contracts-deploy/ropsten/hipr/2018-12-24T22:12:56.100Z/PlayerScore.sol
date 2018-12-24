pragma solidity 0.4.24;
//pragma solidity ^0.4.25;

//import "./base/Ownable.sol";

import "./herc/herc20.sol";

// A contract to manage players' top scores.
contract PlayerScore is Ownable
{
    // Represents the maximum amount of
    // stored top scores.
    uint constant m_maxScores = 50;
    
    // Represents the player-score entry.
    struct Score
    {
        address player;
        int score;
    }
    
    /// <summary>
    /// Most relevant scores stored in this contract.
    /// </summary>
    Score[] public TopScores;
    
    // Maps each player with its own score.
    mapping(address=>int) public Scores;
    
    /// <summary>
    /// Sets the score for current sender.
    /// If no score exists, a new one is created.
    /// </summary>
    function SetScore(int score) public
    {
        int currentScore = Scores[msg.sender];
        
        // Replace the old score with the new one
        // if it is higher.
        if(currentScore < score)
        {
            Scores[msg.sender] = score;
        }
        
        // Now we populate the top scores array.
        if(TopScores.length < m_maxScores)
        {
            // If we didn't reach yet the maximum stored
            // scores amount, we simply add the new entry.
            Score memory newScore = Score(msg.sender, score);
            TopScores.push(newScore);
        }
        else
        {
            // If we reached the maximum stored scores amount,
            // we have to verify if the new received score is
            // higher than the lowest one in the top scores array.
            int lowestScore = TopScores[0].score;
            uint lowestScoreIndex = 0;
            
            // We search for the lowest stored score.
            for(uint i = 1; i < TopScores.length; i++)
            {
                Score memory current = TopScores[i];
                if(lowestScore > current.score)
                {
                    lowestScore = current.score;
                    lowestScoreIndex = i;
                }
            }
            
            // Now we can check our new pushed score against
            // the lowest one.
            if(lowestScore < score)
            {
                Score memory newScoreToReplace = Score(msg.sender, score);
                TopScores[lowestScoreIndex] = newScoreToReplace;
            }
        }
    }
    
    /// <summary>
    /// Get the amount of top scores.
    /// </summary>
    function GetTopScoresCount() view public returns (uint)
    {
        return TopScores.length;
    }
    // SECURE [

    function SetScoreSecure() 
        public
        onlyOwner
    {
        // todo: review requirements
    }

    // SECURE ]

    // PAYOUT LOGIC [

    // CONFIGURE PAYOUTS [

    address public hercContract;
    address public payoutBoss;
    uint[m_maxScores] public winnerReward;

    function SetHERCTokenAddress(address hercContract_)
        public
        onlyOwner
    {
        hercContract = hercContract_;
    }

    function SetPayoutAddress(address boss)
        public
        onlyOwner
    {
        payoutBoss = boss;
    }

    function SetWinnerReward(uint rank, uint reward)
        public
        onlyOwner
    {
        winnerReward[rank] = reward;
    }

    // CONFIGURE PAYOUTS ]
    // SEASON DATE [

    uint public startDate;
    uint public releaseDate;
    uint public seasonInterval;

    function SetNextSeasonReleaseDate(uint startDate_, uint releaseDate_)
        public
        onlyOwner
    {
        startDate = startDate_;
        releaseDate = releaseDate_;
    }

    function SetSeasonInterval(uint interval)
        public
        onlyOwner
    {
        seasonInterval = interval;
    }

    function IsSeasonOver()
        public
        returns(bool)
    {
        return (now >= releaseDate);
    }

    // SEASON DATE ]
    // SEASON PAYOUT [

    function PayoutToWinners()
        public
        onlyOwner
    {
        require (IsSeasonOver(), "Season in progress");

        // update season
        SetNextSeasonReleaseDate(releaseDate, releaseDate + seasonInterval);

        // move scores to memory for sort and progress
        uint count = GetTopScoresCount();

        Score[] memory scores = new Score[](count);

        uint i;
        for (i = 0; i < count; i++) {
            Score memory score = TopScores[i];
            //scores.push(score);
            scores[i] = score;
        }
        
        sortScores(scores);

        // clean up scores for prevet double spent
        WipeScores();

        for (i = 0; i < count; i++) {
            payoutScore(scores[i].player, i);
        }
    }

    event WinnerPayout(address player, uint rank, uint reward);

    function payoutScore(address player, uint rank)
        internal
        onlyOwner
    {
        uint reward = winnerReward[rank];

        HERCToken(hercContract).approve(payoutBoss, reward);

        HERCToken(hercContract).transferFrom(payoutBoss, player, reward);

        emit WinnerPayout(player, rank, reward);
    }

    function WipeScores()
        public
        onlyOwner
    {
        TopScores.length = 0;
    }

    // SEASON PAYOUT ]
    // UTILS [

    function sortScores(Score[] memory scores)
        internal
    {
        uint l = scores.length;
        for(uint i = 0; i < l; i++) {
            for(uint j = i+1; j < l ;j++) {
                if(scores[i].score > scores[j].score) {
                    Score memory temp = scores[i];
                    scores[i] = scores[j];
                    scores[j] = temp;
                }
            }
        }
    }

    // UTILS ]
    // PAYOUT LOGIC ]
}
