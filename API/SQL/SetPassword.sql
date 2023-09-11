OPEN SYMMETRIC KEY WatchListKey DECRYPTION BY CERTIFICATE WatchListCert;

-- Change @UserID to the users' ID and @Password with the plain text password
UPDATE USERS SET Password=ENCRYPTBYKEY(KEY_GUID('WatchListKey'),@Password) WHERE UserID=@UserID 
CLOSE SYMMETRIC KEY WatchListKey