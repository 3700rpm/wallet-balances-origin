import { Request, Response, Router } from 'express'
import checkBalances from '../StreamBalance';
import path from 'path';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const result = await checkBalances()
        res.status(200).json({
            result: result
        })
    } catch (error) {
        res.status(400).json({
            result: 'something went wrong'
        })
    }
});

router.get('/view', async (req: Request, res: Response) => {
    try {
        console.log(__dirname)
        res.sendFile(path.join(__dirname, '../views/index.html'))
    } catch (error) {
        res.status(400).json({
            result: 'something went wrong'
        })
    }
});

export default router;