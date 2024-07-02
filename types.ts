declare namespace NodeJS {
  export interface ProcessEnv {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string;
    CLERK_SECRET_KEY: string;
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: string;
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: string;
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: string;
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: string;
    DATABASE_URL: string;
    AWS_PUBLIC_ACCESS_KEY: string;
    AWS_SECRET_ACCESS_KEY: string;
    S3_BILLBOARD_BUCKET: string;
    S3_PRODUCT_BUCKET: string;
    REGION: string;
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string;
    STRIPE_SECRET_KEY: string;
    STRIPE_WEBHOOK_SECRET: string;
    NODEMAILER_EMAIL: string;
    NODEMAILER_SECRET: string;
  }
}
