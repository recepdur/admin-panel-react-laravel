import { CallApi } from './executer'

export function execute(url, method, data, isPublic, callback) {
  CallApi(url, method, data, isPublic).then((apiResponse) => {
    const { HTTPStatusCode, HTTPData } = apiResponse
    if (HTTPStatusCode === 401) {
    }
    callback(HTTPData)
  })
}
