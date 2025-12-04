import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
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
import inquiryRoutes from './routes/inquiries.js';
import { errorHandler } from './middleware/error.js';

dotenv.config();

const app = express();

const allowed = (process.env.CORS_ORIGIN || '').split(',').filter(Boolean);
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl)
    if (!origin) return callback(null, true);

    if (allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200  // Some browsers need this for legacy support
}));
app.options('*', cors({
  origin: allowed,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true
}));

app.use(morgan('dev'));

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

app.use(errorHandler);

const port = process.env.PORT || 3000;

connectDB().then(async () => {
  await ensureBootstrapAdmin();
  app.listen(port, () => {
    console.log(`API ready on http://localhost:${port}`);
  });
});

export default app;
