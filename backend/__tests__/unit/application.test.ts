import { ApplicationFactory } from '../../src/core/Application'
import { ErrorParams } from '../../src/core/ErrorParams'

describe('Application test suite', () => {
  test('Should fail Testing Fake App name on start"/"', async () => {
    const t = (): ApplicationFactory => {
      return new ApplicationFactory('fakeapp', { port: 8081 })
    }
    expect(t).toThrow(ErrorParams)
  })

  test('Should pass Testing Fake App name start "/"', async () => {
    const app = new ApplicationFactory('restana', { port: 9081 })
    app.application.startServer()
    await new Promise(process.nextTick)
    app.application.stopServer()
    await new Promise(process.nextTick)
  })
})
