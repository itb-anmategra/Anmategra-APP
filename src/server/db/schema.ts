import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTableCreator,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
  pgEnum,
  boolean
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `anmategra_${name}`);

const timestamps = {
  created_at: timestamp("created_at", {
    mode: "date",
    withTimezone: true
  })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updated_at: timestamp("updated_at", {
    mode: "date",
    withTimezone: true
  })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(
      () => new Date())
}

export const posts = createTable(
  "post",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    createdById: varchar("created_by", { length: 255 })
      .notNull()
      .references(() => users.id),
    ...timestamps
  },
  (example) => ({
    createdByIdIdx: index("created_by_idx").on(example.createdById),
    nameIndex: index("name_idx").on(example.name),
  })
);

export const roleEnum = pgEnum('role',['admin','lembaga','mahasiswa']);

export const users = createTable("user", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("email_verified", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
  role: roleEnum('role').notNull().default('mahasiswa'),
  ...timestamps
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  keanggotaan: many(keanggotaan),
  associationRequests: many(associationRequests),
  support: many(support),
  supportReplies: many(supportReplies),
  notifications: many(notifications),
  lembaga: many(lembaga)
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade'}),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_user_id_idx").on(account.userId),
  })
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("session_token", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_user_id_idx").on(session.userId),
  })
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export const mahasiswa = createTable(
  "mahasiswa",
  {
    userId: varchar("user_id", { length: 255 })
      .primaryKey()
      .references(() => users.id, { onDelete: 'cascade' }),
    nim: integer("nim")
      .notNull(),
    jurusan: varchar("jurusan", { length: 255 })
      .notNull(),
    angkatan: integer("angkatan")
      .notNull(),
    ...timestamps 
  }
)

export const mahasiswaRelations = relations(mahasiswa, ({one}) => ({
  users: one(users, {
    fields: [mahasiswa.userId], references: [users.id]
  })
}))

export const lembagaTypeEnum = pgEnum("lembaga_type",["Himpunan","UKM","Kepanitiaan"]);

export const lembaga = createTable(
  "lembaga",
  {
    id: varchar("id", {length:255})
      .primaryKey(),
    userId: varchar("user_id", { length: 255 })
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    name: varchar("name", {length:255})
      .notNull(),
    description: text("description"),
    foundingDate: timestamp("founding_date", {
      mode: "date",
      withTimezone: true
    })
      .notNull(),
    endingDate: timestamp("ending_date", {
        mode: "date",
        withTimezone: true
    }),
    type: lembagaTypeEnum("type"),
    image: varchar("image", { length: 255 }),
    major: varchar("major", { length: 255 }),
    field: varchar("field", { length: 255 }),
    memberCount: integer("member_count"),
    ...timestamps
  }
)

export const lembagaRelations = relations(lembaga, ({one,many}) => ({
  users: one(users, {
    fields: [lembaga.userId], references: [users.id]
  }),
  events: many(events)
}))

export const kontakType = pgEnum("kontak_type",["id_line","phone_number","instagram"]);

export const kontak = createTable(
  "kontak",
  {
    userId: varchar("user_id", { length: 255 })
      .references(() => users.id)
      .primaryKey()
      .notNull(),
    type: kontakType("type"),
    value: varchar("value", { length: 255 })
  }
)

export const eventStatusEnum = pgEnum('event_status', ['Coming Soon', 'On going', 'Ended']);

export const events = createTable('event', {
  id: varchar('id', { length: 255 }).primaryKey(),
  org_id: varchar('org_id', { length: 255 })
    .references(() => lembaga.id),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  image: varchar('image', { length: 255 }),
  start_date: timestamp('start_date').notNull(),
  end_date: timestamp('end_date').notNull(),
  status: eventStatusEnum('status').notNull(),
  oprec_link: varchar('oprec_link', { length: 255 }),
  location: varchar('location', { length: 255 }),
  participant_limit: integer('participant_limit'),
  participant_count: integer('participant_count'),
  is_highlighted: boolean('is_highlighted').notNull().default(false),
  is_organogram: boolean('is_organogram').notNull().default(false),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow()
});

export const eventsRelations = relations(events, ({ many, one }) => ({
  lembaga: one(lembaga, {
    fields: [events.org_id],
    references: [lembaga.id]
  }),
  keanggotaan: many(keanggotaan),
  associationRequests: many(associationRequests),
  eventOrganograms: many(eventOrganograms)
}));

export const organogramTypeEnum = pgEnum('organogram_type', ['Posisi', 'Bidang', 'Divisi']);

export const eventOrganograms = createTable('event_organogram', {
  eventOrganogram_id: varchar('eventOrganogram_id', { length: 255 }).primaryKey(),
  event_id: varchar('event_id', { length: 255 })
    .references(() => events.id),
  type: organogramTypeEnum('type').notNull(),
  value: varchar('value', { length: 255 }).notNull()
});

export const eventOrganogramsRelations = relations(eventOrganograms, ({ many,one }) => ({
  event: one(events, {
    fields: [eventOrganograms.event_id],
    references: [events.id]
  }),
  keanggotaan_positions: many(keanggotaan, { relationName: 'position' }),
  keanggotaan_divisions: many(keanggotaan, { relationName: 'division' }),
  keanggotaan_bidangs: many(keanggotaan, { relationName: 'bidang' }),
  association_request_positions: many(associationRequests, { relationName: 'position' }),
  association_request_divisions: many(associationRequests, { relationName: 'division' }),
  association_request_bidangs: many(associationRequests, { relationName: 'bidang' })
}));

