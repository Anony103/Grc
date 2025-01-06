'use client';

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable, DataTableFilterMeta, } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload, FileUploadSelectEvent, FileUploadUploadEvent } from 'primereact/fileupload';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { RadioButton } from 'primereact/radiobutton';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { InputTextarea } from 'primereact/inputtextarea';
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import {  UserService } from '@/demo/service/ProductService';
import type { Demo } from '@/types';
import { FilterMatchMode, FilterOperator } from 'primereact/api';

const Crud = () => {
   let emptyRole: Demo.Roles = {
        id: '',
        name: '',
        createdAt: '',
        updatedAt: '',
        };


    const [Roles, setRoles] = useState<Demo.Roles[]>([]);
    const [RoleDialog, setRoleDialog] = useState(false);
    const [deleteRoleDialog, setDeleteRoleDialog] = useState(false);
    const [deleteRolesDialog, setDeleteRolesDialog] = useState(false);
    const [Role, setRole] = useState(emptyRole);
    const [filters1, setFilters1] = useState<DataTableFilterMeta>({});
    const [filters2, setFilters2] = useState<DataTableFilterMeta>({});
    const [selectedroles, setSelectedroles] = useState(null);
    const [selectedRoles, setSelectedRoles] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [enrollRoleDialog, setEnrollRoleDialog] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [sendNotificationDialog, setSendNotificationDialog] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationType, setNotificationType] = useState('Reminder');
    const [schedule, setSchedule] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);
    const [totalSize, setTotalSize] = useState(0);
    const fileUploadRef = useRef<FileUpload>(null);

    useEffect(() => {
        UserService.getRoles().then((data) =>{
            setRoles(data)
        initFilters1();
         });
       
         UserService.getRoles().then((data)=>{
            setRoles(data)
            initFilters2()
        })
    }, []);

    const formatDate = (value) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: '2-digit'
        }).format(new Date(value));
    };

    const clearFilter1 = () => {
        initFilters1();
    };

    const clearFilter2 = () => {
        initFilters2();
    };

    const onGlobalFilterChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let _filters1 = { ...filters1 };
        (_filters1['global'] as any).value = value;

        setFilters1(_filters1);
        setGlobalFilter(value);
    };

    console.log(Roles);


    const openNew = () => {
        setRole(emptyRole);
        setSubmitted(false);
        setIsEditMode(false);
        setRoleDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setRoleDialog(false);
    };

    const hideDeleteRoleDialog = () => {
        setDeleteRoleDialog(false);
    };

    const hideDeleteRolesDialog = () => {
        setDeleteRolesDialog(false);
    };

    const initFilters1 = () => {
        setFilters1({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            name: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            },
            'country.name': {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            },
            representative: { value: null, matchMode: FilterMatchMode.IN },
            date: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }]
            },
            balance: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
            },
            status: {
                operator: FilterOperator.OR,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
            },
            activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
            verified: { value: null, matchMode: FilterMatchMode.EQUALS }
        });
        setGlobalFilter('');
    };

    const initFilters2 = () => {
        setFilters1({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            name: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            },
            'country.name': {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            },
            representative: { value: null, matchMode: FilterMatchMode.IN },
            date: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }]
            },
            balance: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
            },
            status: {
                operator: FilterOperator.OR,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
            },
            activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
            verified: { value: null, matchMode: FilterMatchMode.EQUALS }
        });
        setGlobalFilter('');
    };

    const saveRole = () => {
        setSubmitted(true);

        if (Role.name.trim()) {
            let _Roles = [...Roles];
            let _Role = { ...Role };
            if (Role.id) {
                const index = findIndexById(Role.id);

                _Roles[index] = _Role;
                toast.current.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Role Updated',
                    life: 3000
                });
            } else {
                _Role.id = createId();
                _Role.id = createId();
                _Roles.push(_Role);
                toast.current.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Campaing Created',
                    life: 3000
                });
            }

            setRoles(_Roles);
            setRoleDialog(false);
            setRole(emptyRole);
        }
    };

    const editRole = (product) => {
        setRole({ ...product });
        setIsEditMode(true);
        setRoleDialog(true);
    };

    const confirmDeleteRole = (product) => {
        setRole(product);
        setDeleteRoleDialog(true);
    };

    const deleteRole = () => {
        let _Roles = Roles.filter((val) => val.id !== Role.id);
        setRoles(_Roles);
        setDeleteRoleDialog(false);
        setRole(emptyRole);
        toast.current.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Role Deleted',
            life: 3000
        });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < Roles.length; i++) {
            if (Roles[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteRolesDialog(true);
    };

    const deleteSelectedRoles = () => {
        let _Roles = Roles.filter((val) => !selectedRoles.includes(val));
        setRoles(_Roles);
        setDeleteRolesDialog(false);
        setSelectedRoles(null);
        toast.current.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Roles Deleted',
            life: 3000
        });
    };

    const onCategoryChange = (e) => {
        let _Role = { ...Role };
        _Role['category'] = e.value;
        setRole(_Role);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _Role = { ...Role };
        _Role[`${name}`] = val;

        setRole(_Role);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _Role = { ...Role };
        _Role[`${name}`] = val;

        setRole(_Role);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button severity="success" label="New" icon="pi pi-plus" className="mr-2" onClick={openNew} />
                    <Button severity="danger" label="Delete" icon="pi pi-trash" className="mr-2" onClick={confirmDeleteSelected} disabled={!selectedRoles || !selectedRoles.length} />
                </div>
            </React.Fragment>
        );
    };

 


    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Import" className="mr-2 inline-block" />
                <Button severity="help" label="Export" icon="pi pi-upload" onClick={exportCSV} />
            </React.Fragment>
        );
    };


    const sendNotificationHandler = () => {
        setSendNotificationDialog(true);
    };
    




    const idBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">ID</span>
                {rowData.id}
            </>
        );
    };
    

    const nameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.name}
            </>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editRole(rowData)} />
                <Button icon="pi pi-trash text-white bg-red-600" style={{backgroundColor:"#ef4444"}} rounded severity="warning" onClick={() => confirmDeleteRole(rowData)} />
            </>
        );
    };

    const header = () => {
        return (
            <div className="flex justify-content-between">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter1} />
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilter} onChange={onGlobalFilterChange1} placeholder="Data Search" />
                </span>
            </div>
        );
    };

    const RoleDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" severity="success" onClick={saveRole} />
        </>
    );
    const deleteRoleDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteRoleDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteRole} />
        </>
    );
    const deleteRolesDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteRolesDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedRoles} />
        </>
    );
    const onTemplateSelect = (e: FileUploadSelectEvent) => {
        let _totalSize = totalSize;
        let files = e.files;

        for (let i = 0; i < files.length; i++) {
            _totalSize += files[i].size || 0;
        }

        setTotalSize(_totalSize);
    };

  

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={Roles}
                        selection={selectedRoles}
                        onSelectionChange={(e) => setSelectedRoles(e.value)}
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Roles"
                        filters={filters1}
                        emptyMessage="No Roles found."
                        header={header}
                        responsiveLayout="scroll"
                        dataKey='id'
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="ID" sortable body={idBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="name" header="Name" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="createdAt" header="Created At" sortable  headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="updatedAt" header="Updated At" sortable  headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog 
                        visible={RoleDialog} 
                        style={{ width: '800px' }} 
                        header="Role Details" 
                        modal 
                        className="p-fluid" 
                        footer={RoleDialogFooter} 
                        onHide={hideDialog}
                    >
                        {/* ID */}
                        {isEditMode && (
                            <div className="field">
                                <label htmlFor="id">Role ID</label>
                                <InputText
                                    id="id"
                                    value={Role.id}
                                    readOnly
                                    className="p-inputtext p-disabled" // Optional: Add styles to indicate it's read-only
                                />
                            </div>
                        )}

                        {/* Name */}
                        <div className="field">
                            <label htmlFor="name">Role Name</label>
                            <InputText
                                id="name"
                                value={Role.name}
                                onChange={(e) => onInputChange(e, "name")}
                                required
                                className={classNames({ "p-invalid": submitted && !Role.name })}
                            />
                            {submitted && !Role.name && (
                                <small className="p-invalid">Role Name is required.</small>
                            )}
                        </div>

                       

                    

                     

                      
                      
                    </Dialog>


                    <Dialog visible={deleteRoleDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteRoleDialogFooter} onHide={hideDeleteRoleDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {Role && (
                                <span>
                                    Are you sure you want to delete <b>{Role.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteRolesDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteRolesDialogFooter} onHide={hideDeleteRolesDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {Role && <span>Are you sure you want to delete the selected awereness?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Crud;
