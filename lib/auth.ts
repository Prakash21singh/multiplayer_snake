import {betterAuth} from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from './generated/prisma/client';
import prisma from './prisma';


export const auth = betterAuth({
    secret: process.env.SECRET_KEY || 'default_secret_change_this_in_production',
    baseURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    tokenExpiration: '1h',
    refreshTokenExpiration: '7d',
    cookie: {
        name: 'auth_token',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    },
    database: prismaAdapter(prisma, {
        provider: "postgresql"
    }),
    emailAndPassword: {
        enabled: true,
        autoSignInAfterSignUp: true,
    },
    plugins: [],
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID || '',
            clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
        }
    }
});