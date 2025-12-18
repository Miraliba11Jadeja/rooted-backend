import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB, ensureBootstrapAdmin } from './setup.js';
import authRoutes from './routes/auth.js';
import serviceRoutes from './routes/services.js';
import testimonialRoutes from './routes/testimonials.js';
import certificationRoutes from './routes/certifications.js';
import seoRoutes from './routes/seo.js';
import contactRoutes from './routes/contact.js';
import newsletterRoutes from './routes/newsletter.js';
import paymentRoutes from './routes/payments.js';
import planRoutes from './routes/plans.js';
import uploadRoutes from './routes/uploads.js';
import aboutRoutes from './routes/about.js';
import imagesRoutes from './routes/images.js';
import blogRoutes from './routes/blogs.js';
import adminsRoutes from './routes/admins.js';
import historyRoutes from './routes/history.js';
import reviewsRoutes from './routes/reviews.js';
import serviceImagesRoutes from './routes/serviceImages.js';
import inquiryRoutes from './routes/inquiries.js';
import { errorHandler } from './middleware/error.js';

dotenv.config();

const app = express();

app.use(morgan('dev'));

// CORS
const allowedOrigins = (process.env.CORS_ORIGINS || 'https://rootedbysoniya.com,http://localhost:3000').split(',').map(s => s.trim());
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.options('*', cors({ origin: allowedOrigins, credentials: true }));

// Mount Stripe webhook before JSON parser
import paymentsWebhook from './webhook.js';
app.post('/api/payments/webhook', paymentsWebhook);

app.use(express.json({ limit: '1mb' }));
app.use('/uploads', express.static('uploads'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/certifications', certificationRoutes);
app.use('/api/seo', seoRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/images', imagesRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/admins', adminsRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/service-images', serviceImagesRoutes);

app.use(errorHandler);

const port = process.env.PORT || 3000;

connectDB().then(async () => {
  await ensureBootstrapAdmin();
  app.listen(port, '0.0.0.0', () => {
    console.log(`API ready on http://localhost:${port}`);
  });
});

export default app;
