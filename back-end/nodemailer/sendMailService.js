import { transporter } from "./transporter.js";

export const sendEmail = async (to, subject, text, html) => {
  const mailOptions = {
    from: "esms.cs554@gmail.com", // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    text: text, // plain text body
    html: html, // html body
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email: ", error);
  }
};
