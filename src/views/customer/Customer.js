import 'primeicons/primeicons.css'
import 'primereact/resources/themes/lara-light-indigo/theme.css'
import 'primereact/resources/primereact.css'
import 'primeflex/primeflex.css'
import './index.css'
// import ReactDOM from 'react-dom'

import React, { useState, useEffect, useRef } from 'react'
import { FilterMatchMode, FilterOperator } from 'primereact/api'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber'
import { Button } from 'primereact/button'
import { Calendar } from 'primereact/calendar'
import { CustomerService } from './CustomerService'
import './DataTableDemo.css'
import { execute } from '../../common/basePage'
import { Menubar } from 'primereact/menubar'
import { classNames } from 'primereact/utils'
import { Toast } from 'primereact/toast'
import { InputTextarea } from 'primereact/inputtextarea'
import { RadioButton } from 'primereact/radiobutton'
import { Dialog } from 'primereact/dialog'
import { InputMask } from 'primereact/inputmask'

const Customer = () => {
  let emptyCustomer = {
    id: null,
    first_name: null,
    last_name: null,
    phone: null,
    tc_no: null,
    email: null,
  }
  const [customers, setCustomers] = useState(null)
  const [customerDialog, setCustomerDialog] = useState(false)
  const [filters, setFilters] = useState(null)
  const [globalFilterValue, setGlobalFilterValue] = useState('')
  const [loading, setLoading] = useState(true)
  const [deleteCustomersDialog, setDeleteCustomersDialog] = useState(false)
  const [customer, setCustomer] = useState(emptyCustomer)
  const [selectedCustomers, setSelectedCustomers] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  // const [globalFilter, setGlobalFilter] = useState(null)
  const toast = useRef(null)
  // const dt = useRef(null)
  const customerService = new CustomerService()

  const menuItems = [
    {
      label: 'Müşteri',
      icon: 'pi pi-fw pi-file',
      items: [
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
          separator: true,
        },
        {
          label: 'Sil',
          icon: 'pi pi-fw pi-trash',
          command: (event) => {
            confirmDeleteSelected()
          },
          //disabled: !selectedCustomers || !selectedCustomers.length,
        },
      ],
    },
    {
      label: 'Sigorta',
      icon: 'pi pi-fw pi-pencil',
      items: [
        {
          label: 'Left',
          icon: 'pi pi-fw pi-align-left',
        },
        {
          label: 'Right',
          icon: 'pi pi-fw pi-align-right',
        },
        {
          label: 'Center',
          icon: 'pi pi-fw pi-align-center',
        },
        {
          label: 'Justify',
          icon: 'pi pi-fw pi-align-justify',
        },
      ],
    },
    {
      label: 'Hesap',
      icon: 'pi pi-fw pi-calendar',
      items: [
        {
          label: 'New',
          icon: 'pi pi-fw pi-user-plus',
        },
        {
          label: 'Delete',
          icon: 'pi pi-fw pi-user-minus',
        },
        {
          label: 'Search',
          icon: 'pi pi-fw pi-users',
          items: [
            {
              label: 'Filter',
              icon: 'pi pi-fw pi-filter',
              items: [
                {
                  label: 'Print',
                  icon: 'pi pi-fw pi-print',
                },
              ],
            },
            {
              icon: 'pi pi-fw pi-bars',
              label: 'List',
            },
          ],
        },
      ],
    },
  ]

  useEffect(() => {
    // customerService.getCustomersLarge().then((data) => {
    //   setCustomers(getCustomers(data))
    //   setLoading(false)
    // })
    getCustomerList(true)
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

  const getCustomers = (data) => {
    return [...(data || [])].map((d) => {
      d.date = new Date(d.date)
      return d
    })
  }

  const getCustomerList = async (isAct) => {
    setLoading(true)
    const cusData = {
      methodName: 'SelectByColumns',
      data: {
        //userId: localStorage.getItem('loginUserId'),
        isActive: isAct,
      },
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

  const clearFilter = () => {
    initFilters()
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

  const dateFilterTemplate = (options) => {
    return (
      <Calendar
        value={options.value}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        dateFormat="mm/dd/yy"
        placeholder="mm/dd/yyyy"
        mask="99/99/9999"
      />
    )
  }

  const balanceBodyTemplate = (rowData) => {
    return formatCurrency(rowData.balance)
  }

  const balanceFilterTemplate = (options) => {
    return (
      <InputNumber
        value={options.value}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        mode="currency"
        currency="USD"
        locale="en-US"
      />
    )
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

  const onInputNumberChange = (e, name) => {
    const val = e.value || 0
    let _customer = { ...customer }
    _customer[`${name}`] = val

    setCustomer(_customer)
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

  return (
    <div className="datatable-filter-demo">
      <Toast ref={toast} />
      <div className="card">
        <Menubar model={menuItems} />
        <DataTable
          value={customers}
          paginator
          className="p-datatable-customers"
          //showGridlines
          rows={20}
          dataKey="id"
          filters={filters}
          filterDisplay="menu"
          sortField="first_name"
          sortOrder={1}
          loading={loading}
          responsiveLayout="scroll"
          globalFilterFields={['first_name', 'last_name', 'phone', 'tc_no']}
          header={header}
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
      </div>

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
              id="name"
              value={customer.first_name}
              onChange={(e) => onInputChange(e, 'first_name')}
              required
              autoFocus
              className={classNames({ 'p-invalid': submitted && !customer.first_name })}
            />
            {submitted && !customer.first_name && <small className="p-error">Zorunlu alan</small>}
          </div>
          <div className="field col">
            <label htmlFor="last_name">Soyadı</label>
            <InputText
              id="name"
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
    </div>
  )
}

export default Customer
