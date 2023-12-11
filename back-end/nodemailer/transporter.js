import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail", // Replace with your email provider
  auth: {
    type: "OAuth2",
    user: "esms.cs554@gmail.com", // Your email address
    clientId:
      "240060251728-msvumig8d92qh5bfu09l21kgi2eec1vl.apps.googleusercontent.com",
    clientSecret: "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",
    refreshToken:
      "1//04W0mq8KKUSLmCgYIARAAGAQSNwF-L9IrUarfzY_3Dop8yzeeTiH5aI3Puk-Ykl8qMjRYJd94LRd9kj_fPowNCDhm4xdMj7MOUtU",
  },
});
