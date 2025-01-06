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
import { AwerenessService, CampaignService, NotificationTemplateService, UserService } from '@/demo/service/ProductService';
import type { Demo } from '@/types';
import { FilterMatchMode, FilterOperator } from 'primereact/api';

const Crud = () => {
   let emptyCampaign: Demo.Campaign = {
        id: '',
        name: '',
        startDate: '',
        endDate: '',
        time: '',
        content: '',
        allowComments: false,
        enrolledUsers: [],
        completedUsers: [],
        notifications: [],
        type: '',
        status: '',
        createdAt: '',
        updatedAt: '',
    };

 


    const [campaigns, setCampaigns] = useState<Demo.Campaign[]>([]);
    const [notificationTemplates, setNotificationTemplates] = useState<Demo.NotificationTemplate[]>([]);
    const [enrolledUsers, setEnrolledUsers] = useState<Demo.Users[]>([]);
    const [campaignDialog, setCampaignDialog] = useState(false);
    const [deleteCampaignDialog, setDeleteCampaignDialog] = useState(false);
    const [deleteCampaignssDialog, setDeleteCampaignssDialog] = useState(false);
    const [campaign, setCampaign] = useState(emptyCampaign);
    const [filters1, setFilters1] = useState<DataTableFilterMeta>({});
    const [filters2, setFilters2] = useState<DataTableFilterMeta>({});

    const [selectedCampaigns, setSelectedCampaigns] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [enrollUserDialog, setEnrollUserDialog] = useState(false);
    const [enrollUserListDialog, setEnrollUserListDialog] = useState(false);
    
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
        CampaignService.getCampaign().then((data) =>{
            setCampaigns(data)
        initFilters1();
         });
        NotificationTemplateService.getNotificationTemplates().then((data) =>{
         
            setNotificationTemplates(data)
      

        });
        UserService.getUsers().then((data)=>{
            setEnrolledUsers(data)
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

    console.log(campaigns);


    const openNew = () => {
        setCampaign(emptyCampaign);
        setSubmitted(false);
        setIsEditMode(false);
        setCampaignDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setCampaignDialog(false);
    };

    const hideDeleteCampaignDialog = () => {
        setDeleteCampaignDialog(false);
    };

    const hideDeleteCampaignssDialog = () => {
        setDeleteCampaignssDialog(false);
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

    const saveCampaign = () => {
        setSubmitted(true);

        if (campaign.name.trim()) {
            let _campaigns = [...campaigns];
            let _campaign = { ...campaign };
            if (campaign.id) {
                const index = findIndexById(campaign.id);

                _campaigns[index] = _campaign;
                toast.current.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Campaign Updated',
                    life: 3000
                });
            } else {
                _campaign.id = createId();
                _campaign.id = createId();
                _campaigns.push(_campaign);
                toast.current.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Campaing Created',
                    life: 3000
                });
            }

            setCampaigns(_campaigns);
            setCampaignDialog(false);
            setCampaign(emptyCampaign);
        }
    };

    const editCampaign = (product) => {
        setCampaign({ ...product });
        setIsEditMode(true);
        setCampaignDialog(true);
    };

    const confirmDeleteCampaign = (product) => {
        setCampaign(product);
        setDeleteCampaignDialog(true);
    };

    const deleteCampaign = () => {
        let _campaigns = campaigns.filter((val) => val.id !== campaign.id);
        setCampaigns(_campaigns);
        setDeleteCampaignDialog(false);
        setCampaign(emptyCampaign);
        toast.current.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Campaign Deleted',
            life: 3000
        });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < campaigns.length; i++) {
            if (campaigns[i].id === id) {
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
        setDeleteCampaignssDialog(true);
    };

    const deleteSelectedCampaigns = () => {
        let _campaigns = campaigns.filter((val) => !selectedCampaigns.includes(val));
        setCampaigns(_campaigns);
        setDeleteCampaignssDialog(false);
        setSelectedCampaigns(null);
        toast.current.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Campaigns Deleted',
            life: 3000
        });
    };

    const onCategoryChange = (e) => {
        let _campaign = { ...campaign };
        _campaign['category'] = e.value;
        setCampaign(_campaign);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _campaign = { ...campaign };
        _campaign[`${name}`] = val;

        setCampaign(_campaign);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _campaign = { ...campaign };
        _campaign[`${name}`] = val;

        setCampaign(_campaign);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button severity="success" label="New" icon="pi pi-plus" className="mr-2" onClick={openNew} />
                    <Button severity="danger" label="Delete" icon="pi pi-trash" className="mr-2" onClick={confirmDeleteSelected} disabled={!selectedCampaigns || !selectedCampaigns.length} />
                    <Button
                label="Send Notification"
                icon="pi pi-send"
                className="mr-2"
                severity="info"
                onClick={sendNotificationHandler}
                disabled={!selectedCampaigns || !selectedCampaigns.length} 
            />

            {/* List of Notifications */}
            <Button
                label="List of Notifications"
                icon="pi pi-bell"
                className="mr-2"
                severity="warning"
                onClick={listNotificationsHandler}
                disabled={!selectedCampaigns || !selectedCampaigns.length} 
            />
                </div>
            </React.Fragment>
        );
    };

    const sendNotificationLeftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                <Button
                label="List of Enrolled Users"
                icon="pi pi-user-plus"
                className="mr-2"
                severity="success"
              
            />
           

                </div>
            </React.Fragment>
        );
    };

    const enrollUserLeftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                <Button
                label="Enroll A User"
                icon="pi pi-user-plus"
                className="mr-2"
                severity="success"
              
            />
           

                </div>
            </React.Fragment>
        );
    };


    const sendNotificationRightToolbarTemplate = () => {
        return (
            <React.Fragment>
           
                <Button severity="help" label="Export" icon="pi pi-upload" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                 <Button
                label="Enroll User"
                icon="pi pi-user-plus"
                className="mr-2"
                severity="success"
                onClick={enrollUserHandler}
                disabled={!selectedCampaigns || !selectedCampaigns.length} 
            />

            {/* List of Enrolled Users */}
            <Button
                label="List of Enrolled Users"
                icon="pi pi-users"
                className="mr-2"
                // severity="primary"
                onClick={listEnrolledUsersHandler}
                disabled={!selectedCampaigns || !selectedCampaigns.length} 
            />
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Import" className="mr-2 inline-block" />
                <Button severity="help" label="Export" icon="pi pi-upload" onClick={exportCSV} />
            </React.Fragment>
        );
    };


    const sendNotificationHandler = () => {
        setSendNotificationDialog(true);
    };
    
    // Handler to close the dialog
    const hideSendNotificationDialog = () => {
        setSendNotificationDialog(false);
    };
    
    // Handler to send the notification
    const sendNotification = () => {
        // Placeholder logic to send notification (no actual data)
        // console.log("Notification Sent: ", {
        //     content: notificationMessage,
        //     schedule,
        //     type: notificationType
        // });
        toast.current.show({
            severity: 'success',
            summary: 'Notification Sent',
            detail: 'Enrolled Users Notified',
            life: 3000
        });
        setSendNotificationDialog(false);
    };

