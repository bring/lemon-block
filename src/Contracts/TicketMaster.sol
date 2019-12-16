pragma solidity ^0.5.12;

contract TicketMaster {

    enum State {ForSale, Sold}

    struct Ticket {
        int id;
        string eventName;
        int price;
        string owner; //TODO: Change type to address later (address of private account)
        State state;
    }

    int count = 0;
    mapping(int => Ticket) tickets;

    event NewTicket(int id, string eventName, int price, string owner);
    event TicketSold(int id, string eventName, int price, string owner);

    constructor() public {
        sellTicket("Konsert 1", 100, "Ole");
        sellTicket("Konsert 2", 1000, "Per");
    }

    function sellTicket(string memory _eventName, int _price, string memory _owner) public {
        int newId = count++;
        tickets[newId] = Ticket(newId, _eventName, _price, _owner, State.ForSale);
        emit NewTicket(newId, _eventName, _price, _owner);
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
        require(tickets[id].state == State.ForSale);
        tickets[id].state = State.Sold;
        tickets[id].owner = newOwner;
        emit TicketSold(id, tickets[id].eventName, tickets[id].price, tickets[id].owner);
    }
}