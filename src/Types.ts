export interface IUser {
    id: number,
    username: string,
    age: number,
    hobbies: string[]
}

export type Data = IUser[]

export interface IController {
    getUsers: () => Promise<Data>
    getUser: (index: number) => Promise<IUser>
}