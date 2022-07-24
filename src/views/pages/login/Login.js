import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CContainer,
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { execute } from '../../../common/basePage'

const Login = () => {
  const [isOpenProgress, setIsOpenProgress] = useState(false)
  const [email, setEmail] = useState('recep_1@gmail.com')
  const [password, setPassword] = useState('123456')
  const [errorText, setErrorText] = useState('')
  const [alertVisible, setAlertVisible] = useState(false)

  const loginUser = (loginData) => {
    localStorage.setItem('accessToken', loginData.access_token)
    localStorage.setItem('refreshToken', 'loginData.refresh_token')
    localStorage.setItem('tokenCreatedTime', new Date())
    localStorage.setItem('isLogin', true)
    localStorage.setItem('loginUserId', 'loginData.user._id')
    localStorage.setItem('loginUserRole', 'loginData.user.role')
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      loginClick(event)
    }
  }

  const loginClick = (event) => {
    setIsOpenProgress(true)
    setErrorText('')
    let data = { email: email, password: password }
    execute('/api/login', 'POST', data, true, (response) => {
      if (response.success) {
        loginUser(response.data)
        window.location.href = '/'
      } else {
        //setPassword('')
        setErrorText(response.message)
        setAlertVisible(3)
        console.log(response)
      }
      setIsOpenProgress(false)
    })
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Giriş</h1>
                    <p className="text-medium-emphasis">Hesabınıza giriş yapın</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        id="email"
                        name="email"
                        value={email}
                        placeholder="E-Posta"
                        autoComplete="email"
                        autocomplete="off"
                        onChange={(event) => setEmail(event.target.value)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        autoComplete="current-password"
                        onKeyDown={(e) => handleKeyDown(e)}
                        type="password"
                        value={password}
                        placeholder="Şifre"
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol>
                        <CAlert
                          color="danger"
                          visible={alertVisible}
                          onShowChange={setAlertVisible}
                          //onClick={setAlertVisible}
                        >
                          {errorText}
                        </CAlert>
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" onClick={(e) => loginClick(e)}>
                          Giriş
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Şifremi Unuttum?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Kaydol</h2>
                    <p>Müşterilerinizi en verimli şekilde yönetmek için..</p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Şimdi Kaydol!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
        <CRow>
          <CModal
            style={{ width: '70%' }}
            centered
            show={isOpenProgress}
            onClose={setIsOpenProgress}
            size="sm"
          >
            <CModalHeader closeButton>
              <CModalTitle>Lütfen bekleyiniz..</CModalTitle>
            </CModalHeader>
            <CModalBody style={{ textAlign: 'center' }}>
              <CSpinner style={{ width: '4rem', height: '4rem' }} color="info" variant="grow" />
            </CModalBody>
          </CModal>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
