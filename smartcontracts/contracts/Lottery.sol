pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Lottery is Ownable {
  address[] public players;
  LOTTERY_STATE public lotteryState;
  address public recentWinner;
  IERC20 private _token;

  enum LOTTERY_STATE {
    OPEN,
    CALCULATING_WINNER,
    CLOSED
  }

  constructor(IERC20 token) {
    lotteryState = LOTTERY_STATE.CLOSED;
    _token = token;
  }

  function enter() external {
    require(
      lotteryState == LOTTERY_STATE.OPEN,
      "Lottery must be opened in order to participate."
    );
    address from = msg.sender;
    require(_token.transferFrom(from, address(this), 10000000));
    players.push(msg.sender);
  }

  function startLoterry() public onlyOwner {
    require(
      lotteryState == LOTTERY_STATE.CLOSED,
      "Lottery must be opened in order to participate."
    );

    lotteryState = LOTTERY_STATE.OPEN;
  }

  function endLottery() public {
    require(
      lotteryState == LOTTERY_STATE.OPEN,
      "Lottery must be opened in order to be closed."
    );

    if (players.length == 0) {
      lotteryState = LOTTERY_STATE.CLOSED;
      return;
    }

    if (players.length == 1) {
      uint256 lotteryBalance = _token.balanceOf(address(this));
      _token.transfer(players[0], lotteryBalance);
      lotteryState = LOTTERY_STATE.CLOSED;
      return;
    }

    lotteryState = LOTTERY_STATE.CALCULATING_WINNER;

    uint256 winnerIndex = random() % players.length;
    recentWinner = players[winnerIndex];

    uint256 lotteryBalance = _token.balanceOf(address(this));
    _token.transfer(recentWinner, lotteryBalance);
    players = new address[](0);

    lotteryState = LOTTERY_STATE.CLOSED;
  }

  function random() private view returns (uint256) {
    // sha3 and now have been deprecated
    return
      uint256(
        keccak256(abi.encodePacked(block.difficulty, block.timestamp, players))
      );
    // convert hash to integer
    // players is an array of entrants
  }
}

// An ERC20 token is just another contract. The ERC20 standard gives you two functions that work together to help pay a contract: approve() and transferFrom().

// If the token contract is called "token" and the contract you're trying to pay is called "store", the process looks like this:

// The user calls token.approve(store, amount); This gives store permission to transfer amount of the user's tokens.
// The user calls store.buy();, which calls token.transferFrom() to perform the actual transfer.
// The buy() function might look like this:

// function buy() external {
//     require(token.transferFrom(msg.sender, this, amount));
//     // having now received <amount> tokens from the sender, deliver whatever was
//     // purchased, etc.
// }
