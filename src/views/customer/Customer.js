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
//import { CustomerService } from './CustomerService'
import './DataTableDemo.css'
import { execute } from '../../common/basePage'
import { Menubar } from 'primereact/menubar'
import { classNames } from 'primereact/utils'
import { Toast } from 'primereact/toast'
import { InputTextarea } from 'primereact/inputtextarea'
import { RadioButton } from 'primereact/radiobutton'
import { Dialog } from 'primereact/dialog'

const Customer = () => {
  let emptyCustomer = {
    id: null,
    name: '',
    image: null,
    description: '',
    category: null,
    price: 0,
    quantity: 0,
    rating: 0,
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
  // const customerService = new CustomerService()

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
        userId: localStorage.getItem('loginUserId'),
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

  const createId = () => {
    let id = ''
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return id
  }

  const saveCustomer = () => {
    setSubmitted(true)

    if (customer.name.trim()) {
      let _customers = [...customers]
      let _customer = { ...customer }
      if (customer.id) {
        const index = findIndexById(customer.id)

        _customers[index] = _customer
        toast.current.show({
          severity: 'success',
          summary: 'Successful',
          detail: 'Customer Updated',
          life: 3000,
        })
      } else {
        _customer.id = createId()
        _customer.image = 'customer-placeholder.svg'
        _customers.push(_customer)
        toast.current.show({
          severity: 'success',
          summary: 'Successful',
          detail: 'Customer Created',
          life: 3000,
        })
      }

      setCustomers(_customers)
      setCustomerDialog(false)
      setCustomer(emptyCustomer)
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

  const onCategoryChange = (e) => {
    let _customer = { ...customer }
    _customer['category'] = e.value
    setCustomer(_customer)
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
    let _customers = customers.filter((cusItem) => cusItem.id !== selectedCustomers.id)
    setCustomers(_customers)
    setDeleteCustomersDialog(false)
    setSelectedCustomers(null)
    toast.current.show({
      severity: 'success',
      summary: 'Başarılı',
      detail: 'Kayıt silindi.',
      life: 3000,
    })
  }

  const customerDialogFooter = (
    <React.Fragment>
      <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveCustomer} />
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
            filterPlaceholder="Ara"
            style={{ minWidth: '12rem' }}
          />
          <Column
            field="last_name"
            header="Soyadı"
            filter
            filterPlaceholder="Ara"
            style={{ minWidth: '12rem' }}
          />
          <Column
            field="phone"
            header="Telefon"
            filter
            filterPlaceholder="Ara"
            style={{ minWidth: '12rem' }}
          />
          <Column
            field="tc_no"
            header="TC"
            filter
            filterPlaceholder="Ara"
            style={{ minWidth: '12rem' }}
          />
          <Column
            header="Kayıt Tarihi"
            filterField="created_at"
            dataType="date"
            style={{ minWidth: '12rem' }}
            body={dateBodyTemplate}
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
        style={{ width: '450px' }}
        header="Customer Details"
        modal
        className="p-fluid"
        footer={customerDialogFooter}
        onHide={hideDialog}
      >
        {customer.image && (
          <img
            src={`images/customer/${customer.image}`}
            onError={(e) =>
              (e.target.src =
                'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png')
            }
            alt={customer.image}
            className="customer-image block m-auto pb-3"
          />
        )}
        <div className="field">
          <label htmlFor="name">Name</label>
          <InputText
            id="name"
            value={customer.name}
            onChange={(e) => onInputChange(e, 'name')}
            required
            autoFocus
            className={classNames({ 'p-invalid': submitted && !customer.name })}
          />
          {submitted && !customer.name && <small className="p-error">Name is required.</small>}
        </div>
        <div className="field">
          <label htmlFor="description">Description</label>
          <InputTextarea
            id="description"
            value={customer.description}
            onChange={(e) => onInputChange(e, 'description')}
            required
            rows={3}
            cols={20}
          />
        </div>

        <div className="field">
          <label className="mb-3">Category</label>
          <div className="formgrid grid">
            <div className="field-radiobutton col-6">
              <RadioButton
                inputId="category1"
                name="category"
                value="Accessories"
                onChange={onCategoryChange}
                checked={customer.category === 'Accessories'}
              />
              <label htmlFor="category1">Accessories</label>
            </div>
            <div className="field-radiobutton col-6">
              <RadioButton
                inputId="category2"
                name="category"
                value="Clothing"
                onChange={onCategoryChange}
                checked={customer.category === 'Clothing'}
              />
              <label htmlFor="category2">Clothing</label>
            </div>
            <div className="field-radiobutton col-6">
              <RadioButton
                inputId="category3"
                name="category"
                value="Electronics"
                onChange={onCategoryChange}
                checked={customer.category === 'Electronics'}
              />
              <label htmlFor="category3">Electronics</label>
            </div>
            <div className="field-radiobutton col-6">
              <RadioButton
                inputId="category4"
                name="category"
                value="Fitness"
                onChange={onCategoryChange}
                checked={customer.category === 'Fitness'}
              />
              <label htmlFor="category4">Fitness</label>
            </div>
          </div>
        </div>

        <div className="formgrid grid">
          <div className="field col">
            <label htmlFor="price">Price</label>
            <InputNumber
              id="price"
              value={customer.price}
              onValueChange={(e) => onInputNumberChange(e, 'price')}
              mode="currency"
              currency="USD"
              locale="en-US"
            />
          </div>
          <div className="field col">
            <label htmlFor="quantity">Quantity</label>
            <InputNumber
              id="quantity"
              value={customer.quantity}
              onValueChange={(e) => onInputNumberChange(e, 'quantity')}
              integeronly
            />
          </div>
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
