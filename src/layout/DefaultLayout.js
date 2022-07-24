import React from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { Navigate } from 'react-router-dom'
import { IsLogin, IsRefreshTokenExpire } from '../common/apiHelper'

const DefaultLayout = () => {
  if (!IsLogin() || IsRefreshTokenExpire()) {
    return <Navigate from="/" to="/login" />
  }
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />
        <div className="body flex-grow-1 px-3">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
