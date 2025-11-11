import { getServerAuthSession } from '~/server/auth';

export default async function MahasiswaInboxPage() {
  const session = await getServerAuthSession();

  if (!session) {
    return (
      <main className="flex flex-col p-8 min-h-screen">
        <h1 className="text-[32px] font-semibold mb-2">Inbox</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Please sign in to view inbox</div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col p-8 min-h-screen">
      <h1 className="text-[32px] font-semibold mb-2">Inbox</h1>
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="text-lg text-neutral-500">
          Inbox feature coming soon
        </div>
        <p className="text-sm text-neutral-400">
          This feature is under development
        </p>
      </div>
    </main>
  );
}
