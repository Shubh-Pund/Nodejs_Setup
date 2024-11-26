const Model = require("../../models");
const { createRecords } = require("create-records");
const { updateRecords } = require("update-records");
const { saveBulkData } = require("save-bulk-records");
const { getRecord } = require("get-records");
const fs = require("fs");
const path = require('path');

// master create and update
exports.saveRecords = async (req, res) => {
    try {   
        const { id, modelName, uploadImage, uniqueNo, relation, inputData, password, isCompressRequired = false } = req.body;

        // Model validation
        if (!modelName || !Model[modelName]) return res.fail("Invalid or Missing Model Name", []);
        if (!inputData) return res.fail("Input Data is Required", "");

        const data = { id, modelName, inputData, relation, uploadImage, uniqueNo, password, isCompressRequired }

        if (Array.isArray(inputData) && inputData.length > 0) { // save bulk data
            const saveBulkDataResponse = await saveBulkData(data);
            if (!saveBulkDataResponse) return res.fail("Error while saving bulk records!", []);
            return res.success("Bulk Records Saved!", []);
        } else if (id) { // update
            const updateRecordResponse = await updateRecords(data);
            if (!updateRecordResponse) return res.fail("Error while updating records!", []);
            return res.success("Record Updated", updateRecordResponse);
        } else { // insert
            const createRecordsResponse = await createRecords(data);
            if (!createRecordsResponse) return res.fail("Error while creating records!", []);
            return res.success("Record Created", createRecordsResponse);
        }
    } catch (err) {
        console.error("Save records function error:", err);
        return res.catchError(err);
    }
};

exports.getRecords = async (req, res) => {
    try {
        const { modelName } = req.body;
        // Model validation
        if (!modelName || !Model[modelName]) return res.fail("Invalid or Missing Model Name", []);

        const getRecordsResponse = await getRecord(req.body);
        if (!getRecordsResponse && !getRecordsResponse?.rows) return res.fail(`No records found for ${modelName} this model`, [])

        const { rows, count } = getRecordsResponse;
        // Respond with paginated and searched records
        return res.success("Data retrieved successfully", rows, count);
    } catch (err) {
        console.error("Get records error:", err);
        return res.fail("Internal Server Error", err.message);
    }
};

exports.uploadBinaryFile = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) return res.fail('No files uploaded', []);

        // Collect all file information
        const filesInfo = req.files.map(file => ({
            filePath: file.path,
            fileName: file.filename
        }));
        return res.success('Files uploaded successfully!', filesInfo);
    } catch (err) {
        console.error("Upload binary file error:", err);
        return res.fail("Internal Server Error", err.message);
    }
};

exports.modelList = async (req, res) => {
    try {
        const modelsDir = path.join(__dirname, '../../models');
        fs.readdir(modelsDir, (err, files) => {
            if (err) {
                console.error('Error reading models directory:', err);
                return res.status(500).json({ success: false, message: 'Internal Server Error' });
            }

            const modelNames = files.filter(file => file.endsWith('.js')).map(file => path.parse(file).name); // Get the name without the extension
            return res.success("Model List", modelNames);
        });
    } catch (error) {
        console.error('Error fetching model names:', error);
        return catchError('Internal Server Error', []);
    }
}
exports.columnListByModel = async (req, res) => {
    const { modelName } = req.params;
    try {
        // Check if the model is defined in Sequelize
        const model = Model[modelName];
        if (!model) {
            return res.status(404).json({
                success: false,
                message: `Model "${modelName}" not found`
            });
        }

        // Describe the table to get column information
        const tableDescription = await Model.sequelize.queryInterface.describeTable(model.tableName);

        const columnNames = Object.keys(tableDescription);
        return res.success(`${modelName} column list`, columnNames);
    } catch (error) {
        console.error('Error fetching column names:', error);
        return res.catchError('Internal Server Error', []);
    }
}
