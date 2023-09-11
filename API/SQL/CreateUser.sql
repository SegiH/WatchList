DECLARE @Username VARCHAR(80);
DECLARE @Realname VARCHAR(80);
DECLARE @Password VARCHAR(80);
DECLARE @BackendURL VARCHAR(80);

-- SET THESE!!
SET @Username='';
SET @Realname='';
SET @Password='';
SET @BackendURL='';

OPEN SYMMETRIC KEY WatchListKey DECRYPTION BY CERTIFICATE WatchListCert;

IF @Username <> '' AND @Realname <> '' AND @Password <> '' AND @BackendURL <> ''
     INSERT INTO USERS (Username,RealName,Password,BackendURL) VALUES(ENCRYPTBYKEY(KEY_GUID('WatchListKey'),@Username),ENCRYPTBYKEY(KEY_GUID('WatchListKey'),@Realname),ENCRYPTBYKEY(KEY_GUID('WatchListKey'),@Password),ENCRYPTBYKEY(KEY_GUID('WatchListKey'),@BackendURL))
ELSE
     SELECT 'All variables above are mandatory!'
CLOSE SYMMETRIC KEY WatchListKey