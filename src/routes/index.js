import express from 'express';
import Constants from '../constants';
import { msToTime } from '../utils/utils';

const router = express.Router();
const startedAt = Date.now();

router.get('/status',
  async (_req, res) => res.json({
    env: Constants.env,
    serverTime: msToTime(Date.now()),
    uptime: msToTime(Date.now() - startedAt),
  }));

router.use('/auth', require('./controllers/auth').default);
router.use('/user', require('./controllers/user').default);
router.use('/file', require('./controllers/file').default);

export default router;
