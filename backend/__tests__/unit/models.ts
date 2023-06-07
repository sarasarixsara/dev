import {MainModel} from "../../src/models/Model";

describe('Models test suite', function () {
  test('Invalid call to setup model', async () => {
    const initService = async () => {
      MainModel.setupModel('core')
    }
    await expect(initService()).rejects.toThrow(Error);
  })

})
