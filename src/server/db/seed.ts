import 'dotenv/config';
import { eq } from 'drizzle-orm';

import { db } from './index.js';
import { users, verifiedUsers } from './schema.js';

const TEST_EMAIL = 'themalique1910@gmail.com'; // Change this to your own private email

async function seed() {
  console.log('🌱 Starting seed...');

  // Check if user already exists
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, TEST_EMAIL),
  });

  if (existingUser) {
    console.log('⚠️ User already exists');
    return;
  }

  // 1. Add to verified users first
  await db.insert(verifiedUsers).values({
    email: TEST_EMAIL,
  });

  console.log('✅ Added email to verified users');
  console.log(`Email: ${TEST_EMAIL}`);
  console.log(
    '🔗 Now you can sign in with Google and the user/lembaga records will be created automatically',
  );
}

seed().catch(console.error);
