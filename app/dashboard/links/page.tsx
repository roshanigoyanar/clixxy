import { createClient } from "@/lib/supabase/server";
import DashboardHeader from "@/components/dashboard/Header";
import LinkCard from "@/components/links/LinkCard";
import Link from "next/link";
import { Plus, Link2 } from "lucide-react";
import { headers } from "next/headers";

export default async function LinksPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: links } = await supabase
        .from("links")
        .select("id, user_id, name, slug, destination_url, utm_source, utm_medium, utm_campaign, created_at")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });

    const linkIds = links?.map((l) => l.id) ?? [];
    const { data: clicks } = linkIds.length
        ? await supabase.from("clicks").select("link_id").in("link_id", linkIds)
        : { data: [] };

    const linksWithClicks = (links ?? []).map((link) => ({
        ...link,
        click_count: clicks?.filter((c) => c.link_id === link.id).length ?? 0,
    }));

    const headersList = await headers();
    const host = headersList.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;

    return (
        <div>
            <DashboardHeader title="My Links" />
            <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-semibold text-text-primary">Shortened Links</h2>
                        <p className="text-sm text-text-secondary">Manage and track your active campaigns and links.</p>
                    </div>
                    <Link href="/dashboard/links/create" className="btn-primary flex items-center gap-1.5 px-5 py-2.5 text-xs w-auto self-start sm:self-auto shadow-md hover:shadow-md">
                        <Plus className="w-4 h-4" /> Create Link
                    </Link>
                </div>

                {linksWithClicks.length === 0 ? (
                    <div className="card rounded-2xl border border-border bg-surface flex flex-col items-center justify-center py-16 text-center px-6">
                        <div className="w-12 h-12 rounded-xl bg-bg border border-border shadow-sm flex items-center justify-center mb-4">
                            <Link2 className="w-6 h-6 text-text-muted" />
                        </div>
                        <h3 className="text-base font-semibold text-text-primary mb-1">No links created yet</h3>
                        <p className="text-sm text-text-secondary mb-6 max-w-sm">Create your first shortened link to start tracking your audience and geography.</p>
                        <Link href="/dashboard/links/create" className="btn-primary flex items-center gap-1.5 px-6 py-3 text-xs w-auto shadow-md hover:shadow-md">
                            <Plus className="w-4 h-4" /> Create link
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        {linksWithClicks.map((link) => (
                            <LinkCard key={link.id} link={link} baseUrl={baseUrl} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
