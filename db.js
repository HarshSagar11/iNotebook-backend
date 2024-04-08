const mongoose = require('mongoose');
const mongooseURI = 'mongodb://localhost:27017/iNotebook';

const connectToMongo = () =>{
    mongoose.connect(mongooseURI)
    .then(()=>{
        //console.log('connection successful')
    }).catch(()=>{
        //console.log('connectionn - unsuccessful');
    })
};

module.exports = connectToMongo;
