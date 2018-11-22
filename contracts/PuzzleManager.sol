pragma solidity 0.4.25;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";


/**
 * @dev This contract manages the puzzles generation and hashes comparing
 */
contract PuzzleManager is Ownable {

    // Represents a generated puzzle.
    struct Puzzle {
        // The unique identifier for this puzzle.
        uint256 Id;
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
    mapping (uint => Puzzle) private m_puzzles;

    // The next available id.
    uint256 private m_currentId = 0;

    mapping (address => bool) private validators;

    // banlist
    mapping (address => bool) private banList;

    // Events
    event PuzzleCreated(uint puzzleId, string uniqueId);

    // X.1 SECURE PUZZLE [
    /**
     * @dev Creates a new secure puzzle with given metrics
     * @param addr The owner of the puzzle
     * @param plainTextMetrics Metrics to push (string)
     * @param metricsHash The hash associated to the metrics
     * @param checkOwner If true, check if the sender is the owner of the contract
     * @param uniqueId Unique id
     * @return The ID of the new puzzle
     */
    /* TODO: Add a description for the parameters */
    function CreateSecurePuzzle(
        address addr,
        string plainTextMetrics,
        bytes32 metricsHash,
        bool checkOwner,
        string uniqueId
    ) public returns (uint256) {
        require(banList[msg.sender] == false, "Player is banned");

        if (checkOwner) {
            require(msg.sender == owner(), "Owner requirement failed");
        }

        // Instantiate the new puzzle in memory.
        Puzzle memory puzzle = Puzzle(m_currentId, addr, plainTextMetrics, metricsHash, true, checkOwner);

        // Increment the current id for the next puzzle.
        m_currentId = m_currentId + 1;

        // Store the new generated puzzle.
        m_puzzles[puzzle.Id] = puzzle;

        emit PuzzleCreated(puzzle.Id, uniqueId);

        return puzzle.Id;
    }

    /**
     * @dev Pushes secure metrics for the given puzzle
     * @param puzzleId The ID of a specific puzzle
     * @param metricsHash The hash associated to the metrics
     */
    function PushSecureMetrics(uint puzzleId, bytes32 metricsHash) public {
        require(banList[msg.sender] == false, "Player is banned");

        require(m_puzzles[puzzleId].secure, "puzzle is not secure");

        m_puzzles[puzzleId].Hashes[msg.sender] = metricsHash;
    }

    /**
     * @dev Compares the metrics associated to this address to the
     * original metrics, for the given puzzle id.
     * @param puzzleId The ID of a specific puzzle
     * @param byOwner bool
     */
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
    /**
     * @dev Creates a new puzzle with given metrics
     * @param metrics The metrics
     * @param uniqueId A unique ID
     * @return The ID of the new puzzle
     */
    function CreatePuzzle(string metrics, string uniqueId) public returns(uint)
    {
        require(banList[msg.sender] == false, "Player is banned");

        // Instantiate the new puzzle in memory.
        Puzzle memory puzzle = Puzzle(m_currentId, msg.sender, metrics, keccak256(bytes(metrics)), false, false);

        // Increment the current id for the next puzzle.
        m_currentId = m_currentId + 1;

        // Store the new generated puzzle.
        m_puzzles[puzzle.Id] = puzzle;

        emit PuzzleCreated(puzzle.Id, uniqueId);

        return puzzle.Id;
    }

    /**
     * @dev Pushes metrics for the given puzzle
     * @param puzzleId The ID of a specific puzzle
     * @param metrics String
     * @return Bool
     */
    function PushMetrics(uint puzzleId, string metrics) public returns(bool)
    {
        require(banList[msg.sender] == false, "Player is banned");

        m_puzzles[puzzleId].Hashes[msg.sender] = keccak256(bytes(metrics));

        return true;
    }

    /**
     * @dev Compares the metrics associated to this address to the
     * original metrics, for the given puzzle id.
     * @param puzzleId The ID of a specific puzzle
     * @return bool
     */
    function CompareMetrics(uint puzzleId) public view returns(bool)
    {
        Puzzle storage puzzle = m_puzzles[puzzleId];

        if (puzzle.OriginalHash == puzzle.Hashes[msg.sender])
        {
            return true;
        }
        return false;
    }

    /**
     * @dev Returns the original metrics associated to a given puzzle id
     * @param puzzleId The ID of a specific puzzle
     * @return The original metrics of the specific puzzle
     */
    function GetPuzzleOriginalMetrics(uint puzzleId) public view returns(string)
    {
        return m_puzzles[puzzleId].OriginalMetrics;
    }

    // X.2 UNSECURE PUZZLE ]
    /**
     * @dev Returns the hashed metrics associated to a given puzzle id
     * @param puzzleId The ID of a specific puzzle
     * @return The metrics
     */
    function GetPuzzleMetrics(uint puzzleId) public view returns (bytes) {
        bytes32 original = m_puzzles[puzzleId].OriginalHash;
        bytes32 current;
        if (msg.sender == m_puzzles[puzzleId].Owner) {
            current = m_puzzles[puzzleId].OriginalHash;
        } else {
            current = m_puzzles[puzzleId].Hashes[msg.sender];
        }

        bytes memory result = new bytes(64);

        uint index1 = 0;
        uint index2 = 32;
        for (uint i = 0; i < 32; i++) {
            result[index1] = original[i];
            result[index2] = current[i];
            index1 = index1 + 1;
            index2 = index2 + 1;
        }

        return result;
    }

    // BAN LOGIC [
    /**
     * @dev Bans an address
     * @param user The address to ban
     */
    function ban(address user) public onlyOwner() {
        banList[user] = true;
    }

    /**
     * @dev Unbans an address
     * @param user The address to unban
     */
    function unban(address user) public onlyOwner() {
        banList[user] = false;
    }

    // BAN LOGIC ]
}
