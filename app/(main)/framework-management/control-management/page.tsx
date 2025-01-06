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
import { ControlService, FrameworkService } from '@/demo/service/ProductService';
import type { Demo } from '@/types';
import { useSearchParams } from 'next/navigation';
import { FilterMatchMode, FilterOperator } from 'primereact/api';

const Crud = () => {
    const searchParams = useSearchParams();
    const frameworkId = parseInt(searchParams.get('id'), 10);
    let emptyPolicy: Demo.Control = {
        id: '',
        clause: '',
        controlName: '',
        applicable: undefined,
        justification: '',
        createdAt: '',
        updatedAt: '',
        frameworkId: 0,
        framework:'',
        implementationStatus: undefined,
        evidenceFile: '',
        responsible: '',
      };


    const [Controls, setControls] = useState<Demo.Control[]>([]);
    const [ControlDialog, setControlDialog] = useState(false);
    const [deleteControlDialog, setDeleteControlDialog] = useState(false);
    const [deleteControlssDialog, setDeleteControlssDialog] = useState(false);
    const [Control, setControl] = useState(emptyPolicy);
    const [filters1, setFilters1] = useState<DataTableFilterMeta>({});
    const [filters2, setFilters2] = useState<DataTableFilterMeta>({});
    const [frameworkOptions, setFrameworkOptions] = useState([]);
    const [selectedControls, setSelectedControls] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const toast = useRef(null);
    const dt = useRef(null);
    const [totalSize, setTotalSize] = useState(0);
    const fileUploadRef = useRef<FileUpload>(null);

    useEffect(() => {
        ControlService.getControl().then((data) => {
            const filtered = data.filter((control) => control.frameworkId === frameworkId);
            setControls(filtered);
            initFilters1();
        });
    
        FrameworkService.getFramework().then((data) => {
            const options = data.map((framework) => ({
                label: framework.name,
                value: framework.id 
            }));
    
            setFrameworkOptions(options);
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

    console.log(Controls);


    const openNew = () => {
        setControl(emptyPolicy);
        setSubmitted(false);
        setIsEditMode(false);
        setControlDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setControlDialog(false);
    };

    const hideDeleteControlDialog = () => {
        setDeleteControlDialog(false);
    };

    const hideDeleteControlssDialog = () => {
        setDeleteControlssDialog(false);
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

    const saveControl = () => {
        setSubmitted(true);

        if (Control.controlName.trim()) {
            let _Controls = [...Controls];
            let _Control = { ...Control };
            if (Control.id) {
                const index = findIndexById(Control.id);

                _Controls[index] = _Control;
                toast.current.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Control Updated',
                    life: 3000
                });
            } else {
                _Control.id = createId();
                _Control.id = createId();
                _Controls.push(_Control);
                toast.current.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Campaing Created',
                    life: 3000
                });
            }

            setControls(_Controls);
            setControlDialog(false);
            setControl(emptyPolicy);
        }
    };

    const editControl = (product) => {
        setControl({ ...product });
        setIsEditMode(true);
        setControlDialog(true);
    };

    const confirmDeleteControl = (product) => {
        setControl(product);
        setDeleteControlDialog(true);
    };

    const deleteControl = () => {
        let _Controls = Controls.filter((val) => val.id !== Control.id);
        setControls(_Controls);
        setDeleteControlDialog(false);
        setControl(emptyPolicy);
        toast.current.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Control Deleted',
            life: 3000
        });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < Controls.length; i++) {
            if (Controls[i].id === id) {
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
        setDeleteControlssDialog(true);
    };

    const deleteSelectedControls = () => {
        let _Controls = Controls.filter((val) => !selectedControls.includes(val));
        setControls(_Controls);
        setDeleteControlssDialog(false);
        setSelectedControls(null);
        toast.current.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Controls Deleted',
            life: 3000
        });
    };

    const onCategoryChange = (e) => {
        let _Control = { ...Control };
        _Control['category'] = e.value;
        setControl(_Control);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _Control = { ...Control };
        _Control[`${name}`] = val;

        setControl(_Control);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _Control = { ...Control };
        _Control[`${name}`] = val;

        setControl(_Control);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button severity="success" label="New" icon="pi pi-plus" className="mr-2" onClick={openNew} />
                    <Button severity="danger" label="Delete" icon="pi pi-trash" className="mr-2" onClick={confirmDeleteSelected} disabled={!selectedControls || !selectedControls.length} />
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
    

    const nameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.controlName}
            </>
        );
    };

    const createdByTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Created By</span>
                {rowData.createdBy}
            </>
        );
    };

    const approvedBynameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Approved By</span>
                {rowData.approvedBy}
            </>
        );
    };

    const reviewedByBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Reviewed By</span>
                {rowData.reviewedBy}
            </>
        );
    };

    const desBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">clause</span>
                {rowData.clause}
            </>
        );
    };
    

    const startDateBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Start Date</span>
                {rowData.approvalDate}
            </>
        );
    };
    

    const endDateBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">End Date</span>
                {rowData.reviewDate}
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
               <iframe src={rowData.evidenceFile}   className="shadow-2" width="150"  height={'80'} /> 
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

    
    const frameworkIdBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Framework Id</span>
                {rowData.frameworkId}
            </>
        );
    };

    const frameworkBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Framework Id</span>
                {rowData.frameworkId}
            </>
        );
    };
    
    const statusBodyTemplate = (rowData) => {
        const statusClass =
            rowData.implementationStatus === "Complete"
                ? "bg-green-500 px-2 border-round-sm"
                : rowData.implementationStatus === "In Progress"
                ? "bg-yellow-500 px-2 border-round-sm"
                : "bg-blue-500 px-2 border-round-sm";
    
        return (
            <>
                <span className="p-column-title">Implementation Status</span>
                <span className={statusClass}>{rowData.implementationStatus}</span>
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
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editControl(rowData)} />
                <Button icon="pi pi-trash text-white bg-red-600" style={{backgroundColor:"#ef4444"}} rounded severity="warning" onClick={() => confirmDeleteControl(rowData)} />
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

    const ControlDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" severity="success" onClick={saveControl} />
        </>
    );
    const deleteControlDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteControlDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteControl} />
        </>
    );
    const deleteControlssDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteControlssDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedControls} />
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
                        value={Controls}
                        selection={selectedControls}
                        onSelectionChange={(e) => setSelectedControls(e.value)}
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Controls"
                        filters={filters1}
                        emptyMessage="No Controls found."
                        header={header}
                        responsiveLayout="scroll"
                        dataKey='id'
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="frameworkId" header="Framework ID" sortable body={frameworkIdBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="id" header="ID" sortable body={idBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="clause" header="Clause" sortable body={desBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="controlName" header="Control Name" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="applicable" header="Applicable" sortable  headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="justification" header="Justification" sortable  headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="implementationStatus" header="Implementation Status" sortable body={statusBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="evidenceFile" header="Evidence File" sortable body={contentBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="responsible" header="Responsible" sortable headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="createdAt" header="Created At" body={createdAtBodyTemplate}></Column>
                        <Column field="updatedAt" header="Updated At" body={updatedAtBodyTemplate}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog 
                        visible={ControlDialog} 
                        style={{ width: '800px' }} 
                        header="Control Details" 
                        modal 
                        className="p-fluid" 
                        footer={ControlDialogFooter} 
                        onHide={hideDialog}
                    >
                        {/* ID */}
                        {isEditMode && (
                            <div className="field">
                                <label htmlFor="id">Policy ID</label>
                                <InputText
                                    id="id"
                                    value={Control.id}
                                    readOnly
                                    className="p-inputtext p-disabled"
                                />
                            </div>
                        )}

                    <div className="field">
                                <label htmlFor="frameworkId">Framework</label>
                                <Dropdown
                                    id="frameworkId"
                                    value={Control.frameworkId}
                                    onChange={(e) => onInputChange(e, 'frameworkId')}
                                    options={frameworkOptions}
                                    placeholder="Select a Framework"
                                    required
                                    className={classNames({ 'p-invalid': submitted && !Control.frameworkId })}
                                />
                                {submitted && !Control.frameworkId && (
                                <small className="p-invalid">Framework is required.</small>
                            )}
                            </div>

                        {/* Name */}
                        <div className="field">
                            <label htmlFor="name">Policy Name</label>
                            <InputText
                                id="controlName"
                                value={Control.controlName}
                                onChange={(e) => onInputChange(e, "controlName")}
                                required
                                className={classNames({ "p-invalid": submitted && !Control.controlName })}
                            />
                            {submitted && !Control.controlName && (
                                <small className="p-invalid">Policy Name is required.</small>
                            )}
                        </div>

                        <div className="field">
                            <label htmlFor="clause">Clause</label>
                            <InputText
                                id="clause"
                                value={Control.clause}
                                onChange={(e) => onInputChange(e, 'clause')}
                                required
                                className={classNames({ 'p-invalid': submitted && !Control.clause })}
                            />
                            {submitted && !Control.clause && (
                                <small className="p-invalid">Clause is required.</small>
                            )}
                        </div>

                        <div className="field">
                            <label htmlFor="responsible">Responsible</label>
                            <InputText
                                id="responsible"
                                value={Control.responsible}
                                onChange={(e) => onInputChange(e, 'responsible')}
                                required
                                className={classNames({ 'p-invalid': submitted && !Control.responsible })}
                            />
                            {submitted && !Control.responsible && (
                                <small className="p-invalid">Responsible is required.</small>
                            )}
                        </div>

                        <div className="field">
                            <label htmlFor="justification">Justification</label>
                            <InputTextarea
                                id="justification"
                                value={Control.justification}
                                onChange={(e) => onInputChange(e, 'justification')}
                                required
                                className={classNames({ 'p-invalid': submitted && !Control.justification })}
                            />
                            {submitted && !Control.justification && (
                                <small className="p-invalid">Justification is required.</small>
                            )}
                        </div>

                        <div className="field">
                            <label className="mb-3">Applicable</label>
                            <div className="formgrid grid">
                                <div className="field-radiobutton col-4">
                                    <RadioButton
                                        inputId="applicable1"
                                        name="applicable"
                                        value="Y"
                                        onChange={(e) => onInputChange(e, "applicable")}
                                        checked={Control.applicable === "Y"}
                                    />
                                    <label htmlFor="applicable1">Yes</label>
                                </div>
                                <div className="field-radiobutton col-4">
                                    <RadioButton
                                        inputId="applicable2"
                                        name="applicable"
                                        value="N"
                                        onChange={(e) => onInputChange(e, "applicable")}
                                        checked={Control.applicable === "N"}
                                    />
                                    <label htmlFor="applicable2">No</label>
                                </div>
                            </div>
                        </div>

                        <div className="field">
                            <label className="mb-3">Implementation Status</label>
                            <div className="formgrid grid">
                                <div className="field-radiobutton col-4">
                                    <RadioButton
                                        inputId="implementationStatus1"
                                        name="implementationStatus"
                                        value="Complete"
                                        onChange={(e) => onInputChange(e, "implementationStatus")}
                                        checked={Control.implementationStatus === "Complete"}
                                    />
                                    <label htmlFor="implementationStatus1">Complete</label>
                                </div>
                                <div className="field-radiobutton col-4">
                                    <RadioButton
                                        inputId="implementationStatus2"
                                        name="implementationStatus"
                                        value="In Progress"
                                        onChange={(e) => onInputChange(e, "implementationStatus")}
                                        checked={Control.implementationStatus === "In Progress"}
                                    />
                                    <label htmlFor="implementationStatus2">In Progress</label>
                                </div>
                            </div>
                        </div>

                        <div className="field">
                            <label htmlFor="content">Content</label>

                            <FileUpload 
                            ref={fileUploadRef} 
                            onUpload={onTemplateUpload} onSelect={onTemplateSelect} 
                            />
                        </div>
                    </Dialog>



                    <Dialog visible={deleteControlDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteControlDialogFooter} onHide={hideDeleteControlDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {Control && (
                                <span>
                                    Are you sure you want to delete <b>{Control.controlName}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteControlssDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteControlssDialogFooter} onHide={hideDeleteControlssDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {Control && <span>Are you sure you want to delete the selected awereness?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Crud;
