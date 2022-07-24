import { API_BASE_URL, REFRESH_TOKEN_EXPIRED_MINUTE } from './constants'
import { GetMinutesBetweenTwoDates } from './utilitys'

export function GenerateEndpointUrl(url) {
  return API_BASE_URL + url
}

export function GetRefreshToken() {
  return localStorage.getItem('refreshToken')
}

export function GetTokenCreatedTime() {
  return localStorage.getItem('tokenCreatedTime')
}

export function IsLogin() {
  return localStorage.getItem('isLogin')
}

export function IsRefreshTokenExpire() {
  if (
    GetMinutesBetweenTwoDates(new Date(GetTokenCreatedTime()), new Date()) <
    REFRESH_TOKEN_EXPIRED_MINUTE
  ) {
    return false
  } else {
    return true
  }
}
