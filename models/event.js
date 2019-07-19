const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const eventSchema = new Schema( {
	name: {
		type: 'String'
	},
	date: {
		type: 'Date'
	},
	time: {
		type: 'String'
	},
	price: {
		type: 'Number'
	},
	imageUrl: {
		type: 'String'
	},
	onlineUrl: {
		type: 'String'
	},
	location: {
		address: {
			type: 'String'
		},
		city: {
			type: 'String'
		},
		country: {
			type: 'String'
		}
	},
	sessions: {
		type: [
			{
                id: {
                    type: 'Number'
                },
                name: {
                    type: 'String'
                },
                presenter: {
                    type: 'String'
                },
                duration: {
                    type: 'Number'
                },
                level: {
                    type: 'String'
                },
                abstract: {
                    type: 'String'
                },
                voters: {
                    type: [
                        'String'
                    ]
                }
            }
		]
	}
});

//eventSchema.virtual('id1').get(function() { return this._id; });
// Create the model class
const ModelClass = mongoose.model('event', eventSchema);

// Export the model
module.exports = ModelClass;