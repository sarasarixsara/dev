import {faker} from '@faker-js/faker'
import {type Application, ApplicationFactory} from '../../src/core/Application'
import {Config} from '../../src/app/Config'
import {AllowedMethods, type ResponseParams} from '../../src/utils/Types'
import supertest from "supertest";

jest.mock('../../src/routes/Routes', () => {
    const RegisterRoutes = function (application: Application): void {
        application.registerRoute({
            method: AllowedMethods.POST,
            path: '',
            handle: async function (): Promise<ResponseParams> {
                return {}
            }
        })
    }

    return {RegisterRoutes}
})

describe('Controller Post idempotent suite', () => {
    test('Testing Idempotent POST with endpoint "/"', async () => {
        const customApplicationFactory = new ApplicationFactory(
            Config.getValue('SERVER_APPLICATION', {required: true}),
            {
                port: parseInt(Config.getValue('SERVER_PORT', {required: true}))
            })

        const customRequest = supertest(customApplicationFactory.application.server)

        const ingenioKey = `${faker.lorem.word()}${Math.floor(Date.now() / 1000)}`
        const response = await customRequest.post('').set('ingenio-submit', ingenioKey)
        const responseDuplicated = await customRequest.post('').set('ingenio-submit', ingenioKey)

        expect(response.status).toEqual(200)
        expect(responseDuplicated.status).toEqual(409)
    })
})
