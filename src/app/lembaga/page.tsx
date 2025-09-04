"use server"

import React from 'react';
import LandingContent from "~/app/lembaga/landing-content";
import {api} from "~/trpc/server";
import {getServerAuthSession} from "~/server/auth";

export default async function Home() {

  const session = await getServerAuthSession();
  const kegiatanTerbaru = await api.landing.getRecentEvents();
  const kegiatanTerbesar = await api.landing.getTopEvents();

  return (
    <LandingContent data={{kegiatanTerbaru, kegiatanTerbesar}} session={session} />
  );
}
