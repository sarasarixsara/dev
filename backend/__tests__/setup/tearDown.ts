import { DatabaseConnection } from '../../src/core/DatabaseConnection'

const tearDown = async (): Promise<void> => {
  await DatabaseConnection.closeConnections()
}

export default tearDown
