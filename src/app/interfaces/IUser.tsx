import IUserOption from "./IUserOption";

export default interface IUser {
     UserID: number,
     Username: string,
     Realname: string,
     Password: string,
     ConfirmPassword?: string; // Virtual field used when adding a new user
     Admin: boolean,
     Enabled: boolean,
     IsModified?: boolean,
     Options: IUserOption[]
}