import IUserOption from "./IUserOption";

export default interface IUser {
     UserID: number,
     Username: string,
     Realname: string,
     Password: string,
     Admin: number,
     Enabled: number,
     IsModified?: boolean,
     Options: IUserOption[]
}