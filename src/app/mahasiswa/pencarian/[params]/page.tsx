"use server"

import React from 'react';
import PencarianContent from "~/app/_components/pencarian/pencarian-content";
import {getServerAuthSession} from "~/server/auth";
import {api} from "~/trpc/server";

export default async function SearchPage({ params }: {
  params: Promise<{ params: string }>
}) {
  const query = (await params).params
  const session = await getServerAuthSession();
  const data = await api.landing.getResults({query: query});

  return (
      <PencarianContent session={session} data={data} />
  );
}