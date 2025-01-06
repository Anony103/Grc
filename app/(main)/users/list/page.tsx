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
   let emptyUser: Demo.Users = {
    id: '',
        firstName: '',
        lastName: '',
        email: '',
        userGroupName: '', 
        createdAt:'',
        updatedAt:'',
        };

  
    
 
    


  
    const [users, setUsers] = useState<Demo.Users[]>([]);
    const [groups, setGroups] = useState<Demo.Groups[]>([]);
    const [userDialog, setUserDialog] = useState(false);
    const [deleteUserDialog, setDeleteUserDialog] = useState(false);
    const [deleteUsersDialog, setDeleteUsersDialog] = useState(false);
    const [user, setUser] = useState(emptyUser);
    const [filters1, setFilters1] = useState<DataTableFilterMeta>({});
    const [filters2, setFilters2] = useState<DataTableFilterMeta>({});

    const [selectedusers, setSelectedusers] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [enrollUserDialog, setEnrollUserDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [sendNotificationDialog, setSendNotificationDialog] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationType, setNotificationType] = useState('Reminder');
    const [schedule, setSchedule] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);
    const [totalSize, setTotalSize] = useState(0);
    const fileUploadRef = useRef<FileUpload>(null);

    useEffect(() => {
        UserService.getUsers().then((data) =>{
            setUsers(data)
        initFilters1();
         });
       
        UserService.getGroups().then((data)=>{
            setGroups(data)
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

    console.log(users);


    const openNew = () => {
        setUser(emptyUser);
        setSubmitted(false);
        setIsEditMode(false);
        setUserDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setUserDialog(false);
    };

    const hideDeleteUserDialog = () => {
        setDeleteUserDialog(false);
    };

    const hideDeleteUsersDialog = () => {
        setDeleteUsersDialog(false);
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

    const saveuser =async () => {
        setSubmitted(true);

        if (user.firstName.trim()) {
            let _users = [...users];
            let _user = { ...user };
            try {
                if (user.id) {
                    const index = findIndexById(user.id);
    
                    _users[index] = _user;
                    toast.current.show({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'User Updated',
                        life: 3000
                    });
                } else {
                    _user.id = createId();
                    _user.id = createId();
    
                  const createdUser= await UserService.createUser(_user);
                    _users.push(createdUser);
                    toast.current.show({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'User Created',
                        life: 3000
                    });
                }
                setUsers(_users);
                setUserDialog(false);
                setUser(emptyUser);
            } catch (error:any) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail:
                        error.message || 'An error occurred while saving the group. Please try again later.',
                    life: 5000,
                });
                
            }
          

           
        }
    };

    const edituser = (product) => {
        setUser({ ...product });
        setIsEditMode(true);
        setUserDialog(true);
    };

    const confirmDeleteuser = (product) => {
        setUser(product);
        setDeleteUserDialog(true);
    };

    const deleteuser = async() => {
        try{
            let _users = users.filter((val) => val.id !== user.id);
                await UserService.deleteUser({
                    email:user.email
                })
            setUsers(_users);
            setDeleteUserDialog(false);
            setUser(emptyUser);
            toast.current.show({
                severity: 'success',
                summary: 'Successful',
                detail: 'User Deleted',
                life: 3000
            });
        }
        catch(error:any){

        }
       
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < users.length; i++) {
            if (users[i].id === id) {
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
        setDeleteUsersDialog(true);
    };

    const deleteSelectedusers = () => {
        let _users = users.filter((val) => !selectedusers.includes(val));
        setUsers(_users);
        setDeleteUsersDialog(false);
        setSelectedusers(null);
        toast.current.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Users Deleted',
            life: 3000
        });
    };

    const onCategoryChange = (e) => {
        let _user = { ...user };
        _user['category'] = e.value;
        setUser(_user);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _user = { ...user };
        _user[`${name}`] = val;

        setUser(_user);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _user = { ...user };
        _user[`${name}`] = val;

        setUser(_user);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button severity="success" label="New" icon="pi pi-plus" className="mr-2" onClick={openNew} />
                    <Button severity="danger" label="Delete" icon="pi pi-trash" className="mr-2" onClick={confirmDeleteSelected} disabled={!selectedusers || !selectedusers.length} />
                   
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
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => edituser(rowData)} />
                <Button icon="pi pi-trash text-white bg-red-600" style={{backgroundColor:"#ef4444"}} rounded severity="warning" onClick={() => confirmDeleteuser(rowData)} />
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

    const userDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" severity="success" onClick={saveuser} />
        </>
    );
    const deleteUserDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteUserDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteuser} />
        </>
    );
    const deleteUsersDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteUsersDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedusers} />
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
                        value={users}
                        selection={selectedUsers}
                        onSelectionChange={(e) => setSelectedUsers(e.value)}
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Users"
                        filters={filters1}
                        emptyMessage="No Users found."
                        header={header}
                        responsiveLayout="scroll"
                        dataKey='id'
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="ID" sortable body={idBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="firstName" header="First Name" sortable  headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="lastName" header="Last Name" sortable  headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="email" header="Email" sortable  headerStyle={{ minWidth: '15rem' }}></Column>
                  
                        <Column field="userGroupName" header="User Group" sortable  headerStyle={{ minWidth: '15rem' }}></Column>

                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog 
                        visible={userDialog} 
                        style={{ width: '800px' }} 
                        header="User Details" 
                        modal 
                        className="p-fluid" 
                        footer={userDialogFooter} 
                        onHide={hideDialog}
                    >
                        {/* ID */}
                        {isEditMode && (
                            <div className="field">
                                <label htmlFor="id">User ID *</label>
                                <InputText
                                    id="id"
                                    value={user.id}
                                    readOnly
                                    className="p-inputtext p-disabled" // Optional: Add styles to indicate it's read-only
                                />
                            </div>
                        )}

                        {/* Name */}
                        <div className="field">
                            <label htmlFor="name">First Name *</label>
                            <InputText
                                id="firstName"
                                value={user.firstName}
                                onChange={(e) => onInputChange(e, "firstName")}
                                required
                                className={classNames({ "p-invalid": submitted && !user.firstName })}
                            />
                            {submitted && !user.firstName && (
                                <small className="p-invalid">First Name is required.</small>
                            )}
                        </div>

                          {/* Name */}
                          <div className="field">
                            <label htmlFor="name">Last Name *</label>
                            <InputText
                                id="lastName"
                                value={user.lastName}
                                onChange={(e) => onInputChange(e, "lastName")}
                                required
                                className={classNames({ "p-invalid": submitted && !user.lastName })}
                            />
                            {submitted && !user.lastName && (
                                <small className="p-invalid">Last Name is required.</small>
                            )}
                        </div>

                       
  {/* Email */}
  <div className="field">
                            <label htmlFor="name">Email *</label>
                            <InputText
                                id="email"
                                value={user.email}
                                onChange={(e) => onInputChange(e, "email")}
                                required
                                className={classNames({ "p-invalid": submitted && !user.email })}
                            />
                            {submitted && !user.email && (
                                <small className="p-invalid">Email is required.</small>
                            )}
                        </div>

      {/* Email */}
  <div className="field">
                            <label htmlFor="name">User Group *</label>
                            <Dropdown
            id="userGroupName"
            value={user.userGroupName}
            options={groups}
            onChange={(e) => onInputChange(e,'userGroupName')}
            optionLabel="name"
            optionValue='name'
            
            placeholder="Select group"

        />
                            {/* <InputText
                                id="email"
                                value={user.userGroupName}
                                onChange={(e) => onInputChange(e, "userGroupName")}
                                required
                                className={classNames({ "p-invalid": submitted && !user.userGroupName })}
                            /> */}
                            {submitted && !user.userGroupName && (
                                <small className="p-invalid">User Group is required.</small>
                            )}
                        </div>
                    

                     

                      
                      
                    </Dialog>


                    <Dialog visible={deleteUserDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteUserDialogFooter} onHide={hideDeleteUserDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {user && (
                                <span>
                                    Are you sure you want to delete <b>{user.id}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteUsersDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteUsersDialogFooter} onHide={hideDeleteUsersDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {user && <span>Are you sure you want to delete the selected awereness?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Crud;
