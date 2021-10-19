// const constants = require('../../common/constants');
// const path = require("path");
// const multer = require("multer");



const  upload = (req,res) => {
  console.log("UPLOAD IMAGE ROUTE BODY: ",req.body);
  console.log("res.locals: ",res.locals);

  res.locals.uploader(req, res, (err, result) => {
    if(err) {
      return res.status(500).end("Error uploading file. "+err);
    }
    console.log("Request ---", req.body);
    console.log("Request file ---", req.file);//Here you get file.
    console.log("Upload result: ",result);

    const path = req.file.path;
    console.log("File is uploaded, url : " + path);

    const finalPostImgPath = 'https://banter.network/'+req.file.filename
    console.log("finalPostImgPath url : " + finalPostImgPath);

    /*Now do where ever you want to do*/
    return res.status(200).send(JSON.stringify({url: finalPostImgPath})).end();
  });


};



module.exports.upload = upload;
