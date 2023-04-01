const express = require('express')
const router = express.Router()
const {
    getAllJobs,
    getSingleJob,
    postJob,
    patchJob,
    deleteJob,
} = require('../controllers/jobs')

router.route('/')
.post(postJob)
.get(getAllJobs)

router.route('/:id')
.get(getSingleJob)
.patch(patchJob)
.delete(deleteJob)

module.exports = router