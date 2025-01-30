"use server"

import React from 'react';
import PencarianPage from "~/app/pencarian/[params]/searchComp";
import {getServerAuthSession} from "~/server/auth";
import {api} from "~/trpc/server";

export default async function SearchPage({ params }: {
  params: Promise<{ params: string }>
}) {
  const query = (await params).params
  const session = await getServerAuthSession();
  const sessionId = session?.user?.id;
  const data = await api.landing.getResults({query: query});

  return (
      <PencarianPage session={sessionId} data={data} />
  );
}