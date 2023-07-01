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
    } else if (request.url?.match(/^\/api\/users\/[^/]+$/) && request.method === 'GET') {
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
                if (err instanceof Error) {
                    if (err.message === 'Not Founded') {
                        response.writeHead(404, { 'Content-Type': 'application/json' })
                        response.end(JSON.stringify({ message: 'User not found' }))
                    } else {
                        response.writeHead(500, { 'Content-Type': 'application/json' })
                        response.end(JSON.stringify({ message: 'Unexpected server error' }))
                    }
                }
            }
        }
    } else if (request.url === '/api/users' && request.method === 'POST') {
        try {
            const data: string = await getRequestData(request) as string
            if (JSON.parse(data)['username'] === undefined
                || JSON.parse(data)['age'] === undefined
                || JSON.parse(data)['hobbies'] === undefined
                || JSON.parse(data)['id'] !== undefined) {
                response.writeHead(400, { 'Content-Type': 'application/json' })
                response.end(JSON.stringify({ message: 'Invalid user object' }))
            }
            const user = await controller.addUser(data)
            response.writeHead(201, { 'Content-Type': 'application/json' })
            response.end(JSON.stringify(user))
        } catch (err) {
            if (err instanceof Error) {
                if (err.message === 'Not Founded') {
                    response.writeHead(404, { 'Content-Type': 'application/json' })
                    response.end(JSON.stringify({ message: 'User not found' }))
                } else {
                    response.writeHead(500, { 'Content-Type': 'application/json' })
                    response.end(JSON.stringify({ message: 'Unexpected server error' }))
                }
            }
        }
    } else if (request.url?.match(/^\/api\/users\/[^/]+$/) && request.method === 'PUT') {
        const id = request.url.split('/')[3]
        const UUIDPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[8-9a-b][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!UUIDPattern.test(id)) {
            response.writeHead(400, { 'Content-Type': 'application/json' })
            response.end(JSON.stringify({ message: 'User id is invalid' }))
        } else {
            try {
                const data: string = await getRequestData(request) as string
                const user = await controller.updateUser(id, data);
                response.writeHead(200, { 'Content-Type': 'application/json' })
                response.end(JSON.stringify(user))
            } catch (err) {
                if (err instanceof Error) {
                    if (err.message === 'Not Founded') {
                        response.writeHead(404, { 'Content-Type': 'application/json' })
                        response.end(JSON.stringify({ message: 'User not found' }))
                    } else {
                        response.writeHead(500, { 'Content-Type': 'application/json' })
                        response.end(JSON.stringify({ message: 'Unexpected server error' }))
                    }
                }
            }
        }
    } else if (request.url?.match(/^\/api\/users\/[^/]+$/) && request.method === 'DELETE') {
        const id = request.url.split('/')[3]
        const UUIDPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[8-9a-b][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!UUIDPattern.test(id)) {
            response.writeHead(400, { 'Content-Type': 'application/json' })
            response.end(JSON.stringify({ message: 'User id is invalid' }))
        } else {
            try {
                await controller.deleteUser(id)
                response.writeHead(204, { 'Content-Type': 'application/json' })
                response.end()
            } catch (err) {
                if (err instanceof Error) {
                    if (err.message === 'Not Founded') {
                        response.writeHead(404, { 'Content-Type': 'application/json' })
                        response.end(JSON.stringify({ message: 'User not found' }))
                    } else {
                        response.writeHead(500, { 'Content-Type': 'application/json' })
                        response.end(JSON.stringify({ message: 'Unexpected server error' }))
                    }
                }
            }
        }
    } else {
        response.writeHead(404, { 'Content-Type': 'application/json' })
        response.end(JSON.stringify({ message: 'Resource not found' }))
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
        })

        req.on('end', () => resolve(reqBody))
    })
}