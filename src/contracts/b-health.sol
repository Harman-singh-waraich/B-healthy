pragma solidity^0.5.16;
pragma experimental ABIEncoderV2;

contract Health{
  address owner;
  constructor() public {
    owner = msg.sender;
  }
  string public name = "Health contract";
  address [] AuthorisedUsers;
  mapping(address => string[])  UserReports; // maintain reports belonging to a user with address as key
  mapping(string => string[])  UserReportsWithNames; // maintain reports belonging to a user with username as key
  string [] UserNames;
  struct File {
    string fileHash;
    address User;
    string UserName;
    uint dated;

  }
  mapping(string => File) Files;
  event AuthAdded(
    address _auth
    );
  modifier OnlyOwner(){
    require(msg.sender == owner,"you are not authorised to perform the action!");
    _;
  }

  function getAuthorisedUsers() public returns(address [] memory){
    return AuthorisedUsers;
  }
  function getUserReports(address _address) public view returns(string [] memory){
    return UserReports[_address];
  }

  function GetDetailedReport(string memory _fileHash) public returns(File memory){
    return Files[_fileHash];
  }
  function addAuth(address _auth ) public OnlyOwner{
    AuthorisedUsers.push(_auth);
    emit AuthAdded(_auth); //emit an event when new authorisation is given
  }

  function SaveReport(string memory _fileHash,string memory _username) public returns(bool){
    UserReports[msg.sender].push(_fileHash);
    UserReportsWithNames[_username].push(_fileHash);
    UserNames.push(_username);
    File memory _file;
    _file.fileHash = _fileHash;
    _file.User = msg.sender;
    _file.UserName = _username;
    _file.dated = now;
    Files[_fileHash] = _file;
    return true;
  }
}
