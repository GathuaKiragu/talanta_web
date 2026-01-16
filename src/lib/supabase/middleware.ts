import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/lib/env";

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        env.NEXT_PUBLIC_SUPABASE_URL,
        env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Protected routes
    const protectedPaths = ["/dashboard", "/careers", "/mentors", "/sessions", "/profile"];
    const adminPaths = ["/admin"];
    const authPaths = ["/login", "/signup"];

    const path = request.nextUrl.pathname;

    // Redirect to login if accessing protected route without auth
    if (protectedPaths.some((p) => path.startsWith(p)) && !user) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        url.searchParams.set("redirect", path);
        return NextResponse.redirect(url);
    }

    // Redirect to dashboard if accessing auth pages while logged in
    if (authPaths.some((p) => path.startsWith(p)) && user) {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
    }

    // Enforce onboarding
    if (user && !path.startsWith("/onboarding") && !path.startsWith("/auth") && !path.startsWith("/api")) {
        const { data: userData } = await supabase
            .from("users")
            .select("onboarding_completed")
            .eq("id", user.id)
            .single();

        if (userData && !userData.onboarding_completed) {
            const url = request.nextUrl.clone();
            url.pathname = "/onboarding";
            return NextResponse.redirect(url);
        }
    }

    // Check admin access
    if (adminPaths.some((p) => path.startsWith(p)) && user) {
        const { data: adminUser } = await supabase
            .from("admin_users")
            .select("role, is_active")
            .eq("user_id", user.id)
            .single();

        if (!adminUser || !adminUser.is_active) {
            const url = request.nextUrl.clone();
            url.pathname = "/dashboard";
            return NextResponse.redirect(url);
        }
    }

    return supabaseResponse;
}
