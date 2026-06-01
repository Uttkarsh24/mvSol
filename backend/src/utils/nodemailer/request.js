import dotenv from "dotenv";
import transporter from "../../helper/transporter.helper.js";

const sendEmail = async (email, subject, text) => {
    const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: subject,
        text: text,
    };
    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
};

export default sendEmail;