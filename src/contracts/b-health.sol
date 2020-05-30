pragma solidity^0.5.16;
pragma experimental ABIEncoderV2;
contract Health{
  string public name = "Health contract";
  mapping(address => address[]) public UserAuthorisations;
  mapping(address => string[])  public UserReports;
  function getUserReports() public view returns(string [] memory){
    return UserReports[msg.sender];
  }
  function SaveReport(string memory _fileHash) public returns(bool){
    UserReports[msg.sender].push(_fileHash);
    return true;
  }
}
