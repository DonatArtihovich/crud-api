import { Users } from './data'
import { Data, IUser, IController } from './Types'

export class Controller implements IController {
    constructor() { }
    async getUsers(): Promise<Data> {
        return new Promise((resolve, _) => {
            resolve(Users)
        })
    }

    async getUser(index: number): Promise<IUser> {
        return new Promise((resolve) => {
            resolve(Users[index])
        })
    }
}