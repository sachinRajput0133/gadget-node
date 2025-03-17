global.baseDir = __dirname;
const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/database');
const i18next = require("i18next");
const i18nextMiddleware = require("i18next-express-middleware");
const FilesystemBackend = require("i18next-node-fs-backend");
const config = require("../config/config");
const { authentication } = require("./policies/passport");
// Load env vars
dotenv.config();
global.TZ = config.TZ;
// Connect to database
connectDB();

i18next
  .use(FilesystemBackend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    lng: "en",
    fallbackLng: "en",
    preload: ["en", "id"],
    detection: {
      order: ["header", "querystring", "cookie"],
      lookupHeader: "lng",
      caches: false,
    },
    fallbackLng: config.DEFAULT_LNG ?? "en",
    ns: [
      "auth",
      "user",
      "city",
      "state",
      "common",
      "country",
      "master",
      "submaster",
      "file",
      "form",
      "staff",
      "employer",
      "candidate",
      "role",
      "permission",
      "jobs",
      "category",
      "licence",
      "userjobs",
      "jobstracks",
      "usertrack",
      "adminProfile",
      "order",
      "checkSubscription",
      "employerAnalytics",
      "adminAnalytics",
      "pageAndWidget",
      "transaction",
      "payment",
      "localize",
      "invite"
    ],
    defaultNS: [
      "auth",
      "user",
      "city",
      "state",
      "common",
      "country",
      "master",
      "submaster",
      "file",
      "form",
      "staff",
      "employer",
      "candidate",
      "role",
      "permission",
      "jobs",
      "category",
      "licence",
      "userjobs",
      "jobstracks",
      "usertrack",
      "adminProfile",
      "order",
      "checkSubscription",
      "employerAnalytics",
      "adminAnalytics",
      "pageAndWidget",
      "transaction",
      "payment",
      "localize",
      "invite"
    ],
    backend: {
      loadPath: path.join(__dirname, `/locales/{{lng}}/{{ns}}.json`),
      addPath: path.join(__dirname, `/locales/{{lng}}/{{ns}}.json`),
    },
    // TODO: Remove debug in production
    debug: false,
    detection: {
      order: ["header", "querystring", "cookie"],
      lookupHeader: "lng",
      caches: false,
    },
    fallbackLng: config.DEFAULT_LNG ?? "en",
    preload: ["en", "id"],
  });
  const app = express();
  app.use(i18nextMiddleware.handle(i18next)); 
  global.authentication = authentication;

// Body parser
app.use(express.json({ limit: '10mb' }));

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
// const limiter = rateLimit({
//   windowMs: 10 * 60 * 1000, // 10 minutes
//   max: 100 // limit each IP to 100 requests per windowMs
// });
// app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Sanitize data
app.use(mongoSanitize());

// Compress responses
app.use(compression());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/reviews', require('./routes/reviews'));
// app.use('/api/categories', require('./routes/categories'));
// app.use('/api/roles', require('./routes/roles'));
// app.use('/api/permissions', require('./routes/permissions'));
// app.use('/api/users', require('./routes/users'));
// app.use('/api/sections', require('./routes/sections'));
// app.use('/api/uploads', require('./routes/uploads'));
// app.use('/api/articles', require('./routes/articles'));
// Re-route comment routes
// app.use('/api/reviews/:reviewSlug/comments', require('./routes/comments'));
// app.use('/api/comments', require('./routes/comments'));


app.use(require("./routes/index"));
// API documentation route
app.get('/api/docs', (req, res) => {
  res.status(200).json({
    message: "Gadget Review Platform API",
    version: "1.0.0",
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login', 
        logout: 'POST /api/auth/logout',
        getMe: 'GET /api/auth/me'
      },
      roles: {
        getAll: 'GET /api/roles',
        getSingle: 'GET /api/roles/:id',
        create: 'POST /api/roles',
        update: 'PUT /api/roles/:id',
        delete: 'DELETE /api/roles/:id'
      },
      reviews: {
        getAll: 'GET /api/reviews',
        getSingle: 'GET /api/reviews/:slug',
        create: 'POST /api/reviews',
        update: 'PUT /api/reviews/:slug',
        delete: 'DELETE /api/reviews/:slug'
      },
      categories: {
        getAll: 'GET /api/categories',
        getSingle: 'GET /api/categories/:slug',
        create: 'POST /api/categories',
        update: 'PUT /api/categories/:slug',
        delete: 'DELETE /api/categories/:slug'
      },
      comments: {
        getAll: 'GET /api/reviews/:reviewSlug/comments',
        getSingle: 'GET /api/comments/:id',
        create: 'POST /api/reviews/:reviewSlug/comments',
        update: 'PUT /api/comments/:id',
        delete: 'DELETE /api/comments/:id',
        approve: 'PUT /api/comments/:id/approve'
      }
    }
  });
});

// 404 handler
app.use((req, res, next) => {
  next(new Error(`Route not found: ${req.originalUrl}`));
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
