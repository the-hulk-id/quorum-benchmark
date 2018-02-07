pragma solidity ^0.4.17;

contract Benchmark {
  mapping (uint => string) _strings;

  event FinishWrite(  
    uint256 sequence,
    string data,
    bytes32 sha1,
    bytes32 sha2,
    bytes32 sha3
  );

  function writeData(uint sequence, string data) public {
    bytes memory rawData = bytes(data);
    bytes memory bnewData = new bytes(rawData.length + 1);
    uint k = 0;
    for (uint i = 0; i < rawData.length; i++) {
      bnewData[k++] = rawData[i];
    }
    bnewData[k] = "1";
    bytes32 sha1 = sha256(string(bnewData));
    bnewData[k] = "2";
    bytes32 sha2 = sha256(string(bnewData));
    bnewData[k] = "3";
    bytes32 sha3 = sha256(string(bnewData));
    _strings[sequence] = data;
    FinishWrite(sequence, data, sha1, sha2, sha3);
  }
}