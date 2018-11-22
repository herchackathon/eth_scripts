pragma solidity 0.4.25;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";


/**
 * @dev This contract manages the puzzles generation and hashes comparing
 */
contract PuzzleManager is Ownable {
    // Represents a generated puzzle.
    struct Puzzle {
        // The unique identifier for this puzzle.
        uint256 id;
        // The owner who generated this puzzle.
        address owner;
        // The original metrics associated to this puzzle.
        string originalMetrics;
        // The original hashed metrics associated to this puzzle.
        bytes32 originalHash;
        // The map of stored hashed metrics associated to this puzzle.
        mapping(address => bytes32) hashes;
        // Secure metrics
        bool secure;
        // Created by owner.
        // todo: remove that flag if not required by 3rd party puzzle generation. possible collisions
        bool createdByOwner;
    }

    // Internal generated puzzles.
    mapping (uint256 => Puzzle) private puzzles;

    // The next available id.
    uint256 private currentId = 0;

    mapping (address => bool) private validators;

    // banlist
    mapping (address => bool) private banList;

    // Events
    event PuzzleCreated(uint256 puzzleId, string uniqueId);

    /**
     * @dev Creates a new secure puzzle with given metrics
     * @param addr The owner of the puzzle
     * @param plainTextMetrics Metrics to push (string)
     * @param metricsHash The hash associated to the metrics
     * @param checkOwner If true, check if the sender is the owner of the contract
     * @param uniqueId Unique id
     * @return The ID of the new puzzle
     */
    function createSecurePuzzle(
        address addr,
        string plainTextMetrics,
        bytes32 metricsHash,
        bool checkOwner,
        string uniqueId
    ) external returns (uint256) {
        require(banList[msg.sender] == false, "Player is banned");

        if (checkOwner) {
            require(msg.sender == owner(), "Owner requirement failed");
        }

        // We create the secure puzzle
        puzzles[currentId] = Puzzle({
            id: currentId,
            owner: addr,
            originalMetrics: plainTextMetrics,
            originalHash: metricsHash,
            secure: true,
            createdByOwner: checkOwner
        });

        // Increment the current id for the next puzzle.
        currentId += 1;

        emit PuzzleCreated(currentId - 1, uniqueId);

        return currentId - 1;
    }

    /**
     * @dev Pushes secure metrics for the given puzzle
     * @param puzzleId The ID of a specific puzzle
     * @param metricsHash The hash associated to the metrics
     */
    function pushSecureMetrics(uint256 puzzleId, bytes32 metricsHash) external {
        require(banList[msg.sender] == false, "Player is banned");

        require(puzzles[puzzleId].secure, "Puzzle is not secure");

        puzzles[puzzleId].hashes[msg.sender] = metricsHash;
    }

    /**
     * @dev Creates a new puzzle with given metrics
     * @param metrics The metrics
     * @param uniqueId A unique ID
     * @return The ID of the new puzzle
     */
    function createPuzzle(string metrics, string uniqueId) external returns (uint256) {
        require(banList[msg.sender] == false, "Player is banned");

        // We create the new puzzle
        puzzles[currentId] = Puzzle({
            id: currentId,
            owner: msg.sender,
            originalMetrics: metrics,
            originalHash: keccak256(bytes(metrics)),
            secure: false,
            createdByOwner: false
        });

        // Increment the current id for the next puzzle.
        currentId += 1;

        emit PuzzleCreated(currentId - 1, uniqueId);

        return currentId - 1;
    }

    /**
     * @dev Pushes metrics for the given puzzle
     * @param puzzleId The ID of a specific puzzle
     * @param metrics String
     * @return Bool
     */
    function pushMetrics(uint256 puzzleId, string metrics) external returns (bool) {
        require(banList[msg.sender] == false, "Player is banned");

        puzzles[puzzleId].hashes[msg.sender] = keccak256(bytes(metrics));

        return true;
    }

    /**
     * @dev Bans an address
     * @param user The address to ban
     */
    function ban(address user) external onlyOwner() {
        banList[user] = true;
    }

    /**
     * @dev Unbans an address
     * @param user The address to unban
     */
    function unban(address user) external onlyOwner() {
        banList[user] = false;
    }

    /**
     * @dev Compares the metrics associated to this address to the
     * original metrics, for the given puzzle id.
     * @param puzzleId The ID of a specific puzzle
     * @param byOwner bool
     * @return Bool
     */
    function compareSecureMetrics(uint256 puzzleId, bool byOwner) external view returns (bool) {
        require(puzzles[puzzleId].secure, "Puzzle is not secure");

        require(puzzles[puzzleId].createdByOwner == byOwner, "Puzzle invalid owner");

        if (puzzles[puzzleId].originalHash == puzzles[puzzleId].hashes[msg.sender]) {
            return true;
        }

        return false;
    }

    /**
     * @dev Compares the metrics associated to this address to the
     * original metrics, for the given puzzle id.
     * @param puzzleId The ID of a specific puzzle
     * @return bool
     */
    function compareMetrics(uint256 puzzleId) external view returns (bool) {
        if (puzzles[puzzleId].originalHash == puzzles[puzzleId].hashes[msg.sender]) {
            return true;
        }

        return false;
    }

    /**
     * @dev Returns the original metrics associated to a given puzzle id
     * @param puzzleId The ID of a specific puzzle
     * @return The original metrics of the specific puzzle
     */
    function getPuzzleOriginalMetrics(uint256 puzzleId) external view returns (string) {
        return puzzles[puzzleId].originalMetrics;
    }

    /**
     * @dev Returns the hashed metrics associated to a given puzzle id
     * @param puzzleId The ID of a specific puzzle
     * @return The metrics
     */
    function getPuzzleMetrics(uint256 puzzleId) external view returns (bytes) {
        bytes32 original = puzzles[puzzleId].originalHash;
        bytes32 current;

        if (msg.sender == puzzles[puzzleId].owner) {
            current = puzzles[puzzleId].originalHash;
        } else {
            current = puzzles[puzzleId].hashes[msg.sender];
        }

        bytes memory result = new bytes(64);

        uint256 index1 = 0;
        uint256 index2 = 32;

        for (uint256 i = 0; i < 32; i += 1) {
            result[index1] = original[i];
            result[index2] = current[i];
            index1 += 1;
            index2 += 1;
        }

        return result;
    }
}
