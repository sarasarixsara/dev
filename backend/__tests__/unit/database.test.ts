import { DatabaseConnection } from '../../src/core/DatabaseConnection'

describe('Testing Database functions "/"', () => {
  test('Testing Database connection to test', async () => {
    const agent = DatabaseConnection.getConnection('test')
    await agent.authenticate()

    const testDatabase = DatabaseConnection.getConnection('test')
    expect(testDatabase).toBeTruthy()
    await DatabaseConnection.closeConnections()

  })

  // TODO test permissions, insert migrations etc...
})
