"use server"

import React from 'react';
import LandingComp from "~/app/lembaga/landingComp";
import {api} from "~/trpc/server";
import {getServerAuthSession} from "~/server/auth";

export default async function Home() {

  const session = await getServerAuthSession();
  const kepanitiaanTerbaru = await api.landing.getRecentKepanitiaan();
  const kegiatanTerbaru = await api.landing.getRecentEvents();
  const kepanitiaanTerbesar = await api.landing.getTopEvents();

  return (
    <LandingComp data={{kepanitiaanTerbaru, kegiatanTerbaru, kepanitiaanTerbesar}} session={session} />
  );
}
