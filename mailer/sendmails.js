const nodemailer = require('nodemailer');
const sgMail = require('nodemailer-sendgrid-transport');

let mailConfig;

if(process.env.NODE_ENV === 'production'){
    const options = {
        auth: {
            api_key: process.env.SENDGRID_API_KEY
        }
    }
    mailConfig = sgMail(options);
}else{
    if(process.env.NODE_ENV === 'staging'){
        console.log('XXXXXXXXXXXX');
        const options = {
            auth: {
                api_key: process.env.SENDGRID_API_KEY
            }
        }
        mailConfig = sgMail(options);
    }else{
        mailConfig = {
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: process.env.ETHEREAL_USER,
                pass: process.env.ETHEREAL_PASS
            }
        }
    }
}


module.exports = nodemailer.createTransport(mailConfig);
