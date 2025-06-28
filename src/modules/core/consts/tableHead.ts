export type Order = 'asc' | 'desc';



export interface HeadCell {
    disablePadding: boolean;
    id: string;
    label: string;
    numeric: boolean;
}


export const headCells: HeadCell[]= [
    { id: 'name', numeric: false, disablePadding: false, label: 'Camera Name' },
    { id: 'rtsp_url', numeric: false, disablePadding: false, label: 'rtsp_url' },
    { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
    { id: 'edit', numeric: false, disablePadding: false, label: 'Edit' },
];

export const demographicsHeadCells: HeadCell[] = [
    { id: 'gender',numeric: false, disablePadding: false, label: 'Gender' },
    { id: 'age', numeric: false, disablePadding: false,label: 'Age' },
    { id: 'emotion', numeric: false, disablePadding: false,label: 'Emotion' },
    { id: 'ethnicity', numeric: false, disablePadding: false,label: 'Ethnicity' },
];

// consts/tableHead.ts
export const distributionHeadCells = [
    { id: 'label',numeric: false, disablePadding: false, label: 'Label' },
    { id: 'count',numeric: false, disablePadding: false, label: 'Count' },
];
