import 'primeicons/primeicons.css'
import 'primereact/resources/themes/lara-light-indigo/theme.css'
import 'primereact/resources/primereact.css'
import 'primeflex/primeflex.css'
import './index.css'
import ReactDOM from 'react-dom'

import React, { useState, useEffect } from 'react'
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

const Customer = () => {
  const [customers, setCustomers] = useState(null)
  const [filters, setFilters] = useState(null)
  const [globalFilterValue, setGlobalFilterValue] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedProduct5, setSelectedProduct5] = useState(null)

  const customerService = new CustomerService()

  useEffect(() => {
    // customerService.getCustomersLarge().then((data) => {
    //   setCustomers(getCustomers(data))
    //   setLoading(false)
    // })
    getCustomerList(true)
    initFilters()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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

  const menuItems = [
    {
      label: 'Müşteri',
      icon: 'pi pi-fw pi-file',
      items: [
        {
          label: 'Yeni',
          icon: 'pi pi-fw pi-plus',
        },
        {
          label: 'Güncelle',
          icon: 'pi pi-fw pi-pencil',
        },
        {
          separator: true,
        },
        {
          label: 'Sil',
          icon: 'pi pi-fw pi-trash',
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

  const header = renderHeader()

  return (
    <div className="datatable-filter-demo">
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
          selection={selectedProduct5}
          onSelectionChange={(e) => setSelectedProduct5(e.value)}
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
    </div>
  )
}

export default Customer
