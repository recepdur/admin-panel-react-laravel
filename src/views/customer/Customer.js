import 'primeicons/primeicons.css'
import 'primereact/resources/themes/lara-light-indigo/theme.css'
import 'primereact/resources/primereact.css'
import 'primeflex/primeflex.css'
import './index.css'
import './DataTableDemo.css'
import React, { useState, useEffect, useRef } from 'react'
import { CCard, CCardHeader, CCardBody, CRow, CCol } from '@coreui/react'
import { FilterMatchMode, FilterOperator } from 'primereact/api'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber'
import { Button } from 'primereact/button'
import { CustomerService } from './CustomerService'
import { execute } from '../../common/basePage'
import { Menubar } from 'primereact/menubar'
import { classNames } from 'primereact/utils'
import { Toast } from 'primereact/toast'
import { Dialog } from 'primereact/dialog'
import { InputMask } from 'primereact/inputmask'
import { Dropdown } from 'primereact/dropdown'

const Customer = () => {
  let emptyCustomer = {
    id: null,
    first_name: '',
    last_name: '',
    phone: null,
    tc_no: null,
    email: '',
    status: true,
  }
  const [customers, setCustomers] = useState(null)
  const [customer, setCustomer] = useState(emptyCustomer)
  const [filterCutomer, setFilterCustomer] = useState(emptyCustomer)
  const [customerDialog, setCustomerDialog] = useState(false)
  const [filters, setFilters] = useState(null)
  const [globalFilterValue, setGlobalFilterValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [deleteCustomersDialog, setDeleteCustomersDialog] = useState(false)
  const [selectedCustomers, setSelectedCustomers] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const toast = useRef(null)
  const customerService = new CustomerService()

  const menuItems = [
    {
      label: 'Listele',
      icon: 'pi pi-fw pi-list',
      command: (event) => {
        listCustomers()
      },
    },
    {
      label: 'Temizle',
      icon: 'pi pi-fw pi-file',
      command: (event) => {
        clearFilter()
      },
    },
    {
      label: 'Yeni',
      icon: 'pi pi-fw pi-plus',
      command: (event) => {
        openNew()
      },
    },
    {
      label: 'Güncelle',
      icon: 'pi pi-fw pi-pencil',
      command: (event) => {
        editCustomer()
      },
    },
    {
      label: 'Sil',
      icon: 'pi pi-fw pi-trash',
      command: (event) => {
        confirmDeleteSelected()
      },
      //disabled: !selectedCustomers || !selectedCustomers.length,
    },
    {
      label: 'Hesap',
      icon: 'pi pi-fw pi-calendar',
      items: [
        {
          label: 'Ekle',
          icon: 'pi pi-fw pi-credit-card',
        },
        {
          label: 'Listele',
          icon: 'pi pi-fw pi-history',
        },
      ],
    },
  ]

  useEffect(() => {
    // customerService.getCustomersLarge().then((data) => {
    //   setCustomers(getCustomers(data))
    //   setLoading(false)
    // })
    // getCustomerList(true)
    initFilters()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      first_name: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      last_name: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      phone: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
      },
      tc_no: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
      },
      // name: {
      //   operator: FilterOperator.AND,
      //   constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      // },
      // date: {
      //   operator: FilterOperator.AND,
      //   constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
      // },
      // balance: {
      //   operator: FilterOperator.AND,
      //   constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      // },
    })
    setGlobalFilterValue('')
  }

  const clearFilter = () => {
    initFilters()
    setCustomer(emptyCustomer)
    setFilterCustomer(emptyCustomer)
    setCustomers(null)
  }

  const getCustomers = (data) => {
    return [...(data || [])].map((d) => {
      d.date = new Date(d.date)
      return d
    })
  }

  const listCustomers = () => {
    setLoading(true)
    const cusData = {
      methodName: 'SelectByColumns',
      data: filterCutomer,
    }
    execute('/api/customers', 'POST', cusData, false, (response) => {
      if (response.success) {
        setCustomers(response.data)
      } else {
        // callAlert(response.message, 3, 'danger')
      }
      setLoading(false)
    })
  }

  const formatDate = (value) => {
    return value
    // return value.toLocaleDateString('en-US', {
    //   day: '2-digit',
    //   month: '2-digit',
    //   year: 'numeric',
    // })
  }

  const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
  }

  const onGlobalFilterChange = (e) => {
    const value = e.target.value
    let _filters = { ...filters }
    _filters['global'].value = value
    setFilters(_filters)
    setGlobalFilterValue(value)
  }

  const renderHeader = () => {
    return (
      <div className="flex justify-content-center">
        <span className="p-input-icon-left mr-2 w-50">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Arama"
            className="p-inputtext-sm block mb-2 w-75"
          />
        </span>
        {/* <Button
          type="button"
          icon="pi pi-filter-slash"
          label="Temizle"
          className="p-button-outlined p-button-sm"
          onClick={clearFilter}
        /> */}
      </div>
    )
  }

  const header = renderHeader()

  const dateBodyTemplate = (rowData) => {
    return formatDate(rowData.created_at)
  }

  const hideDialog = () => {
    setSubmitted(false)
    setCustomerDialog(false)
  }

  const hideDeleteCustomersDialog = () => {
    setDeleteCustomersDialog(false)
  }

  const findIndexById = (id) => {
    let index = -1
    for (let i = 0; i < customers.length; i++) {
      if (customers[i].id === id) {
        index = i
        break
      }
    }

    return index
  }

  const saveCustomer = () => {
    setSubmitted(true)

    if (customer.first_name.trim()) {
      let _customers = [...customers]
      let _customer = { ...customer }

      if (customer.id) {
        const cusData = {
          methodName: 'Update',
          data: _customer,
        }
        execute('/api/customers', 'POST', cusData, false, (response) => {
          if (response.success) {
            const index = findIndexById(customer.id)
            _customers[index] = _customer
            toast.current.show({
              severity: 'success',
              summary: 'Başarılı',
              detail: 'Müşteri Güncellendi',
              life: 3000,
            })
            setCustomers(_customers)
            setCustomerDialog(false)
            setCustomer(emptyCustomer)
          } else {
            toast.current.show({
              severity: 'error',
              summary: 'Hata',
              detail: response.message,
              life: 5000,
            })
          }
        })
      } else {
        const cusData = {
          methodName: 'Insert',
          data: _customer,
        }
        execute('/api/customers', 'POST', cusData, false, (response) => {
          if (response.success) {
            _customers.push(response.data)
            toast.current.show({
              severity: 'success',
              summary: 'Başarılı',
              detail: 'Müşteri Eklendi',
              life: 3000,
            })
            setCustomers(_customers)
            setCustomerDialog(false)
            setCustomer(emptyCustomer)
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
    }
  }

  const editCustomer = () => {
    if (!selectedCustomers) {
      toast.current.show({
        severity: 'warn',
        summary: 'Uyarı',
        detail: 'Kayıt seçiniz!',
        life: 3000,
      })
      return
    }

    let customer = customers.find((cusItem) => cusItem.id === selectedCustomers.id)
    if (!customer) {
      toast.current.show({
        severity: 'warn',
        summary: 'Uyarı',
        detail: 'Müşteri bulunamadı!',
        life: 3000,
      })
      return
    }

    setCustomer({ ...customer })
    setCustomerDialog(true)
  }

  const openNew = () => {
    setCustomer(emptyCustomer)
    setSubmitted(false)
    setCustomerDialog(true)
  }

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || ''
    let _customer = { ...customer }
    _customer[`${name}`] = val

    setCustomer(_customer)
  }

  const onFilterInputChange = (e, name) => {
    //const val = (e.target && e.target.value) || ''
    let _filterCustomer = { ...filterCutomer }
    _filterCustomer[`${name}`] = e.target.value
    setFilterCustomer(_filterCustomer)
  }

  const confirmDeleteSelected = () => {
    if (!selectedCustomers) {
      toast.current.show({
        severity: 'warn',
        summary: 'Uyarı',
        detail: 'Kayıt seçiniz!',
        life: 3000,
      })
      setDeleteCustomersDialog(false)
      return
    }
    setDeleteCustomersDialog(true)
  }

  const deleteSelectedCustomers = () => {
    const cusData = {
      methodName: 'Delete',
      data: { id: selectedCustomers.id },
    }
    execute('/api/customers', 'POST', cusData, false, (response) => {
      if (response.success) {
        let _customers = customers.filter((cusItem) => cusItem.id !== selectedCustomers.id)
        setCustomers(_customers)
        setDeleteCustomersDialog(false)
        setSelectedCustomers(null)
        toast.current.show({
          severity: 'success',
          summary: 'Başarılı',
          detail: 'Müşteri Silindi',
          life: 3000,
        })
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

  const customerDialogFooter = (
    <React.Fragment>
      <Button label="İptal" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
      <Button label="Kaydet" icon="pi pi-check" className="p-button-text" onClick={saveCustomer} />
    </React.Fragment>
  )

  const deleteCustomersDialogFooter = (
    <React.Fragment>
      <Button
        label="Hayır"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteCustomersDialog}
      />
      <Button
        label="Evet"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteSelectedCustomers}
      />
    </React.Fragment>
  )

  const statusList = [
    //{ name: 'Hepsi', value: null },
    { name: 'Aktif', value: true },
    { name: 'Pasif', value: false },
  ]

  return (
    <>
      <CRow>
        <CCol>
          <Menubar model={menuItems} />
        </CCol>
      </CRow>
      <CRow>
        <CCol sm={2} md={2}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Kriterler</strong>
            </CCardHeader>
            <CCardBody>
              <div className="field">
                <Dropdown
                  value={filterCutomer.status}
                  options={statusList}
                  onChange={(e) => onFilterInputChange(e, 'status')}
                  className="p-dropdown-sm w-100"
                  optionLabel="name"
                  placeholder="Durum"
                />
              </div>
              <div className="field">
                <InputText
                  id="first_name"
                  placeholder="Adı"
                  className="p-inputtext-sm w-100"
                  value={filterCutomer.first_name}
                  onChange={(e) => onFilterInputChange(e, 'first_name')}
                />
              </div>
              <div className="field">
                <InputText
                  id="last_name"
                  placeholder="Soyadı"
                  className="p-inputtext-sm w-100"
                  value={filterCutomer.last_name}
                  onChange={(e) => onFilterInputChange(e, 'last_name')}
                />
              </div>
              <div className="field">
                <InputNumber
                  id="phone"
                  placeholder="Telefon"
                  className="p-inputtext-sm w-100"
                  value={filterCutomer.phone}
                  mode="decimal"
                  onValueChange={(e) => onFilterInputChange(e, 'phone')}
                />
              </div>
              <div className="field">
                <InputNumber
                  id="tc_no"
                  placeholder="TC"
                  className="p-inputtext-sm w-100"
                  value={filterCutomer.tc_no}
                  mode="decimal"
                  onValueChange={(e) => onFilterInputChange(e, 'tc_no')}
                />
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={10} md={10}>
          <Toast ref={toast} />
          <DataTable
            value={customers}
            paginator
            className="p-datatable-customers"
            //showGridlines
            rows={20}
            dataKey="id"
            filters={filters}
            filterDisplay="menu"
            // sortField="first_name"
            // sortOrder={1}
            loading={loading}
            responsiveLayout="scroll"
            globalFilterFields={['first_name', 'last_name', 'phone', 'tc_no']}
            //header={header}
            emptyMessage="Kayıt bulunamadı!"
            size="small"
            selection={selectedCustomers}
            onSelectionChange={(e) => setSelectedCustomers(e.value)}
          >
            <Column selectionMode="single" headerStyle={{ width: '3em' }}></Column>
            <Column
              field="first_name"
              header="Adı"
              filter
              sortable
              filterPlaceholder="Ara"
              style={{ minWidth: '12rem' }}
            />
            <Column
              field="last_name"
              header="Soyadı"
              filter
              sortable
              filterPlaceholder="Ara"
              style={{ minWidth: '12rem' }}
            />
            <Column
              field="tc_no"
              header="TC"
              filter
              sortable
              filterPlaceholder="Ara"
              style={{ minWidth: '12rem' }}
            />
            <Column
              field="phone"
              header="Telefon"
              filter
              sortable
              filterPlaceholder="Ara"
              style={{ minWidth: '12rem' }}
            />
            <Column
              field="email"
              header="Email"
              filter
              sortable
              filterPlaceholder="Ara"
              style={{ minWidth: '15rem' }}
            />
            <Column
              header="Kayıt Tarihi"
              filterField="created_at"
              dataType="date"
              style={{ minWidth: '12rem' }}
              body={dateBodyTemplate}
              sortable
              // filter
              // filterElement={dateFilterTemplate}
            />
            {/* <Column
            header="Balance"
            filterField="balance"
            dataType="numeric"
            style={{ minWidth: '10rem' }}
            body={balanceBodyTemplate}
            filter
            filterElement={balanceFilterTemplate}
          /> */}
          </DataTable>
          <Dialog
            visible={customerDialog}
            style={{ width: '500px' }}
            header="Müşteri Detayı"
            modal
            className="p-fluid"
            footer={customerDialogFooter}
            onHide={hideDialog}
          >
            <div className="formgrid grid">
              <div className="field col">
                <label htmlFor="first_name">Adı</label>
                <InputText
                  id="first_name"
                  value={customer.first_name}
                  onChange={(e) => onInputChange(e, 'first_name')}
                  required
                  autoFocus
                  className={classNames({ 'p-invalid': submitted && !customer.first_name })}
                />
                {submitted && !customer.first_name && (
                  <small className="p-error">Zorunlu alan</small>
                )}
              </div>
              <div className="field col">
                <label htmlFor="last_name">Soyadı</label>
                <InputText
                  id="last_name"
                  value={customer.last_name}
                  onChange={(e) => onInputChange(e, 'last_name')}
                  autoFocus
                />
              </div>
            </div>
            <div className="formgrid grid">
              <div className="field col">
                <label htmlFor="phone">Telefon</label>
                <InputMask
                  id="phone"
                  mask="9999999999"
                  value={customer.phone}
                  //placeholder="(999) 999-9999"
                  onChange={(e) => onInputChange(e, 'phone')}
                />
              </div>
              <div className="field col">
                <label htmlFor="quantity">TC No</label>
                <InputMask
                  id="tc_no"
                  mask="9999999999999"
                  value={customer.tc_no}
                  //placeholder="9999999999999"
                  onChange={(e) => onInputChange(e, 'tc_no')}
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor="email">E-Posta</label>
              <InputText
                id="email"
                value={customer.email}
                onChange={(e) => onInputChange(e, 'email')}
              />
            </div>
          </Dialog>

          <Dialog
            visible={deleteCustomersDialog}
            style={{ width: '450px' }}
            //header="Confirm"
            modal
            footer={deleteCustomersDialogFooter}
            onHide={hideDeleteCustomersDialog}
          >
            <div className="confirmation-content">
              <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
              {customer && <span>Silmek istediğinize emin misiniz?</span>}
            </div>
          </Dialog>
        </CCol>
      </CRow>
    </>
  )
}

export default Customer
