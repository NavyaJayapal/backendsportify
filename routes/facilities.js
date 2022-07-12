//Author: Aravind Jayanthi (B00868943)
//Email: ar687531@dal.ca
const express = require('express');
const {v4: uuidv4} = require('uuid');
const Facilities = require('../models/facilities');
const ReservationsController = require('../controllers/reservations');
const router = express.Router();

router.get('/all', async (req, res) => {
    try {
        const allFacilities = await Facilities.find();
        return res.status(200).json({
            data: allFacilities,
            success: true
        });
    }
    catch (err) {
        return res.status(500).json({
            message:"Internal server error",
            success:false
        });
    }
});

router.get('/booked-slots', [(req, res, next) => {
    const facilityId = req.query.facilityId
    if (!facilityId) {
        return res.status(400).json({
            message: 'Facility is required',
            success: false,
        });
    }
    const date = req.query.date;
    if(!date) {
        return res.status(400).json({
            message: 'Date is required',
            success: false,
        });
    }
    next();
}, async(req, res) => {
    const facilityId = req.query.facilityId;
    const facility = await Facilities.find({"id": facilityId});
    if (!facility.length) {
        return res.status(404).send({
            message: "Facility not found!",
            success: false,
        });
    }
    const bookedSlots = await ReservationsController.getReservationByFacilityIdAndDate(facilityId, new Date(+req.query.date));
    return res.status(200).json({
        data: bookedSlots,
        success: true,
    })
}]);

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).send({
            message: "Id is required!",
            success: false,
        });
    }
    try {
        const facility = await Facilities.find({"id": id});
        if (!facility || facility.length == 0) {
            return res.status(404).send({
                message: "Facility not found!",
                success: false
            });
        }
        return res.status(200).send({
            data: facility[0],
            success: true
        })
    }
    catch(err) {
        return res.status(500).json({
            message:"Internal server error",
            success:false
        });
    }
});

router.post('/', async (req, res) => {
    let facilityData = {
        ...req.body,
        id: uuidv4()
    };
    try{
        const reservationDoc = new Facilities(facilityData);
        await reservationDoc.save();
        return res.status(200).json({
            data: facilityData,
            success: true,
        });
    }
    catch(err) {
        return res.status(500).json({
            message:"Internal server error",
            success:false
        });
    }
});

module.exports = router;