-- Set up the SQL Database
Use WatchList
CREATE MASTER KEY ENCRYPTION
BY PASSWORD = 'PASSWORD' -- CHANGE THIS!!!
GO

CREATE CERTIFICATE WatchListCert
WITH SUBJECT = 'WatchList certificate'

CREATE SYMMETRIC KEY WatchListKey
WITH ALGORITHM = AES_256  
ENCRYPTION BY CERTIFICATE WatchListCert;  
GO

GRANT SELECT, INSERT, DELETE, UPDATE ON WatchList.dbo.Users TO WatchList
GRANT VIEW DEFINITION ON SYMMETRIC KEY::WatchListKey TO WatchList
GRANT CONTROL ON CERTIFICATE::WatchListCert TO WatchList

USE [WatchList]

CREATE TABLE [dbo].[Users](
	[UserID] [int] IDENTITY(1,1) NOT NULL,
	[Username] [varbinary](256) NOT NULL,
	[Realname] [varbinary](256) NOT NULL,
	[Password] [varbinary](256) NOT NULL,
        [Admin] INT NOT NULL,
        [Enabled] INT NOT NULL
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[WatchList](
	[WatchListID] [int] IDENTITY(1,1) NOT NULL,
	[UserID] [int] NOT NULL,
	[WatchListItemID] [int] NOT NULL,
	[StartDate] [date] NOT NULL,
	[EndDate] [date] NULL,
	[WatchListSourceID] [int] NULL,
	[Season] [int] NULL,
	[Archived] [bit] NOT NULL,
	[Notes] [varchar](200) NULL,
	[Rating] [decimal(18,2)] NULL,
 CONSTRAINT [PK_WatchList] PRIMARY KEY CLUSTERED 
(
	[WatchListID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[WatchList] ADD  CONSTRAINT [DF_WatchList_UserID]  DEFAULT ((0)) FOR [UserID]
GO

ALTER TABLE [dbo].[WatchList] ADD  CONSTRAINT [DF_WatchList_Season]  DEFAULT (NULL) FOR [Season]
GO

CREATE TABLE [dbo].[WatchListItems](
	[WatchListItemID] [int] IDENTITY(1,1) NOT NULL,
	[WatchListItemName] [varchar](500) NOT NULL,
	[WatchListTypeID] [int] NOT NULL,
	[IMDB_URL] [varchar](200) NULL,
	[IMDB_Poster] [varchar](200) NULL,
	[ItemNotes] [varchar](200) NULL,
	[Archived] [bit] NOT NULL
 CONSTRAINT [PK_WatchListItems] PRIMARY KEY CLUSTERED 
(
	[WatchListItemID] ASC,
	[WatchListItemName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[WatchListSources](
	[WatchListSourceID] [int] IDENTITY(1,1) NOT NULL,
	[WatchListSourceName] [varchar](80) NOT NULL,
 CONSTRAINT [PK_WatchListSources] PRIMARY KEY CLUSTERED 
(
	[WatchListSourceID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[WatchListTypes](
	[WatchListTypeID] [int] IDENTITY(1,1) NOT NULL,
	[WatchListTypeName] [varchar](80) NULL,
 CONSTRAINT [PK_WatchListTypes] PRIMARY KEY CLUSTERED 
(
	[WatchListTypeID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
