import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import {RandomString} from '../../src/utils/RandomString'
import {encryptString} from '../../src/utils/Encryptor'
import {Token} from '../../src/models/Token'
import {AppService} from '../../src/models/AppService'
import {User} from '../../src/models/User'
import {faker} from '@faker-js/faker'
import {ApplicationFactory} from '../../src/core/Application'
import {Config} from '../../src/app/Config'
import supertest from 'supertest'
import {Business} from "../../src/models/Business";
import {initServices} from "../utils/helper";

const mock = new MockAdapter(axios)
let business: Business | null = null
let service: AppService | null = null
let testUser: User | null = null
let testToken: Token | null = null

const createToken = async (business: Business, user: User, key: string, invalid = false): Promise<Token> => {
    const expiresAt = new Date()
    const expiresConfig = 1
    expiresAt.setTime(expiresAt.getTime() + (invalid ? -(expiresConfig * 60 * 60 * 1000) : (expiresConfig * 60 * 60 * 1000)))
    const verificationKey = RandomString(20)
    const authorizationToken = encryptString(verificationKey, key)
    const refreshToken = encryptString(JSON.stringify({authorizationToken, expiresAt: expiresAt.getTime()}), key)

    return await Token.getModel<typeof Token>(business.id).create({
        authorizationToken,
        refreshToken,
        key,
        verificationKey,
        expiresAt,
        userId: user.id
    })
}

afterAll(async () => {
    try {
        await testToken?.destroy({force: true})
        await testUser?.destroy({force: true})
    } catch (e){
        console.log('Please delete manually')
    }
})

beforeAll(async () => {

    const initialization = await initServices()
    service = initialization.service
    business = initialization.business


    testUser = await User.getModel<typeof User>(business.id).create({
        username: faker.internet.userName(),
        password: faker.internet.password(),
        name: faker.person.fullName()
    })

    testToken = await createToken(business, testUser, faker.string.sample(10))

    if (service === null) {
        throw new Error('Missing service auth')
    }

    mock.onGet(`http://localhost:${service.port}/`, {}).reply((config) => {
        return [200, {
            code: 200,
            status: true,
            message: '',
            data: {}
        }, {
            'test-header': config?.headers?.['ingenio-user']
        }]
    })

})

describe('Testing User Integration', () => {
    const customApplicationFactory = new ApplicationFactory(
        Config.getValue('SERVER_APPLICATION', {required: true}),
        {
            port: parseInt(Config.getValue('SERVER_PORT', {required: true}))
        })

    const request = supertest(customApplicationFactory.application.server)
    test('Testing User authentication with simple get', async () => {
        if (service === null || testToken === null || testUser === null || business === null) {
            throw new Error('Missing models for testing')
        }

        const response = await request.get(`/service/${service.name}`).set('host', business.domain).set('authorization', testToken.authorizationToken)
        expect(response.status).toEqual(200)
        expect(response.body.status).toEqual(true)
        expect(response.headers['test-header']).toEqual(testUser.id)
    })

    test('Testing User authentication with me route get', async () => {
        if (service === null || testToken === null || testUser === null || business === null) {
            throw new Error('Missing models for testing')
        }

        const response = await request.get(`/me`).set('host', business.domain).set('authorization', testToken.authorizationToken)
        expect(response.status).toEqual(200)
        expect(response.body.status).toEqual(true)
        expect(response.body.data.auth.id).toEqual(testUser.id)
    })

    test('Testing User authentication with false auth token', async () => {
        if (service === null || business === null) {
            throw new Error('Missing service auth')
        }

        const response = await request.get(`/service/${service.name}`).set('host', business.domain).set('authorization', faker.string.sample(20))
        expect(response.status).toEqual(401)
        expect(response.body.status).toBeFalsy()
    })
})
