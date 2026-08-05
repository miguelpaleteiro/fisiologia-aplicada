import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex">

      <Sidebar />

      <div className="flex-1">

        <Topbar />

        <section className="p-8">
          Dashboard
        </section>

      </div>

    </main>
  );
}