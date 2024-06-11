"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
// import INodeMailer from '../../useCase/interface/INodeMailer'
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class SendMail {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.NODMILER_USER,
                pass: process.env.NODMILER_PASS,
            }
        });
    }
    sendMail(name, email, verificationCode) {
        console.log('send emila in utils');
        const emailContent = `Dear ${name},

            Thank you for choosing do_Travel..!
            To ensure the security of your account, we've generated a One-Time Password (OTP) for you to complete your registration or login process.
            
            Your OTP is: ${verificationCode}
            
            Please use this OTP within the next 5 minutes to complete your action. If you did not initiate this request or need any assistance, please contact our support team immediately.
            Thank you for trusting do_Travel for your travel experiences. We look forward to serving you!
            
            Best regards,
            do_Travel
            `;
        const mailOptions = {
            from: process.env.NODMILER_USER,
            to: email,
            subject: 'do_Travle Verification Code.',
            text: emailContent,
        };
        this.transporter.sendMail(mailOptions, (error) => {
            if (error) {
                console.log('send Email error in utils : ', error);
            }
            else {
                console.log('Email send successfully..!');
            }
        });
    }
}
exports.default = SendMail;
