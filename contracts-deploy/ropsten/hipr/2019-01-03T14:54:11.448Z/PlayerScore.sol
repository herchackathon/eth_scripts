pragma solidity 0.4.24;

// File: contracts/herc/herc20.sol

//pragma solidity ^0.4.25;
pragma solidity 0.4.24;

/*
Copyright (c) 2018 Hercules SEZC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

library SafeMath {

  /**
  * @dev Multiplies two numbers, reverts on overflow.
  */
  function mul(uint256 a, uint256 b) internal pure returns (uint256) {
    // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
    // benefit is lost if 'b' is also tested.
    // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522
    if (a == 0) {
      return 0;
    }

    uint256 c = a * b;
    require(c / a == b);

    return c;
  }

  /**
  * @dev Integer division of two numbers truncating the quotient, reverts on division by zero.
  */
  function div(uint256 a, uint256 b) internal pure returns (uint256) {
    require(b > 0); // Solidity only automatically asserts when dividing by 0
    uint256 c = a / b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold

    return c;
  }

  /**
  * @dev Subtracts two numbers, reverts on overflow (i.e. if subtrahend is greater than minuend).
  */
  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    require(b <= a);
    uint256 c = a - b;

    return c;
  }

  /**
  * @dev Adds two numbers, reverts on overflow.
  */
  function add(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a + b;
    require(c >= a);

    return c;
  }

  /**
  * @dev Divides two numbers and returns the remainder (unsigned integer modulo),
  * reverts when dividing by zero.
  */
  function mod(uint256 a, uint256 b) internal pure returns (uint256) {
    require(b != 0);
    return a % b;
  }
}


interface Int20 {
  function totalSupply() external view returns (uint256);

  function balanceOf(address who) external view returns (uint256);

  function allowance(address owner, address spender)
    external view returns (uint256);

  function transfer(address to, uint256 value) external returns (bool);

  function approve(address spender, uint256 value)
    external returns (bool);

  function transferFrom(address from, address to, uint256 value)
    external returns (bool);

  event Transfer(
    address indexed from,
    address indexed to,
    uint256 value
  );

  event Approval(
    address indexed owner,
    address indexed spender,
    uint256 value
  );
}

contract Ownable {
  address private _owner;

  event OwnershipTransferred(
    address indexed previousOwner,
    address indexed newOwner
  );

  /**
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender
   * account.
   */
  constructor() internal {
    _owner = msg.sender;
    emit OwnershipTransferred(address(0), _owner);
  }

  /**
   * @return the address of the owner.
   */
  function owner() public view returns(address) {
    return _owner;
  }

  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner() {
    require(isOwner());
    _;
  }

  /**
   * @return true if `msg.sender` is the owner of the contract.
   */
  function isOwner() public view returns(bool) {
    return msg.sender == _owner;
  }

  /**
   * @dev Allows the current owner to relinquish control of the contract.
   * @notice Renouncing to ownership will leave the contract without an owner.
   * It will not be possible to call the functions with the `onlyOwner`
   * modifier anymore.
   */
  function renounceOwnership() public onlyOwner {
    emit OwnershipTransferred(_owner, address(0));
    _owner = address(0);
  }

  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param newOwner The address to transfer ownership to.
   */
  function transferOwnership(address newOwner) public onlyOwner {
    _transferOwnership(newOwner);
  }

  /**
   * @dev Transfers control of the contract to a newOwner.
   * @param newOwner The address to transfer ownership to.
   */
  function _transferOwnership(address newOwner) internal {
    require(newOwner != address(0));
    emit OwnershipTransferred(_owner, newOwner);
    _owner = newOwner;
  }
}
/**
 * @title HERC Token 
**/

