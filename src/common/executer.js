import { GenerateEndpointUrl } from './apiHelper'
import { ACCESS_TOKEN_EXPIRED_MINUTE, API_BASE_URL } from './constants'
import { GetMinutesBetweenTwoDates } from './utilitys'
//import { useHistory } from 'react-router-dom'
const axios = require('axios')

export function CallApi(urlPath, method, data, isPublic) {
  return new Promise(async (resolve, reject) => {
    // const headers = {
    //   'Content-Type': 'application/json',
    //   Authorization: 'Bearer ' + token.accessToken,
    // }
    // xsrfCookieName: 'XSRF-TOKEN',
    // xsrfHeaderName: 'X-XSRF-TOKEN',
    // xsrfHeaderName: 'X-CSRF-Token',

    const token = await getToken(isPublic)
    axios.defaults.baseURL = API_BASE_URL
    axios.defaults.withCredentials = true
    axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token.accessToken

    axios.get('/sanctum/csrf-cookie').then((responseCSRF) => {
      console.log(responseCSRF)
      axios
        .post(urlPath, data)
        .then((response) => {
          console.log(response)
          const apiResponseresult = {
            HTTPStatus: true,
            HTTPStatusCode: response.status,
            HTTPData: response.data,
          }
          resolve(apiResponseresult)
        })
        .catch((error) => {
          console.log(error)
          const apiResponseresult = {
            HTTPStatus: false,
            HTTPStatusCode: error.response.status,
            HTTPData: error.response.data,
          }
          resolve(apiResponseresult)
        })
    })
  })
}

async function getToken(isPublic) {
  if (isPublic) {
    return { accessToken: 'public' }
  }

  const tokenCreatedTime = localStorage.getItem('tokenCreatedTime')
  const refreshToken = localStorage.getItem('refreshToken')
  const accessToken = localStorage.getItem('accessToken')

  if (!tokenCreatedTime || !accessToken || !refreshToken) return null

  let token = {
    tokenCreatedTime: tokenCreatedTime,
    accessToken: accessToken,
    refreshToken: refreshToken,
  }

  if (
    GetMinutesBetweenTwoDates(new Date(tokenCreatedTime), new Date()) < ACCESS_TOKEN_EXPIRED_MINUTE
  ) {
    console.log('return token ' + JSON.stringify(token))
    return token
  } else {
    await axios({
      method: 'POST',
      headers: { authorization: 'Bearer public' },
      url: GenerateEndpointUrl('/auth/accessToken'),
      data: { refreshToken: refreshToken },
    })
      .then(function (response) {
        token.accessToken = response.data.data.accessToken
        token.tokenCreatedTime = new Date()
        localStorage.setItem('accessToken', token.accessToken)
        localStorage.setItem('tokenCreatedTime', token.tokenCreatedTime)
        console.log('new token ' + JSON.stringify(response))
      })
      .catch(function (error) {
        //let history = useHistory();
        console.log(error.response.data.message)
        setTimeout(() => {
          localStorage.clear()
          //history.push("/login");
          window.location.href = '/login'
        }, 1000)
      })
    return token
  }
}
