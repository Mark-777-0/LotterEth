// SPDX-License-Identifier: Apache 2.0
pragma solidity >=0.8.11 <0.9.0;

contract Lottery{
    address payable public owner ; 
    address payable[] public players;
    uint public lotteryId;
    uint fee; 
    mapping (uint => address payable) public lotteryHistory;


    /// payable modifier so it can receive coins

    constructor () {
        owner= payable(msg.sender) ; ///set the deployer of the contract as the owner
        lotteryId =1 ;
        fee = 5;
        
    }

    modifier onlyOwner(){
        ///owner must be the one sending function
        require(msg.sender==owner);

        _;
    }
    modifier paysKeeper(){
        uint256 startGas = gasleft();

        _;

        uint256 gasUsed = startGas -gasleft();
        uint256 amount = block.basefee * gasUsed *11/10;
        if (address(this).balance < amount) amount = address(this).balance;
        (bool success,) = payable(msg.sender).call{value: amount}("");
        require(success, 'bad keeper');
    }



    function getBalance() public view returns (uint){
        return address(this).balance;

    }

    function getWinnerByLottery(uint lotteryNumber) public view returns(address payable){
        return lotteryHistory[lotteryNumber];
    } 

    function getPlayers() public view returns (address payable[] memory){
        ///returns players list, memory needed
        return players;

    }


    function enter() public payable {

        ///require player to pay funds
        require(msg.value >= .01 ether); 

        // Donation if more than .01 ETH sent
        if (msg.value > .01 ether) {
            owner.transfer(msg.value - .01 ether);
        }

        players.push(payable(msg.sender)); 
        ///msg.sender is the person running the enter function to enter the lottery we add them to players list
        ///must make address payable before adding it to the payable array that is "players"

    }

    function getRandomNumber() public view returns(uint){ ///just views blockchain no input
        return uint(keccak256(abi.encodePacked(owner, block.timestamp, block.difficulty, block.number))); ///owner address and current time to gen a pseudorandom number

    }


    function getFivePercent() public view returns (uint){
        return (address(this).balance *5) /100;

    }

    function pickWinner() public onlyOwner paysKeeper{


        ///randomly choose an index
        uint indexWinner = getRandomNumber() % players.length;

        uint fivePercentPot = (address(this).balance *fee) /100 ;

        ///vector attack so we increment after, track winners and ID
        lotteryHistory[lotteryId] = players[indexWinner];
        lotteryId++; 

        if(players.length > 1){
            ///5% transferred to owner for hosting the game if there are enough players
            owner.transfer(fivePercentPot);
        }
        
        ///transfer the remaining entire balance of the smart contract 
        players[indexWinner].transfer(address(this).balance);


        ///reset players array
        players = new address payable [](0);

    }

}

