const multer = require('multer');
const path = require('path');
const { memoryStorage } = require('multer');
const { storageFire, defaultAppConfig } = require('../config/firebase');
const Mluter = multer({
    storage: memoryStorage(),
    limits: {
        fileSize: 1024 * 1024 * 5
    },

})
const uploadImageFirestore = (req, res, next) => {
    const image = req.file;
    if (!image) {
        return res.status(400).send({
            message: "No file uploaded!"
        });
    }

    const filename = Date.now() + path.extname(image.originalname);
    const file = storageFire.file(filename);

    const stream = file.createWriteStream({
        metadata: {
            contentType: image.mimetype
        }
    });
    stream.on("error", (err) => {
        console.log(err)
        res.status(500).send({
            message: err.message
        });
    })
    stream.on("finish", async () => {
        await file.makePublic();
        req.file.firebaseUrl = `https://storage.googleapis.com/${defaultAppConfig.storageBucket}/${file.name}`;
        next();
    })
    stream.end(image.buffer);

}
module.exports = {
    Mluter, uploadImageFirestore
}