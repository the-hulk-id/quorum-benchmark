pragma solidity ^0.4.17;

contract Benchmark {
  mapping (uint => string) _strings;

  event FinishWrite(  
    uint256 timestamp,
    string data
  );

  function writeData(string data, uint shaCount) public {
    for (uint i = 0; i < shaCount; i++) {
      sha256(data);
    }
    uint timestamp = now;
    _strings[timestamp] = data;
    FinishWrite(timestamp, data);
  }
}