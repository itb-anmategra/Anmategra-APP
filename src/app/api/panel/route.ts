// src/app/api/panel/route.ts
import { renderTrpcPanel } from '@metamorph/trpc-panel';
import { appRouter } from '~/server/api/root';

export async function GET() {
  return new Response(
    renderTrpcPanel(appRouter, {
      url: 'http://localhost:3000/api/trpc',
      transformer: 'superjson',
    }),
    {
      status: 200,
      headers: [['Content-Type', 'text/html']],
    },
  );
}
