import Calendar from "@/src/components/home/calendar";
import { fetchTest } from "@/src/lib/data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | Task Manager and Cloud Storage System",
  description: "Home page",
};

export default async function HomePage() {
  // remove in production
  // await fetchTest();

  return (
    <main className="flex-1 p-8 overflow-auto max-w-8xl mx-auto">
      <h2 className="text-2xl font-bold tracking-tight">Calendar</h2>
      <Calendar />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"></div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8"></div>
    </main>
  );
}
