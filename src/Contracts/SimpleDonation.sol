pragma solidity ^0.5.12;
contract SimpleDonation {

    int donation;
    string donator;

    event NewDonation(int donation, string donator);

    function donate(int _value, string memory _donator) public {
        donation = _value;
        donator = _donator;
        emit NewDonation(_value, _donator);
    }

    function getDonation()  public view returns (int) {
        return donation;
    }
}