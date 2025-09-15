interface EventProfil {
  profilId: number;
  profilDescription: string;
}

interface ProfilGroup {
  kmProfil: string;
  eventProfil: EventProfil[];
}

const eventProfil1: EventProfil = {
  profilId: 1,
  profilDescription:
    'Wisokto menekankan pengembangan kemampuan berpikir tingkat tinggi dan penerapannya dalam kegiatan yang nyata serta bermanfaat.',
};
const eventProfil2: EventProfil = {
  profilId: 2,
  profilDescription:
    'Wisokto mengutamakan kemampuan analitis yang terintegrasi dengan implementasi program sehari-hari.',
};
const eventProfil3: EventProfil = {
  profilId: 3,
  profilDescription:
    'Wisokto mengutamakan kemampuan analitis yang terintegrasi dengan implementasi program sehari-hari.',
};
const eventProfil4: EventProfil = {
  profilId: 4,
  profilDescription:
    'Wisokto mengutamakan kemampuan analitis yang terintegrasi dengan implementasi program sehari-hari.',
};
const eventProfil5: EventProfil = {
  profilId: 5,
  profilDescription:
    'Wisokto mengutamakan kemampuan analitis yang terintegrasi dengan implementasi program sehari-hari.',
};

const kmProfilData = [
  'Memiliki kemampuan berpikir tingkat tinggi dan mampu mengimplementasikannya dalam kehidupan sehari-hari',
  'Memiliki kemampuan sebagai pembelajar seumur hidup',
  'Memiliki kemampuan untuk berkolaborasi secara efektif dalam lingkungan masyarakat akademik maupun masyarakat umum',
  'Memiliki kesadaran akan tanggung jawab sosial serta mampu menerapkan pendekatan multidisiplin dan interdisiplin dalam memecahkan berbagai masalah terkait keprofesian dan masyarakat yang luas',
];

const eventProfilProp: ProfilGroup[] = [
  {
    kmProfil: kmProfilData[0]!,
    eventProfil: [eventProfil1, eventProfil2],
  },
  {
    kmProfil: kmProfilData[1]!,
    eventProfil: [eventProfil3],
  },
  {
    kmProfil: kmProfilData[2]!,
    eventProfil: [eventProfil4],
  },
  {
    kmProfil: kmProfilData[3]!,
    eventProfil: [eventProfil5],
  },
];

interface ProfilRowProps {
  profilGroup: ProfilGroup;
}

interface ProfilTableProps {
  profilData: ProfilGroup[];
}

export { eventProfilProp };
export type { ProfilGroup, ProfilRowProps, ProfilTableProps };
