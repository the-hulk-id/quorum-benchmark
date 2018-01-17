pragma solidity ^0.4.10;

contract WriteRead {

    mapping (uint => string) _strings;
    string strZero = "0";

    event FinishWrite(  
        uint256 _stringID,
        string data
    );

    function writeNothing(uint _stringID, string data) {
    }

    function writeString(uint _stringID, string data) {
        _strings[_stringID] = data;
        FinishWrite(_stringID, data);
    }

    function readNothing(uint _stringID) returns(string) {
        return "Nothing";
    }

    function readString(uint _stringID) constant returns (string stringData) {
        stringData = _strings[_stringID];
    }

    function readZeroString(uint _size) constant returns (string stringData) {

        bytes memory zero = bytes(strZero);
        bytes memory result = new bytes(_size);

        for (uint i=0;i<_size;i++) {
            result[i] = zero[0];
        }

        return string(result);
    }

}