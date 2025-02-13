"use server"

import React from 'react';
import LandingComp from "~/app/lembaga/landingComp";
import {api} from "~/trpc/server";
import {getServerAuthSession} from "~/server/auth";

export default async function Home() {

  const session = await getServerAuthSession();
  const kegiatanTerbaru = await api.landing.getRecentEvents();
  const kegiatanTerbesar = await api.landing.getTopEvents();

  return (
    <LandingComp data={{kegiatanTerbaru, kegiatanTerbesar}} session={session} />
  );
}
