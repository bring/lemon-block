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
        /*
                Ticket ticket = tickets[count++];
                ticket.eventName = _eventName;
                ticket.price = _price;
                ticket.owner = _owner;
                emit NewTicket(ticket);
        */
    }

    function getTickets() public view returns (int) {
        return 1;
        //return tickets[count];
    }

    function buyTicket(int id, string memory newOwner) public {
        //TODO
    }
}