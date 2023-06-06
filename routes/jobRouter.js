//express
import express from 'express'
//controllers
import {createJob, deleteJob, getAllJobs, updateJob, showStats} from '../controllers/jobController.js'

const router = express.Router()

router.route('/').get(getAllJobs)
router.route('/').post(createJob)

router.route('/stats').post(showStats)

router.route('/:id').delete(deleteJob)
router.route('/:id').patch(updateJob)

export default router