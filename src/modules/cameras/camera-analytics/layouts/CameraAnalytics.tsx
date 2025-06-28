'use client';
import { useParams } from 'next/navigation';
import { useState, useMemo } from 'react';
import {CircularProgress, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Tab, TableCell, Tabs, Typography,} from '@mui/material';
import {BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer,} from 'recharts';
import Link from 'next/link';
import { Dayjs } from 'dayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useDemographicsResults } from '@/modules/cameras/demographics/hooks/useDemographicsResults';
import {demographicsHeadCells, distributionHeadCells} from "@/modules/core/consts/tableHead";
import * as React from "react";
import { useCameraDetails } from '@/modules/cameras/camera-details/hooks/useCameraDetails';
import { EnhancedTablePagination } from '@/modules/core/tables/EnhancedTablePagination';
import filterControl from "@/modules/cameras/camera-analytics/components/FilterControl";
import Header from "@/modules/cameras/camera-analytics/components/Header";

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c', '#d0ed57'];



export default function DemographicsResultsPage() {
    const {id: cameraId } = useParams();

    const [gender, setGender] = useState('');
    const [age, setAge] = useState('');
    const [emotion, setEmotion] = useState('');
    const [ethnicity, setEthnicity] = useState('');
    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [endDate, setEndDate] = useState<Dayjs | null>(null);
    const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');

    const {data, isLoading} = useDemographicsResults({
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

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const paginatedItems = useMemo(() => {
        const start = page * rowsPerPage;
        const end = start + rowsPerPage;
        return items.slice(start, end);
    }, [items, page, rowsPerPage]);


    const distributionData = useMemo(() => {
        if (!analytics) return [];

        let distribution = analytics.gender_distribution;
        if (ethnicity) distribution = analytics.ethnicity_distribution;
        else if (emotion) distribution = analytics.emotion_distribution;
        else if (age) distribution = analytics.age_distribution;

        return Object.entries(distribution || {}).map(([label, count], index) => ({
            id: String(index),
            label,
            count,
        }));
    }, [analytics, age, emotion, ethnicity]);



    const renderChart = () => {
        switch (chartType) {
            case 'bar':
                return (
                    <BarChart data={distributionData}>
                        <XAxis dataKey="label"/>
                        <YAxis/>
                        <Tooltip/>
                        <Bar dataKey="count">
                            {distributionData.map((entry, index) => (
                                <Cell key={`bar-${index}`} fill={COLORS[index % COLORS.length]}/>
                            ))}
                        </Bar>
                    </BarChart>
                );
            case 'line':
                return (
                    <LineChart data={distributionData}>
                        <XAxis dataKey="label"/>
                        <YAxis/>
                        <Tooltip/>
                        <Line
                            type="monotone"
                            dataKey="count"
                            stroke="#8884d8"
                            activeDot={{
                                r: 8,
                                strokeWidth: 2,
                                fill: '#fff',
                                stroke: '#1976d2',
                            }}
                        />
                    </LineChart>
                );
            case 'pie':
                return (
                    <PieChart>
                        <Pie
                            data={distributionData}
                            dataKey="count"
                            nameKey="label"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label
                        >
                            {distributionData.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                            ))}
                        </Pie>
                        <Tooltip/>
                    </PieChart>
                );
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="p-6">
             <Header/>

                <Grid container spacing={2} my={4}>
                    <Grid size={{xs: 12, sm: 6, md: 3, lg: 2}}>
                        {filterControl('Gender', gender, setGender, ['male', 'female'])}
                    </Grid>
                    <Grid size={{xs: 12, sm: 6, md: 3, lg: 2}}>
                        {filterControl('Age', age, setAge, ['0-18', '19-30', '31-45', '46-60', '60+'])}
                    </Grid>
                    <Grid size={{xs: 12, sm: 6, md: 3, lg: 2}}>
                        {filterControl('Emotion', emotion, setEmotion, [
                            'happy',
                            'sad',
                            'angry',
                            'fear',
                            'neutral',
                            'surprise',
                        ])}
                    </Grid>
                    <Grid size={{xs: 12, sm: 6, md: 3, lg: 2}}>
                        {filterControl('Ethnicity', ethnicity, setEthnicity, [
                            'white',
                            'african',
                            'south_asian',
                            'east_asian',
                            'middle_eastern',
                        ])}
                    </Grid>
                    <Grid size={{xs: 12, sm: 6, md: 3, lg: 2}}>
                        <DatePicker
                            label="📅 Start Date"
                            value={startDate}
                            onChange={(newVal) => setStartDate(newVal)}
                            slotProps={{textField: {fullWidth: true}}}
                        />
                    </Grid>
                    <Grid size={{xs: 12, sm: 6, md: 3, lg: 2}}>
                        <DatePicker
                            label="📅 End Date"
                            value={endDate}
                            onChange={(newVal) => setEndDate(newVal)}
                            slotProps={{textField: {fullWidth: true}}}
                        />
                    </Grid>
                </Grid>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <CircularProgress/>
                    </div>
                ) : (
                    <Paper elevation={2} className="p-4">
                        <Typography variant="h6" gutterBottom>
                            📈 Analytics Chart
                        </Typography>

                        <Tabs
                            centered
                            className="mb-4"
                            value={chartType}
                            onChange={(_, val) => setChartType(val)}
                        >
                            <Tab value="bar" label="Bar Chart"/>
                            <Tab value="line" label="Line Chart"/>
                            <Tab value="pie" label="Pie Chart"/>
                        </Tabs>

                        <ResponsiveContainer width="100%" height={300}>
                            {renderChart()}
                        </ResponsiveContainer>

                        {distributionData.length > 0 && (
                            <Paper elevation={2} className="p-4 mt-6">
                                <Typography variant="h6" gutterBottom>
                                    📋 Raw Distribution
                                </Typography>

                                <EnhancedTablePagination
                                    rows={distributionData}
                                    onChangePage={()=>{}}
                                    totalCount={distributionData.length}
                                    loading={false}
                                    headCells={distributionHeadCells}
                                    showCheckBox={false}
                                    renderRow={(row) => (
                                        <>
                                            <TableCell>{row.label}</TableCell>
                                            <TableCell align="center">{row.count as number}</TableCell>
                                        </>
                                    )}
                                />
                            </Paper>
                        )}


                        {items.length > 0 && (
                            <Paper elevation={2} className="p-4 mt-6">
                                <Typography variant="h6" gutterBottom>
                                    🧑‍🤝‍🧑 Individuals Detected
                                </Typography>

                                <EnhancedTablePagination
                                    rows={paginatedItems}
                                    page={page}
                                    rowsPerPage={rowsPerPage}
                                    onChangePage={(event, newPage) => setPage(newPage)}
                                    onChangeRowsPerPage={(event) => {
                                        setRowsPerPage(parseInt(event.target.value, 10));
                                        setPage(0);
                                    }}
                                    totalCount={items.length}
                                    loading={isLoading}
                                    headCells={demographicsHeadCells}
                                    showCheckBox={false}
                                    renderRow={(row: any) => (
                                        <>
                                            <TableCell>{row.gender}</TableCell>
                                            <TableCell>{row.age}</TableCell>
                                            <TableCell>{row.emotion}</TableCell>
                                            <TableCell>{row.ethnicity}</TableCell>
                                        </>
                                    )}
                                />
                            </Paper>
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
    );
}
