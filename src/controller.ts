import { Users } from './data'
import { Data, IUser, IController } from './Types'
import { v4 as v4uuid } from 'uuid'

export class Controller implements IController {
    constructor() { }
    async getUsers(): Promise<Data> {
        return new Promise((resolve, _) => {
            resolve(Users)
        })
    }

    async getUser(id: string): Promise<IUser> {
        return new Promise((resolve, reject) => {
            if (id === undefined) throw new Error('')
            const user: IUser | undefined = Users.find((user: IUser) => user.id === id)
            if (user === undefined) reject()
            else resolve(user)
        })
    }

    async addUser(data: string): Promise<IUser> {
        return new Promise(resolve => {
            const user = JSON.parse(data)
            const id = v4uuid()
            console.log(id)
            const userData = { id, ...user }
            Users.push(userData)
            resolve(userData)
        })
    }
}