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
import React, { useEffect, useRef, useState, useContext } from 'react';
import { PolicyService, FrameworkService, ControlService } from '@/demo/service/ProductService';
import type { Demo } from '@/types';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { ChartData, ChartOptions } from 'chart.js';
import { Chart } from 'primereact/chart';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import type { ChartDataState, ChartOptionsState } from '@/types';
import PolicyChart from './policy-chart';
import ApprovedBarChart from './approved-chart';
import { useSearchParams } from 'next/navigation';
import ControlChart from '../control-management/control-chart';

const Crud = () => {
    const searchParams = useSearchParams();
    const frameworkId = parseInt(searchParams.get('id'), 10);
    let emptyPolicy: Demo.Policy = {
        id: '',
        policyName: '',
        description: '',
        status: 'Draft',
        createdBy: '',
        createdAt: '',
        updatedAt: '',
        frameworkId: 0,
        framework:'',
        templateFile: undefined,
        reviewComments: undefined,
        approvedBy: undefined,
        reviewedBy: undefined,
        reviewDate: undefined,
        approvalDate: undefined,
      };


    const [Policies, setPolicies] = useState<Demo.Policy[]>([]);

    const [PolicyDialog, setPolicyDialog] = useState(false);
    const [analyticDialog, setAnalyticDialog] = useState(false);
    const [deletePolicyDialog, setDeletePolicyDialog] = useState(false);
    const [deletePoliciessDialog, setDeletePoliciessDialog] = useState(false);
    const [Policy, setPolicy] = useState(emptyPolicy);
    const [filters1, setFilters1] = useState<DataTableFilterMeta>({});

    const [frameworkOptions, setFrameworkOptions] = useState<Demo.Framework[]>([]);
    const [selectedPolicies, setSelectedPolicies] = useState(null);
   
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    const { layoutConfig } = useContext(LayoutContext);
    const toast = useRef(null);
    const dt = useRef(null);
    const [Controls, setControls] = useState<Demo.Control[]>([]);
    const [totalSize, setTotalSize] = useState(0);
    const fileUploadRef = useRef<FileUpload>(null);

    useEffect(() => {
        PolicyService.getPolicy().then((data) => {
            const filtered = data.filter((policy) => policy.frameworkId === frameworkId);
            setPolicies(filtered);

            initFilters1();
        });

    
        FrameworkService.getFramework().then((data) => {
          
            setFrameworkOptions(data);
            initFilters1();
        });

        ControlService.getControl().then((data) => {
            setControls(data);
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

    console.log(Policies);


    const openNew = () => {
        setPolicy(emptyPolicy);
        setSubmitted(false);
        setIsEditMode(false);
        setPolicyDialog(true);
    };

    const openAnalyticNew = () => {
        setAnalyticDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setPolicyDialog(false);
    };

    const hideAnalyticDialog = () => {
        setSubmitted(false);
        setAnalyticDialog(false);
    };

    const hideDeletePolicyDialog = () => {
        setDeletePolicyDialog(false);
    };

    const hideDeletePoliciessDialog = () => {
        setDeletePoliciessDialog(false);
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

    const savePolicy = () => {
        setSubmitted(true);

        if (Policy.policyName.trim()) {
            let _Policies = [...Policies];
            let _Policy = { ...Policy };
            if (Policy.id) {
                const index = findIndexById(Policy.id);

                _Policies[index] = _Policy;
                toast.current.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Policy Updated',
                    life: 3000
                });
            } else {
                _Policy.id = createId();
                _Policy.id = createId();
                _Policies.push(_Policy);
                toast.current.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Campaing Created',
                    life: 3000
                });
            }

            setPolicies(_Policies);
            setPolicyDialog(false);
            setPolicy(emptyPolicy);
        }
    };

    const editPolicy = (product) => {
        setPolicy({ ...product });
        setIsEditMode(true);
        setPolicyDialog(true);
    };

    const confirmDeletePolicy = (product) => {
        setPolicy(product);
        setDeletePolicyDialog(true);
    };

    const deletePolicy = () => {
        let _Policies = Policies.filter((val) => val.id !== Policy.id);
        setPolicies(_Policies);
        setDeletePolicyDialog(false);
        setPolicy(emptyPolicy);
        toast.current.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Policy Deleted',
            life: 3000
        });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < Policies.length; i++) {
            if (Policies[i].id === id) {
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

    const statusOptions = [
        { label: 'Active', value: 'Active' },
        { label: 'Inactive', value: 'Inactive' },
        // Add more options as needed
    ];
    

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeletePoliciessDialog(true);
    };

    const deleteSelectedPolicies = () => {
        let _Policies = Policies.filter((val) => !selectedPolicies.includes(val));
        setPolicies(_Policies);
        setDeletePoliciessDialog(false);
        setSelectedPolicies(null);
        toast.current.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Policies Deleted',
            life: 3000
        });
    };

    const onCategoryChange = (e) => {
        let _Policy = { ...Policy };
        _Policy['category'] = e.value;
        setPolicy(_Policy);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _Policy = { ...Policy };
        _Policy[`${name}`] = val;

        setPolicy(_Policy);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _Policy = { ...Policy };
        _Policy[`${name}`] = val;

        setPolicy(_Policy);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button severity="success" label="New" icon="pi pi-plus" className="mr-2" onClick={openNew} />
                    <Button severity="danger" label="Delete" icon="pi pi-trash" className="mr-2" onClick={confirmDeleteSelected} disabled={!selectedPolicies || !selectedPolicies.length} />
                    <Button style={{backgroundColor:"orange"}} label="Analytics" icon="pi pi-chart-bar" className="mr-2" onClick={openAnalyticNew} />
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
                {rowData.policyName}
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
                <span className="p-column-title">Description</span>
                {rowData.description}
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
               <iframe src={rowData.templateFile}   className="shadow-2" width="150"  height={'80'} /> 
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
        const selectedFramework = frameworkOptions.find((frame) => frame.id === rowData.frameworkId);
    
        return (
            <>
                <span className="p-column-title">Framework</span>
                {selectedFramework ? selectedFramework.name : "Framework not found"}
            </>
        );
    };
    
    
    const statusBodyTemplate = (rowData) => {
        const statusClass =
            rowData.status === "Approved"
                ? "bg-green-500 px-2 border-round-sm"
                : rowData.status === "In Review"
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
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editPolicy(rowData)} />
                <Button icon="pi pi-trash text-white bg-red-600" style={{backgroundColor:"#ef4444"}} rounded severity="warning" onClick={() => confirmDeletePolicy(rowData)} />
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

    const PolicyDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" onClick={hideAnalyticDialog} />
            <Button label="Save" icon="pi pi-check" severity="success" onClick={savePolicy} />
        </>
    );

    const AnalyticDialogFooter = (
        <>
            <Button label="Cancel" severity="danger" icon="pi pi-times" onClick={hideDialog} />
        </>
    );

    const deletePolicyDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeletePolicyDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deletePolicy} />
        </>
    );
    const deletePoliciessDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeletePoliciessDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedPolicies} />
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

    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color') || '#495057';
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary') || '#6c757d';
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border') || '#dee2e6';
        const barData: ChartData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'My First dataset',
                    backgroundColor: '#4399d3',
                    borderColor: '#4399d3',
                    data: [65, 59, 80, 81, 56, 55, 40]
                },
                {
                    label: 'My Second dataset',
                    backgroundColor:  '#3ba56a',
                    borderColor:  '#3ba56a',
                    data: [28, 48, 40, 19, 86, 27, 90]
                }
            ]
        };

        const barOptions: ChartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: '500'
                        }
                    },
                    grid: {
                        display: false
                    },
                    border: {
                        display: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    },
                    border: {
                        display: false
                    }
                }
            }
        };

        const pieData: ChartData = {
            labels: ['A', 'B', 'C'],
            datasets: [
                {
                    data: [540, 325, 702],
                    backgroundColor: [documentStyle.getPropertyValue('--indigo-500') || '#3f51b5', documentStyle.getPropertyValue('--purple-500') || '#9c27b0', documentStyle.getPropertyValue('--teal-500') || '#009688'],
                    hoverBackgroundColor: [documentStyle.getPropertyValue('--indigo-400') || '#6372c3', documentStyle.getPropertyValue('--purple-400') || '#af50bf', documentStyle.getPropertyValue('--teal-400') || '#30aa9f']
                }
            ]
        };

        const pieOptions: ChartOptions = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        color: textColor
                    }
                }
            }
        };



      
    }, [layoutConfig]);

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={Policies}
                        selection={selectedPolicies}
                        onSelectionChange={(e) => setSelectedPolicies(e.value)}
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Policies"
                        filters={filters1}
                        emptyMessage="No Policies found."
                        header={header}
                        responsiveLayout="scroll"
                        dataKey='id'
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>

                        <Column field="id" header="ID" sortable body={idBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="frameworkId" header="Framework ID" showFilterMenuOptions sortable body={frameworkIdBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="policyName" header="Policy Name" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="description" header="Description" sortable body={desBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="templateFile" header="Template File" sortable body={contentBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="status" header="Status" body={statusBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="reviewComments" header="Review Comments" sortable  headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="createdBy" header="Created By" sortable body={createdByTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                       <Column field="reviewedBy" header="Reviewed By" sortable body={reviewedByBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                       
                        <Column field="reviewDate" header="Review Date" sortable body={endDateBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="approvedBy" header="Approved By" sortable body={approvedBynameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                       
                        <Column field="approvalDate" header="ApprovalDate" sortable body={startDateBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="createdAt" header="Created At" body={createdAtBodyTemplate}></Column>
                        <Column field="updatedAt" header="Updated At" body={updatedAtBodyTemplate}></Column>
                       
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog 
                        visible={PolicyDialog} 
                        style={{ width: '800px' }} 
                        header="Policy Details" 
                        modal 
                        className="p-fluid" 
                        footer={PolicyDialogFooter} 
                        onHide={hideDialog}
                    >
                        {/* ID */}
                        {isEditMode && (
                            <div className="field">
                                <label htmlFor="id">Policy ID</label>
                                <InputText
                                    id="id"
                                    value={Policy.id}
                                    readOnly
                                    className="p-inputtext p-disabled"
                                />
                            </div>
                        )}

                            <div className="field">
                                <label htmlFor="frameworkId">Framework</label>
                                <Dropdown
                                    id="frameworkId"
                                    value={Policy.frameworkId}
                                    onChange={(e) => onInputChange(e, 'frameworkId')}
                                    options={frameworkOptions}
                                    optionLabel='name'
                                    optionValue='id'
                                    placeholder="Select a Framework"
                                    required
                                    className={classNames({ 'p-invalid': submitted && !Policy.frameworkId })}
                                />
                                {submitted && !Policy.frameworkId && (
                                <small className="p-invalid">Framework is required.</small>
                            )}
                            </div>


                        {/* Name */}
                        <div className="field">
                            <label htmlFor="policyName">Policy Name</label>
                            <InputText
                                id="policyName"
                                value={Policy.policyName}
                                onChange={(e) => onInputChange(e, "policyName")}
                                required
                                className={classNames({ "p-invalid": submitted && !Policy.policyName })}
                            />
                            {submitted && !Policy.policyName && (
                                <small className="p-invalid">user Name is required.</small>
                            )}
                        </div>

                        <div className="field">
                            <label htmlFor="description">Description</label>
                            <InputTextarea
                                id="description"
                                value={Policy.description}
                                onChange={(e) => onInputChange(e, 'description')}
                                required
                                className={classNames({ 'p-invalid': submitted && !Policy.description })}
                            />
                            {submitted && !Policy.description && (
                                <small className="p-invalid">Description is required.</small>
                            )}
                        </div>

                        <div className="field">
                            <label htmlFor="content">Content</label>

                            <FileUpload 
                            ref={fileUploadRef} 
                            onUpload={onTemplateUpload} onSelect={onTemplateSelect} 
                            />
                        </div>

        {/* Status */}
        <div className="field">
                            <label className="mb-3">Status</label>
                            <div className="formgrid grid">
                                <div className="field-radiobutton col-4">
                                    <RadioButton
                                        inputId="status1"
                                        name="status"
                                        value="Approved"
                                        onChange={(e) => onInputChange(e, "status")}
                                        checked={Policy.status === "Approved"}
                                    />
                                    <label htmlFor="status1">Approved</label>
                                </div>
                                <div className="field-radiobutton col-4">
                                    <RadioButton
                                        inputId="status2"
                                        name="status"
                                        value="In Review"
                                        onChange={(e) => onInputChange(e, "status")}
                                        checked={Policy.status === "In Review"}
                                    />
                                    <label htmlFor="status2">In Review</label>
                                </div>
                            </div>
                        </div>

        {/* Review Comments */}
        <div className="field">
            <label htmlFor="reviewComments">Review Comments</label>
            <InputTextarea
                id="reviewComments"
                value={Policy.reviewComments}
                onChange={(e) => onInputChange(e, 'reviewComments')}
            />
        </div>

        {/* Created By */}
        <div className="field">
            <label htmlFor="createdBy">Created By</label>
            <InputText
                id="createdBy"
                value={Policy.createdBy}
                onChange={(e) => onInputChange(e, 'createdBy')}
            />
        </div>

        {/* Approved By */}
        <div className="field">
            <label htmlFor="approvedBy">Approved By</label>
            <InputText
                id="approvedBy"
                value={Policy.approvedBy}
                onChange={(e) => onInputChange(e, 'approvedBy')}
            />
        </div>


        {/* Reviewed By */}
        <div className="field">
            <label htmlFor="reviewedBy">Reviewed By</label>
            <InputText
                id="reviewedBy"
                value={Policy.reviewedBy}
                onChange={(e) => onInputChange(e, 'reviewedBy')}
            />
        </div>

                    </Dialog>

                    <Dialog 
                        visible={analyticDialog} 
                        style={{ width: '1200px' }} 
                        header="Analytics Details" 
                        modal 
                        className="p-fluid" 
                        footer={AnalyticDialogFooter} 
                        onHide={hideAnalyticDialog}
                        resizable
                    >
                        <div className="grid p-fluid">
                            <div className="col-12 xl:col-6">
                                <div className="card flex flex-column align-items-center">
                                    <h5 className="text-center w-full">Total Policy</h5>
                                    <PolicyChart policies={Policies} />
                                    {/* <Chart type="doughnut" data={data.pieData} options={options.pieOptions} /> */}
                                </div>
                            </div>

                            <div className="col-12 xl:col-6">
                                <div className="card flex flex-column align-items-center">
                                    <h5 className="text-center w-full">Total Control</h5>
                                    <ControlChart controls={Controls} />
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="card">
                                    <h5>Approved Policy Vs Approved Control</h5>
                                    <ApprovedBarChart  policies={Policies}  controls={Controls} />
                                    {/* <Chart type="bar" data={data.barData} options={options.barOptions} /> */}
                                </div>
                            </div>
                        </div>
                    </Dialog>





                    <Dialog visible={deletePolicyDialog} style={{ width: '450px' }} header="Confirm" modal footer={deletePolicyDialogFooter} onHide={hideDeletePolicyDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {Policy && (
                                <span>
                                    Are you sure you want to delete <b>{Policy.policyName}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deletePoliciessDialog} style={{ width: '450px' }} header="Confirm" modal footer={deletePoliciessDialogFooter} onHide={hideDeletePoliciessDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {Policy && <span>Are you sure you want to delete the selected awereness?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Crud;
