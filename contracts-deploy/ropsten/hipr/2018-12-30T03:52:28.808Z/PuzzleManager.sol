pragma solidity 0.4.24;

import "./base/Ownable.sol";

// Manages the puzzles generation and hashes comparing.
contract PuzzleManager is Ownable
{
    mapping(address => bool) validators;

    // Represents a generated puzzle.
    struct Puzzle
    {
        // The unique identifier for this puzzle.
        uint Id;
        // The owner who generated this puzzle.
        address Owner;
        // The original metrics associated to this puzzle.
        string OriginalMetrics;
        // The original hashed metrics associated to this puzzle.
        bytes32 OriginalHash;
        // The map of stored hashed metrics associated to this puzzle.
        mapping(address => bytes32) Hashes;
        // Secure metrics
        bool secure;
        // Created by owner. 
        // todo: remove that flag if not required by 3rd party puzzle generation. possible collisions 
        bool createdByOwner;
    }

    // Internal generated puzzles.
    mapping(uint => Puzzle) m_puzzles;

    // The next available id.
    uint m_currentId = 0;

    // banlist

    mapping(address => bool) banList;

    // Events
    event PuzzleCreated(uint puzzleId, string uniqueId);

    // X.1 SECURE PUZZLE [

    /// <summary>
    /// Creates a new secure puzzle with given metrics.
    /// </summary>
    
    function CreateSecurePuzzle(address addr, string plainTextMetrics, bytes32 metricsHash, bool checkOwner, string uniqueId) public returns(uint)
    {
        if (banList[addr]) {
            revert("cheater is banned"); 
        }

        if (checkOwner)
            require(msg.sender == owner, "check owner fail");
            
        // Instantiate the new puzzle in memory.
        Puzzle memory puzzle = Puzzle(m_currentId, addr, plainTextMetrics, metricsHash, true, checkOwner);

        // Increment the current id for the next puzzle.
        m_currentId = m_currentId + 1;

        // Store the new generated puzzle.
        m_puzzles[puzzle.Id] = puzzle;

        emit PuzzleCreated(puzzle.Id, uniqueId);

        return puzzle.Id;
    }

    /// <summary>
    /// Pushes secure metrics for the given puzzle.
    /// </summary>
    function PushSecureMetrics(uint puzzleId, bytes32 metricsHash) public returns(bool)
    {
        if (banList[msg.sender]) {
            revert("cheater is banned"); 
        }

        require(m_puzzles[puzzleId].secure, "puzzle is not secure");

        m_puzzles[puzzleId].Hashes[msg.sender] = metricsHash;

        return true;
    }

    /// <summary>
    /// Compares the metrics associated to this address to the
    /// original metrics, for the given puzzle id.
    /// </summary>
    function CompareSecureMetrics(uint puzzleId, bool byOwner) public view returns(bool)
    {
        Puzzle storage puzzle = m_puzzles[puzzleId];

        require(m_puzzles[puzzleId].secure, "puzzle is not secure");

        require(m_puzzles[puzzleId].createdByOwner == byOwner, "puzzle invalid owner");

        if (puzzle.OriginalHash == puzzle.Hashes[msg.sender])
        {
            return true;
        }
        return false;
    }

    // X.1 SECURE PUZZLE ]
    // X.2 UNSECURE PUZZLE [

    /// <summary>
    /// Creates a new puzzle with given metrics.
    /// </summary>
    
    function CreatePuzzle(string metrics, string uniqueId) public returns(uint)
    {
        if (banList[msg.sender]) {
            revert("cheater is banned"); 
        }
            
        // Instantiate the new puzzle in memory.
        Puzzle memory puzzle = Puzzle(m_currentId, msg.sender, metrics, keccak256(bytes(metrics)), false, false);

        // Increment the current id for the next puzzle.
        m_currentId = m_currentId + 1;

        // Store the new generated puzzle.
        m_puzzles[puzzle.Id] = puzzle;

        emit PuzzleCreated(puzzle.Id, uniqueId);

        return puzzle.Id;
    }

    /// <summary>
    /// Pushes metrics for the given puzzle.
    /// </summary>
    function PushMetrics(uint puzzleId, string metrics) public returns(bool)
    {
        if (banList[msg.sender]) {
            revert("cheater is banned"); 
        }

        m_puzzles[puzzleId].Hashes[msg.sender] = keccak256(bytes(metrics));

        return true;
    }

    /// <summary>
    /// Compares the metrics associated to this address to the
    /// original metrics, for the given puzzle id.
    /// </summary>
    function CompareMetrics(uint puzzleId) public view returns(bool)
    {
        Puzzle storage puzzle = m_puzzles[puzzleId];

        if (puzzle.OriginalHash == puzzle.Hashes[msg.sender])
        {
            return true;
        }
        return false;
    }

    /// <summary>
    /// Returns the original metrics associated to a given puzzle id.
    /// </summary>
    function GetPuzzleOriginalMetrics(uint puzzleId) public view returns(string)
    {
        return m_puzzles[puzzleId].OriginalMetrics;
    }

    // X.2 UNSECURE PUZZLE ]

    /// <summary>
    /// Returns the hashed metrics associated to a given puzzle id.
    /// </summary>
    function GetPuzzleMetrics(uint puzzleId) public view returns(bytes)
    {
        bytes32 original = m_puzzles[puzzleId].OriginalHash;
        bytes32 current;
        if (msg.sender == m_puzzles[puzzleId].Owner)
        {
            current = m_puzzles[puzzleId].OriginalHash;
        }
        else
        {
            current = m_puzzles[puzzleId].Hashes[msg.sender];
        }
 
        bytes memory result = new bytes(64);

        uint index1 = 0;
        uint index2 = 32;
        for (uint i = 0; i < 32; i++)
        {
            result[index1] = original[i];
            result[index2] = current[i];
            index1 = index1 + 1;
            index2 = index2 + 1;
        }

        return result;
    }

    // BAN LOGIC [
    
    /// <summary>
    /// Ban address
    /// </summary>
    function ban(address user)
        public
        onlyOwner
    {
        banList[user] = true;
    }

    /// <summary>
    /// Ban address
    /// </summary>
    function unban(address user)
        public
        onlyOwner
    {
        banList[user] = false;
    }

    // BAN LOGIC ]
}
