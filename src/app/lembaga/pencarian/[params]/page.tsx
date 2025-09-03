"use server"

import React from 'react';
import PencarianPage from "~/app/_components/pencarian/search-comp";
import {getServerAuthSession} from "~/server/auth";
import {api} from "~/trpc/server";

export default async function SearchPage({ params }: {
  params: Promise<{ params: string }>
}) {
  const query = (await params).params
  const session = await getServerAuthSession();
  const data = await api.landing.getResults({query: query});

  return (
      <PencarianPage session={session} data={data} />
  );
}