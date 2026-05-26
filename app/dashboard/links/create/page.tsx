import DashboardHeader from "@/components/dashboard/Header";
import CreateLinkForm from "@/components/links/CreateLinkForm";

export default function CreateLinkPage() {
    return (
        <div>
            <DashboardHeader title="Create Link" />
            <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 max-w-2xl mx-auto">
                <div className="card rounded-2xl border border-border bg-surface p-6 sm:p-8">
                    <h2 className="text-lg font-semibold text-text-primary mb-2">Shorten a URL</h2>
                    <p className="text-sm text-text-secondary mb-6">Create a short link with optional UTM parameters to track clicks.</p>
                    <CreateLinkForm />
                </div>
            </div>
        </div>
    );
}
