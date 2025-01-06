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
import {  NotificationTemplateService} from '@/demo/service/ProductService';
import type { Demo } from '@/types';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import DOMPurify from 'dompurify';


const Crud = () => {
   let emptyNotificationTemplate: Demo.PolicyNotificationTemplate = {
        id: '',
        name: '',
        body: '',
        createdAt: '',
        updatedAt: '',
    };

    const [notificationTemplates, setNotificationTemplates] = useState<Demo.NotificationTemplate[]>([]);
    const [notificationTemplateDialog, setNotificationTemplateDialog] = useState(false);
    const [deleteNotificationTemplateDialog, setDeleteNotificationTemplateDialog] = useState(false);
    const [deleteNotificationTemplatesDialog, setDeleteNotificationTemplatesDialog] = useState(false);
    const [notificationTemplate, setNotificationTemplate] = useState(emptyNotificationTemplate);
    const [filters1, setFilters1] = useState<DataTableFilterMeta>({});
    const [selectednotificationTemplates, setSelectednotificationTemplates] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [fullScreenDialogVisible, setFullScreenDialogVisible] = useState(false);
    const [fullScreenContent, setFullScreenContent] = useState("");

  

    const toast = useRef(null);
    const dt = useRef(null);
    const [totalSize, setTotalSize] = useState(0);
    const fileUploadRef = useRef<FileUpload>(null);

    useEffect(() => {
       NotificationTemplateService.getPolicyNotificationTemplates().then((data) =>{
            setNotificationTemplates(data)
        initFilters1();

        });
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

    const onGlobalFilterChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let _filters1 = { ...filters1 };
        (_filters1['global'] as any).value = value;

        setFilters1(_filters1);
        setGlobalFilter(value);
    };

    const openFullScreenDialog = (content) => {
        setFullScreenContent(content);
        setFullScreenDialogVisible(true);
    };

    console.log(notificationTemplates);


    const openNew = () => {
        setNotificationTemplate(emptyNotificationTemplate);
        setSubmitted(false);
        setIsEditMode(false);
        setNotificationTemplateDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setNotificationTemplateDialog(false);
    };

    const hideDeleteNotificationTemplateDialog = () => {
        setDeleteNotificationTemplateDialog(false);
    };

    const hideDeleteNotificationTemplatesDialog = () => {
        setDeleteNotificationTemplatesDialog(false);
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

    const savenotificationTemplate = () => {
        setSubmitted(true);

        if (notificationTemplate.name.trim()) {
            let _notificationTemplates = [...notificationTemplates];
            let _notificationTemplate = { ...notificationTemplate };
            if (notificationTemplate.id) {
                const index = findIndexById(notificationTemplate.id);

                _notificationTemplates[index] = _notificationTemplate;
                toast.current.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'notificationTemplate Updated',
                    life: 3000
                });
            } else {
                _notificationTemplate.id = createId();
                _notificationTemplate.id = createId();
                _notificationTemplates.push(_notificationTemplate);
                toast.current.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Campaing Created',
                    life: 3000
                });
            }

            setNotificationTemplates(_notificationTemplates);
            setNotificationTemplateDialog(false);
            setNotificationTemplate(emptyNotificationTemplate);
        }
    };

    const editnotificationTemplate = (notificationTemplate) => {
        setNotificationTemplate({ ...notificationTemplate });
        setIsEditMode(true);
        setNotificationTemplateDialog(true);
    };

    const confirmDeletenotificationTemplate = (notificationTemplate) => {
        setNotificationTemplate(notificationTemplate);
        setDeleteNotificationTemplateDialog(true);
    };

    const deletenotificationTemplate = () => {
        let _notificationTemplates = notificationTemplates.filter((val) => val.id !== notificationTemplate.id);
        setNotificationTemplates(_notificationTemplates);
        setDeleteNotificationTemplateDialog(false);
        setNotificationTemplate(emptyNotificationTemplate);
        toast.current.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'notificationTemplate Deleted',
            life: 3000
        });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < notificationTemplates.length; i++) {
            if (notificationTemplates[i].id === id) {
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
        setDeleteNotificationTemplatesDialog(true);
    };

    const deleteSelectedNotificationTemplates = () => {
        let _notificationTemplates = notificationTemplates.filter((val) => !selectednotificationTemplates.includes(val));
        setNotificationTemplates(_notificationTemplates);
        setDeleteNotificationTemplatesDialog(false);
        setSelectednotificationTemplates(null);
        toast.current.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'notificationTemplates Deleted',
            life: 3000
        });
    };


    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _notificationTemplate = { ...notificationTemplate };
        _notificationTemplate[`${name}`] = val;

        setNotificationTemplate(_notificationTemplate);
    };

   

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button severity="success" label="New" icon="pi pi-plus" className="mr-2" onClick={openNew} />
                    <Button severity="danger" label="Delete" icon="pi pi-trash" className="mr-2" onClick={confirmDeleteSelected} disabled={!selectednotificationTemplates || !selectednotificationTemplates.length} />
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


  

    







    const idBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">ID</span>
                {rowData.id}
            </>
        );
    };
    




    const BodyTemplate = (rowData) => {
        const sanitizedHtml = DOMPurify.sanitize(rowData.body);

        return (
            <div
                style={{
                    width: "150px",
                    height: "80px",
                    overflow: "hidden",
                    border: "1px solid #ddd",
                    padding: "5px",
                    borderRadius: "4px",
                    cursor: "pointer",
                }}
                dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
                onClick={() => openFullScreenDialog(sanitizedHtml)}
            />
        );
    };

    
    





    
    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editnotificationTemplate(rowData)} />
                <Button icon="pi pi-trash text-white bg-red-600" style={{backgroundColor:"#ef4444"}} rounded severity="warning" onClick={() => confirmDeletenotificationTemplate(rowData)} />
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

    const notificationTemplateDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={savenotificationTemplate} />
        </>
    );
    const deleteNotificationTemplateDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteNotificationTemplateDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deletenotificationTemplate} />
        </>
    );
    const deleteNotificationTemplatesDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteNotificationTemplatesDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedNotificationTemplates} />
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
                        value={notificationTemplates}
                        selection={selectednotificationTemplates}
                        onSelectionChange={(e) => setSelectednotificationTemplates(e.value)}
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} notificationTemplates"
                        filters={filters1}
                        emptyMessage="No notificationTemplates found."
                        header={header}
                        responsiveLayout="scroll"
                        dataKey='id'
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="ID" sortable body={idBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="name" header="Name" sortable  headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column  sortable header="Preview"  body={BodyTemplate}  headerStyle={{ minWidth: '15rem' }}></Column>
                     <Column field="createdAt" header="Created At" ></Column>
                        <Column field="updatedAt" header="Updated At" ></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog 
                        visible={notificationTemplateDialog} 
                        style={{ width: '800px' }} 
                        header="Notification Template Details" 
                        modal 
                        className="p-fluid" 
                        footer={notificationTemplateDialogFooter} 
                        onHide={hideDialog}
                    >
                        {/* ID */}
                        {isEditMode && (
                            <div className="field">
                                <label htmlFor="id">Template ID</label>
                                <InputText
                                    id="id"
                                    value={notificationTemplate.id}
                                    readOnly
                                    className="p-inputtext p-disabled" // Optional: Add styles to indicate it's read-only
                                />
                            </div>
                        )}

                        {/* Name */}
                        <div className="field">
                            <label htmlFor="name">Template Name *</label>
                            <InputText
                                id="name"
                                value={notificationTemplate.name}
                                onChange={(e) => onInputChange(e, "name")}
                                required
                                className={classNames({ "p-invalid": submitted && !notificationTemplate.name })}
                            />
                            {submitted && !notificationTemplate.name && (
                                <small className="p-invalid">notificationTemplate Name is required.</small>
                            )}
                        </div>


                    

                     

                        {/* Content */}
                        <div className="field">
                            <label htmlFor="content">Template Body *</label>

                            <InputTextarea
                                id="content"
                                value={notificationTemplate.body}
                                onChange={(e) => onInputChange(e, "content")}
                                rows={20}
                                required
                            />
                        </div>

                       


                
                      
                    </Dialog>

                    <Dialog
                        visible={fullScreenDialogVisible}
                        style={{ width: "50vw", height: "100vh" }}
                        header="Preview"
                        modal
                        className="p-fluid"
                        onHide={() => setFullScreenDialogVisible(false)}
                    >
                        <div
                            dangerouslySetInnerHTML={{ __html: fullScreenContent }}
                            style={{ height: "100%", overflow: "auto" }}
                        />
                    </Dialog>






                    <Dialog visible={deleteNotificationTemplateDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteNotificationTemplateDialogFooter} onHide={hideDeleteNotificationTemplateDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {notificationTemplate && (
                                <span>
                                    Are you sure you want to delete <b>{notificationTemplate.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteNotificationTemplatesDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteNotificationTemplatesDialogFooter} onHide={hideDeleteNotificationTemplatesDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {notificationTemplate && <span>Are you sure you want to delete the selected awereness?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Crud;
