import { BusinessScope } from '../../src/middleware/BusinessScope'
import {IRequest, IResponse} from "../../src/utils/Types";

describe('Middlewares test suite', () => {
  test('Testing Business middleware pass when send valid headers', async () => {
    const next = jest.fn()
    const iRequest:IRequest = { ingenio: undefined, headers: {} } as unknown as IRequest
    const iResponse:IResponse = {} as unknown as IResponse

    await BusinessScope(iRequest, iResponse, next)
    expect(next).toHaveBeenCalled()
  })
  // TODO test cache
})
