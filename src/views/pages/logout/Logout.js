import React, { useState, useEffect } from 'react'
import {
  CContainer,
  CModalHeader,
  CModalTitle,
  CRow,
  CModal,
  CModalBody,
  CSpinner,
} from '@coreui/react'
import { execute } from '../../../common/basePage'
import { GetRefreshToken } from '../../../common/apiHelper'
import { useNavigate } from 'react-router-dom'

const Logout = () => {
  const [isOpenProgress, setIsOpenProgress] = useState(true)

  // eslint-disable-next-line
  useEffect(() => {
    logoutProcess()
  })

  let navigate = useNavigate()

  const logoutProcess = async () => {
    const refreshToken = GetRefreshToken()
    if (refreshToken) {
      execute('/logout', 'POST', { refreshToken: refreshToken }, true, (response) => {
        if (response.status) {
        }
      })
    }
    setTimeout(() => {
      localStorage.clear()
      setIsOpenProgress(false)
      //window.location.href = "/login";
      //history.push('/login')
      navigate('/login')
    }, 2000)
  }

  return (
    <CContainer>
      <CRow>
        <CModal
          style={{ width: '70%' }}
          centered
          show={isOpenProgress}
          onClose={setIsOpenProgress}
          size="sm"
        >
          <CModalHeader closeButton>
            <CModalTitle>Çıkış yapılıyor..</CModalTitle>
          </CModalHeader>
          <CModalBody style={{ textAlign: 'center' }}>
            <CSpinner style={{ width: '4rem', height: '4rem' }} color="info" variant="grow" />
          </CModalBody>
        </CModal>
      </CRow>
    </CContainer>
  )
}

export default Logout
