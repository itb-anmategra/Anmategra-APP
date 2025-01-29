"use server"

import React from 'react';
import PencarianPage from "~/app/pencarian/[params]/searchComp";
import {getServerAuthSession} from "~/server/auth";
import {api} from "~/trpc/server";

export default async function SearchPage({ params }: {
  params: { input: string };
}) {
  const session = await getServerAuthSession();
  return (
      <PencarianPage session={!!session}/>
  );
}