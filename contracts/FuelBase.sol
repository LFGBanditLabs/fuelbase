// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title FuelBase
 * @dev Smart contract for managing fuel delivery orders and payments on Base network
 */
contract FuelBase {
    // Structs
    struct Order {
        uint256 orderId;
        address customer;
        string deliveryLocation;
        uint256 fuelAmount;
        uint256 totalPrice;
        OrderStatus status;
        uint256 timestamp;
    }

    enum OrderStatus {
        Pending,
        Confirmed,
        InTransit,
        Delivered,
        Cancelled
    }

    // State variables
    address public owner;
    uint256 private orderCounter;
    uint256 public pricePerLiter;
    mapping(uint256 => Order) public orders;
    mapping(address => uint256[]) public customerOrders;

    // Events
    event OrderCreated(
        uint256 indexed orderId,
        address indexed customer,
        uint256 amount
    );
    event OrderStatusUpdated(uint256 indexed orderId, OrderStatus status);
    event PriceUpdated(uint256 newPrice);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier validOrder(uint256 _orderId) {
        require(_orderId <= orderCounter && _orderId > 0, "Invalid order ID");
        _;
    }

    // Constructor
    constructor(uint256 _initialPricePerLiter) {
        owner = msg.sender;
        pricePerLiter = _initialPricePerLiter;
        orderCounter = 0;
    }

    // Functions
    function createOrder(
        string memory _deliveryLocation,
        uint256 _fuelAmount
    ) external payable {
        uint256 totalPrice = _fuelAmount * pricePerLiter;
        require(msg.value >= totalPrice, "Insufficient payment");

        orderCounter++;

        Order memory newOrder = Order({
            orderId: orderCounter,
            customer: msg.sender,
            deliveryLocation: _deliveryLocation,
            fuelAmount: _fuelAmount,
            totalPrice: totalPrice,
            status: OrderStatus.Pending,
            timestamp: block.timestamp
        });

        orders[orderCounter] = newOrder;
        customerOrders[msg.sender].push(orderCounter);

        emit OrderCreated(orderCounter, msg.sender, _fuelAmount);
    }

    function updateOrderStatus(
        uint256 _orderId,
        OrderStatus _status
    ) external onlyOwner validOrder(_orderId) {
        require(
            _status != OrderStatus.Pending,
            "Cannot set status back to pending"
        );
        orders[_orderId].status = _status;
        emit OrderStatusUpdated(_orderId, _status);
    }

    function updateFuelPrice(uint256 _newPrice) external onlyOwner {
        pricePerLiter = _newPrice;
        emit PriceUpdated(_newPrice);
    }

    function getOrder(
        uint256 _orderId
    ) external view validOrder(_orderId) returns (Order memory) {
        return orders[_orderId];
    }

    function getCustomerOrders(
        address _customer
    ) external view returns (uint256[] memory) {
        return customerOrders[_customer];
    }

    function withdrawFunds() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
}
