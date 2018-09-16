var nodemailer = require('nodemailer');
var admconfig = require('./adminInfo.js');

module.exports.sendmails = function (msg, mailadresse) { 
        var transporter = nodemailer.createTransport({
            host: admconfig.mailhost,
            port: 587,
            auth: {
                user: admconfig.mailusername,
                pass: admconfig.mailpassword
            }
        });
        
        var mailOptions = {
            from: '"Varehus" <sporing@noreply.net>',
            to: mailadresse,
            subject: 'Sporingsnummer',
            html: '<p>Lenk til sporingsstatus:</p><b>'+admconfig.webdomain+'/track/'+msg+'</b>'
        };
    
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
        });
};
