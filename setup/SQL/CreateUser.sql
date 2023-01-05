DECLARE @Username VARCHAR(80);
DECLARE @Realname VARCHAR(80);
DECLARE @Password VARCHAR(80);

-- SET THESE!!
SET @Username='';
SET @Realname='';
SET @Password='';

OPEN SYMMETRIC KEY WatchListKey DECRYPTION BY CERTIFICATE WatchListCert;

IF @Username <> '' AND @Realname <> '' AND @Password
     INSERT INTO USERS (Username,RealName,Password) VALUES(ENCRYPTBYKEY(KEY_GUID('WatchListKey'),@Username),ENCRYPTBYKEY(KEY_GUID('WatchListKey'),@Realname),ENCRYPTBYKEY(KEY_GUID('WatchListKey'),@Password))
ELSE
     SELECT 'All variables above are mandatory!'
CLOSE SYMMETRIC KEY WatchListKey