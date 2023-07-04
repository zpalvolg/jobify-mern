import Job from '../models/Job.js';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import moment from 'moment';

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

const deleteJob = async (req, res) => {
    const { id: jobId } = req.params;
  
    const job = await Job.findOne({ _id: jobId });
  
    if (!job) {
        res.status(StatusCodes.NOT_FOUND).json({
            msg: "No job with this id!"
        })
    }else {
  
    await job.deleteOne();
    
    res.status(StatusCodes.OK).json({ msg: 'Success! Job removed' });
    }
};

const getAllJobs = async (req, res) => {
    const jobs = await Job.find({ createdBy: req.user.userId });
  
    res
      .status(StatusCodes.OK)
      .json({ jobs, totalJobs: jobs.length, numOfPages: 1 });
};

const updateJob = async (req, res) => {
    const { id: jobId } = req.params;
  
    const { company, position } = req.body;
  
    if (!company || !position) {
        res.status(StatusCodes.BAD_REQUEST).json({
            msg: "Provide all values!"
        })
    }else {
        const job = await Job.findOne({ _id: jobId });
    
        if (!job) {
            res.status(StatusCodes.NOT_FOUND).json({
                msg: "No job with this id!"
            })
        }else {
        
            // check permissions
        
            const updatedJob = await Job.findOneAndUpdate({ _id: jobId }, req.body, {
            new: true,
            runValidators: true,
            });

            res.status(StatusCodes.OK).json({ updatedJob });
        }
    }
};

const showStats = async (req, res) => {
    let stats = await Job.aggregate([
      { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    stats = stats.reduce((acc, curr) => {
      const { _id: title, count } = curr;
      acc[title] = count;
      return acc;
    }, {});
  
    const defaultStats = {
      pending: stats.pending || 0,
      interview: stats.interview || 0,
      declined: stats.declined || 0,
    };

    let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    {
        $group: {
        _id: {
            year: {
            $year: '$createdAt',
            },
            month: {
            $month: '$createdAt',
            },
        },
        count: { $sum: 1 },
        },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 6 },
    ]);

    monthlyApplications = monthlyApplications.map((item) => 
    {
        const {
        _id: { year, month },
        count,
        } = item;
        // accepts 0-11
        const date = moment()
        .month(month - 1)
        .year(year)
        .format('MMM Y');
        return { date, count };
    }).reverse();

    res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
  };

export  {createJob, deleteJob, getAllJobs, updateJob, showStats}