pragma solidity ^0.4.21;

import "truffle/Assert.sol";
//import "truffle/DeployedAddesses.sol";
import "../contracts/PuzzleManager.sol";

contract TestPuzzleManager
{
    function testCreatePuzzleAndRetrieveOriginalMetrics() public
    {
        PuzzleManager manager = new PuzzleManager();

        string memory originalMetrics = "test metrics";
        uint id = AddPuzzle(manager, originalMetrics);

        string memory puzzleMetrics = manager.GetPuzzleOriginalMetrics(id);

        Assert.equal(puzzleMetrics, originalMetrics, "Metrics should be equal.");
    }

    function testPushMetricsAndCompare() public
    {
        PuzzleManager manager = new PuzzleManager();

        string memory originalMetrics = "test metrics";
        uint id = AddPuzzle(manager, originalMetrics);

        manager.PushMetrics(id, "test metrics");

        Assert.equal(manager.CompareMetrics(id), true, "ComparedMetrics should return true.");
    }

    function AddPuzzle(PuzzleManager manager, string originalMetrics) private returns(uint)
    {
        return manager.CreatePuzzle(originalMetrics);
    }
}