var mongoose = require('mongoose');

var AnnounceSchema = mongoose.Schema({
	name: {
		type: String
	},
    link: {
		type: String
	},
    uploadtime: {
    	type: Date
    },
    updatetime:  {
    	type: Date
    }
}, { collection: 'announce' });

var Announce = module.exports = mongoose.model('announce', AnnounceSchema);