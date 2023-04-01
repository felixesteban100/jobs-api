const Job = require('../models/Job')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')


async function getAllJobs(req, res){
    const jobs = await Job.find({createdBy: req.user.userId}).sort('createdAt')
    res.status(StatusCodes.OK).json({ jobs, count: jobs.length })
}

async function getSingleJob(req, res){
    const { user: {userId}, params: {id: jobId} } = req

    const job = await Job.findOne({ _id: jobId, createdBy: userId })

    if(!job) throw NotFoundError(`Not job with id ${jobId}`)

    res.status(StatusCodes.OK).json({ job })
}

async function postJob(req, res){
    req.body.createdBy = req.user.userId
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).send({ job })
}

async function patchJob(req, res){
    const {
        body: {company, position},
        user: { userId },
        params: { id: jobId },
    } = req

    if(company === '' || position === '') throw new BadRequestError('Company or position fields cannot be empty')

    const job = await Job.findByIdAndUpdate(
        {_id: jobId, createdBy: userId},
        req.body,
        {new: true, runValidators:true}
    )

    if(!job) throw new NotFoundError(`No job found with id ${jobId}`)

    res.status(StatusCodes.OK).json({ job })
}


async function deleteJob(req, res){
    const {
        user: {userId},
        params: {id: jobId},
    } = req

    const job = await Job.findOneAndRemove({
        _id: jobId,
        createdBy: userId
    })

    if(!job) throw NotFoundError(`No job with id ${jobId}`)

    res.status(StatusCodes.OK).json({ msg: 'Job deleted'})

}


module.exports = {
    getAllJobs,
    getSingleJob,
    postJob,
    patchJob,
    deleteJob,
}