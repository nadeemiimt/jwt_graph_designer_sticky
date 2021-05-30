import { User } from "./user";

export interface UserLogin{
    access_token: string;
    user: User;
}