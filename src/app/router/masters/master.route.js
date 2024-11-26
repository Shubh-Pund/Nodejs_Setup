const express = require("express");
const router = express.Router();
const { saveRecords, getRecords, uploadBinaryFile, modelList, columnListByModel } = require("../../controller/masters/masters.controller");
const dynamicMulter = require('../../middleware/dynamicMulter.middleware');  // Import the middleware

router.get("/", (req, res) => {
  res.json({
    status: 200,
    message: "This is master page!",
  });
});

// master create and update
router.post("/saveRecords", saveRecords);

// get master list
router.post("/getRecords", getRecords);

// upload binary file using multer
router.post("/uploadBinaryFile", dynamicMulter, uploadBinaryFile);

router.get("/modelList", modelList);
router.get("/columnListByModel/:modelName", columnListByModel);

module.exports = router;
