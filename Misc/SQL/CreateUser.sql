DECLARE @Username VARCHAR(80);
DECLARE @Realname VARCHAR(80);
DECLARE @Password VARCHAR(80);

-- SET THESE!! Do not use this script if you are setting up WatchList for the first time. Go to http://localhost:8080/Setup to set up WatchList
SET @Username='';
SET @Realname='';
SET @Password='';
SET @IsAdmin='0'; -- Set this to 1 if you want to create an admin account

OPEN SYMMETRIC KEY WatchListKey DECRYPTION BY CERTIFICATE WatchListCert;

IF @Username <> '' AND @Realname <> '' AND @Password <> '' AND (@IsAdmin = '0' || @IsAdmin ='1')
     INSERT INTO USERS (Username,RealName,Password,Admin,Enabled) VALUES(ENCRYPTBYKEY(KEY_GUID(za'WatchListKey'),@Username),ENCRYPTBYKEY(KEY_GUID('WatchListKey'),@Realname),ENCRYPTBYKEY(KEY_GUID('WatchListKey'),@Password),ENCRYPTBYKEY(KEY_GUID('WatchListKey'),@Admin),1)
ELSE
     SELECT 'All variables above are mandatory!'
CLOSE SYMMETRIC KEY WatchListKey
