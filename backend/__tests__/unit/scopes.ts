import {ServiceScope} from "../../src/middleware/ServiceScope";
import {IRequest, IResponse} from "../../src/utils/Types";
import {ErrorParams} from "../../src/core/ErrorParams";
import {UserScope} from "../../src/middleware/UserScope";

jest.mock('../../src/core/AppProxy', () => {
  class AppProxy {
    public static async createProxy (): Promise<AppProxy> {
      return new AppProxy();
    }

    public async call (): Promise<void> {
      throw new Error()
    }

    public async addHeader (): Promise<void> {
      return;
    }
  }
  return { AppProxy }
})

describe('Service Scope test suite', function () {

  test('Handle general error service scope', async () => {
    const initService = async () => {
      await ServiceScope({} as unknown as IRequest, {} as unknown as IResponse, () => {return})
    }

    await expect(initService()).rejects.toThrow(ErrorParams);

  })

  test('Invalid business user scope', async () => {
    const initService = async () => {
      await UserScope({} as unknown as IRequest, {} as unknown as IResponse, () => {return})
    }

    await expect(initService()).rejects.toThrow(ErrorParams);

  })

})
