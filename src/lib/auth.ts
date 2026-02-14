// Auth
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
// ORM
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prismaClient } from "@/lib/prisma";
// Types
import { AuthOptions } from "next-auth";
import { User } from "@/generated/prisma";
// Others
import bcrypt from "bcrypt";




export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prismaClient),
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
        updateAge: 48 * 60 * 60,
    },
    secret: process.env.AUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            authorize: async (credentials: any): Promise<any> => {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user: User | null = await prismaClient.user.findUnique({ where: { email: credentials.email } });

                if (!user) {
                    return null;
                }

                const passwordIsValid: boolean = await bcrypt.compare(credentials.password, user.password);

                if (!passwordIsValid) {
                    return null;
                }

                const { password, ...newUser } = user;
                return { ...newUser };
            }
        })
    ],
    pages: { signIn: "/sign-in" },
    callbacks: {
        async session({ session, token }: { session: any, token: any }) {
            if (token) {
                session.user.id = token.sub as string;
            }
            return session;
        },
        async jwt({ token, user }: { token: any, user: any }) {
            if (user) {
                token.sub = user.id;
            }
            return token;
        }
    }
};

export const { auth } = NextAuth(authOptions);
