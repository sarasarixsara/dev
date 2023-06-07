jest.mock('../../src/app/Config', () => {
  class Config {
    private static readonly _config: Config | undefined
    private readonly records: Record<string, string>

    constructor (records: Record<string, string>) {
      this.records = records
    }

    public static getValue (value: string, options: { defaultValue?: string | null, required?: boolean } = { defaultValue: null, required: false }): string {
      const configuration:{[key:string]:string} = {
        SERVER_LANG: 'fakeLocalAlt',
        LOCALES_FOLDER: '__tests__/unit/locales'
      }

      return configuration[value] ?? options.defaultValue
    }
  }
  return { Config }
})

import * as fs from 'fs'
import * as path from 'path'
import { Local } from '../../src/app/Local'

const testLocales = path.join(__dirname, 'locales')

async function removeFolderAsync(folder: string | undefined = undefined) {
  return new Promise((resolve, reject) => {
    fs.rm(folder ?? testLocales, { recursive: true, force: true }, (err) => {
      if(err){
        reject(err)
      }
      resolve(true)
    })
  });
}

async function createFolderAsync() {
  return new Promise((resolve, reject) => {
    fs.access(testLocales, (err) => {
      if (err) {
        fs.mkdir(testLocales, (err) => {
          if(err){
            return reject(err)
          }
          resolve(true)
        })

        return;
      }

      resolve(true)

    })
  });
}

async function createFileAsync(fileName:string, fileContent:string) {
  return new Promise((resolve, reject) => {
    fs.writeFile(`${testLocales}/${fileName}`, fileContent, (err) => {
      if(err){
        reject(err)
      }
      resolve(true)
    })
  });
}

beforeEach(() => {
  jest.resetModules()
})

describe('Testing Local language manager using I18N', () => {

  beforeAll(async () => {
    await createFolderAsync()
    await createFileAsync('fakeLocalAlt.json', '{"General error":"Fake general error"}')
    await createFileAsync(`fakeLocalAlt_2.json`, '{"General error":"Fake general error 2"}')
    Local.refreshLocal();
  })

  afterAll(async () => {
    await removeFolderAsync()
  })

  test('Testing Local set local from config', () => {
    expect(Local.i18nProvider.defaultLocale).toBe('fakeLocalAlt')
  })

  test('Testing Local set local from config changing default locale by default', () => {
    Local.setLocale('fakeLocal')
    const localProvider = Local.i18nProvider.i18nInstance
    expect(localProvider.getLocale()).toBe(Local.i18nProvider.defaultLocale)
  })

  test('Testing Local set local from config', () => {
    Local.setLocale('fakeLocal')
    const translation = Local.translate('General error')
    expect(translation).toBe('Fake general error')
  })

  it('Testing Local with alt languages and set local from config', () => {
    Local.setLocale('fakeLocalAlt_2')
    const translation = Local.translate('General error')
    expect(translation).toBe('Fake general error 2')
  })

  it('Testing Local with alt 3 languages and set local from config', () => {
    Local.setLocale('fakeLocalAlt_3')
    const translation = Local.translate('General error')
    expect(translation).toBe('Fake general error')
  })
})


describe('Testing Local language initialization', () => {
  afterEach(async () => {
    await removeFolderAsync()
  })

  beforeEach(async () => {
    await removeFolderAsync()
  })

  test('Testing folder and local creation', async () => {
    Local.refreshLocal()
    expect(Local.i18nProvider.defaultLocale).toBe('fakeLocalAlt')
  })

  test('Testing Default Language change', async () => {
    await createFolderAsync()
    await createFileAsync(`fakeLocalAlt_2.json`, '{"General error":"Fake general error 2"}')
    await removeFolderAsync(path.join(testLocales, 'fakeLocalAlt.json'))

    Local.refreshLocal()

    expect(Local.i18nProvider.defaultLocale).toBe('fakeLocalAlt_2')
  })
})