import * as fs from 'fs-extra'
import officeParser from 'officeparser'
import { isOfficeFilePath } from '../shared/file-extensions'
import { getLogger } from './util'

const log = getLogger('file-parser')

export async function parseFile(filePath: string) {
  if (isOfficeFilePath(filePath)) {
    try {
      const data = await officeParser.parseOfficeAsync(filePath)
      return data
    } catch (error) {
      log.error(error)
      throw error
    }
  }
  const data = await fs.readFile(filePath, 'utf8')
  return data
}
