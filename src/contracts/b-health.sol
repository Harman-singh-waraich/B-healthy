pragma solidity^0.5.16;
pragma experimental ABIEncoderV2;

contract Health{

  string public name = "Health contract";
  mapping(address => address[]) UserAuthorisations;
  mapping(address => string[])  UserReports; // maintain reports belonging to a user
  struct File {
    string fileHash;
    address User;
    address [] Auths;

  }
  mapping(string => File) Files;
  event AuthAdded(
    string _fileHash,
    address _auth
    );


  function getUserReports(address _address) public view returns(string [] memory){
    return UserReports[_address];
  }

  function getAuthsForReport(string memory _fileHash) public view returns(address [] memory ){
    return Files[_fileHash].Auths;
  }

  function GetDetailedReport(string memory _fileHash) public returns(File memory){
    return Files[_fileHash];
  }
  function addAuth(string memory _fileHash ,address _auth ) public {
    File storage _file = Files[_fileHash];
    require(_file.User == msg.sender, "Only user can add Authorisations!");

    _file.Auths.push(_auth);
    emit AuthAdded(_fileHash,_auth); //emit an event when new authorisation is given
  }

  function SaveReport(string memory _fileHash) public returns(bool){
    UserReports[msg.sender].push(_fileHash);
    File memory _file;
    _file.fileHash = _fileHash;
    _file.User = msg.sender;
    Files[_fileHash] = _file;
    return true;
  }
}
