const nodemailer = require("nodemailer");

const emailSender = async(email:string, html: string) =>{
    const transporter = nodemailer.createTransport({
        host: "imap.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
          user: process.env.NODE_EMAIL,
          pass: process.env.NODE_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
      
      
        const info = await transporter.sendMail({
          from: `"Supreme Health Care 👻" <process.env.NODE_EMAIL>`, // sender address
          to: email, // list of receivers
          subject: "Reset Password", // Subject line
        //   text: "Hello world?", // plain text body
          html: html, // html body
        });
      
        console.log("Message sent: %s", info.messageId);
        // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
      }

      export default emailSender;
      
     
      
