import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import { faker } from '@faker-js/faker'
import { AppService } from '../../src/models/AppService'
import { ApplicationFactory } from '../../src/core/Application'
import { Config } from '../../src/app/Config'
import supertest from 'supertest'
import { Business } from '../../src/models/Business'
import {initServices} from "../utils/helper";

let business: Business | null = null
let service: AppService | null = null
const mock = new MockAdapter(axios)


beforeEach(() => {
  jest.resetModules()
})

beforeAll(async () => {
  const initialization = await initServices()
  business = initialization.business
  service = initialization.service

  mock.onDelete(`http://localhost:${service.port}/`).reply(() => {
    return [200, {
      code: 200,
      status: true,
      message: 'deleted',
      data: {}
    }]
  })

  mock.onPatch(`http://localhost:${service.port}/`).reply((config) => {
    return [200, {
      code: 200,
      status: true,
      message: JSON.parse(config.data).upload,
      data: {}
    }]
  })

  mock.onPost(`http://localhost:${service.port}/`).reply((config) => {
    return [201, {
      code: 201,
      status: true,
      message: JSON.parse(config.data).upload,
      data: {}
    }]
  })

  mock.onGet(`http://localhost:${service.port}/`).reply(() => {
    return [200, {
      code: 200,
      status: true,
      message: 'get message',
      data: {}
    }]
  })
})

describe('App Proxy test suite', function () {
  const customApplicationFactory = new ApplicationFactory(
    Config.getValue('SERVER_APPLICATION', { required: true }),
    {
      port: parseInt(Config.getValue('SERVER_PORT', { required: true }))
    })

  const request = supertest(customApplicationFactory.application.server)

  test('Testing Proxy patch request', async () => {
    if (service === null || business === null) {
      throw new Error('Missing required service and business')
    }

    const message = faker.string.sample(10)
    const response = await request.patch(`/service/${service.name}`).set('host', business.domain).send({ upload: message })
    expect(response.status).toEqual(200)
    expect(response.body.message).toEqual(message)
  })

  test('Testing Proxy post request', async () => {
    if (service === null || business === null) {
      throw new Error('Missing required service and business')
    }

    const message = faker.string.sample(10)
    const response = await request.post(`/service/${service.name}`).set('host', business.domain).send({ upload: message })
    expect(response.status).toEqual(201)
    expect(response.body.message).toEqual(message)
  })

  test('Testing Proxy post without body request', async () => {
    if (service === null || business === null) {
      throw new Error('Missing required service and business')
    }

    const response = await request.post(`/service/${service.name}`).set('host', business.domain)
    expect(response.status).toEqual(201)
  })

  test('Testing Proxy delete request', async () => {
    if (service === null || business === null) {
      throw new Error('Missing required service and business')
    }

    const response = await request.delete(`/service/${service.name}`).set('host', business.domain)
    expect(response.status).toEqual(200)
    expect(response.body.message).toEqual('deleted')
  })

  test('Testing Proxy get request', async () => {
    if (service === null || business === null) {
      throw new Error('Missing required service and business')
    }

    const response = await request.get(`/service/${service.name}`).set('host', business.domain)
    expect(response.status).toEqual(200)
    expect(response.body.message).toEqual('get message')
  })


  test('Testing Proxy get request fake service', async () => {
    if (service === null || business === null) {
      throw new Error('Missing required service and business')
    }

    const serviceName = faker.string.sample(1);
    const response = await request.get(`/service/fake${serviceName}`).set('host', business.domain)
    expect(response.status).toEqual(404)
    expect(response.body.message).toEqual('Service not found')
  })
})
