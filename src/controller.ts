import { Users } from './data'
import { Data, IUser, IController } from './Types'
import { v4 as v4uuid } from 'uuid'

export class Controller implements IController {
    constructor() { }
    async getUsers(): Promise<Data> {
        return new Promise((resolve, reject) => {
            if (Users) resolve(Users)
            else reject(new Error('Not Founded'))
        })
    }

    async getUser(id: string): Promise<IUser> {
        return new Promise((resolve, reject) => {
            if (id === undefined) throw new Error('')
            const user: IUser | undefined = Users.find((user: IUser) => user.id === id)
            if (user === undefined) reject(new Error('Not Founded'))
            else resolve(user)
        })
    }

    async addUser(data: string): Promise<IUser> {
        return new Promise(resolve => {
            const user = JSON.parse(data)
            const id = v4uuid()
            const userData = { id, ...user }
            Users.push(userData)
            resolve(userData)
        })
    }

    async updateUser(id: string, data: string): Promise<IUser> {
        return new Promise((resolve, reject) => {
            const userIndex: number = Users.findIndex(user => user.id === id)
            if (userIndex === -1) {
                reject(new Error('Not Founded'))
            } else {
                const requestData: Partial<IUser> = JSON.parse(data)
                const user: IUser = Users.find(user => user.id === id) as IUser
                const updateData: PropertyDescriptorMap = {}
                Object.entries(requestData).forEach((cur) => {
                    const key = cur[0]
                    const value = cur[1]
                    updateData[key] = {
                        value
                    }
                })
                Object.defineProperties(user, updateData)
                resolve(user)
            }
        })
    }

    async deleteUser(id: string): Promise<Data> {
        return new Promise((resolve, reject) => {
            const userIndex: number = Users.findIndex(user => user.id === id)
            if (userIndex === -1) reject(new Error('Not Founded'))
            else {
                Users.splice(userIndex)
                resolve(Users)
            }
        })
    }
}