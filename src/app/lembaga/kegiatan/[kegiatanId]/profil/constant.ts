interface EventProfile {
  profileId: number;
  profileDescription: string;
}

interface ProfileGroup {
  kmProfile: string;
  eventProfile: EventProfile[];
}

const eventProfile1: EventProfile = {
  profileId: 1,
  profileDescription:
    'Wisokto menekankan pengembangan kemampuan berpikir tingkat tinggi dan penerapannya dalam kegiatan yang nyata serta bermanfaat.',
};
const eventProfile2: EventProfile = {
  profileId: 2,
  profileDescription:
    'Wisokto mengutamakan kemampuan analitis yang terintegrasi dengan implementasi program sehari-hari.',
};
const eventProfile3: EventProfile = {
  profileId: 3,
  profileDescription:
    'Wisokto mengutamakan kemampuan analitis yang terintegrasi dengan implementasi program sehari-hari.',
};
const eventProfile4: EventProfile = {
  profileId: 4,
  profileDescription:
    'Wisokto mengutamakan kemampuan analitis yang terintegrasi dengan implementasi program sehari-hari.',
};
const eventProfile5: EventProfile = {
  profileId: 5,
  profileDescription:
    'Wisokto mengutamakan kemampuan analitis yang terintegrasi dengan implementasi program sehari-hari.',
};

const kmProfileData = [
  'Memiliki kemampuan berpikir tingkat tinggi dan mampu mengimplementasikannya dalam kehidupan sehari-hari',
  'Memiliki kemampuan sebagai pembelajar seumur hidup',
  'Memiliki kemampuan untuk berkolaborasi secara efektif dalam lingkungan masyarakat akademik maupun masyarakat umum',
  'Memiliki kesadaran akan tanggung jawab sosial serta mampu menerapkan pendekatan multidisiplin dan interdisiplin dalam memecahkan berbagai masalah terkait keprofesian dan masyarakat yang luas',
];

const eventProfileProp: ProfileGroup[] = [
  {
    kmProfile: kmProfileData[0]!,
    eventProfile: [eventProfile1, eventProfile2],
  },
  {
    kmProfile: kmProfileData[1]!,
    eventProfile: [eventProfile3],
  },
  {
    kmProfile: kmProfileData[2]!,
    eventProfile: [eventProfile4],
  },
  {
    kmProfile: kmProfileData[3]!,
    eventProfile: [eventProfile5],
  },
];

interface ProfileRowProps {
  profileGroup: ProfileGroup;
}

interface ProfileTableProps {
  profileData: ProfileGroup[];
}

export { eventProfileProp };
export type { ProfileGroup, ProfileRowProps, ProfileTableProps };