// Enum for association request status
export const associationRequestStatusEnum = pgEnum('association_request_status', ['Pending', 'Accepted', 'Declined']);

// Keanggotaan (Membership) Table
export const keanggotaan = createTable('keanggotaan', {
  id: varchar('id', { length: 255 }).primaryKey(),
  event_id: varchar('event_id', { length: 255 })
    .references(() => events.id),
  user_id: varchar('user_id', { length: 255 })
    .references(() => users.id),
  position_id: varchar('position_id', { length: 255 })
    .references(() => eventOrganograms.eventOrganogram_id)
    .notNull(),
  division_id: varchar('division_id', { length: 255 })
    .references(() => eventOrganograms.eventOrganogram_id),
  bidang_id: varchar('bidang_id', { length: 255 })
    .references(() => eventOrganograms.eventOrganogram_id),
  description: text('description')
});

// Association Request Table
export const associationRequests = createTable('association_request', {
  id: varchar('id', { length: 255 }).primaryKey(),
  event_id: varchar('event_id', { length: 255 })
    .references(() => events.id),
  user_id: varchar('user_id', { length: 255 })
    .references(() => users.id),
  position_id: varchar('position_id', { length: 255 })
    .references(() => eventOrganograms.eventOrganogram_id)
    .notNull(),
  division_id: varchar('division_id', { length: 255 })
    .references(() => eventOrganograms.eventOrganogram_id),
  bidang_id: varchar('bidang_id', { length: 255 })
    .references(() => eventOrganograms.eventOrganogram_id),
  status: associationRequestStatusEnum('status').notNull().default('Pending'),
  created_at: timestamp('created_at').notNull().defaultNow()
});

// Relations for Keanggotaan
export const keanggotaanRelations = relations(keanggotaan, ({ one }) => ({
  event: one(events, {
    fields: [keanggotaan.event_id],
    references: [events.id]
  }),
  user: one(users, {
    fields: [keanggotaan.user_id],
    references: [users.id]
  }),
  position: one(eventOrganograms, {
    fields: [keanggotaan.position_id],
    references: [eventOrganograms.eventOrganogram_id],
    relationName: "position"
  }),
  division: one(eventOrganograms, {
    fields: [keanggotaan.division_id],
    references: [eventOrganograms.eventOrganogram_id],
    relationName: "division"
  }),
  bidang: one(eventOrganograms, {
    fields: [keanggotaan.bidang_id],
    references: [eventOrganograms.eventOrganogram_id],
    relationName: "bidang"
  }),
}));

// Relations for Association Requests
export const associationRequestRelations = relations(associationRequests, ({ one }) => ({
  event: one(events, {
    fields: [associationRequests.event_id],
    references: [events.id]
  }),
  user: one(users, {
    fields: [associationRequests.user_id],
    references: [users.id]
  }),
  position: one(eventOrganograms, {
    fields: [associationRequests.position_id],
    references: [eventOrganograms.eventOrganogram_id],
    relationName: "position"
  }),
  division: one(eventOrganograms, {
    fields: [associationRequests.division_id],
    references: [eventOrganograms.eventOrganogram_id],
    relationName: "division"
  }),
  bidang: one(eventOrganograms, {
    fields: [associationRequests.bidang_id],
    references: [eventOrganograms.eventOrganogram_id],
    relationName: "bidang"
  })
}));

// Enum for support ticket status
export const supportStatusEnum = pgEnum('support_status', ['Open', 'In Progress', 'Resolved', 'Closed']);

// Enum for notification type
export const notificationTypeEnum = pgEnum('notification_type', ['Association Request', 'System']);

// Support Ticket Table
export const support = createTable('support', {
  id: varchar('id', { length: 255 }).primaryKey(),
  user_id: varchar('user_id', { length: 255 })
    .references(() => users.id),
  subject: varchar('subject', { length: 255 }).notNull(),
  topic: varchar('topic', { length: 255 }).notNull(),
  description: text('description').notNull(),
  status: supportStatusEnum('status').notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow()
});

// Support Reply Table
export const supportReplies = createTable('support_reply', {
  reply_id: varchar('reply_id', { length: 255 }).primaryKey(),
  user_id: varchar('user_id', { length: 255 })
    .references(() => users.id),
  support_id: varchar('support_id', { length: 255 })
    .references(() => support.id),
  text: text('text').notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow()
});

// Notification Table
export const notifications = createTable('notification', {
  id: varchar('id', { length: 255 }).primaryKey(),
  user_id: varchar('user_id', { length: 255 })
    .references(() => users.id),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  type: notificationTypeEnum('type').notNull(),
  read: boolean('read').notNull().default(false),
  created_at: timestamp('created_at').notNull().defaultNow()
});

// Relations for Support
export const supportRelations = relations(support, ({ many, one }) => ({
  replies: many(supportReplies),
  user: one(users, {
    fields: [support.user_id],
    references: [users.id]
  }),
}));

// Relations for Support Replies
export const supportRepliesRelations = relations(supportReplies, ({ one }) => ({
  support: one(support, {
    fields: [supportReplies.support_id],
    references: [support.id]
  }),
  user: one(users, {
    fields: [supportReplies.user_id],
    references: [users.id]
  })
}));

// Relations for Notifications
export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.user_id],
    references: [users.id]
  })
}));

// Verified Users table
export const verifiedUsers = createTable("verified_user", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: varchar("email", { length: 255 }).notNull(),
})