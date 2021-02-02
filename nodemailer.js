const nodemailer = require('nodemailer')
const keys = require('./keys')

const message = {
    from: keys.FROM,
    to: 'sudkurve@mail.ru',
    subject: 'Visit out shop and buy some goods!',
    text: 'Visit out shop and buy some goods! Thanks for your attention! =)'
};

const nodemailerTransport = {
    host: 'smtp.mail.ru',
    port: 465,
    secure: true,
    auth: {
        user: keys.USER,
        pass: keys.PASSWORD
    }
}

const transport = nodemailer.createTransport(nodemailerTransport)

module.exports = function (to, message) {
    const body = {
        from: keys.FROM,
        to,
        subject: message.subject,
        text: message?.text,
        html: message?.html
    };

    transport.sendMail(body, (err, info) => {
        if(err) console.error(err)
        else console.log(info)
    })
}