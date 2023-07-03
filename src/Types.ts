export interface IUser {
    id: string,
    username: string,
    age: number,
    hobbies: string[]
}

export type Data = IUser[]

export interface IController {
    getUsers: () => Promise<Data>
    getUser: (id: string) => Promise<IUser>
    addUser: (data: string) => Promise<IUser>
    updateUser: (id: string, data: string) => Promise<IUser>
    deleteUser: (id: string) => Promise<Data>
}

export type UserKey = 'id' | 'username' | 'age' | 'hobbies'