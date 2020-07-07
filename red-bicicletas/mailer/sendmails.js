const nodemailer = require('nodemailer');

const mailConfig = {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'freddy.ritchie61@ethereal.email',
        pass: 'yBDD3XnxsHY4zBj56F'
    }
};

module.exports = nodemailer.createTransport(mailConfig);
