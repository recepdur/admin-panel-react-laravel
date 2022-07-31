import React, { useState, useRef } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { freeSet } from '@coreui/icons'
import { execute } from '../../../common/basePage'
import { Toast } from 'primereact/toast'

const Register = () => {
  let emptyRegisterObj = {
    name: 'Recep5',
    email: 'recep5@gmail.com',
    password: '123456',
    confirm_password: '123456',
  }
  const [registerObj, setRegisterObj] = useState(emptyRegisterObj)
  const toast = useRef(null)

  const registerClick = (event) => {
    execute('/api/register', 'POST', registerObj, true, (response) => {
      if (response.success) {
        toast.current.show({
          severity: 'success',
          summary: 'Başarılı',
          detail: 'Kayıt Başarılı',
          life: 3000,
        })
        window.location.href = '/login'
      } else {
        toast.current.show({
          severity: 'error',
          summary: 'Hata',
          detail: response.message,
          life: 5000,
        })
      }
    })
  }

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || ''
    let _registerObj = { ...registerObj }
    _registerObj[`${name}`] = val
    setRegisterObj(_registerObj)
  }

  const onInputNumberChange = (e, name) => {
    const val = e.value || 0
    let _registerObj = { ...registerObj }
    _registerObj[`${name}`] = val
    setRegisterObj(_registerObj)
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <Toast ref={toast} />
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm>
                  <h1>Kaydol</h1>
                  <p className="text-medium-emphasis">Hesabınızı kolayca oluşturun.</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Adı"
                      //autoComplete="name"
                      value={registerObj.name}
                      onChange={(e) => onInputChange(e, 'name')}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      placeholder="E-Posta"
                      //autoComplete="email"
                      value={registerObj.email}
                      onChange={(e) => onInputChange(e, 'email')}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Şifre"
                      value={registerObj.password}
                      onChange={(e) => onInputChange(e, 'password')}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Şifre Tekrar"
                      value={registerObj.confirm_password}
                      onChange={(e) => onInputChange(e, 'confirm_password')}
                    />
                  </CInputGroup>
                  <div className="d-grid">
                    <CButton color="success" onClick={(e) => registerClick(e)}>
                      Hesap Oluştur
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
