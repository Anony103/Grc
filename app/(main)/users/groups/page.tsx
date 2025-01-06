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
   let emptygroup: Demo.Groups = {
        id: '',
        name: '',
        role:'',
        createdAt: new Date().toISOString(),  // Current date and time in ISO format
        updatedAt: new Date().toISOString(),  
        };

  
    
 
    


  
    const [groups, setgroups] = useState<Demo.Groups[]>([]);
    const [roles, setRoles] = useState<Demo.Roles[]>([]);
    const [selectedUsers, setSelectedUsers] = useState(null);
    const [groupDialog, setGroupDialog] = useState(false);
    const [deleteGroupDialog, setDeleteGroupDialog] = useState(false);
    const [deletegroupsDialog, setDeleteGroupsDialog] = useState(false);
    const [group, setgroup] = useState(emptygroup);
    const [filters1, setFilters1] = useState<DataTableFilterMeta>({});
    const [filters2, setFilters2] = useState<DataTableFilterMeta>({});
    const [selectedGroups, setSelectedGroups] = useState<Demo.Groups[]>([]);
    const [selectedRole, setSelectedRole] = useState<Demo.Roles | null>(null);
    const [enrollUserDialog, setEnrollUserDialog] = useState(false);
    const [selectedgroups, setSelectedgroups] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [enrollgroupDialog, setEnrollgroupDialog] = useState(false);
    const [selectedgroup, setSelectedgroup] = useState(null);
    const [sendNotificationDialog, setSendNotificationDialog] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationType, setNotificationType] = useState('Reminder');
    const [schedule, setSchedule] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);
    const [totalSize, setTotalSize] = useState(0);
    const fileUploadRef = useRef<FileUpload>(null);

    useEffect(() => {
        UserService.getGroups().then((data) =>{
            setgroups(data)
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

    console.log(groups);


    const openNew = () => {
        setgroup(emptygroup);
        setSubmitted(false);
        setIsEditMode(false);
        setGroupDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setGroupDialog(false);
    };

    const hideDeletegroupDialog = () => {
        setDeleteGroupDialog(false);
    };

    const hideDeletegroupsDialog = () => {
        setDeleteGroupsDialog(false);
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

    const saveGroup = async () => {
        setSubmitted(true);
    
        // Ensure the group name is not empty or just whitespace
        if (group.name.trim()) {
            let _groups = [...groups];
            let _group = { ...group };
    
            try {
                if (group.id) {
                    // Update existing group
                    const index = findIndexById(group.id);
    
                    _groups[index] = _group; // Update the group in the local array
    
                    await UserService.updatUserGroup({
                        id: group.id, // Include the ID for the update call
                        name: _group.name,
                    });
    
                    toast.current.show({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Group Updated',
                        life: 3000,
                    });

                }
                 else {
                    // Create a new group
                    _group.id = createId(); // Assign a new unique ID
    
                  const createdGroup=  await UserService.createGroup({
                        name: _group.name,
                    });

                    

    
                    _groups.push(createdGroup); // Add the new group to the local array
    
                    toast.current.show({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Group Created',
                        life: 3000,
                    });
                }
    
                // Update the state with the modified groups array
                setgroups(_groups);
    
                // Close the dialog and reset the form
                setGroupDialog(false);
                setgroup(emptygroup);
            } catch (error: any) {
                console.error('Error saving group:', error);
    
                // Display an error message
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
    

    const editgroup = (product) => {
        setgroup({ ...product });
        setIsEditMode(true);
        setGroupDialog(true);
    };

    const confirmDeletegroup = (product) => {
        setgroup(product);
        setDeleteGroupDialog(true);
    };

    const hideEnrollUserDialog = () => {
        setEnrollUserDialog(false);
    };

    const enrollUser = () => {
        // Placeholder for user enrollment logic (no actual user data)
        console.log("User Enrolled: ", selectedUser);
        setEnrollUserDialog(false);
    };

    const deletegroup = async() => {
        try {

            let _groups = groups.filter((val) => val.id !== group.id);
            setgroups(_groups);
            setDeleteGroupDialog(false);
            setgroup(emptygroup);
           await  UserService.deleteGroup({
                id:group.id
            })
            toast.current.show({
                severity: 'success',
                summary: 'Successful',
                detail: 'Group Deleted',
                life: 3000
            });
        } catch (error:any) {
            toast.current.show({
                severity: 'success',
                summary: 'Successful',
                detail: 'Group Deleted',
                life: 3000
            });
            // toast.current.show({
            //     severity: 'error',
            //     summary: 'Successful',
            //     detail: 'An error occurred while deleting the group. Please try again later.',
            //     life: 3000
            // });
        }
      
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < groups.length; i++) {
            if (groups[i].id === id) {
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
        setDeleteGroupsDialog(true);
    };

    const deleteSelectedGroups = () => {
        let _groups = groups.filter((val) => !selectedgroups.includes(val));
        setgroups(_groups);
        setDeleteGroupsDialog(false);
        setSelectedgroups(null);
        toast.current.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'groups Deleted',
            life: 3000
        });
    };

    const onCategoryChange = (e) => {
        let _group = { ...group };
        _group['category'] = e.value;
        setgroup(_group);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _group = { ...group };
        _group[`${name}`] = val;

        setgroup(_group);
    };

    const enrollUserHandler = () => {
        setEnrollUserDialog(true);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _group = { ...group };
        _group[`${name}`] = val;

        setgroup(_group);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button severity="success" label="New" icon="pi pi-plus" className="mr-2" onClick={openNew} />
                    <Button severity="danger" label="Delete" icon="pi pi-trash" className="mr-2" onClick={confirmDeleteSelected} disabled={!selectedgroups || !selectedgroups.length} />
                    <Button
                        label="Assign Role"
                        icon="pi pi-sitemap"
                        className="mr-2"
                        severity="info"
                        onClick={enrollUserHandler}
                        disabled={!selectedgroups || !selectedgroups.length} 
                    />
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

    const Header = () => {
        return (
            <div className="flex justify-content-between ">
            {/* Left-aligned button */}
            <Button 
                type="button" 
                icon="pi pi-filter-slash" 
                label="Clear" 
                outlined 
                onClick={clearFilter1} 
            />
            <div></div>
            {/* Right-aligned search bar */}
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText 
                    value={globalFilter} 
                    onChange={onGlobalFilterChange1} 
                    placeholder="Data Search" 
                />
            </span>
        </div>
        );
    };


    const sendNotificationHandler = () => {
        setSendNotificationDialog(true);
    };



    const sendNotificationRightToolbarTemplate = () => {
        return (
            <React.Fragment>
           
                <Button severity="help" label="Export" icon="pi pi-upload" onClick={exportCSV} />
            </React.Fragment>
        );
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

    const roleBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Role</span>
                {rowData.role || 'No Role Assigned'}
            </>
        );
    };
    
    

    const assignRole = () => {
        // Check if a role is selected
        if (!selectedRole) {
            toast.current?.show({
                severity: 'warn',
                summary: 'No Role Selected',
                detail: 'Please select a role before assigning.',
                life: 3000,
            });
            return;
        }
    
        // Ensure that at least one group is selected
        if (!selectedgroups || selectedgroups.length === 0) {
            toast.current?.show({
                severity: 'warn',
                summary: 'No Groups Selected',
                detail: 'Please select at least one group to assign a role.',
                life: 3000,
            });
            return;
        }
    
        // Get the role name (string) from the selectedRole object
        const roleName = selectedRole.name; // Assuming 'selectedRole' is of type 'Roles' and 'name' is the string
    
        // Update the role for selected groups
        let updatedGroups = [...groups];
        
        selectedgroups.forEach((group) => {
            const groupIndex = findIndexById(group.id);
            try {
            UserService.updatUserGroup({
                id:group.id,
                name:group.name,
                role:roleName
            })

            if (groupIndex !== -1) {

                updatedGroups[groupIndex] = { 
                    ...updatedGroups[groupIndex], 
                    role: roleName // Assign the role name (string) directly
                };
            }

        }
        catch(error:any){
              // Display an error message
              toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail:
                  'An error occurred while saving the group. Please try again later.',
                life: 5000,
            });

        }
        });
    
        // Update the groups state with the new role assignment
        setgroups(updatedGroups);
    
        // Close the dialog and reset the selected role
        setEnrollUserDialog(false);
        setSelectedRole(null);
    
        // Show success toast
        toast.current?.show({
            severity: 'success',
            summary: 'Role Assigned',
            detail: 'Role has been successfully assigned to the selected groups.',
            life: 3000,
        });
    };
    
    
    
    


    const enrollUserDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" onClick={hideEnrollUserDialog} />
            <Button label="Assign" icon="pi pi-check" severity="success" onClick={assignRole} />
        </>
    );
    

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editgroup(rowData)} />
                <Button icon="pi pi-trash text-white bg-red-600" style={{backgroundColor:"#ef4444"}} rounded severity="warning" onClick={() => confirmDeletegroup(rowData)} />
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

    const groupDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" severity="success" onClick={saveGroup} />
        </>
    );
    const deletegroupDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeletegroupDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deletegroup} />
        </>
    );
    const deletegroupsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeletegroupsDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedGroups} />
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
                        value={groups}
                        selection={selectedgroups}
                        onSelectionChange={(e) => setSelectedgroups(e.value)}
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} groups"
                        filters={filters1}
                        emptyMessage="No groups found."
                        header={header}
                        responsiveLayout="scroll"
                        dataKey='id'
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="ID" sortable body={idBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="name" header="Name" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="role" header="Role" body={roleBodyTemplate} sortable headerStyle={{ minWidth: '15rem' }} sortField="role" filter filterPlaceholder="Search by Role"></Column>
                        <Column field="createdAt" header="Created At" sortable  headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="updatedAt" header="Updated At" sortable  headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog 
                        visible={groupDialog} 
                        style={{ width: '800px' }} 
                        header="Group Details" 
                        modal 
                        className="p-fluid" 
                        footer={groupDialogFooter} 
                        onHide={hideDialog}
                    >
                        {/* ID */}
                        {isEditMode && (
                            <div className="field">
                                <label htmlFor="id">Group ID</label>
                                <InputText
                                    id="id"
                                    value={group.id}
                                    readOnly
                                    className="p-inputtext p-disabled" // Optional: Add styles to indicate it's read-only
                                />
                            </div>
                        )}

                        {/* Name */}
                        <div className="field">
                            <label htmlFor="name">Group Name</label>
                            <InputText
                                id="name"
                                value={group.name}
                                onChange={(e) => onInputChange(e, "name")}
                                required
                                className={classNames({ "p-invalid": submitted && !group.name })}
                            />
                            {submitted && !group.name && (
                                <small className="p-invalid">group Name is required.</small>
                            )}
                        </div>

                    </Dialog>

                    <Dialog style={{ width: '600px' }} visible={enrollUserDialog} header="Assign Role" footer={enrollUserDialogFooter} modal onHide={hideEnrollUserDialog}>
                        <DataTable
                            value={roles}
                            selection={selectedRole}
                            onSelectionChange={(e) => setSelectedRole(e.value)}
                            paginator
                            rows={5}
                            dataKey="id"
                            selectionMode="single"
                        >
                            <Column selectionMode="single" headerStyle={{ width: '4rem' }}></Column>
                            <Column field="name" header="Role Name" sortable></Column>
                        </DataTable>
                    </Dialog>



                    <Dialog visible={deleteGroupDialog} style={{ width: '450px' }} header="Confirm" modal footer={deletegroupDialogFooter} onHide={hideDeletegroupDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {group && (
                                <span>
                                    Are you sure you want to delete <b>{group.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deletegroupsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deletegroupsDialogFooter} onHide={hideDeletegroupsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {group && <span>Are you sure you want to delete the selected awereness?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Crud;
