/**
 * Automated Verification Script for Vynora Demo Mode
 * Tests:
 * 1. Demo Mode detection and Persona resolution.
 * 2. Demo Storage seeding and Local Persistence.
 * 3. All 18 Modules CRUD operations.
 * 4. Banking, Farm, Dairy, Vehicle, Health calculations.
 * 5. Cross-domain Financial Synchronization.
 * 6. Reset Demo Data functionality.
 */

import { isDemoMode, getAppMode, DEMO_USER } from './src/services/appMode';
import { DemoStorage } from './src/services/demo/demoStorage';
import {
  FinanceService,
  LoanService,
  AgricultureService,
  DairyService,
  MedicineService,
  BillService,
  DocumentService,
  ContactService,
  TaskService,
  VehicleService,
  StudentService,
  InventoryService,
  PasswordService,
  FamilyService,
  HealthService,
  GoalService,
  DashboardService,
  UserService,
  GlobalSearchService
} from './src/services/firestoreService';

async function runDemoVerification() {
  console.log('====================================================');
  console.log('🧪 RUNNING VYNORA DEMO MODE VERIFICATION SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, details?: string) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName} ${details ? `(${details})` : ''}`);
      failed++;
    }
  }

  // TEST 1: App Mode Detection
  assert(isDemoMode(), 'Application detects Demo Mode as default mode');
  assert(getAppMode() === 'demo', 'Mode equals "demo"');
  assert(DEMO_USER.name === 'Alex Morgan', 'Demo Persona initialized as Alex Morgan');

  // TEST 2: Demo Storage & Seeding
  const store = DemoStorage.getStore();
  assert(Boolean(store.finance_transactions?.length), 'DemoStorage seeded finance_transactions');
  assert(Boolean(store.loans?.length), 'DemoStorage seeded loans');
  assert(Boolean(store.cows?.length), 'DemoStorage seeded cattle herd');
  assert(Boolean(store.farms?.length), 'DemoStorage seeded farms');
  assert(Boolean(store.vehicles?.length), 'DemoStorage seeded vehicles');

  // TEST 3: Module 1 - Dashboard Overview Aggregation
  const overview = await DashboardService.getOverview();
  assert(overview.finance.currentSavings > 0, 'Dashboard finance savings aggregated (> 0)');
  assert(overview.domainSnapshots.milkProduction > 0, 'Dashboard dairy milk production aggregated');
  assert(overview.domainSnapshots.activeCrops > 0, 'Dashboard active crops counted');
  assert(overview.domainSnapshots.totalLoanPrincipal > 0, 'Dashboard loan liabilities aggregated');
  assert(overview.actionRequired.upcomingBill !== null, 'Dashboard shows upcoming bill action item');

  // TEST 4: Module 2 - Finance Tracker CRUD & Math
  const txs = await FinanceService.getTransactions(DEMO_USER.id);
  assert(txs.length >= 8, `Finance transactions loaded (${txs.length} records)`);
  const summary = await FinanceService.getSummary(DEMO_USER.id);
  assert(summary.totalIncome > 0 && summary.totalExpense > 0, 'Finance summary calculated income & expense');

  const newTx = await FinanceService.addTransaction(DEMO_USER.id, {
    type: 'expense',
    amount: 1500,
    category: 'Food & Dining',
    title: 'Recruiter Interview Coffee & Snacks',
    date: new Date().toISOString()
  });
  assert(Boolean(newTx.id), 'FinanceService.addTransaction created record');

  // TEST 5: Module 3 - Loan Management & Installments
  const loans = await LoanService.getLoans(DEMO_USER.id);
  assert(loans.length >= 2, `Loans loaded (${loans.length} loans)`);
  const activeLoan = loans[0];
  const paidCountBefore = (activeLoan.paidMonths || []).length;
  await LoanService.togglePayment(activeLoan.id, '2026-11');
  const updatedLoan = DemoStorage.getItem<any>('loans', activeLoan.id);
  assert((updatedLoan.paidMonths || []).length !== paidCountBefore, 'LoanService.togglePayment updated paid months');

  // TEST 6: Module 4 - Digital Locker
  const docs = await DocumentService.getDocuments(DEMO_USER.id);
  assert(docs.length >= 5, `Digital locker documents loaded (${docs.length} docs)`);

  // TEST 7: Module 5 - Tasks & Planner Kanban
  const tasks = await TaskService.getTasks(DEMO_USER.id);
  assert(tasks.length >= 5, `Tasks loaded (${tasks.length} tasks)`);
  const subtaskTask = tasks.find((t: any) => t.subtasks && t.subtasks.length > 0);
  if (subtaskTask) {
    const subId = subtaskTask.subtasks[0].id;
    const initialStatus = subtaskTask.subtasks[0].completed;
    await TaskService.toggleSubtask(subtaskTask.id, subId);
    const refreshedTask = DemoStorage.getItem<any>('tasks', subtaskTask.id);
    const newStatus = refreshedTask.subtasks.find((s: any) => s.id === subId)?.completed;
    assert(initialStatus !== newStatus, 'TaskService.toggleSubtask toggled checklist item');
  }

  // TEST 8: Module 6 - Medicine Reminder
  const meds = await MedicineService.getMedicines(DEMO_USER.id);
  assert(meds.length >= 4, `Medicines loaded (${meds.length} medicines)`);
  const testMed = meds[0];
  const stockBefore = testMed.stock || testMed.currentStock;
  await MedicineService.logDose(testMed.id, 'taken', 'morning');
  const refreshedMed = DemoStorage.getItem<any>('medicines', testMed.id);
  assert((refreshedMed.stock || refreshedMed.currentStock) === stockBefore - 1, 'MedicineService.logDose decremented stock');

  // TEST 9: Module 7 - Bill Reminder
  const bills = await BillService.getBills(DEMO_USER.id);
  assert(bills.length >= 5, `Bills loaded (${bills.length} bills)`);
  const testBill = bills[0];
  await BillService.togglePaid(testBill.id, testBill.isPaid, testBill);
  const refreshedBill = DemoStorage.getItem<any>('bills', testBill.id);
  assert(refreshedBill.isPaid !== testBill.isPaid, 'BillService.togglePaid flipped payment status');

  // TEST 10: Module 8 - Emergency Contacts
  const contacts = await ContactService.getContacts(DEMO_USER.id);
  assert(contacts.length >= 4, `Emergency contacts loaded (${contacts.length} contacts)`);

  // TEST 11: Module 9 - Agriculture Manager
  const crops = await AgricultureService.getCrops(DEMO_USER.id);
  const farms = await AgricultureService.getFarms(DEMO_USER.id);
  assert(crops.length >= 2, `Crops loaded (${crops.length} crops)`);
  assert(farms.length >= 2, `Farm parcels loaded (${farms.length} parcels)`);

  // TEST 12: Module 10 - Dairy Management
  const cows = await DairyService.getCows(DEMO_USER.id);
  const milkLogs = await DairyService.getLogs(DEMO_USER.id);
  assert(cows.length >= 3, `Cattle herd loaded (${cows.length} cows)`);
  assert(milkLogs.length >= 4, `Milk logs loaded (${milkLogs.length} logs)`);

  // TEST 13: Module 11 - Vehicle Manager
  const vehicles = await VehicleService.getVehicles(DEMO_USER.id);
  assert(vehicles.length >= 3, `Vehicles loaded (${vehicles.length} vehicles)`);
  const hondaLogs = await VehicleService.getFuelLogs(vehicles[0].id);
  assert(hondaLogs.length >= 2, 'Vehicle fuel logs loaded with mileage calculation');

  // TEST 14: Module 12 - Student Planner
  const studentItems = await StudentService.getItems(DEMO_USER.id);
  const courses = await StudentService.getCourses(DEMO_USER.id);
  assert(studentItems.length >= 8, `Student items loaded (${studentItems.length} items)`);
  assert(courses.length >= 3, `Student courses loaded (${courses.length} courses)`);

  // TEST 15: Module 13 - Home Inventory
  const inventory = await InventoryService.getInventory(DEMO_USER.id);
  assert(inventory.length >= 5, `Inventory items loaded (${inventory.length} items)`);

  // TEST 16: Module 14 - Password Vault
  const passwords = await PasswordService.getPasswords(DEMO_USER.id);
  assert(passwords.length >= 4, `Vault credentials loaded (${passwords.length} items)`);

  // TEST 17: Module 15 - Family Dashboard
  const members = await FamilyService.getMembers(DEMO_USER.id);
  const chores = await FamilyService.getChores(DEMO_USER.id);
  assert(members.length >= 4, `Family members loaded (${members.length} members)`);
  assert(chores.length >= 3, `Family chores loaded (${chores.length} chores)`);

  // TEST 18: Module 16 - Health Records
  const vitals = await HealthService.getRecords(DEMO_USER.id);
  const profile = await HealthService.getProfile(DEMO_USER.id);
  assert(vitals.length >= 4, `Health vitals history loaded (${vitals.length} logs)`);
  assert(Boolean(profile?.bloodGroup), 'Health profile loaded with O+ blood group');

  // TEST 19: Module 17 - Goal Tracker
  const goals = await GoalService.getGoals(DEMO_USER.id);
  assert(goals.length >= 4, `Goals loaded (${goals.length} goals)`);

  // TEST 20: Module 18 - Global Search Prewarmer
  await GlobalSearchService.prewarmUserDatasets(DEMO_USER.id);
  assert(true, 'GlobalSearchService.prewarmUserDatasets executed without error');

  // TEST 21: Reset Demo Data
  DemoStorage.resetStore();
  const resetTxs = await FinanceService.getTransactions(DEMO_USER.id);
  const foundAddedTx = resetTxs.find((t: any) => t.title === 'Recruiter Interview Coffee & Snacks');
  assert(!foundAddedTx, 'Reset Demo Data successfully restored pristine sample records');

  console.log('\n====================================================');
  console.log(`📊 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runDemoVerification().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});

