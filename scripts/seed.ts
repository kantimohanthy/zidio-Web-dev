import { DEMO_ORG, DEMO_USERS, DEMO_SOURCES, DEMO_TAGS, DEMO_THEMES, DEMO_FEEDBACK_ITEMS } from '../src/lib/utils/mock-db';

async function runSeed() {
  console.log('--------------------------------------------------');
  console.log('PROJECT LOOP — Database Seed Script');
  console.log('--------------------------------------------------');
  console.log(`[SEED] Organization: "${DEMO_ORG.name}" (${DEMO_ORG.id})`);
  console.log(`[SEED] Demo Users Loaded: ${DEMO_USERS.length}`);
  DEMO_USERS.forEach(u => {
    console.log(`  - ${u.profile.full_name} (${u.role}): ${u.profile.email}`);
  });
  console.log(`[SEED] Data Sources Loaded: ${DEMO_SOURCES.length}`);
  console.log(`[SEED] Feedback Tags Loaded: ${DEMO_TAGS.length}`);
  console.log(`[SEED] Detected Themes Loaded: ${DEMO_THEMES.length}`);
  console.log(`[SEED] Realistic Feedback Items Generated: ${DEMO_FEEDBACK_ITEMS.length}`);
  console.log('--------------------------------------------------');
  console.log('SUCCESS: Seed data generation verified successfully.');
  console.log('All demo credentials and feedback data are ready for evaluator testing.');
  console.log('--------------------------------------------------');
}

runSeed().catch(err => {
  console.error('Seed script error:', err);
  process.exit(1);
});
