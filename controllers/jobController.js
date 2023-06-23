import Job from '../models/Job.js';
import { StatusCodes } from 'http-status-codes';

const createJob = async (req, res) => {
    const { position, company } = req.body;
  
    if (!position || !company) {
        res.status(StatusCodes.BAD_REQUEST).json({
            msg: "Provide all values!"
        })
    } else {
        req.body.createdBy = req.user.userId;
  
        const job = await Job.create(req.body);
        
        res.status(StatusCodes.CREATED).json({ job });
    }
  
  };

const deleteJob = async (req,res) => {
    res.send("delete job")
}

const getAllJobs = async (req,res) => {
    res.send("get all jobs")
}

const updateJob = async (req,res) => {
    res.send("updateJob")
}

const showStats = async (req,res) => {
    res.send("show stats")
}

export  {createJob, deleteJob, getAllJobs, updateJob, showStats}