import { AppService } from '../../src/models/AppService'
import MockAdapter from 'axios-mock-adapter'
import axios, {AxiosError} from 'axios'
import { ApplicationFactory } from '../../src/core/Application'
import { Config } from '../../src/app/Config'
import supertest from 'supertest'
import {Business} from "../../src/models/Business";
import {initServices} from "../utils/helper";


const mock = new MockAdapter(axios)
let service: AppService | null = null
let business: Business | null = null
let customRequest: supertest.SuperTest<supertest.Test> | null = null
const customApplicationFactory = new ApplicationFactory(
    Config.getValue('SERVER_APPLICATION', { required: true }),
    {
      port: parseInt(Config.getValue('SERVER_PORT', { required: true }))
    })

const request = supertest(customApplicationFactory.application.server)
beforeAll(async () => {
  const initialization = await initServices()
  business = initialization.business
  service = initialization.service

  mock.onGet(`http://localhost:${service.port}/`, {}).reply(200, {
    code: 200,
    status: true,
    message: '',
    data: {}
  })

  mock.onGet(`http://localhost:${service.port}/status`, {}).reply((config) => {
    return [200, {
      code: 200,
      status: true,
      message: '',
      data: {}
    }, {
      'test-header': config?.headers?.['test-header'],
      'ingenio-business': config?.headers?.['ingenio-business']
    }]
  })

  mock.onGet(`http://localhost:${service.port}/fake`, {}).reply((config) => {
    return [404, {
      code: 404,
      status: false,
      message: 'message test',
      data: {
        test: true
      }
    }, {
      'test-header': config?.headers?.['test-header'],
      'ingenio-business': config?.headers?.['ingenio-business']
    }]
  })

  mock.onGet(`http://localhost:${service.port}/fake2`, {}).reply(() => {
    throw new AxiosError('Error in axios','ECONNREFUSED')
  })

  const customApplicationFactory = new ApplicationFactory(
    Config.getValue('SERVER_APPLICATION', { required: true }),
    {
      port: parseInt(Config.getValue('SERVER_PORT', { required: true }))
    })

  customRequest = supertest(customApplicationFactory.application.server)
})

describe('Services testsuite', () => {
  test('Testing Service with simple get', async () => {
    if (service === null || customRequest === null) {
      throw new Error('Missing service auth')
    }

    const response = await customRequest.get(`/service/${service.name}`)
    expect(response.status).toEqual(200)
    expect(response.body.status).toEqual(true)
  })

  test('Testing Service endpoint with headers', async () => {
    if (service === null || customRequest === null || business === null) {
      throw new Error('Missing service auth')
    }

    const response = await customRequest.get(`/service/${service.name}/status`).set('test-header', business.id)
    expect(response.status).toEqual(200)
    expect(response.body.status).toEqual(true)
    expect(response.headers['test-header']).toEqual(business.id)
    expect(response.headers['ingenio-business']).not.toEqual(business.id)// prevent overwrite service business
  })

  test('Testing Service endpoint 404 custom response with active service', async () => {
    if (service === null || customRequest === null || business === null) {
      throw new Error('Missing service auth')
    }
    const response = await customRequest.get(`/service/${service.name}/fake`).set('test-header', business.id)
    expect(response.status).toEqual(404)
  })

  test('Testing Service endpoint 404 for unhandled error in service', async () => {
    if (service === null || customRequest === null || business === null) {
      throw new Error('Missing service auth')
    }
    const response = await customRequest.get(`/service/${service.name}/fake2`).set('test-header', business.id)
    expect(response.status).toEqual(404)
  })

  test('Testing Service endpoint 404 with true service when is off', async () => {
    if (service === null || business === null) {
      throw new Error('Missing service auth')
    }
    mock.resetHandlers();
    const response = await request.get(`/service/${service.name}`).set('test-header', business.id)
    expect(response.status).toEqual(404)
  })

})
