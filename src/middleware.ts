import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// ==============================================


export const middleware = async (request: NextRequest): Promise<NextResponse> => {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = request.nextUrl;
    const publicRoutes: string[] = [
        '/',
        '/sign-in',
        '/sign-up',
        '/services'
    ];
    const publicApiRoutes: string[] = [
        '/api/auth',
        '/api/services'
    ];

    const isPublicPage: boolean = publicRoutes.includes(pathname);
    const isPublicApi: boolean = publicApiRoutes.some((route: string) => pathname.startsWith(route));

    if (pathname.startsWith('/api')) {
        if (!token && !isPublicApi) {
            return NextResponse.json(
                { error: 'Not authorized, you should be connected' },
                { status: 401 }
            );
        }

        return NextResponse.next();
    }

    if (token && pathname === '/') {
        //return NextResponse.redirect(new URL('/profile', request.url));
    }

    if (!token && !isPublicPage && !pathname.startsWith('/api/auth')) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    if (!token && pathname.startsWith('/api') && !isPublicApi) {
        return NextResponse.json({ error: 'Not authorized, you should be connected' }, { status: 401 });
    }

    return NextResponse.next();
};


export const config = {
    matcher: [
        '/',
        '/profile/:path*',
        '/messages/:path*',
        '/services/:path*',
        '/api/:path*'
    ]
};
