pragma solidity 0.4.25;

import "./openzeppelin-solidity/contracts/ownership/Ownable.sol";


// Manages the puzzles generation and hashes comparing.
contract PuzzleManager is Ownable {
    mapping (address => bool) private validators;

    // Represents a generated puzzle.
    struct Puzzle {
        // The unique identifier for this puzzle.
        uint256 id;
        // The owner who generated this puzzle.
        address puzzleOwner;
        // The original metrics associated to this puzzle.
        string originalMetrics;
        // The original hashed metrics associated to this puzzle.
        bytes32 originalHash;
        // The map of stored hashed metrics associated to this puzzle.
        mapping (address => bytes32) hashes;
    }

    // Internal generated puzzles.
    mapping (uint256 => Puzzle) private puzzles;

    // The next available id.
    uint256 private currentId = 0;

    /**
     * @dev Creates a new puzzle with given metrics
     * @param metrics The metrics related to the puzzle
     * @return The id of the new puzzle
     */
    function createPuzzle(string metrics) external onlyOwner() returns (uint256) {
        // Increment the current id for the next puzzle.
        currentId += 1;

        // Store the new generated puzzle.
        puzzles[puzzle.Id] = Puzzle({
            id: currentId,
            puzzleOwner: msg.sender,
            originalMetrics: metrics,
            originalHash: keccak256(bytes(metrics))
        });

        return currentId;
    }

    /// <summary>
    ///
    /// </summary>
    /**
     * @dev Pushes metrics for the given puzzle
     * @param puzzleId The id of a specific puzzle
     * @param metrics The metrics to push
     */
    function pushMetrics(uint256 puzzleId, string metrics) external onlyOwner() {
        puzzles[puzzleId].hashes[msg.sender] = keccak256(bytes(metrics));
    }

    /**
     * @dev Compares the metrics associated to this address to the original metrics, for the given puzzle id
     * @param puzzleId The id of a specific puzzle
     * @return True if the metrics are identical
     */
    function compareMetrics(uint256 puzzleId) public view returns (bool) {
        if (puzzles[puzzleId].originalHash == puzzles[puzzleId].hashes[msg.sender]) {
            return true;
        }

        return false;
    }

    /// <summary>
    /// Returns the original metrics associated to a given puzzle id.
    /// </summary>
    function getPuzzleOriginalMetrics(uint256 puzzleId) public view returns (string)
    {
        return puzzles[puzzleId].originalMetrics;
    }

    /// <summary>
    /// Returns the hashed metrics associated to a given puzzle id.
    /// </summary>
    function getPuzzleMetrics(uint256 puzzleId) public view returns (bytes) {
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
            index1 = index1 + 1;
            index2 = index2 + 1;
        }

        return result;
    }

    /// <summary>
    /// Accept puzzle
    /// </summary>
    function acceptPuzzle() public onlyOwner() {

    }
}