const listNotificationsHandler = () => {
    // Logic to open a dialog or navigate to a list of notifications
    console.log("List of Notifications Clicked");
};

// Handlers for Right Toolbar
const enrollUserHandler = () => {
    setEnrollUserDialog(true);
};

// Handler to close the dialog
const hideEnrollUserDialog = () => {
    setEnrollUserDialog(false);
};
const hideEnrollUserListDialog = () => {
    setEnrollUserListDialog(false);
};


// Handler to enroll the user
const enrollUser = () => {
    // Placeholder for user enrollment logic (no actual user data)
    console.log("User Enrolled: ", selectedUser);
    setEnrollUserDialog(false);
};

const listEnrolledUsersHandler = () => {
    // Logic to open a dialog or navigate to the enrolled users list
    console.log("List of Enrolled Users Clicked");
    setEnrollUserListDialog(true);
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
    

    const startDateBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Start Date</span>
                {rowData.startDate}
            </>
        );
    };
    

    const endDateBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">End Date</span>
                {rowData.endDate}
            </>
        );
    };
    

    const timeBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Time</span>
                {rowData.time}
            </>
        );
    };
    

    const contentBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Content</span>
               <iframe src={rowData.content}   className="shadow-2" width="150"  height={'80'} /> 
            </>
        );
    };

    const allowCommentsBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Allow Comments</span>
                {rowData.allowComments ? "Yes" : "No"}
            </>
        );
    };
    
    const enrolledUsersBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Enrolled Users</span>
                {rowData.enrolledUsers.length}
            </>
        );
    };
    
    const completedUsersBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Completed Users</span>
                {rowData.completedUsers.length}
            </>
        );
    };
    
    const notificationsBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Notifications</span>
                {rowData.notifications.length}
            </>
        );
    };
    
    const typeBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Type</span>
                {rowData.type}
            </>
        );
    };
    
    const statusBodyTemplate = (rowData) => {
        const statusClass =
            rowData.status === "Active"
                ? "bg-green-500 px-2 border-round-sm"
                : rowData.status === "Inactive"
                ? "bg-yellow-500 px-2 border-round-sm"
                : "bg-blue-500 px-2 border-round-sm";
    
        return (
            <>
                <span className="p-column-title">Status</span>
                <span className={statusClass}>{rowData.status}</span>
            </>
        );
    };

    const createdAtBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Created At</span>
                {rowData.createdAt}
            </>
        );
    };

    const updatedAtBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Updated At</span>
                {rowData.updatedAt}
            </>
        );
    };

    
    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editCampaign(rowData)} />
                <Button icon="pi pi-trash text-white bg-red-600" style={{backgroundColor:"#ef4444"}} rounded severity="warning" onClick={() => confirmDeleteCampaign(rowData)} />
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
    const sendNotificationHeader = () => {
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

    const campaignDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" severity="success" onClick={saveCampaign} />
        </>
    );
    const deleteCampaignDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteCampaignDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteCampaign} />
        </>
    );
    const deleteCampaignssDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteCampaignssDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedCampaigns} />
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

    const onTemplateUpload = (e: FileUploadUploadEvent) => {
        let _totalSize = 0;

        e.files.forEach((file) => {
            _totalSize += file.size || 0;
        });

        setTotalSize(_totalSize);
        toast.current?.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    };
    const onTemplateRemove = (file: File, callback: Function) => {
        setTotalSize(totalSize - file.size);
        callback();
    };

    const onTemplateClear = () => {
        setTotalSize(0);
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={campaigns}
                        selection={selectedCampaigns}
                        onSelectionChange={(e) => setSelectedCampaigns(e.value)}
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} campaigns"
                        filters={filters1}
                        emptyMessage="No campaigns found."
                        header={header}
                        responsiveLayout="scroll"
                        dataKey='id'
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="ID" sortable body={idBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="name" header="Name" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="startDate" header="Start Date" sortable body={startDateBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="endDate" header="End Date" sortable body={endDateBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="time" header="Time" sortable body={timeBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="content" header="Content" sortable body={contentBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="allowComments" header="Allow Comments" body={allowCommentsBodyTemplate}></Column>
                        <Column field="enrolledUsers" header="Enrolled Users" body={enrolledUsersBodyTemplate}></Column>
                        <Column field="completedUsers" header="Completed Users" body={completedUsersBodyTemplate}></Column>
                        <Column field="notifications" header="Notifications" body={notificationsBodyTemplate}></Column>
                        <Column field="type" header="Type" body={typeBodyTemplate}></Column>
                        <Column field="status" header="Status" body={statusBodyTemplate}></Column>
                        <Column field="createdAt" header="Created At" body={createdAtBodyTemplate}></Column>
                        <Column field="updatedAt" header="Updated At" body={updatedAtBodyTemplate}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog 
                        visible={campaignDialog} 
                        style={{ width: '800px' }} 
                        header="Campaign Details" 
                        modal 
                        className="p-fluid" 
                        footer={campaignDialogFooter} 
                        onHide={hideDialog}
                    >
                        {/* ID */}
                        {isEditMode && (
                            <div className="field">
                                <label htmlFor="id">Campaign ID</label>
                                <InputText
                                    id="id"
                                    value={campaign.id}
                                    readOnly
                                    className="p-inputtext p-disabled" // Optional: Add styles to indicate it's read-only
                                />
                            </div>
                        )}

                        {/* Name */}
                        <div className="field">
                            <label htmlFor="name">Campaign Name</label>
                            <InputText
                                id="name"
                                value={campaign.name}
                                onChange={(e) => onInputChange(e, "name")}
                                required
                                className={classNames({ "p-invalid": submitted && !campaign.name })}
                            />
                            {submitted && !campaign.name && (
                                <small className="p-invalid">Campaign Name is required.</small>
                            )}
                        </div>

                        {/* Start Date */}
                        <div className="field">
                            <label htmlFor="startDate">Start Date</label>
                            <InputText
                                id="startDate"
                                type="date"
                                value={campaign.startDate}
                                onChange={(e) => onInputChange(e, "startDate")}
                                required
                            />
                        </div>

                        {/* End Date */}
                        <div className="field">
                            <label htmlFor="endDate">End Date</label>
                            <InputText
                                id="endDate"
                                type="date"
                                value={campaign.endDate}
                                onChange={(e) => onInputChange(e, "endDate")}
                                required
                            />
                        </div>

                        {/* Time */}
                        <div className="field">
                            <label htmlFor="time">Time</label>
                            <InputText
                                id="time"
                                value={campaign.time}
                                onChange={(e) => onInputChange(e, "time")}
                                required
                            />
                        </div>

                        {/* Content */}
                        <div className="field">
                            <label htmlFor="content">Content</label>

                            <FileUpload 
                            ref={fileUploadRef} 
                            onUpload={onTemplateUpload} onSelect={onTemplateSelect} 
                            />
                            {/* <InputTextarea
                                id="content"
                                value={campaign.content}
                                onChange={(e) => onInputChange(e, "content")}
                                rows={3}
                                required
                            /> */}
                        </div>

                        {/* Allow Comments */}
                        <div className="field-checkbox">
                            <Checkbox
                                inputId="allowComments"
                                checked={campaign.allowComments}
                                onChange={(e) => onInputChange(e, "allowComments")}
                            />
                            <label htmlFor="allowComments">Allow Comments</label>
                        </div>

                        {/* Enrolled Users */}
                        <div className="field">
                            <label htmlFor="enrolledUsers">Enrolled Users</label>
                            <InputNumber
                                id="enrolledUsers"
                                value={campaign.enrolledUsers.length}
                                disabled
                            />
                        </div>

                        {/* Completed Users */}
                        <div className="field">
                            <label htmlFor="completedUsers">Completed Users</label>
                            <InputNumber
                                id="completedUsers"
                                value={campaign.completedUsers.length}
                                disabled
                            />
                        </div>

                        {/* Notifications */}
                        <div className="field">
                            <label htmlFor="notifications">Notifications</label>
                            <InputNumber
                                id="notifications"
                                value={campaign.notifications.length}
                                disabled
                            />
                        </div>

                        {/* Type */}
                        <div className="field">
                            <label className="mb-3">Type</label>
                            <div className="formgrid grid">
                                <div className="field-radiobutton col-4">
                                    <RadioButton
                                        inputId="type1"
                                        name="type"
                                        value="Internal"
                                        onChange={(e) => onInputChange(e, "type")}
                                        checked={campaign.type === "Internal"}
                                    />
                                    <label htmlFor="type1">Internal</label>
                                </div>
                                <div className="field-radiobutton col-4">
                                    <RadioButton
                                        inputId="type2"
                                        name="type"
                                        value="External"
                                        onChange={(e) => onInputChange(e, "type")}
                                        checked={campaign.type === "External"}
                                    />
                                    <label htmlFor="type2">External</label>
                                </div>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="field">
                            <label className="mb-3">Status</label>
                            <div className="formgrid grid">
                                <div className="field-radiobutton col-4">
                                    <RadioButton
                                        inputId="status1"
                                        name="status"
                                        value="Completed"
                                        onChange={(e) => onInputChange(e, "status")}
                                        checked={campaign.status === "Completed"}
                                    />
                                    <label htmlFor="status1">Completed</label>
                                </div>
                                <div className="field-radiobutton col-4">
                                    <RadioButton
                                        inputId="status2"
                                        name="status"
                                        value="Ongoing"
                                        onChange={(e) => onInputChange(e, "status")}
                                        checked={campaign.status === "Ongoing"}
                                    />
                                    <label htmlFor="status2">Ongoing</label>
                                </div>
                                <div className="field-radiobutton col-4">
                                    <RadioButton
                                        inputId="status3"
                                        name="status"
                                        value="Scheduled"
                                        onChange={(e) => onInputChange(e, "status")}
                                        checked={campaign.status === "Scheduled"}
                                    />
                                    <label htmlFor="status3">Scheduled</label>
                                </div>
                            </div>
                        </div>
                    </Dialog>

                    <Dialog
    visible={sendNotificationDialog}
    style={{ width: '1200px' }} 
    className="p-fluid" 
    header="Send Notification"
    modal
    footer={
        <>
            <Button label="Cancel" icon="pi pi-times"  onClick={hideSendNotificationDialog} />

            {/* <Button severity="help" label="Export" icon="pi pi-upload" onClick={exportCSV} /> */}
            <Button severity="success" label="Send Notification" icon="pi pi-check"  onClick={sendNotification} />
        </>
    }
    onHide={hideSendNotificationDialog}
>
    
 {/* Name */}
 <div className="field">
                            <label htmlFor="name">Notification Template *</label>
                            <Dropdown
            id="userEmail"
            value={selectedUser}
            options={notificationTemplates}
            onChange={(e) => setSelectedUser(e.value)}
            optionLabel="name"
            
            placeholder="Select Template"

        />
                            
                            {submitted && !campaign.name && (
                                <small className="p-invalid">Campaign Name is required.</small>
                            )}
                        </div>


                        <Toolbar className="mb-4" left={sendNotificationLeftToolbarTemplate} right={sendNotificationRightToolbarTemplate}></Toolbar>

<DataTable
    ref={dt}
    value={enrolledUsers}
    selection={selectedUsers}
    onSelectionChange={(e) => setSelectedUsers(e.value)}
    paginator
    rows={10}
    rowsPerPageOptions={[5, 10, 25]}
    className="datatable-responsive"
    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} enrolled users"
    filters={filters1}
    emptyMessage="No enrolled users found."
    header={sendNotificationHeader}
    responsiveLayout="scroll"
    dataKey='id'
>

    <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
    <Column field="id" header="ID" sortable body={idBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
    <Column field="firstName" header="First Name" sortable headerStyle={{ minWidth: '15rem' }}></Column>
    <Column field="lastName" header="Last Name" sortable  headerStyle={{ minWidth: '15rem' }}></Column>
    <Column field="email" header="Email" sortable  headerStyle={{ minWidth: '15rem' }}></Column>
    
    <Column field="userGroupName" header="User Group" sortable  headerStyle={{ minWidth: '15rem' }}></Column>
   
</DataTable>



</Dialog>


<Dialog
    visible={enrollUserDialog}
    style={{ width: '1200px' }} 
    header="Enroll User"
    modal
    footer={
        <>
            <Button label="Cancel" icon="pi pi-times" onClick={hideEnrollUserDialog} />
            <Button severity="success" label="Enroll" icon="pi pi-check" onClick={enrollUser} />
        </>
    }
    onHide={hideEnrollUserDialog}
>



                        <Toolbar className="mb-4" left={enrollUserLeftToolbarTemplate} right={sendNotificationRightToolbarTemplate}></Toolbar>

<DataTable
    ref={dt}
    value={enrolledUsers}
    selection={selectedUsers}
    onSelectionChange={(e) => setSelectedUsers(e.value)}
    paginator
    rows={10}
    rowsPerPageOptions={[5, 10, 25]}
    className="datatable-responsive"
    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} enrolled users"
    filters={filters1}
    emptyMessage="No enrolled users found."
    header={sendNotificationHeader}
    responsiveLayout="scroll"
    dataKey='id'
>

    <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
    <Column field="id" header="ID" sortable body={idBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
    <Column field="firstName" header="First Name" sortable headerStyle={{ minWidth: '15rem' }}></Column>
    <Column field="lastName" header="Last Name" sortable  headerStyle={{ minWidth: '15rem' }}></Column>
    <Column field="email" header="Email" sortable  headerStyle={{ minWidth: '15rem' }}></Column>
    
    <Column field="userGroupName" header="User Group" sortable  headerStyle={{ minWidth: '15rem' }}></Column>
   </DataTable>


</Dialog>




<Dialog
    visible={enrollUserListDialog}
    style={{ width: '1200px' }} 
    header="List of Enrolled Users"
    modal
    footer={
        <>
            <Button  severity="danger" label="Cancel" icon="pi pi-times" onClick={hideEnrollUserListDialog} />
            <Button severity="success" label="Ok" icon="pi pi-check" onClick={hideEnrollUserListDialog} />
        </>
    }
    onHide={hideEnrollUserDialog}
>



                        <Toolbar className="mb-4" left={enrollUserLeftToolbarTemplate} right={sendNotificationRightToolbarTemplate}></Toolbar>

<DataTable
    ref={dt}
    value={enrolledUsers}
    selection={selectedUsers}
    onSelectionChange={(e) => setSelectedUsers(e.value)}
    paginator
    rows={10}
    rowsPerPageOptions={[5, 10, 25]}
    className="datatable-responsive"
    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} enrolled users"
    filters={filters1}
    emptyMessage="No enrolled users found."
    header={sendNotificationHeader}
    responsiveLayout="scroll"
    dataKey='id'
>

    <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
    <Column field="id" header="ID" sortable body={idBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
    <Column field="firstName" header="First Name" sortable headerStyle={{ minWidth: '15rem' }}></Column>
    <Column field="lastName" header="Last Name" sortable  headerStyle={{ minWidth: '15rem' }}></Column>
    <Column field="email" header="Email" sortable  headerStyle={{ minWidth: '15rem' }}></Column>
    
    <Column field="userGroupName" header="User Group" sortable  headerStyle={{ minWidth: '15rem' }}></Column>
   </DataTable>


</Dialog>



                    <Dialog visible={deleteCampaignDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteCampaignDialogFooter} onHide={hideDeleteCampaignDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {campaign && (
                                <span>
                                    Are you sure you want to delete <b>{campaign.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteCampaignssDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteCampaignssDialogFooter} onHide={hideDeleteCampaignssDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {campaign && <span>Are you sure you want to delete the selected awereness?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Crud;
