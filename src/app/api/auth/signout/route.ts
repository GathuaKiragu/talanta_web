import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const supabase = await createClient();

    // Sign out from Supabase
    await supabase.auth.signOut();

    // Redirect to login page
    const url = new URL(request.url);
    const origin = url.origin;

    return NextResponse.redirect(`${origin}/login`, {
        status: 303, // See Other - recommended for redirects after POST
    });
}
