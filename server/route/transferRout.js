
const express = require("express");
const router = express.Router();
const multer = require('multer');
const filedb = require('../modal/file');
const path = require('path');
const fs = require('fs')

var uname;

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            console.log('hi................');
            cb(null, "uploads/");
        },
        filename: (req, file, cb) => {
            console.log('file:', file.originalname);
            uname = `${Date.now()}-bezkoder-${file.originalname}`
            cb(null, uname);
        }
    }),
    fileFilter: (req, file, cb) => { 
        cb(undefined, true);
    }
});


router.post('/upload', upload.single('file'), async (req, res) => {
    console.log("hit.............");
    const file = req.file;
    const newFiledb = new filedb({
        name: file.originalname,
        orgname: uname,
        from:req.body.from,
        to:req.body.to
    });
    await newFiledb.save();

    res.send('File uploaded successfully');
});


router.post('/filenames', async (req, res) => {
    try {
        const filenames = await filedb.find({
            $or: [
                { $and: [{ to: req.body.to }, { from: req.body.from }] },
                { $and: [{ to: req.body.from }, { from: req.body.to }] }
            ]
        });
        res.json(filenames);
    } catch (error) {
        console.error('Error fetching filenames:', error);
        res.status(500).json({ error: 'Error fetching filenames' });
    }
});


router.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    console.log('hit download..............................');
  
    // Set the file path based on your uploads directory
    const filePath = path.join(__dirname, '../uploads', filename);
    console.log('file path..........................', filePath)
  
    // Send the file back to the client
    res.download(filePath, (err) => {
      if (err) {
        // Handle errors if the file cannot be downloaded
        console.error('Error downloading file:', err);
        res.status(500).send('Error downloading file');
      }
    });
  });


  router.delete('/delete/:filename', async (req, res) => {
    try {
      const filename = req.params.filename;
  
      // Find the file in the database based on the filename
      const file = await filedb.findOne({ orgname: filename });
      if (!file) {
        return res.status(404).json({ error: 'File not found' });
      }
  
      // Delete the file from MongoDB
      await filedb.deleteOne({ orgname: filename });
  
      // Delete the file from the storage directory
      const filePath = path.join(__dirname, '../uploads', filename);
      fs.unlinkSync(filePath);
  
      res.status(200).json({ message: 'File deleted successfully' });
    } catch (error) {
      console.error('Error deleting file:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  module.exports = router;