contract HERCToken is Int20 , Ownable {
  using SafeMath for uint256;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    

    mapping(address => uint) balances;
    mapping(address => mapping(address => uint)) allowed;

   string public constant name = "Hercules";
  string public constant symbol = "HERC";
  uint8 public constant decimals = 18;

  uint256 public constant INITIAL_SUPPLY = 234259085 * (10 ** uint256(decimals));

  /**
   * @dev Constructor that gives msg.sender all of existing tokens.
   */
  constructor() public {
    mint(msg.sender, INITIAL_SUPPLY);
  }
    /**
     * @dev Fallback function
     */
    function() public payable { revert(); }

  mapping (address => uint256) private _balances;

  mapping (address => mapping (address => uint256)) private _allowed;

  uint256 private _totalSupply;

  /**
  * @dev Total number of tokens in existence
  */
  function totalSupply() public view returns (uint256) {
    return _totalSupply;
  }

  /**
  * @dev Gets the balance of the specified address.
  * @param owner The address to query the balance of.
  * @return An uint256 representing the amount owned by the passed address.
  */
  function balanceOf(address owner) public view returns (uint256) {
    return _balances[owner];
  }

  /**
   * @dev Function to check the amount of tokens that an owner allowed to a spender.
   * @param owner address The address which owns the funds.
   * @param spender address The address which will spend the funds.
   * @return A uint256 specifying the amount of tokens still available for the spender.
   */
  function allowance(
    address owner,
    address spender
   )
    public
    view
    returns (uint256)
  {
    return _allowed[owner][spender];
  }

  /**
  * @dev Transfer token for a specified address
  * @param to The address to transfer to.
  * @param value The amount to be transferred.
  */
  function transfer(address to, uint256 value) public returns (bool) {
    _transfer(msg.sender, to, value);
    return true;
  }

  /**
   * @dev Approve the passed address to spend the specified amount of tokens on behalf of msg.sender.
   * Beware that changing an allowance with this method brings the risk that someone may use both the old
   * and the new allowance by unfortunate transaction ordering. One possible solution to mitigate this
   * race condition is to first reduce the spender's allowance to 0 and set the desired value afterwards:
   * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
   * @param spender The address which will spend the funds.
   * @param value The amount of tokens to be spent.
   */
  function approve(address spender, uint256 value) public returns (bool) {
    require(spender != address(0));

    _allowed[msg.sender][spender] = value;
    emit Approval(msg.sender, spender, value);
    return true;
  }

  /**
   * @dev Transfer tokens from one address to another
   * @param from address The address which you want to send tokens from
   * @param to address The address which you want to transfer to
   * @param value uint256 the amount of tokens to be transferred
   */
  function transferFrom(
    address from,
    address to,
    uint256 value
  )
    public
    returns (bool)
  {
    require(value <= _allowed[from][msg.sender]);

    _allowed[from][msg.sender] = _allowed[from][msg.sender].sub(value);
    _transfer(from, to, value);
    return true;
  }

  /**
   * @dev Increase the amount of tokens that an owner allowed to a spender.
   * approve should be called when allowed_[_spender] == 0. To increment
   * allowed value is better to use this function to avoid 2 calls (and wait until
   * the first transaction is mined)
   * From MonolithDAO Token.sol
   * @param spender The address which will spend the funds.
   * @param addedValue The amount of tokens to increase the allowance by.
   */
  function increaseAllowance(
    address spender,
    uint256 addedValue
  )
    public
    returns (bool)
  {
    require(spender != address(0));

    _allowed[msg.sender][spender] = (
      _allowed[msg.sender][spender].add(addedValue));
    emit Approval(msg.sender, spender, _allowed[msg.sender][spender]);
    return true;
  }

  /**
   * @dev Decrease the amount of tokens that an owner allowed to a spender.
   * approve should be called when allowed_[_spender] == 0. To decrement
   * allowed value is better to use this function to avoid 2 calls (and wait until
   * the first transaction is mined)
   * From MonolithDAO Token.sol
   * @param spender The address which will spend the funds.
   * @param subtractedValue The amount of tokens to decrease the allowance by.
   */
  function decreaseAllowance(
    address spender,
    uint256 subtractedValue
  )
    public
    returns (bool)
  {
    require(spender != address(0));

    _allowed[msg.sender][spender] = (
      _allowed[msg.sender][spender].sub(subtractedValue));
    emit Approval(msg.sender, spender, _allowed[msg.sender][spender]);
    return true;
  }

  /**
  * @dev Transfer token for a specified addresses
  * @param from The address to transfer from.
  * @param to The address to transfer to.
  * @param value The amount to be transferred.
  */
  function _transfer(address from, address to, uint256 value) internal {
    require(value <= _balances[from]);
    require(to != address(0));

    _balances[from] = _balances[from].sub(value);
    _balances[to] = _balances[to].add(value);
    emit Transfer(from, to, value);
  }

  /**
   * @dev Internal function that mints an amount of the token and assigns it to
   * an account. This encapsulates the modification of balances such that the
   * proper events are emitted.
   * @param account The account that will receive the created tokens.
   * @param value The amount that will be created.
   */
  function mint(address account, uint256 value) onlyOwner public {
    require(account != 0);
    _totalSupply = _totalSupply.add(value);
    _balances[account] = _balances[account].add(value);
    emit Transfer(address(0), account, value);
  }

  /**
   * @dev Internal function that burns an amount of the token of a given
   * account.
   * @param account The account whose tokens will be burnt.
   * @param value The amount that will be burnt.
   */
  function burn(address account, uint256 value) onlyOwner public {
    require(account != 0);
    require(value <= _balances[account]);

    _totalSupply = _totalSupply.sub(value);
    _balances[account] = _balances[account].sub(value);
    emit Transfer(account, address(0), value);
  }

  /**
   * @dev Internal function that burns an amount of the token of a given
   * account, deducting from the sender's allowance for said account. Uses the
   * internal burn function.
   * @param account The account whose tokens will be burnt.
   * @param value The amount that will be burnt.
   */
  function _burnFrom(address account, uint256 value) internal {
    require(value <= _allowed[account][msg.sender]);


    // this function needs to emit an event with the updated approval.
    _allowed[account][msg.sender] = _allowed[account][msg.sender].sub(
      value);
    burn(account, value);
  }
}

// File: contracts/PlayerScore.sol

//pragma solidity ^0.4.25;

//import "./base/Ownable.sol";

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

    function GetTopScoresMax() view public returns (uint)
    {
        return m_maxScores;
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
    uint public seasonInterval=9;
    uint public lastWipeDate=9;

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
//        lastWipeDate = interval;
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
        //WipeScores();

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
        lastWipeDate = now;
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