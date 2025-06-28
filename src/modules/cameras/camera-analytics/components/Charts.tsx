import { Paper, Tab, Tabs, Typography } from '@mui/material';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie,
    Cell, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c', '#d0ed57'];

type Props = {
    chartType: 'bar' | 'line' | 'pie';
    setChartType: (val: 'bar' | 'line' | 'pie') => void;
    distributionData: { label: string; count: number }[];
};

export default function DistributionChart({ chartType, setChartType, distributionData }: Props) {
    const renderChart = () => {
        switch (chartType) {
            case 'bar':
                return (
                    <BarChart data={distributionData}>
                        <XAxis dataKey="label" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count">
                            {distributionData.map((_, index) => (
                                <Cell key={index} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                );
            case 'line':
                return (
                    <LineChart data={distributionData}>
                        <XAxis dataKey="label" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="count" stroke="#8884d8" />
                    </LineChart>
                );
            case 'pie':
                return (
                    <PieChart>
                        <Pie data={distributionData} dataKey="count" nameKey="label" cx="50%" cy="50%" outerRadius={100} label>
                            {distributionData.map((_, index) => (
                                <Cell key={index} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                );
        }
    };

    return (
        <Paper elevation={2} className="p-4">
            <Typography variant="h6" gutterBottom>📈 Analytics Chart</Typography>
            <Tabs centered value={chartType} onChange={(_, val) => setChartType(val)} className="mb-4">
                <Tab value="bar" label="Bar Chart" />
                <Tab value="line" label="Line Chart" />
                <Tab value="pie" label="Pie Chart" />
            </Tabs>
            <ResponsiveContainer width="100%" height={300}>
                {renderChart()}
            </ResponsiveContainer>
        </Paper>
    );
}
