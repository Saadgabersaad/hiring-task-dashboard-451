import { Typography } from '@mui/material';

export default function Header({ cameraName }: { cameraName?: string }) {

    return (
        <Typography variant="h5" gutterBottom className="text-center">
             Demographics Results for Camera
            {cameraName && (
                <span className="text-blue-600 font-semibold"> : {cameraName}</span>
            )}
        </Typography>
    );
}
