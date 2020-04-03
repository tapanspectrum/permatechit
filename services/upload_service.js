var mongoose = require('mongoose');
var mediaschema = require('../models/detail');

exports.getalldetails =
    async function () {
        const docs = await mediaschema
            .find()
            .lean();
        return docs;
    };
exports.details_save =
    async function (media) {
        const docs = await mediaschema
            .create(media);
        return docs;
    };
exports.details_remove =
    async function (id) {
        // console.log(id);
        const docs = await mediaschema
            .remove({mediaId:id});
        return docs;
    };