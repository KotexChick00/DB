import express, {Express} from 'express';
import cors from 'cors';
import { connectDB } from './db';
import employeeRoute from './src/routes/employeeRoute';
import orderRoute from './src/routes/orderRoute';
import billRoute from './src/routes/billRoute';
import customerRoute from './src/routes/customerRoute';

const app: Express = express();
const PORT = process.env.PORT || 5173;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', employeeRoute);
app.use('/api', orderRoute);
app.use('/api', billRoute);
app.use('/api', customerRoute);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
});

app.use((req: express.Request, res: express.Response) => {
    res.status(404).json({ message: 'Route not found' });
});

async function startApp() {
    try {
        await connectDB(); 
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
    }
}

startApp();
