import http from 'node:http'
import 'dotenv/config'
import { Controller } from './controller'
import { IController } from './Types'

const PORT = process.env.PORT
const server = http.createServer(async (request, response) => {
    const controller: IController = new Controller
    if (request.url === '/api/users' && request.method === 'GET') {
        const users = await controller.getUsers()
        response.writeHead(200, { "Content-Type": "application/json" })
        response.end(JSON.stringify(users))
    }
    if (request.url?.match(/^\/api\/users\/[^/]+$/) && request.method === 'GET') {
        const id = request.url.split('/')[3]
        const UUIDPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[8-9a-b][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!UUIDPattern.test(id)) {
            response.writeHead(400, { 'Content-Type': 'application/json' })
            response.end(JSON.stringify({ message: 'User id is invalid' }))
        } else {
            try {
                const user = await controller.getUser(id);
                response.writeHead(200, { 'Content-Type': 'application/json' })
                response.end(JSON.stringify(user))
            } catch (err) {
                response.writeHead(404, { 'Content-Type': 'application/json' })
                response.end(JSON.stringify({ message: err }))
            }
        }
    }

    if (request.url === '/api/users') {
        console.log(request.method)

        try {
            const data: string = await getRequestData(request) as string
            console.log(data)
            const user = await controller.addUser(data)
            console.log(user)
            response.writeHead(200, { 'Content-Type': 'application/json' })
            response.end(JSON.stringify(user))
        } catch (err) {
            response.writeHead(400, { 'Content-Type': 'application/json' })
            response.end(JSON.stringify({ message: err }))
        }
    }

})

server.listen(PORT, () => {
    console.log(`Server is started on port ${PORT}`)
})

async function getRequestData(req: http.IncomingMessage) {
    return new Promise(resolve => {
        let reqBody = ''
        req.on('data', data => {
            reqBody += data
            // resolve(reqBody)
        })

        req.on('end', () => resolve(reqBody))
    })
}