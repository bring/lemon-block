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

    function sellTicket(string memory _eventName, int _price, string memory _owner) public {
        int newId = count++;
        tickets[newId] = Ticket(newId, _eventName, _price, _owner);
    }

    function getLastTicket() public view returns (Ticket) {
        return tickets[count];
    }

    function buyTicket(int id, string memory newOwner) public {
        //TODO
    }
}