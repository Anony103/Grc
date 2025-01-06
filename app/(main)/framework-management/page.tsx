'use client';

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable, DataTableFilterMeta, } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload, FileUploadSelectEvent, FileUploadUploadEvent } from 'primereact/fileupload';

import { InputText } from 'primereact/inputtext';

import { Toast } from 'primereact/toast';
import { InputTextarea } from 'primereact/inputtextarea';

import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState, useContext } from 'react';
import { FrameworkService,   } from '@/demo/service/ProductService';
import type { Demo } from '@/types';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { useRouter } from 'next/navigation';


const Framework = () => {
    let emptyFramework: Demo.Framework = {
        id: '',
        name: '',
        description: '',
        standards: [],
        policies:[],
        controls:[],

       
        createdAt: new Date().toLocaleDateString(),
        updatedAt: new Date().toLocaleDateString(),
        
       
      };

      const router = useRouter();
    const [Frameworks, setFrameworks] = useState<Demo.Framework[]>([]);
    const [FrameworkDialog, setFrameworkDialog] = useState(false);
    const [deleteFrameworkDialog, setDeleteFrameworkDialog] = useState(false);
    const [deleteFrameworkssDialog, setDeleteFrameworkssDialog] = useState(false);
    const [Framework, setFramework] = useState(emptyFramework);
    const [filters1, setFilters1] = useState<DataTableFilterMeta>({});
    const [selectedFrameworks, setSelectedFrameworks] = useState(null);
    const [selectedFramework, setSelectedFramework] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const toast = useRef(null);
    const dt = useRef(null);
  

    useEffect(() => {
        FrameworkService.getFramework().then((data) => {
            setFrameworks(data);
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

    console.log(Frameworks);


    const openNew = () => {
        setFramework(emptyFramework);
        setSubmitted(false);
        setIsEditMode(false);
        setFrameworkDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setFrameworkDialog(false);
    };

    const hideDeleteFrameworkDialog = () => {
        setDeleteFrameworkDialog(false);
    };

    const hideDeleteFrameworkssDialog = () => {
        setDeleteFrameworkssDialog(false);
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

    const saveFramework = () => {
        setSubmitted(true);

        if (Framework.name.trim()) {
            let _Frameworks = [...Frameworks];
            let _Framework = { ...Framework };
            if (Framework.id) {
                const index = findIndexById(Framework.id);

                _Frameworks[index] = _Framework;
                toast.current.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Framework Updated',
                    life: 3000
                });
            } else {
                _Framework.id = createId();
                _Framework.id = createId();
                _Frameworks.push(_Framework);
                toast.current.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Framework Created',
                    life: 3000
                });
            }

            setFrameworks(_Frameworks);
            setFrameworkDialog(false);
            setFramework(emptyFramework);
        }
    };

    const editFramework = (product) => {
        setFramework({ ...product });
        setIsEditMode(true);
        setFrameworkDialog(true);
    };

    const confirmDeleteFramework = (product) => {
        setFramework(product);
        setDeleteFrameworkDialog(true);
    };

    const deleteFramework = () => {
        let _Frameworks = Frameworks.filter((val) => val.id !== Framework.id);
        setFrameworks(_Frameworks);
        setDeleteFrameworkDialog(false);
        setFramework(emptyFramework);
        toast.current.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Framework Deleted',
            life: 3000
        });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < Frameworks.length; i++) {
            if (Frameworks[i].id === id) {
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
        setDeleteFrameworkssDialog(true);
    };

    const deleteSelectedFrameworks = () => {
        let _Frameworks = Frameworks.filter((val) => !selectedFrameworks.includes(val));
        setFrameworks(_Frameworks);
        setDeleteFrameworkssDialog(false);
        setSelectedFrameworks(null);
        toast.current.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Frameworks Deleted',
            life: 3000
        });
    };


    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _Framework = { ...Framework };
        _Framework[`${name}`] = val;

        setFramework(_Framework);
    };


    const leftToolbarTemplate = () => { 
        const navigateToPolicyPage = () => {
            if (selectedFrameworks && selectedFrameworks.length === 1) {
                router.push(`/framework-management/policie(s)?id=${selectedFrameworks[0].id}`);
            } else {
                toast.current.show({
                    severity: 'warn',
                    summary: 'Warning',
                    detail: 'Please select a single framework to view its policies.',
                    life: 3000,
                });
            }
        };
    
        const navigateToControlPage = () => {
            if (selectedFrameworks && selectedFrameworks.length === 1) {
                router.push(`/framework-management/control-management?id=${selectedFrameworks[0].id}`);
            } else {
                toast.current.show({
                    severity: 'warn',
                    summary: 'Warning',
                    detail: 'Please select a single framework to view its controls.',
                    life: 3000,
                });
            }
        };
    
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button severity="success" label="New" icon="pi pi-plus" className="mr-2" onClick={openNew} />
                    <Button severity="danger" label="Delete" icon="pi pi-trash" className="mr-2" onClick={confirmDeleteSelected} disabled={!selectedFrameworks || !selectedFrameworks.length} />
                    <Button severity="info" label="Clauses/Policy" icon="pi pi-list" className="mr-2" onClick={navigateToPolicyPage} disabled={!selectedFrameworks || selectedFrameworks.length !== 1} />
                    <Button severity="warning" label="Annex A Control" icon="pi pi-cog" className="mr-2" onClick={navigateToControlPage} disabled={!selectedFrameworks || selectedFrameworks.length !== 1} />
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

    const desBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Description</span>
                {rowData.description}
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
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editFramework(rowData)} />
                <Button icon="pi pi-trash text-white bg-red-600" style={{backgroundColor:"#ef4444"}} rounded severity="warning" onClick={() => confirmDeleteFramework(rowData)} />
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

    const FrameworkDialogFooter = (
        <>
            <Button label="Save" icon="pi pi-check" severity="success" onClick={saveFramework} />
        </>
    );


    const deleteFrameworkDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteFrameworkDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteFramework} />
        </>
    );
    const deleteFrameworkssDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteFrameworkssDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedFrameworks} />
        </>
    );

 

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={Frameworks}
                        selection={selectedFrameworks}
                        onSelect={(e)=>{setSelectedFramework(e)}}
                        onSelectionChange={(e) => setSelectedFrameworks(e.value)}
                        onRowDoubleClick={(e)=>router.push(`/framework-management/policie(s)?id=${(e.data.id)}`)}
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} frameworks"
                        filters={filters1}
                        emptyMessage="no frameworks found."
                        header={header}
                        responsiveLayout="scroll"
                        dataKey='id'
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>

                        <Column field="id" header="ID" sortable body={idBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                       
                        <Column field="name" header="Framework Name" sortable  headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="description" header="Description" sortable body={desBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                      <Column field="createdAt" header="Created At" body={createdAtBodyTemplate}></Column>
                        <Column field="updatedAt" header="Updated At" body={updatedAtBodyTemplate}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog 
                        visible={FrameworkDialog} 
                        style={{ width: '800px' }} 
                        header="Framework Details" 
                        modal 
                        className="p-fluid" 
                        footer={FrameworkDialogFooter} 
                        onHide={hideDialog}
                    >
                        {/* ID */}
                        {isEditMode && (
                            <div className="field">
                                <label htmlFor="id">Framework ID</label>
                                <InputText
                                    id="id"
                                    value={Framework.id}
                                    readOnly
                                    className="p-inputtext p-disabled"
                                />
                            </div>
                        )}

                        

                        {/* Name */}
                        <div className="field">
                            <label htmlFor="FrameworkName">Framework Name</label>
                            <InputText
                                id="FrameworkName"
                                value={Framework.name}
                                onChange={(e) => onInputChange(e, "name")}
                                required
                                className={classNames({ "p-invalid": submitted && !Framework.name })}
                            />
                            {submitted && !Framework.name && (
                                <small className="p-invalid">framework name is required.</small>
                            )}
                        </div>

                        <div className="field">
                            <label htmlFor="description">Description</label>
                            <InputTextarea
                                id="description"
                                value={Framework.description}
                                onChange={(e) => onInputChange(e, 'description')}
                                rows={10}
                                required
                                className={classNames({ 'p-invalid': submitted && !Framework.description })}
                            />
                            {submitted && !Framework.description && (
                                <small className="p-invalid">framework description is required.</small>
                            )}
                        </div>

            

        {/* Created By */}
        <div className="field">
            <label htmlFor="createdBy">Created At</label>
            <InputText
                id="createdBy"
                value={new Date().toString()}
           readOnly
            />
        </div>

        {/* Approved By */}
        <div className="field">
            <label htmlFor="approvedBy">Updated At</label>
            <InputText
                id="approvedBy"
                value={new Date().toString()}
                readOnly
            />
        </div>


     

                    </Dialog>

               



                    <Dialog visible={deleteFrameworkDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteFrameworkDialogFooter} onHide={hideDeleteFrameworkDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {Framework && (
                                <span>
                                    Are you sure you want to delete <b>{Framework.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteFrameworkssDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteFrameworkssDialogFooter} onHide={hideDeleteFrameworkssDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {Framework && <span>Are you sure you want to delete the selected awereness?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Framework;
