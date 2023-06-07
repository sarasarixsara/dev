import {AppProxy} from "../../src/core/AppProxy";
import {IRequest} from "../../src/utils/Types";
import {ErrorParams} from "../../src/core/ErrorParams";

jest.mock('../../src/utils/Types', () => {
  return {...jest.requireActual('../../src/utils/Types'), AllowedMethods: {}}
})

describe('App Proxy test suite', function () {

  test('Testing Proxy get invalid method', async () => {
    const initProxy = async () => {
      await AppProxy.createProxy({
        originalUrl: '/service/api',
        body: {},
        method: 'get',
        headers: {},
        query: {}
      } as unknown as IRequest)
    }

    await expect(initProxy()).rejects.toThrow(ErrorParams);
  })

  test('Testing Proxy get invalid path', async () => {
    const initProxy = async () => {
      await AppProxy.createProxy({
        originalUrl: 'service',
        body: {},
        method: 'get',
        headers: {},
        query: {}
      } as unknown as IRequest)
    }

    await expect(initProxy()).rejects.toThrow(ErrorParams);
  })
})
