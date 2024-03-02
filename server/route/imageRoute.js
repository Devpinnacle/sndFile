const express = require("express");
const router = express.Router();
const mongoose = require('mongoose')
const fs = require('fs');
const path = require('path');
const multer = require("multer");
const archiver = require('archiver');
const unzipper = require('unzipper');
const { promisify } = require('util');
const { finished } = require("stream");

const { KeyObject } = require("crypto");
const rimraf = require('rimraf');
const rimrafSync = rimraf.rimrafSync
const recursiveCopy = require('recursive-copy')
const mkdirp = require('mkdirp')
const os = require('os')
const zlib = require('zlib');
const fsExtra = require('fs-extra');
const pump = require('pump');
const ncp = require('ncp');
const { spawn } = require('child_process');
const glob = require('glob');
const admZip = require('adm-zip');


const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/")

    },
    filename: (req, file, cb) => {
      console.log('file:', file.originalname);
      cb(null, `${Date.now()}-bezkoder-${file.originalname}`)
    }
  }),
  fileFilter: (req, file, cb) => {
    cb(undefined, true)
  }
})

router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const imageFile = req.file;
    if (!imageFile) {
      console.log("not uploaded")
      return res.status(400).json({ error: 'No image uploaded!' });
    }
    console.log('Image received:', imageFile.filename);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message || 'An error occurred during file upload' });
  }
});

//*******************************************************************************************************************************************************/
// const readdirAsync = promisify(fs.readdir);
// const statAsync = promisify(fs.stat);

// router.post('/images', async (req, res) => {
//   const sourceImgFolderPath = 'D:/dev';

//   // Create a unique timestamp for the destination filename
//   const timestamp = new Date().toISOString().replace(/:/g, '-');
//   const destinationZipFilename = `images-${timestamp}.zip`;
//   const destinationZipFilePath = path.join('D:/Hello', destinationZipFilename);

//   try {
//     // Record the start time
//     const startTime = process.hrtime();

//     // Ensure the img folder exists before processing
//     if (!fs.existsSync(sourceImgFolderPath)) {
//       console.log('Source img folder not found');
//       return res.status(404).json({ error: 'Source img folder not found' });
//     }

//     // Create the uploads2 directory if it doesn't exist
//     if (!fs.existsSync(path.dirname(destinationZipFilePath))) {
//       fs.mkdirSync(path.dirname(destinationZipFilePath), { recursive: true });
//     }

//     // Create a new zip archive instance
//     const archive = archiver('zip', { zlib: { level: 1 } });

//     // Create a stream for writing the zip file
//     const zipStream = fs.createWriteStream(destinationZipFilePath);

//     // Listen for all archive data to be written
//     zipStream.on('close', function () {
//       console.log('Zip file created successfully:', destinationZipFilePath);

//       // Unzip the created zip file automatically
//       fs.createReadStream(destinationZipFilePath)
//         .pipe(unzipper.Extract({ path: path.dirname(destinationZipFilePath) }))
//         .on('error', (err) => {
//           console.error('Error extracting zip file:', err);
//           res.status(500).json({ error: 'Error extracting zip file' });
//         })
//         .on('finish', () => {
//           // Record the end time
//           const endTime = process.hrtime(startTime);

//           // Calculate the total process time
//           const processTimeInMs = Math.round((endTime[0] * 1000) + (endTime[1] / 1000000));

//           console.log(`Entire process completed in ${processTimeInMs} milliseconds`);

//           // Delete the zip file after successful extraction
//           fs.unlink(destinationZipFilePath, (err) => {
//             if (err) {
//               console.error('Error deleting zip file:', err);
//             } else {
//               console.log('zip file deleted');
//               res.send({ 'error': 'hiii' });
//               res.json({ message: 'hello' });
//             }
//           });

//           // Respond with the process time
//           res.json({ message: `Entire process completed in ${processTimeInMs} milliseconds` });
//         });
//     });

//     // Handle errors during zip creation
//     archive.on('error', function (err) {
//       console.error('Error creating zip file:', err);
//       res.status(500).json({ error: 'Error creating zip file' });
//     });

//     // Pipe the zip archive stream to the file stream
//     archive.pipe(zipStream); 

//     // Add all files and directories from the img folder to the zip archive recursively
//     await addFilesToArchive(sourceImgFolderPath, '', archive);

//     // Finalize the zip archive creation
//     archive.finalize();

//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// async function addFilesToArchive(directory, parentPath, archive) {
//   const files = await readdirAsync(directory);

//   for (const file of files) {
//     const filePath = path.join(directory, file);
//     const fileStat = await statAsync(filePath);

//     if (fileStat.isDirectory()) {
//       // Recursively add files from nested directories
//       await addFilesToArchive(filePath, path.join(parentPath, file), archive);
//     } else {
//       // Add file to the zip archive
//       archive.file(filePath, { name: path.join(parentPath, file) });
//     }
//   }
// }

//******************************************************************************************************************************************************************/
// router.post('/images', async (req, res) => {
//     const startTime = process.hrtime();
//     const sourceFolder = 'D:/K&H missing - 4 images'; // Adjust this path
//     const destinationFolder = 'D:/Hello'; // Adjust this path

//     try {
//       // Use rimrafSync directly for synchronous deletion:
//       rimrafSync(destinationFolder);

//       // Start the copying process:
//       recursiveCopy(sourceFolder, destinationFolder, (err) => {
//         if (err) {
//           console.error('Error copying folder:', err);
//           return;
//         }

//         const endTime = process.hrtime(startTime);

