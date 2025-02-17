import IUserOption from "./IUserOption";

export default interface IUser {
     UserID: number,
     Username: string,
     Realname: string,
     Password: string,
     Admin: boolean,
     Enabled: boolean,
     IsModified?: boolean,
     Options: IUserOption[]
}