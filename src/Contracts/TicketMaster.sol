pragma solidity ^0.5.14;

contract TicketMaster {

    enum State {ForSale, Sold}

    struct Ticket {
        int id;
        string eventName;
        int price;
        string owner; //TODO: Change type to address later (address of private account)
        address payable ownerAddress;
        State state;
    }

    int count = 0;
    mapping(int => Ticket) tickets;

    event NewTicket(int id, string eventName, int price, string owner, address ownerAddress);
    event TicketSold(int id, string eventName, int price, string owner, address ownerAddress);

    function sellTicket(string memory _eventName, int _price, string memory _owner) public {
        int newId = count++;
        tickets[newId] = Ticket(newId, _eventName, _price, _owner, msg.sender, State.ForSale);
        emit NewTicket(newId, _eventName, _price, _owner, msg.sender);
    }

    function getTicket(int id) public view returns (int, string memory, int, string memory, State) {
        Ticket memory ticket = tickets[id];
        return (ticket.id, ticket.eventName, ticket.price, ticket.owner, ticket.state);
    }

    function getTicketCount() public view returns (int) {
        return count;
    }

    function buyTicket(int id, string memory newOwner) public {
        // TODO validate transaction -> sufficient funds etc..
        //require(tickets[id].state == State.ForSale);
        tickets[id].ownerAddress.transfer(uint256(tickets[id].price));

        tickets[id].state = State.Sold;
        tickets[id].owner = newOwner;
        tickets[id].ownerAddress = msg.sender;
        emit TicketSold(id, tickets[id].eventName, tickets[id].price, tickets[id].owner, msg.sender);
    }
}