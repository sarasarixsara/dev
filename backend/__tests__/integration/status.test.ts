import {ErrorParams} from '../../src/core/ErrorParams'
import supertest from 'supertest'
import {ApplicationFactory} from '../../src/core/Application'
import {Config} from '../../src/app/Config'
import {IRequest, type ResponseParams} from '../../src/utils/Types'
import {faker} from '@faker-js/faker'
import {Business} from "../../src/models/Business";
import {initServices} from "../utils/helper";

let business: Business | null = null
const customApplicationFactory = new ApplicationFactory(
    Config.getValue('SERVER_APPLICATION', {required: true}),
    {
        port: parseInt(Config.getValue('SERVER_PORT', {required: true}))
    })

const request = supertest(customApplicationFactory.application.server)
let mockedCall:Error | undefined = undefined

jest.mock('../../src/handlers/StatusHandler', () => {
    const getStatusHandler = async function (): Promise<ResponseParams> {
        if (mockedCall !== undefined) {
            throw mockedCall
        }
        const statusHandler = jest.requireActual('../../src/handlers/StatusHandler');
        return statusHandler.getStatusHandler()
    }

    const getMeHandler = async function (): Promise<ResponseParams> {
        if (mockedCall !== undefined) {
            throw mockedCall
        }
        const statusHandler = jest.requireActual('../../src/handlers/StatusHandler');
        return statusHandler.getMeHandler({} as unknown as IRequest)
    }

    return {getStatusHandler, getMeHandler}
})

beforeAll(async () => {
    const initialization = await initServices()
    business = initialization.business
})

beforeEach(() => {
    jest.resetModules()
    mockedCall = undefined
})

describe('Controller test suite', () => {
    test('Testing Case Process Default Route handling error in controller', async () => {
        mockedCall = new ErrorParams({code: 500, message: 'test error message'})
        const customApplicationFactory = new ApplicationFactory(
            Config.getValue('SERVER_APPLICATION', {required: true}),
            {
                port: parseInt(Config.getValue('SERVER_PORT', {required: true}))
            })

        const customRequest = supertest(customApplicationFactory.application.server)
        const response = await customRequest.get('')

        expect(response.status).toEqual(500)
        expect(response.body.message).toEqual('test error message')
    })

    test('Testing Case Process Default Route handling any error', async () => {
        mockedCall = new Error('test error message generic')
        const customApplicationFactory = new ApplicationFactory(
            Config.getValue('SERVER_APPLICATION', {required: true}),
            {
                port: parseInt(Config.getValue('SERVER_PORT', {required: true}))
            })

        const customRequest = supertest(customApplicationFactory.application.server)
        const response = await customRequest.get('')

        expect(response.status).toEqual(500)
        expect(response.body.message).toEqual('test error message generic')
    })

    test('Testing Endpoint 404 Endpoint "/"', async () => {
        const randomRoute = faker.lorem.word({length: 20})
        const response = await request.get(`/fake/${randomRoute}`)
        expect(response.status).toEqual(404)
    })

    test('Testing Status endpoint', async () => {
        const response = await request.get('')
        expect(response.status).toEqual(200)
    })

    test('Testing me endpoint', async () => {
        if (business === null) {
            throw new Error('Missing service auth')
        }

        const response = await request.get('/me').set('host', business.domain)
        expect(response.status).toEqual(200)
        expect(Object.keys(response.body.data).length).toEqual(0)
    })
})
