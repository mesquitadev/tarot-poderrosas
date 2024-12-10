import { factories } from '@strapi/strapi';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export default factories.createCoreController('api::hotmart.hotmart', ({ strapi }) => ({
  async handleWebhook(ctx) {
    try {
      const { email, full_name } = ctx.request.body;

      // Check if the user already exists
      const existingUser = await strapi.query('plugin::users-permissions.user').findOne({ where: { email } });
      if (existingUser) {
        return ctx.badRequest('User already exists');
      }

      // Generate a random password
      const password = crypto.randomBytes(8).toString('hex');

      // Create the new user
      const newUser = await strapi.plugins['users-permissions'].services.user.add({
        email,
        username: full_name,
        password,
        confirmed: true,
      });

      // Configure the email transport
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'your-email@gmail.com',
          pass: 'your-email-password',
        },
      });

      // Send the email with the password
      const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Your Account Details',
        text: `Hello ${full_name},\n\nYour account has been created. Here are your login details:\n\nEmail: ${email}\nPassword: ${password}\n\nPlease change your password after logging in for the first time.\n\nBest regards,\nYour Company`,
      };

      await transporter.sendMail(mailOptions);

      ctx.send(newUser);
    } catch (err) {
      ctx.badRequest('An error occurred', { error: err.message });
    }
  },
}));