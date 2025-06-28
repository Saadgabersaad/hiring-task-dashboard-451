'use client';

import { useParams } from 'next/navigation';
import { useState, useMemo } from 'react';
import {
    CircularProgress, Grid, Paper, Typography, TableCell,
} from '@mui/material';
import Link from 'next/link';
import { Dayjs } from 'dayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { useDemographicsResults } from '@/modules/cameras/demographics/hooks/useDemographicsResults';
import { useCameraDetails } from '@/modules/cameras/camera-details/hooks/useCameraDetails';

import { EnhancedTablePagination } from '@/modules/core/tables/EnhancedTablePagination';
import { demographicsHeadCells, distributionHeadCells } from '@/modules/core/consts/tableHead';
import filterControl from '@/modules/cameras/camera-analytics/components/FilterControl';
import Header from '@/modules/cameras/camera-analytics/components/Header';
import { Page } from '@/modules/core/page';
import AgeCharts from "@/modules/cameras/camera-analytics/components/Charts";

interface AgeDistributionRow {
    label: string;
    count: number;
}

interface Props {
    ageDistributionData: { label: string; count: number }[];
}
export default function DemographicsResultsPage() {
    const { id: cameraId } = useParams();

    const [gender, setGender] = useState('');
    const [age, setAge] = useState('');
    const [emotion, setEmotion] = useState('');
    const [ethnicity, setEthnicity] = useState('');
    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [endDate, setEndDate] = useState<Dayjs | null>(null);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const { data, isLoading } = useDemographicsResults({
        camera_id: cameraId as string,
        gender,
        age,
        emotion,
        ethnicity,
        start_date: startDate?.toISOString(),
        end_date: endDate?.toISOString(),
    });

    const items = data?.items || [];
    const analytics = data?.analytics;
    const { data: camera } = useCameraDetails(cameraId as string);

    // const paginatedItems = useMemo(() => {
    //     const start = page * rowsPerPage;
    //     const end = start + rowsPerPage;
    //     return items.slice(start, end);
    // }, [items, page, rowsPerPage]);
    // console.log(items);

    const ageDistributionData  = useMemo(() => {
        if (!analytics?.age_distribution) return [];

        return Object.entries(analytics.age_distribution).map(([label, count],index) => ({
            id: `row-${index}`, // <-- required
            label,
            count,
        }));
    }, [analytics]);

    console.log(ageDistributionData);
    return (
        <Page>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div className="p-6">
                    <Header />

                    <Grid container spacing={2} my={4}>
                        <Grid size={{xs: 12, sm: 6, md: 3, lg: 2}}>
                            {filterControl('Gender', gender, setGender, ['male', 'female'])}
                        </Grid>
                        <Grid size={{xs: 12, sm: 6, md: 3, lg: 2}}>
                            {filterControl('Age', age, setAge, ['0-18', '19-30', '31-45', '46-60', '60+'])}
                        </Grid>
                        <Grid size={{xs: 12, sm: 6, md: 3, lg: 2}}>
                            {filterControl('Emotion', emotion, setEmotion, ['happy', 'sad', 'angry', 'fear', 'neutral', 'surprise'])}
                        </Grid>
                        <Grid size={{xs: 12, sm: 6, md: 3, lg: 2}}>
                            {filterControl('Ethnicity', ethnicity, setEthnicity, ['white', 'african', 'south_asian', 'east_asian', 'middle_eastern'])}
                        </Grid>
                        <Grid size={{xs: 12, sm: 6, md: 3, lg: 2}}>
                            <DatePicker
                                label="📅 Start Date"
                                value={startDate}
                                onChange={setStartDate}
                                slotProps={{ textField: { fullWidth: true } }}
                            />
                        </Grid>
                        <Grid size={{xs: 12, sm: 6, md: 3, lg: 2}}>
                            <DatePicker
                                label="📅 End Date"
                                value={endDate}
                                onChange={setEndDate}
                                slotProps={{ textField: { fullWidth: true } }}
                            />
                        </Grid>
                    </Grid>

                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <CircularProgress />
                        </div>
                    ) : (
                        <Paper elevation={2} className="p-4">
                            <Typography align={"center"} variant="h5" gutterBottom>📊 Age Distribution Charts</Typography>
                            <AgeCharts ageDistributionData={ageDistributionData} />

                            {ageDistributionData.length > 0 && (
                                <div className="p-4 mt-6">
                                    <Typography align={"center"} variant="h6" gutterBottom my={2} >📋 Age Distribution Table</Typography>
                                    <EnhancedTablePagination
                                        rows={ageDistributionData }
                                        onChangePage={() => {}}
                                        totalCount={ageDistributionData.length}
                                        loading={false}
                                        headCells={distributionHeadCells}
                                        showCheckBox={false}
                                        renderRow={(row) => (
                                            <>
                                                <TableCell align="center">{row.label}</TableCell>
                                                <TableCell align="center">{row.count as string }</TableCell>
                                            </>
                                        )}
                                    />
                                </div>
                            )}

                            {items.length > 0 && (
                                <div className="p-4 mt-6">
                                    <Typography align={"center"} variant="h6" gutterBottom my={2}  >🧑‍🤝‍🧑 Individuals Detected</Typography>
                                    <EnhancedTablePagination
                                        rows={items!}
                                        page={page}
                                        rowsPerPage={rowsPerPage}
                                        onChangePage={(e, newPage) => setPage(newPage)}
                                        onChangeRowsPerPage={(e) => {
                                            setRowsPerPage(parseInt(e.target.value, 10));
                                            setPage(0);
                                        }}

                                        totalCount={items.length}
                                        loading={isLoading}
                                        headCells={demographicsHeadCells}
                                        showCheckBox={false}
                                        renderRow={(row: any) => (
                                            <>
                                                <TableCell  align="center">{row.count}</TableCell >
                                                <TableCell align="center">{row.gender}</TableCell >
                                                <TableCell align="center">{row.age}</TableCell>
                                                <TableCell align="center">{row.emotion}</TableCell>
                                                <TableCell align="center">{row.ethnicity}</TableCell>
                                                <TableCell align="center">{row.created_at}</TableCell>
                                            </>
                                        )}
                                    />
                                </div>
                            )}
                        </Paper>
                    )}

                    <Link
                        href={`/cameras/${cameraId}`}
                        className="mt-6 inline-block text-blue-600 underline"
                    >
                        ← Back to Camera
                    </Link>
                </div>
            </LocalizationProvider>
        </Page>
    );
}
