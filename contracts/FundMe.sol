// SPDX-License-Identifier: MIT
// 1. Pragma
pragma solidity ^0.8.7;
// 2. Imports
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./PriceConverter.sol";

// 3. Interfaces, Libraries, Contracts
error FundMe__NotOwner();

/**@title A sample Funding Contract
 * @author Patrick Collins
 * @notice This contract is for creating a sample funding contract
 * @dev This implements price feeds as our library
 */
contract FundMe {
    // Type Declarations
    using PriceConverter for uint256;

    // State variables
    uint256 public constant MINIMUM_USD = 50 * 10**18;
    address private immutable i_owner;
    address[] private s_funders;
    address[] private s_usdtFunders;
    mapping(address => uint256) private s_addressToAmountFunded;
    mapping(address => uint256) private s_addressUsdtFunded;//s_usdtFunds;
    AggregatorV3Interface private s_priceFeed;
    IERC20 public usdtToken; // the ERC20 token contract for usdt

    // Events (we have none!)

    // Modifiers
    modifier onlyOwner() {
        // require(msg.sender == i_owner);
        if (msg.sender != i_owner) revert FundMe__NotOwner();
        _;
    }

    // Functions Order:
    //// constructor
    //// receive
    //// fallback
    //// external
    //// public
    //// internal
    //// private
    //// view / pure

    constructor(address priceFeed, address _usdtTokenAddress) {
        s_priceFeed = AggregatorV3Interface(priceFeed);
        i_owner = msg.sender;
        usdtToken = IERC20(_usdtTokenAddress);
    
    }

    event funded(address indexed from, uint256 time, uint256 value);
    event withdrawLog(address indexed from, uint256 time);

    /// @notice Funds our contract based on the ETH/USD price
    function fund() public payable {
        require(
            msg.value.getConversionRate(s_priceFeed) >= MINIMUM_USD,
            "You need to spend more ETH!"
        );
        // require(PriceConverter.getConversionRate(msg.value) >= MINIMUM_USD, "You need to spend more ETH!");
        s_addressToAmountFunded[msg.sender] += msg.value;
        s_funders.push(msg.sender);
        emit funded(msg.sender, block.timestamp, msg.value);
    }

    function fundUsdt(uint256 usdtAmount) public payable{
        require(
            usdtAmount >= MINIMUM_USD,
            "You need to spend more USDT"
        );

        // Transfer USDT from the sender to the contract
        require(
            usdtToken.transferFrom(msg.sender, address(this), usdtAmount),
            "USDT transfer failed"
        );

        s_addressUsdtFunded[msg.sender] += usdtAmount;
        s_usdtFunders.push(msg.sender);
        emit funded(msg.sender, block.timestamp, msg.value);
    }

    function withdraw() public onlyOwner {
        for (
            uint256 funderIndex = 0;
            funderIndex < s_funders.length;
            funderIndex++
        ) {
            address funder = s_funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }
        s_funders = new address[](0);
        // Transfer vs call vs Send
        // payable(msg.sender).transfer(address(this).balance);
        (bool success, ) = i_owner.call{value: address(this).balance}("");
        require(success);
        emit withdrawLog(msg.sender, block.timestamp);
    }

    function withdrawUsdt() public onlyOwner{
        for (
            uint256 funderIndex = 0;
            funderIndex < s_usdtFunders.length;
            funderIndex++
        ) {
            address funder = s_usdtFunders[funderIndex];
            s_addressUsdtFunded[funder] = 0;
        }
        s_usdtFunders = new address[](0);
        (bool success, ) = i_owner.call{value: address(this).balance}("");
        require(success);
        emit withdrawLog(msg.sender, block.timestamp);
    }

    function cheaperWithdraw() public onlyOwner {
        address[] memory funders = s_funders;
        // mappings can't be in memory, sorry!
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }
        s_funders = new address[](0);
        // payable(msg.sender).transfer(address(this).balance);
        (bool success, ) = i_owner.call{value: address(this).balance}("");
        require(success);
        emit withdrawLog(msg.sender, block.timestamp);
    }

    function cheaperUsdtWithdraw() public onlyOwner {
        address[] memory usdtF = s_usdtFunders;
         for (
            uint256 funderIndex = 0;
            funderIndex < usdtF.length;
            funderIndex++
        ) {
            address funder = usdtF[funderIndex];
            s_addressUsdtFunded[funder] = 0;
        }
        s_usdtFunders = new address[](0);
        (bool success, ) = i_owner.call{value: address(this).balance}("");
        require(success);
        emit withdrawLog(msg.sender, block.timestamp);
    }

    /** @notice Gets the amount that an address has funded
     *  @param fundingAddress the address of the funder
     *  @return the amount funded
     */
    function getAddressToAmountFunded(address fundingAddress)
        public
        view
        returns (uint256)
    {
        return s_addressToAmountFunded[fundingAddress];
    }

    function getAddressUsdtFunded(address fundingUsdtAddress) public view returns (uint256) {
        return s_addressUsdtFunded[fundingUsdtAddress];
    }

    function getVersion() public view returns (uint256) {
        return s_priceFeed.version();
    }

    function getFunder(uint256 index) public view returns (address) {
        return s_funders[index];
    }

    function getUsdtFunders(uint256 index) public view returns (address) {
        return s_usdtFunders[index];
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }
}