//         // Calculate the total process time:
//         const processTimeInMs = Math.round((endTime[0] * 1000) + (endTime[1] / 1000000));
//         console.log(`Entire process completed in ${processTimeInMs} milliseconds`);
//         console.log('Folder transfer completed successfully');

//         res.json({ message: `Entire process completed in ${processTimeInMs} milliseconds` });
//       });
//     } catch (error) {
//       console.error('Error:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   });

//*****************************************************************************************************************************************************************/

// router.post('/images', async (req, res) => {
//     const startTime = process.hrtime();
//     const sourceFolder = 'D:/K&H missing - 4 images'; // Adjust this path
//     const destinationFolder = 'D:/Hello'; // Adjust this path

//     try {
//         fs.copy(sourceFolder, destinationFolder, { recursive: true })
//             .then(() => {
//                 console.log('Folder transferred successfully!');
//                 const endTime = process.hrtime(startTime);

//                 // Calculate the total process time:
//                 const processTimeInMs = Math.round((endTime[0] * 1000) + (endTime[1] / 1000000));
//                 console.log(`Entire process completed in ${processTimeInMs} milliseconds`);
//                 console.log('Folder transfer completed successfully');

//                 res.json({ message: `Entire process completed in ${processTimeInMs} milliseconds` });
//             })
//             .catch((err) => {
//                 console.error('Error during transfer:', err);
//             });
//     } catch (error) {
//         console.error('Error during transfer:', error);
//         res.status(500).json({ error: 'An error occurred' });
//     }
// });

//*****************************************************************************************************************************************************************/

// router.post('/images', async (req, res) => {
//   const startTime = process.hrtime();
//   const sourceFolder = 'D:/K&H missing - 4 images';
//   const destinationFolder = 'D:/Hello';

//   try {
//     ncp(sourceFolder, destinationFolder, (err) => {
//       if (err) {
//         console.error('Error during transfer:', err);
//       } else {
//         console.log('Folder transfer successful!');
//         // Calculate the total process time:
//         const endTime = process.hrtime(startTime);
//         const processTimeInMs = Math.round((endTime[0] * 1000) + (endTime[1] / 1000000));
//         console.log(`Entire process completed in ${processTimeInMs} milliseconds`);
//         console.log('Folder transfer completed successfully');
//         res.json({ message: `Entire process completed in ${processTimeInMs} milliseconds` });
//       }
//     });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).send('Error creating archive');
//   }
// });

//*****************************************************************************************************************************************************************/
//***********need rycn******************** */
// router.post('/images', async (req, res) => {
//   try {
//     const sourceFolder = 'D:/K&H missing - 4 images';
//     const destinationFolder = 'D:/Hello';

//     const rsync = spawn('rsync', ['-avz', sourceFolder, destinationFolder]);

//     rsync.stdout.on('data', (data) => {
//       console.log(`rsync output: ${data}`);
//     });

//     rsync.on('close', (code) => {
//       if (code === 0) {
//         console.log('Folder transfer successful!');
//       } else {
//         console.error('rsync failed with code:', code);
//       }
//     });

//   } catch (error) {

//     console.error('Error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

//*****************************************************************************************************************************************************************/

router.post('/images', async (req, res) => {
  const startTime = process.hrtime();
  const sourceFolder = 'D:/K&H missing - 4 images';
  const destinationFolder = 'D:/Hello';

  try {
    function createDirectories(filePath) {
      const directory = path.dirname(filePath);
      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true }); // Create nested directories if needed
      }
    }

    glob(sourceFolder + '/**/*', (err, files) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
      }
      else {
        const copyOperations = files.map((file) => {
          return new Promise((resolve) => {
            const relativePath = file.replace(sourceFolder, '');
            const destinationPath = path.join(destinationFolder, relativePath);
            createDirectories(destinationPath); // Create directories if needed
            fs.copyFile(file, destinationPath, (err) => {
              if (err) {
                console.error(err);
              } else {
                console.log(file + ' copied successfully!');
              }
              resolve();
            });
          });
        });

        Promise.all(copyOperations).then(() => {
          // Calculate the total process time:
          const endTime = process.hrtime(startTime);
          const processTimeInMs = Math.round((endTime[0] * 1000) + (endTime[1] / 1000000));
          console.log(`Entire process completed in ${processTimeInMs} milliseconds or ${processTimeInMs / 1000} seconds`);
          console.log('Folder transfer completed successfully');
          res.json({ message: `Entire process completed in ${processTimeInMs} milliseconds or ${processTimeInMs / 1000} seconds` });
        });
      }
    });
  }
  catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//****************************************************************************************************************************************************************/

// router.post('/images', async (req, res) => {
//   try {
//     const startTime = process.hrtime();
//     const sourceFolder = 'D:/K&H missing - 4 images';
//     const destinationFolder = 'D:/Hello';
//     const archive = archiver('zip');
//     const output = fs.createWriteStream('archive.zip');

//     archive.pipe(output);
//     archive.directory(sourceFolder, '');
//     archive.finalize();

//     output.on('close', () => {
//       fs.cp('archive.zip', destinationFolder+'/archive.zip', (err) => {
//         if (err) {
//           console.error(err);
//         } else {
//           console.log('Folder archived and transferred successfully!');
//           const endTime = process.hrtime(startTime);
//           const processTimeInMs = Math.round((endTime[0] * 1000) + (endTime[1] / 1000000));
//           res.json({ message: `Entire process completed in ${processTimeInMs} milliseconds` });
//         }
//       });
//     });
//   } catch (error) {

//     console.error('Error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

module.exports = router;