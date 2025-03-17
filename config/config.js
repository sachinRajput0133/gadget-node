module.exports = {
    server: {
        port: process.env.PORT || 9876,
        DB_CONNECTION: process.env.DB_CONNECTION || "mongodb",
        DB_HOST: process.env.DB_HOST || 'localhost',
        DB_PORT: process.env.DB_PORT === "" ? process.env.DB_PORT : process.env.DB_PORT ? `:${process.env.DB_PORT}` : ':27017',
        DB_DATABASE: process.env.DB_DATABASE || ``,
        DB_USERNAME: process.env.DB_PASSWORD ? `${process.env.DB_USERNAME}:` : '',
        DB_PASSWORD: process.env.DB_PASSWORD ? `${process.env.DB_PASSWORD}@` : '',
        MONGOOSE_ENCRYPTION_SECRET: process.env.MONGOOSE_ENCRYPTION_SECRET
    },
    auth: {
        jwtSecret: process.env.JWT_SECRET || '',
    },
    MIDTRANS: {
        AUTH_STRING: process.env.MIDTRANS_AUTH_STRING ?? "<MIDTRANS AUTH STRING>",
        BASE_URL: process.env.MIDTRANS_BASE_URL ?? "https://api.midtrans.com",
        CLIENT_KEY: process.env.MIDTRANS_CLIENT_KEY ?? "<MIDTRANS CLIENT KEY>",
        PRODUCTION: process.env.MIDTRANS_PRODUCTION ?? "false",
        SERVER_KEY: process.env.MIDTRANS_SERVER_KEY ?? "<MIDTRANS SERVER KEY>"
    },
    REDIS: {
        HOST: process.env.REDIS_HOST || '127.0.0.1',
        PORT: process.env.REDIS_PORT || 6379,
        PASSWORD_FOR_BULL: process.env.REDIS_PASSWORD ?? "",
        PASSWORD: process.env.REDIS_PASSWORD == "" ? process.env.REDIS_PASSWORD : process.env.REDIS_PASSWORD ? `:${process.env.REDIS_PASSWORD}@` : "",
        USER: process.env.REDIS_USER ?? ""
    },
    IN_APPS_PURCHASE: {
        URL: process.env.IN_APPS_API_URL
    },
    AWS_CONFIG: {
        AWS_S3_ACCESS_KEY: process.env.AWS_S3_ACCESS_KEY,
        AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
        AWS_SESSION_TOKEN: process.env.AWS_SESSION_TOKEN,
        AWS_S3_SECRET_KEY: process.env.AWS_S3_SECRET_KEY,
        AWS_S3_URL: process.env.AWS_S3_URL,
        AWS_S3_API_VERSION: process.env.AWS_S3_API_VERSION,
        AWS_ACCESS_ID: process.env.AWS_ACCESS_ID,
        AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
        REGION: process.env.REGION
    },

    SMTP_CONFIG: {
        SMTP_HOST: process.env.ZOHO_SMTP_HOST,
        SMTP_PORT: process.env.ZOHO_SMTP_PORT,
        SMTP_EMAIL: process.env.ZOHO_SMTP_EMAIL,
        SMTP_PASSWORD: process.env.ZOHO_SMTP_PASSWORD
    },
    SSO_DETAILS: {
        CLIENT_ID: process.env.SSO_CLIENT_ID ?? "<SSO CLIENT KEY>",
        CLIENT_SECRET: process.env.SSO_CLIENT_SECRET ?? "<SSO SECRECT KEY>",
        REDIRECT_URL: process.env.SSO_REDIRECT_URL ?? "https://orbitjobs.id/",
        API_URL: process.env.SSO_API_URL ?? "https://api.orbitaccount.id"
    },
    THIS: {
        SENDER_EMAIL: process.env.SENDER_EMAIL ?? 'Artha Job Board <jenish+artha@knovator.com>',
        ORBIT_EMAIL: process.env.ORBIT_EMAIL ?? 'info@orbitjobs.id',
        FRONT_URL: process.env.FRONT_URL ?? "https://orbitjobs.id/",
        API_URL: process.env.API_URL ?? "https://api.orbitjobs.id/"
    },
    LINKED_IN: {
        CLIENT_ID: process.env.CLIENT_ID ?? "<LINKEDIN CLIENT KEY>",
        CLIENT_SECRET: process.env.CLIENT_SECRET ?? "<LINKEDIN SECRECT KEY>",
        STATE: process.env.STATE ?? "<LINKEDIN STATE>",
        REDIRECT_LOGIN_URL: process.env.LINKEDIN_REDIRECT_LOGIN_URL ?? "https://quality.orbitjobs.id/jobsseekers/login",
        REDIRECT_REGISTER_URL: process.env.LINKEDIN_REDIRECT_REGISTER_URL ?? "https://quality.orbitjobs.id/jobsseekers/register",
        ACCESS_TOKEN: process.env.LINKEDIN_ACCESS_TOKEN ?? "https://www.linkedin.com/oauth/v2/accessToken",
        PROFILE_URL: process.env.PROFILE_URL ?? "https://api.linkedin.com/v2/me?projection=(id,localizedFirstName,localizedLastName,profilePicture(displayImage~digitalmediaAsset:playableStreams))",
        EMAIL_URL: process.env.EMAIL_URL ?? "https://api.linkedin.com/v2/clientAwareMemberHandles?q=members&projection=(elements*(primary,type,handle~))"
    },
    FIREBASE: {
        NOTIFICATION_LINK: process.env.FIREBASE_NOTIFICATION_LINK,
        SERVERKEY: process.env.FIREBASE_SERVERKEY
    },
    SEED: process.env.SEED ?? "true",
    PORT: process.env.PORT ?? "4872",
    TZ: process.env.TZ ?? 'Asia/Kolkata',
    DEBUG: process.env.DEBUG ?? false,
    DEFAULT_LNG: process.env.DEFAULT_LNG ?? 'id',
    MATCHING_LIMIT: process.env.MATCHING_LIMIT ?? 25,
    OPENSSL_CONF: process.env.OPENSSL_CONF ?? '/dev/null',
    CHUNK_SIZE: process.env.CHUNK_SIZE ?? 200,
    ARRAY_LIMIT: process.env.ARRAY_LIMIT ?? 10,
    WEASYPRINT: {
        HOST: process.env.PDF_GENERATOR_HOST ?? "pdfs.knovator.in",
        PATH: process.env.PDF_GENERATOR_PATH ?? "/api/v1.0/print"
    },
    TIMEOUT: process.env.TIMEOUT ?? 3000,
    AI: {
        API_URL: process.env.AI_API_URL ?? 'http://4.213.88.105/recommend',
        RESP_LIMIT: process.env.AI_RESP_LIMIT ?? 50000,
        API_KEY: process.env.AI_API_KEY ?? "<AI_API_KEY>"
    },
    SETTING: {
        CUSTOMIZE_DOCUMENTATION: 'DOWNLOADABLE_DOCUMENT_CUSTOMIZATION',
        EMAIL_CONFIGURATION: "EMAIL_CONFIGURATION",
        SOCIAL_MEDIA_LINK: "SOCIAL_MEDIA_LINK",
        APPEARANCE: "APPEARANCE"
    },
    EMAIL: {
        AWS: "AWS",
        SMTP: "SMTP",
        MAILGUN: "MAILGUN",
        SENDINBLUE: "SENDINBLUE",
        SENDGRID: "SENDGRID"
    },

    WEBHOOK_URL: process.env.WEBHOOK_URL,
    LEAD_WEBHOOK_URL: process.env.LEAD_WEBHOOK_URL,
    NODE_ENV: process.env.NODE_ENV,
    BASE_URL: {
        FRONT: process.env.FRONT_BASE_URL ?? "localhost:1123",
        ADMIN: process.env.ADMIN_BASE_URL ?? "localhost:1122"
    },

    PAYMENT_METHODS: {
        RAZORPAY: {
            KEY_ID: process.env.KEY_ID,
            KEY_SECRET: process.env.SERECT_ID
        },
        STRIPE: {
            KEY: process.env.STRIPE_KEY,
            ENDPOINT_SECRET: process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET
        },
        PAYPAL: {
            CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
            CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET,
            API_BASE_URL: process.env.PAYPAL_API_BASE_URL || "https://api-m.sandbox.paypal.com",
            WEBHOOK_ID: process.env.PAYPAL_WEBHOOK_ID || "61T54330AH494073S"
        }
    },

    OAUTH: {
        LINKEDIN: {
            LINKEDIN_CLIENT_ID: process.env.LINKEDIN_CLIENT_ID,
            LINKEDIN_CLIENT_SECRET: process.env.LINKEDIN_CLIENT_SECRET,
            LINKEDIN_OAUTH_CALLBACK_URL: process.env.LINKEDIN_OAUTH_CALLBACK_URL || `${process.env.API_URL}social-auth/linkedin/callback`,
            LINKEDIN_OAUTH_ACCESS_TOKEN_URL: process.env.LINKEDIN_OAUTH_ACCESS_TOKEN_URL || 'https://www.linkedin.com/oauth/v2/accessToken',
            LINKEDIN_OAUTH_USER_INFO_URL: process.env.LINKEDIN_OAUTH_USER_INFO_URL || 'https://api.linkedin.com/v2/userinfo'
        },
        GOOGLE: {
            GOOGLE_OAUTH_CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID,
            GOOGLE_OAUTH_CLIENT_SECRET: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
            GOOGLE_OAUTH_CALLBACK_URL: process.env.GOOGLE_OAUTH_CALLBACK_URL || `${process.env.API_URL}social-auth/google/callback`
        }
    },

    CLIENT_DOMAIN_NOT_ALLOWED: process.env.CLIENT_DOMAIN_NOT_ALLOWED,
    ALLOW_LOCAL_ORIGINS: process.env.ALLOW_LOCAL_ORIGINS,
    DB_COPY_DATA_CHUNK_SIZE: 2000,

    SMS_SERVICE: {
        TWILLIO: {
            TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
            TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN
        },
        FROM: process.env.FROM_SMS
    },

    SALES_ACCOUNT_CREDS: {
        PASSWORD: process.env.SALES_ACCOUNT_PASSWORD || 'Test@123',
    },
    MASTER_OTP:  process.env.MASTER_OTP || '9876',
    EXCHANGE_API_URL: process.env.EXCHANGE_URL || 'https://api.exchangerate-api.com/v4/latest'
}

// Validations for a required field in ENV.
if (!process.env.DB_CONNECTION || !process.env.DB_HOST || !process.env.DB_DATABASE || !process.env.DB_USERNAME || (process.env.DB_PASSWORD !== "" && !process.env.DB_PASSWORD)) {
} else if (!process.env.AWS_S3_ACCESS_KEY || !process.env.AWS_S3_BUCKET_NAME || !process.env.AWS_S3_SECRET_KEY || !process.env.AWS_S3_URL || !process.env.AWS_SESSION_TOKEN || !process.env.AWS_S3_API_VERSION) {
    logger.error("Please add AWS S3 config details in env. Please verify these keys [AWS_S3_ACCESS_KEY, AWS_S3_BUCKET_NAME, AWS_S3_SECRET_KEY, AWS_S3_URL, AWS_SESSION_TOKEN, AWS_S3_API_VERSION]")
    process.exit(0)
} else if (!process.env.FIREBASE_NOTIFICATION_LINK || !process.env.FIREBASE_SERVERKEY) {
    logger.error('Please add firebase notification url/link and server key in your ENV file.');
    process.exit(0);
}