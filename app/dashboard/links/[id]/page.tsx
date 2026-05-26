import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import DashboardHeader from "@/components/dashboard/Header";
import StatsCard from "@/components/dashboard/StatsCard";
import UnifiedAnalyticsCharts from "@/components/analytics/UnifiedAnalyticsCharts";
import RecentClicks from "@/components/analytics/RecentClicks";
import CopyButton from "@/components/links/CopyButton";
import Link from "next/link";
import { BarChart3, Calendar, ExternalLink, Globe, Smartphone, ArrowLeft } from "lucide-react";
import { getPlatformFromReferrer, formatDate } from "@/lib/utils";
import { headers } from "next/headers";

export default async function LinkAnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: link, error: linkError } = await supabase
        .from("links")
        .select("id, name, slug, destination_url, utm_source, utm_medium, utm_campaign, created_at")
        .eq("id", id)
        .eq("user_id", user!.id)
        .single();

    if (linkError || !link) {
        notFound();
    }

    const { data: clicks } = await supabase
        .from("clicks")
        .select("id, link_id, referrer, device, country, user_agent, timestamp")
        .eq("link_id", id)
        .order("timestamp", { ascending: false });

    const totalClicks = clicks?.length ?? 0;

    const platformCounts: { [key: string]: number } = {};
    const deviceCounts: { [key: string]: number } = {};
    const countryCounts: { [key: string]: number } = {};

    clicks?.forEach((click) => {
        const platform = getPlatformFromReferrer(click.referrer, click.user_agent);
        platformCounts[platform] = (platformCounts[platform] || 0) + 1;

        const device = click.device || "Unknown";
        deviceCounts[device] = (deviceCounts[device] || 0) + 1;

        const country = click.country || "Unknown";
        countryCounts[country] = (countryCounts[country] || 0) + 1;
    });

    const platformData = Object.entries(platformCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

    const deviceData = Object.entries(deviceCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

    const countryData = Object.entries(countryCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

    const topCountry = countryData[0]?.name || "—";
    const topPlatform = platformData[0]?.name || "—";
    const topDevice = deviceData[0]?.name || "—";

    const headersList = await headers();
    const host = headersList.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;
    const shortUrl = `${baseUrl}/r/${link.slug}`;

    return (
        <div>
            <DashboardHeader title="Analytics" />
            <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
                {/* Back button and title */}
                <div className="flex flex-col gap-4">
                    <Link href="/dashboard/links" className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-text-secondary hover:text-text-primary flex items-center gap-1.5 transition-colors self-start">
                        <ArrowLeft className="w-4 h-4" /> Back to Links
                    </Link>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-semibold text-text-primary uppercase tracking-wider">{link.name}</h2>
                            <div className="flex items-center gap-2 mt-2">
                                <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-mono font-bold text-accent hover:underline break-all">
                                    {shortUrl}
                                </a>
                                <CopyButton text={shortUrl} />
                                <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg border border-solid border-transparent hover:border-accent bg-surface-hover hover:bg-surface-hover text-text-secondary hover:text-accent-hover transition-all" title="Open Link">
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                            <p className="text-xs text-text-muted mt-2 uppercase font-bold tracking-widest break-all">
                                Destination: {link.destination_url}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-muted self-start sm:self-auto">
                            <Calendar className="w-4 h-4" />
                            Created {formatDate(link.created_at)}
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    <StatsCard title="Total Audience" value={totalClicks} icon={BarChart3} subtitle="Clicks recorded" iconColor="text-blue-500" />
                    <StatsCard title="Top Country" value={topCountry} icon={Globe} subtitle="Most active" iconColor="text-purple-500" />
                    <StatsCard title="Top Platform" value={topPlatform} icon={Globe} subtitle="Main source" iconColor="text-green-500" />
                    <StatsCard title="Top Device" value={topDevice} icon={Smartphone} subtitle="Most used" iconColor="text-orange-500" />
                </div>

                {/* Charts */}
                <UnifiedAnalyticsCharts platformData={platformData} deviceData={deviceData} countryData={countryData} />

                {/* Recent Visitors */}
                <div className="card rounded-2xl border border-border bg-surface overflow-hidden">
                    <div className="px-6 py-5 border-b border-border bg-bg/50">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary">Recent Visitors</h3>
                    </div>
                    <RecentClicks clicks={clicks || []} />
                </div>
            </div>
        </div>
    );
}
