/**
 * Vynora Realistic Fictional Seed Dataset
 * Populates all 18 modules with believable, recruiter-grade demonstration records.
 * Dynamic dates ensure the demo looks freshly populated whenever launched.
 */

// Helpers for realistic relative dates
const now = new Date();
const isoToday = now.toISOString();

function daysAgo(n: number, hour = 10, minute = 0): string {
  const d = new Date(now.getTime() - n * 86400000);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

function daysFromNow(n: number, hour = 18, minute = 0): string {
  const d = new Date(now.getTime() + n * 86400000);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

function formatDate(iso: string): string {
  return iso.split('T')[0];
}

export const INITIAL_DEMO_USER_ID = 'demo_user_recruiter_01';

export function getInitialDemoData() {
  return {
    // -------------------------------------------------------------
    // 1. FINANCE TRACKER (Accounts, Budgets, Transactions)
    // -------------------------------------------------------------
    finance_accounts: [
      {
        id: 'acc_salary_01',
        _id: 'acc_salary_01',
        userId: INITIAL_DEMO_USER_ID,
        name: 'HDFC Premium Salary Account',
        type: 'Bank',
        balance: 148500,
        accountNumber: '•••• 8924',
        createdAt: daysAgo(120),
        updatedAt: daysAgo(2)
      },
      {
        id: 'acc_savings_02',
        _id: 'acc_savings_02',
        userId: INITIAL_DEMO_USER_ID,
        name: 'ICICI Emergency Reserve',
        type: 'Savings',
        balance: 420000,
        accountNumber: '•••• 3140',
        createdAt: daysAgo(300),
        updatedAt: daysAgo(5)
      },
      {
        id: 'acc_agri_03',
        _id: 'acc_agri_03',
        userId: INITIAL_DEMO_USER_ID,
        name: 'SBI Agri & Farm Operations',
        type: 'Bank',
        balance: 74300,
        accountNumber: '•••• 5519',
        createdAt: daysAgo(200),
        updatedAt: daysAgo(1)
      },
      {
        id: 'acc_cash_04',
        _id: 'acc_cash_04',
        userId: INITIAL_DEMO_USER_ID,
        name: 'Cash on Hand',
        type: 'Cash',
        balance: 15000,
        accountNumber: 'Physical Cash',
        createdAt: daysAgo(60),
        updatedAt: daysAgo(1)
      },
      {
        id: 'acc_cc_05',
        _id: 'acc_cc_05',
        userId: INITIAL_DEMO_USER_ID,
        name: 'Amazon Pay ICICI Credit Card',
        type: 'CreditCard',
        balance: -18400,
        accountNumber: '•••• 7702',
        createdAt: daysAgo(180),
        updatedAt: daysAgo(3)
      }
    ],

    finance_budgets: [
      {
        id: 'bgt_food_01',
        _id: 'bgt_food_01',
        userId: INITIAL_DEMO_USER_ID,
        category: 'Food & Dining',
        amount: 20000,
        createdAt: daysAgo(30)
      },
      {
        id: 'bgt_util_02',
        _id: 'bgt_util_02',
        userId: INITIAL_DEMO_USER_ID,
        category: 'Utilities & Bills',
        amount: 15000,
        createdAt: daysAgo(30)
      },
      {
        id: 'bgt_trans_03',
        _id: 'bgt_trans_03',
        userId: INITIAL_DEMO_USER_ID,
        category: 'Transportation',
        amount: 12000,
        createdAt: daysAgo(30)
      },
      {
        id: 'bgt_health_04',
        _id: 'bgt_health_04',
        userId: INITIAL_DEMO_USER_ID,
        category: 'Healthcare',
        amount: 10000,
        createdAt: daysAgo(30)
      },
      {
        id: 'bgt_agri_05',
        _id: 'bgt_agri_05',
        userId: INITIAL_DEMO_USER_ID,
        category: 'Agriculture',
        amount: 40000,
        createdAt: daysAgo(30)
      }
    ],

    finance_transactions: [
      {
        id: 'tx_salary_curr',
        _id: 'tx_salary_curr',
        userId: INITIAL_DEMO_USER_ID,
        type: 'income',
        amount: 185000,
        category: 'Salary / Wages',
        title: 'Monthly Salary Credit - TechCorp Solutions',
        accountId: 'acc_salary_01',
        accountName: 'HDFC Premium Salary Account',
        date: daysAgo(12),
        paymentMode: 'Net Banking',
        createdAt: daysAgo(12)
      },
      {
        id: 'tx_crop_income',
        _id: 'tx_crop_income',
        userId: INITIAL_DEMO_USER_ID,
        type: 'income',
        amount: 68500,
        category: 'Agriculture',
        title: 'Crop Revenue - Organic Wheat Harvest',
        referenceId: 'crop_wheat_01',
        accountId: 'acc_agri_03',
        accountName: 'SBI Agri & Farm Operations',
        date: daysAgo(8),
        paymentMode: 'UPI / Direct Deposit',
        createdAt: daysAgo(8)
      },
      {
        id: 'tx_milk_income',
        _id: 'tx_milk_income',
        userId: INITIAL_DEMO_USER_ID,
        type: 'income',
        amount: 24800,
        category: 'Dairy',
        title: 'Fortnightly Milk Sales Payout - Cooperative Society',
        accountId: 'acc_agri_03',
        accountName: 'SBI Agri & Farm Operations',
        date: daysAgo(4),
        paymentMode: 'Direct Credit',
        createdAt: daysAgo(4)
      },
      {
        id: 'tx_grocery_01',
        _id: 'tx_grocery_01',
        userId: INITIAL_DEMO_USER_ID,
        type: 'expense',
        amount: 4350,
        category: 'Food & Dining',
        title: 'Fresh Groceries & Household Essentials - Nature Basket',
        accountId: 'acc_salary_01',
        accountName: 'HDFC Premium Salary Account',
        date: daysAgo(2),
        paymentMode: 'UPI',
        createdAt: daysAgo(2)
      },
      {
        id: 'tx_dining_today',
        _id: 'tx_dining_today',
        userId: INITIAL_DEMO_USER_ID,
        type: 'expense',
        amount: 2450,
        category: 'Food & Dining',
        title: 'Family Weekend Dinner - Olive Bistro',
        accountId: 'acc_cc_05',
        accountName: 'Amazon Pay ICICI Credit Card',
        date: isoToday,
        paymentMode: 'Credit Card',
        createdAt: isoToday
      },
      {
        id: 'tx_fuel_01',
        _id: 'tx_fuel_01',
        userId: INITIAL_DEMO_USER_ID,
        type: 'expense',
        amount: 3200,
        category: 'Transportation',
        title: 'Shell Petrol Station - Honda City Full Tank',
        referenceId: 'veh_honda_01',
        accountId: 'acc_cc_05',
        accountName: 'Amazon Pay ICICI Credit Card',
        date: daysAgo(6),
        paymentMode: 'Credit Card',
        createdAt: daysAgo(6)
      },
      {
        id: 'tx_pharmacy_01',
        _id: 'tx_pharmacy_01',
        userId: INITIAL_DEMO_USER_ID,
        type: 'expense',
        amount: 1850,
        category: 'Healthcare',
        title: 'Apollo Pharmacy - Monthly Prescriptions Refill',
        accountId: 'acc_salary_01',
        accountName: 'HDFC Premium Salary Account',
        date: daysAgo(10),
        paymentMode: 'UPI',
        createdAt: daysAgo(10)
      },
      {
        id: 'tx_broadband_01',
        _id: 'tx_broadband_01',
        userId: INITIAL_DEMO_USER_ID,
        type: 'expense',
        amount: 1179,
        category: 'Utilities & Bills',
        title: 'Airtel Xstream Fiber Gigabit Internet',
        accountId: 'acc_salary_01',
        accountName: 'HDFC Premium Salary Account',
        date: daysAgo(15),
        paymentMode: 'Net Banking',
        createdAt: daysAgo(15)
      },
      {
        id: 'tx_feed_expense',
        _id: 'tx_feed_expense',
        userId: INITIAL_DEMO_USER_ID,
        type: 'expense',
        amount: 2900,
        category: 'Dairy',
        title: 'Farm Feed Expense - Cattle Concentrate Pellets',
        referenceId: 'feed_01',
        accountId: 'acc_agri_03',
        accountName: 'SBI Agri & Farm Operations',
        date: daysAgo(5),
        paymentMode: 'UPI',
        createdAt: daysAgo(5)
      },
      {
        id: 'tx_fert_expense',
        _id: 'tx_fert_expense',
        userId: INITIAL_DEMO_USER_ID,
        type: 'expense',
        amount: 8200,
        category: 'Agriculture',
        title: 'Crop Activity - Bio-Fertilizer & Drip Nutrients',
        referenceId: 'crop_paddy_01',
        accountId: 'acc_agri_03',
        accountName: 'SBI Agri & Farm Operations',
        date: daysAgo(14),
        paymentMode: 'Cash',
        createdAt: daysAgo(14)
      },
      {
        id: 'tx_transfer_01',
        _id: 'tx_transfer_01',
        userId: INITIAL_DEMO_USER_ID,
        type: 'transfer',
        amount: 25000,
        category: 'Transfer',
        title: 'Monthly Savings Allocation (Salary -> Emergency)',
        fromAccountId: 'acc_salary_01',
        toAccountId: 'acc_savings_02',
        date: daysAgo(12),
        paymentMode: 'Net Banking',
        createdAt: daysAgo(12)
      }
    ],

    // -------------------------------------------------------------
    // 2. LOANS & LIABILITIES
    // -------------------------------------------------------------
    loans: [
      {
        id: 'loan_hdfc_home',
        _id: 'loan_hdfc_home',
        userId: INITIAL_DEMO_USER_ID,
        loanName: 'HDFC Home Loan (Villa Residency)',
        provider: 'HDFC Bank Ltd',
        loanType: 'Home',
        accountNumber: 'HL-7789-4412',
        principalAmount: 2800000,
        outstandingBalance: 2145000,
        interestRate: 8.5,
        tenureMonths: 180,
        monthlyPay: 27585,
        startDate: '2023-04-10',
        endDate: '2038-04-10',
        disbursalDate: '2023-04-10',
        paidMonths: ['2026-08', '2026-09', '2026-10'],
        status: 'active',
        createdAt: daysAgo(400),
        updatedAt: daysAgo(5)
      },
      {
        id: 'loan_mahindra_agri',
        _id: 'loan_mahindra_agri',
        userId: INITIAL_DEMO_USER_ID,
        loanName: 'Mahindra Finance Agri Tractor Loan',
        provider: 'Mahindra Rural Finance',
        loanType: 'Agricultural',
        accountNumber: 'MF-AGRI-1092',
        principalAmount: 650000,
        outstandingBalance: 305000,
        interestRate: 7.0,
        tenureMonths: 60,
        monthlyPay: 12870,
        startDate: '2024-02-15',
        endDate: '2029-02-15',
        disbursalDate: '2024-02-15',
        paidMonths: ['2026-08', '2026-09', '2026-10'],
        status: 'active',
        createdAt: daysAgo(350),
        updatedAt: daysAgo(8)
      }
    ],

    // -------------------------------------------------------------
    // 3. DIGITAL LOCKER (Documents with Expiry Alerts)
    // -------------------------------------------------------------
    documents: [
      {
        id: 'doc_pan_card',
        _id: 'doc_pan_card',
        userId: INITIAL_DEMO_USER_ID,
        title: 'Permanent Account Number (PAN Card)',
        category: 'Personal',
        docNumber: 'ABCDE1234F',
        fileUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
        fileType: 'image/jpeg',
        tags: ['Identity', 'Taxation', 'KYC'],
        notes: 'Primary national tax identity card',
        createdAt: daysAgo(180)
      },
      {
        id: 'doc_passport',
        _id: 'doc_passport',
        userId: INITIAL_DEMO_USER_ID,
        title: 'Republic Passport (36 Pages)',
        category: 'Personal',
        docNumber: 'Z8942103',
        expiryDate: daysFromNow(450),
        fileUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
        fileType: 'image/jpeg',
        tags: ['Travel', 'Identity', 'Global'],
        notes: 'Valid for international travel',
        createdAt: daysAgo(210)
      },
      {
        id: 'doc_degree',
        _id: 'doc_degree',
        userId: INITIAL_DEMO_USER_ID,
        title: 'B.Tech Computer Science Degree Certificate',
        category: 'Education',
        docNumber: 'CS-GRAD-2018-991',
        fileUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
        fileType: 'image/jpeg',
        tags: ['Academic', 'University', 'Engineering'],
        notes: 'First Class with Distinction',
        createdAt: daysAgo(300)
      },
      {
        id: 'doc_health_policy',
        _id: 'doc_health_policy',
        userId: INITIAL_DEMO_USER_ID,
        title: 'HDFC ERGO Comprehensive Health Shield',
        category: 'Insurance',
        docNumber: 'POL-HLT-992104',
        expiryDate: daysFromNow(28), // Expiring soon (<45 days)
        fileUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
        fileType: 'image/jpeg',
        tags: ['Health', 'Insurance', 'Family Floater'],
        notes: 'Coverage ₹15,00,000 for family of 4',
        createdAt: daysAgo(330)
      },
      {
        id: 'doc_land_patta',
        _id: 'doc_land_patta',
        userId: INITIAL_DEMO_USER_ID,
        title: 'Agricultural Land Title Deed (Patta / Survey 142/3)',
        category: 'Property',
        docNumber: 'REV-PATTA-142-3',
        fileUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
        fileType: 'image/jpeg',
        tags: ['Land', 'Agriculture', 'Legal Deed'],
        notes: '3.50 Acres prime agricultural parcel',
        createdAt: daysAgo(420)
      },
      {
        id: 'doc_puc_cert',
        _id: 'doc_puc_cert',
        userId: INITIAL_DEMO_USER_ID,
        title: 'Honda City Emission PUC Certificate',
        category: 'Vehicle',
        docNumber: 'PUC-TN09-8812',
        expiryDate: daysFromNow(18), // Expiring soon!
        fileUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
        fileType: 'image/jpeg',
        tags: ['Vehicle', 'Honda City', 'Compliance'],
        notes: 'Tested at Bharat Petroleum Station',
        createdAt: daysAgo(160)
      }
    ],

    // -------------------------------------------------------------
    // 4. TASKS & PLANNER (Kanban Board)
    // -------------------------------------------------------------
    tasks: [
      {
        id: 'task_soil_test',
        _id: 'task_soil_test',
        userId: INITIAL_DEMO_USER_ID,
        title: 'Collect and submit North Valley parcel soil samples',
        description: 'Take 5 core samples at 15cm depth for NPK and pH lab testing.',
        status: 'todo',
        priority: 'high',
        dueDate: daysFromNow(4),
        category: 'Agriculture',
        subtasks: [
          { id: 'sub_1', text: 'Clean sampling auger and sample bags', completed: true },
          { id: 'sub_2', text: 'Collect samples from 4 corners + center', completed: false },
          { id: 'sub_3', text: 'Submit to Agri Extension Testing Lab', completed: false }
        ],
        createdAt: daysAgo(3)
      },
      {
        id: 'task_vehicle_service',
        _id: 'task_vehicle_service',
        userId: INITIAL_DEMO_USER_ID,
        title: 'Schedule 40,000 km Periodic Service for Honda City',
        description: 'Synthetic engine oil renewal, brake pad inspection, tire rotation.',
        status: 'in-progress',
        priority: 'urgent',
        dueDate: daysFromNow(2),
        category: 'Vehicle',
        subtasks: [
          { id: 'sub_v1', text: 'Book appointment with Capital Honda Service Center', completed: true },
          { id: 'sub_v2', text: 'Confirm synthetic oil availability (0W-20)', completed: true },
          { id: 'sub_v3', text: 'Drop vehicle on Thursday 8:30 AM', completed: false }
        ],
        createdAt: daysAgo(5)
      },
      {
        id: 'task_portfolio_review',
        _id: 'task_portfolio_review',
        userId: INITIAL_DEMO_USER_ID,
        title: 'Quarterly Mutual Fund Portfolio Rebalancing',
        description: 'Review asset allocation across large cap, mid cap, and debt funds.',
        status: 'in-progress',
        priority: 'medium',
        dueDate: daysFromNow(6),
        category: 'Finance',
        subtasks: [
          { id: 'sub_p1', text: 'Download Zerodha statement', completed: true },
          { id: 'sub_p2', text: 'Check debt fund asset weighting vs 30% target', completed: false }
        ],
        createdAt: daysAgo(4)
      },
      {
        id: 'task_student_assignment',
        _id: 'task_student_assignment',
        userId: INITIAL_DEMO_USER_ID,
        title: 'Finalize Distributed Systems Consensus Research Paper',
        description: 'Draft performance benchmarks comparing Raft vs Paxos in Golang.',
        status: 'review',
        priority: 'high',
        dueDate: daysFromNow(5),
        category: 'Education',
        subtasks: [
          { id: 'sub_s1', text: 'Implement leader election benchmark', completed: true },
          { id: 'sub_s2', text: 'Generate throughput latency graphs', completed: true },
          { id: 'sub_s3', text: 'Peer review with study group', completed: false }
        ],
        createdAt: daysAgo(8)
      },
      {
        id: 'task_cattle_fodder',
        _id: 'task_cattle_fodder',
        userId: INITIAL_DEMO_USER_ID,
        title: 'Order bulk green fodder & silage for dairy herd',
        description: '500kg hybrid Napier grass bales delivered from regional cooperative.',
        status: 'completed',
        priority: 'medium',
        dueDate: daysAgo(1),
        category: 'Dairy',
        subtasks: [
          { id: 'sub_c1', text: 'Call supplier for quality check', completed: true },
          { id: 'sub_c2', text: 'Receive delivery and stack in dry shed', completed: true }
        ],
        createdAt: daysAgo(6)
      },
      {
        id: 'task_property_tax',
        _id: 'task_property_tax',
        userId: INITIAL_DEMO_USER_ID,
        title: 'Pay Municipal Residential Property Tax',
        description: 'Annual urban property assessment fee for residential home.',
        status: 'completed',
        priority: 'normal',
        dueDate: daysAgo(4),
        category: 'Finance',
        subtasks: [
          { id: 'sub_pt1', text: 'Fetch assessment number from Digital Locker', completed: true },
          { id: 'sub_pt2', text: 'Pay online via Net Banking', completed: true }
        ],
        createdAt: daysAgo(10)
      }
    ],

    // -------------------------------------------------------------
    // 5. MEDICINE REMINDER (Slots, Stock, Refills)
    // -------------------------------------------------------------
    medicines: [
      {
        id: 'med_metformin',
        _id: 'med_metformin',
        userId: INITIAL_DEMO_USER_ID,
        name: 'Metformin Hydrochloride 500mg',
        dosage: '500mg',
        form: 'Tablet',
        timing: ['morning', 'night'],
        mealInstruction: 'After meals',
        currentStock: 28,
        refillThreshold: 10,
        prescribedBy: 'Dr. K. Ramesh (Consultant Diabetologist)',
        courseStartDate: daysAgo(90),
        courseEndDate: daysFromNow(90),
        notes: 'Maintain regular blood glucose monitoring',
        createdAt: daysAgo(90)
      },
      {
        id: 'med_telmisartan',
        _id: 'med_telmisartan',
        userId: INITIAL_DEMO_USER_ID,
        name: 'Telmisartan 40mg',
        dosage: '40mg',
        form: 'Tablet',
        timing: ['morning'],
        mealInstruction: 'Before breakfast',
        currentStock: 14,
        refillThreshold: 7,
        prescribedBy: 'Dr. K. Ramesh',
        courseStartDate: daysAgo(120),
        courseEndDate: daysFromNow(60),
        notes: 'Daily morning blood pressure maintenance',
        createdAt: daysAgo(120)
      },
      {
        id: 'med_vitd3',
        _id: 'med_vitd3',
        userId: INITIAL_DEMO_USER_ID,
        name: 'Cholecalciferol (Vitamin D3) 60,000 IU',
        dosage: '60,000 IU',
        form: 'Capsule',
        timing: ['morning'],
        mealInstruction: 'After breakfast with milk',
        currentStock: 4, // Refill alert soon!
        refillThreshold: 5,
        prescribedBy: 'Dr. Priya Sundaram',
        courseStartDate: daysAgo(30),
        courseEndDate: daysFromNow(30),
        notes: 'Once weekly on Sunday mornings',
        createdAt: daysAgo(30)
      },
      {
        id: 'med_multivit',
        _id: 'med_multivit',
        userId: INITIAL_DEMO_USER_ID,
        name: 'Zincovit Comprehensive Multivitamin & Minerals',
        dosage: '1 Tablet',
        form: 'Tablet',
        timing: ['afternoon'],
        mealInstruction: 'After lunch',
        currentStock: 22,
        refillThreshold: 7,
        prescribedBy: 'Self Wellness Care',
        courseStartDate: daysAgo(40),
        courseEndDate: daysFromNow(50),
        notes: 'Daily nutritional booster',
        createdAt: daysAgo(40)
      }
    ],

    medicine_logs: [
      {
        id: 'medlog_today_m1',
        _id: 'medlog_today_m1',
        userId: INITIAL_DEMO_USER_ID,
        medicineId: 'med_metformin',
        medicineName: 'Metformin Hydrochloride 500mg',
        slot: 'morning',
        status: 'taken',
        timestamp: daysAgo(0, 8, 15),
        date: formatDate(isoToday),
        createdAt: daysAgo(0, 8, 15)
      },
      {
        id: 'medlog_today_m2',
        _id: 'medlog_today_m2',
        userId: INITIAL_DEMO_USER_ID,
        medicineId: 'med_telmisartan',
        medicineName: 'Telmisartan 40mg',
        slot: 'morning',
        status: 'taken',
        timestamp: daysAgo(0, 7, 45),
        date: formatDate(isoToday),
        createdAt: daysAgo(0, 7, 45)
      }
    ],

    // -------------------------------------------------------------
    // 6. BILL REMINDER (Upcoming, Due, Paid)
    // -------------------------------------------------------------
    bills: [
      {
        id: 'bill_tneb_power',
        _id: 'bill_tneb_power',
        userId: INITIAL_DEMO_USER_ID,
        title: 'State Electricity Board Bi-Monthly Power Tariff',
        category: 'Electricity',
        amount: 3850,
        dueDate: daysFromNow(3), // Due very soon!
        isPaid: false,
        recurrence: 'Bi-Monthly',
        consumerNumber: '09-241-008-912',
        notes: 'Domestic residential consumption (410 units)',
        createdAt: daysAgo(10)
      },
      {
        id: 'bill_airtel_fiber',
        _id: 'bill_airtel_fiber',
        userId: INITIAL_DEMO_USER_ID,
        title: 'Airtel Xstream Fiber Gigabit Connection',
        category: 'Internet',
        amount: 1179,
        dueDate: daysFromNow(8),
        isPaid: false,
        recurrence: 'Monthly',
        consumerNumber: 'ACC-8910-2244',
        notes: 'High speed fiber plan 200 Mbps with unlimited data',
        createdAt: daysAgo(12)
      },
      {
        id: 'bill_piped_water',
        _id: 'bill_piped_water',
        userId: INITIAL_DEMO_USER_ID,
        title: 'Municipal Corporation Potable Water Supply',
        category: 'Water',
        amount: 650,
        dueDate: daysFromNow(14),
        isPaid: false,
        recurrence: 'Monthly',
        consumerNumber: 'WTR-ZONE-4-118',
        notes: 'Metropolitan water charges',
        createdAt: daysAgo(14)
      },
      {
        id: 'bill_dth_tv',
        _id: 'bill_dth_tv',
        userId: INITIAL_DEMO_USER_ID,
        title: 'Tata Play DTH Premium HD Mega Pack',
        category: 'Subscriptions',
        amount: 450,
        dueDate: daysAgo(2),
        isPaid: true,
        paidDate: daysAgo(2),
        recurrence: 'Monthly',
        consumerNumber: '1099248102',
        notes: 'Auto-debited via Net Banking',
        createdAt: daysAgo(20)
      },
      {
        id: 'bill_health_insurance',
        _id: 'bill_health_insurance',
        userId: INITIAL_DEMO_USER_ID,
        title: 'HDFC Ergo Health Policy Renewal Premium',
        category: 'Insurance',
        amount: 21500,
        dueDate: daysFromNow(28),
        isPaid: false,
        recurrence: 'Yearly',
        consumerNumber: 'POL-HLT-992104',
        notes: 'Annual renewal for ₹15L family coverage',
        createdAt: daysAgo(25)
      }
    ],

    // -------------------------------------------------------------
    // 7. EMERGENCY CENTER (Hotlines & Contacts)
    // -------------------------------------------------------------
    emergency_contacts: [
      {
        id: 'ec_doctor_ramesh',
        _id: 'ec_doctor_ramesh',
        userId: INITIAL_DEMO_USER_ID,
        name: 'Dr. K. Ramesh (Family Physician)',
        relationship: 'Doctor',
        phoneNumber: '+91 98401 23456',
        priority: 'primary',
        hospital: 'City Care Multispeciality Hospital',
        medicalNotes: 'Primary consultant for cardiology and diabetes',
        bloodGroup: 'B+',
        createdAt: daysAgo(200)
      },
      {
        id: 'ec_spouse_ananya',
        _id: 'ec_spouse_ananya',
        userId: INITIAL_DEMO_USER_ID,
        name: 'Dr. Ananya Sharma',
        relationship: 'Spouse',
        phoneNumber: '+91 98402 34567',
        priority: 'primary',
        medicalNotes: 'Authorized next-of-kin healthcare proxy',
        bloodGroup: 'O+',
        createdAt: daysAgo(365)
      },
      {
        id: 'ec_trauma_icu',
        _id: 'ec_trauma_icu',
        userId: INITIAL_DEMO_USER_ID,
        name: 'City Care 24/7 Trauma Emergency & ICU',
        relationship: 'Hospital',
        phoneNumber: '+91 44 2836 9999',
        priority: 'primary',
        hospital: 'City Care Hospital Main Campus',
        medicalNotes: 'Direct emergency admission hotline',
        createdAt: daysAgo(300)
      },
      {
        id: 'ec_mechanic_rajesh',
        _id: 'ec_mechanic_rajesh',
        userId: INITIAL_DEMO_USER_ID,
        name: 'Rajesh Kumar (Highway Roadside Assistance)',
        relationship: 'Mechanic',
        phoneNumber: '+91 98403 45678',
        priority: 'secondary',
        medicalNotes: '24/7 towing and mobile breakdown repair',
        createdAt: daysAgo(150)
      },
      {
        id: 'ec_legal_counsel',
        _id: 'ec_legal_counsel',
        userId: INITIAL_DEMO_USER_ID,
        name: 'Adv. Sundaram Legal Associates',
        relationship: 'Legal',
        phoneNumber: '+91 98404 56789',
        priority: 'general',
        medicalNotes: 'Family attorney and property documents counsel',
        createdAt: daysAgo(250)
      }
    ],

    // -------------------------------------------------------------
    // 8. AGRICULTURE MANAGER (Parcels, Crops, Field Activities)
    // -------------------------------------------------------------
    farms: [
      {
        id: 'parcel_north_valley',
        _id: 'parcel_north_valley',
        userId: INITIAL_DEMO_USER_ID,
        name: 'North Valley Farm Parcel',
        surveyNumber: 'Survey #142/3',
        acreage: 3.5,
        soilType: 'Alluvial Loam',
        irrigationType: 'Solar Automated Drip',
        location: 'Sector 4, Green Valley Belt',
        notes: 'Highly fertile soil with high organic carbon content',
        createdAt: daysAgo(250)
      },
      {
        id: 'parcel_riverbed_east',
        _id: 'parcel_riverbed_east',
        userId: INITIAL_DEMO_USER_ID,
        name: 'Riverbed East Agro Plot',
        surveyNumber: 'Survey #145/1',
        acreage: 2.0,
        soilType: 'Clay Loam',
        irrigationType: 'Borewell Sprinkler',
        location: 'East Canal Road',
        notes: 'Suitable for intensive cereal crops and fodder cultivation',
        createdAt: daysAgo(220)
      }
    ],

    crops: [
      {
        id: 'crop_paddy_01',
        _id: 'crop_paddy_01',
        userId: INITIAL_DEMO_USER_ID,
        name: 'Kharif Organic Paddy (BPT 5204)',
        variety: 'Samba Mahsuri Fine Grain',
        season: 'Kharif 2026',
        farmId: 'parcel_north_valley',
        farmName: 'North Valley Farm Parcel',
        sowingDate: daysAgo(90),
        expectedHarvestDate: daysFromNow(20),
        seedCost: 4500,
        fertilizerCost: 8200,
        waterCost: 2200,
        labourCost: 14000,
        machineCost: 6500,
        harvestQuantity: 45, // Quintals
        sellingPricePerUnit: 2250, // per quintal => Total revenue = ₹1,01,250
        status: 'growing',
        notes: 'Drip fertigation with bio-stimulants applied',
        createdAt: daysAgo(90)
      },
      {
        id: 'crop_maize_02',
        _id: 'crop_maize_02',
        userId: INITIAL_DEMO_USER_ID,
        name: 'Golden Sweet Maize (Hybrid CP-818)',
        variety: 'CP-818 High Yield',
        season: 'Post-Monsoon 2026',
        farmId: 'parcel_riverbed_east',
        farmName: 'Riverbed East Agro Plot',
        sowingDate: daysAgo(50),
        expectedHarvestDate: daysFromNow(45),
        seedCost: 3200,
        fertilizerCost: 5400,
        waterCost: 1800,
        labourCost: 8500,
        machineCost: 4200,
        harvestQuantity: 32, // Quintals
        sellingPricePerUnit: 1950, // per quintal => Total revenue = ₹62,400
        status: 'growing',
        notes: 'Excellent germination rate (96%)',
        createdAt: daysAgo(50)
      }
    ],

    crop_activities: [
      {
        id: 'act_fert_01',
        _id: 'act_fert_01',
        userId: INITIAL_DEMO_USER_ID,
        cropId: 'crop_paddy_01',
        activityType: 'Fertigation & Soil Nutrition',
        date: daysAgo(14),
        cost: 2400,
        notes: 'Water-soluble NPK 19:19:19 infused through drip venturi system',
        createdAt: daysAgo(14)
      },
      {
        id: 'act_weed_02',
        _id: 'act_weed_02',
        userId: INITIAL_DEMO_USER_ID,
        cropId: 'crop_paddy_01',
        activityType: 'Manual De-weeding & Root Aeration',
        date: daysAgo(28),
        cost: 3500,
        notes: 'Manual weeding completed across 3.5 acres by 4 farm workers',
        createdAt: daysAgo(28)
      }
    ],

    // -------------------------------------------------------------
    // 9. DAIRY MANAGEMENT (Cattle Herd, Milk Production, Feed, Vet)
    // -------------------------------------------------------------
    cows: [
      {
        id: 'cow_ganga_01',
        _id: 'cow_ganga_01',
        userId: INITIAL_DEMO_USER_ID,
        tagNumber: 'HF-101',
        name: 'Ganga',
        breed: 'Holstein Friesian Cross',
        dateOfBirth: '2021-03-12',
        lactationStage: 'Stage 2 (Peak Production)',
        dailyFoodCost: 180,
        purchasePrice: 65000,
        purchaseDate: '2022-06-10',
        status: 'active',
        imageUrl: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80',
        notes: 'Docile temperament, average daily yield 16.5 Liters',
        createdAt: daysAgo(300)
      },
      {
        id: 'cow_lakshmi_02',
        _id: 'cow_lakshmi_02',
        userId: INITIAL_DEMO_USER_ID,
        tagNumber: 'JER-204',
        name: 'Lakshmi',
        breed: 'Jersey Purebred',
        dateOfBirth: '2022-01-18',
        lactationStage: 'Stage 1 (Early Lactation)',
        dailyFoodCost: 160,
        purchasePrice: 58000,
        purchaseDate: '2023-08-15',
        status: 'active',
        imageUrl: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=800&q=80',
        notes: 'High butterfat content (4.8% fat, 8.5% SNF)',
        createdAt: daysAgo(280)
      },
      {
        id: 'cow_kamadhenu_03',
        _id: 'cow_kamadhenu_03',
        userId: INITIAL_DEMO_USER_ID,
        tagNumber: 'GIR-305',
        name: 'Kamadhenu',
        breed: 'Indigenous Gir A2 Breed',
        dateOfBirth: '2020-08-05',
        lactationStage: 'Stage 3 (Late Lactation)',
        dailyFoodCost: 140,
        purchasePrice: 72000,
        purchaseDate: '2021-11-20',
        status: 'active',
        imageUrl: 'https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?auto=format&fit=crop&w=800&q=80',
        notes: 'Pure Gir cow producing certified A2 organic milk',
        createdAt: daysAgo(350)
      }
    ],

    dairy_logs: [
      {
        id: 'milk_today_am',
        _id: 'milk_today_am',
        userId: INITIAL_DEMO_USER_ID,
        date: formatDate(isoToday),
        session: 'Morning',
        litersProduced: 15.5,
        ratePerLiter: 38,
        soldAmount: 589,
        fatPercentage: 4.4,
        snfPercentage: 8.6,
        notes: 'Delivered to Cooperative Chilling Unit',
        createdAt: daysAgo(0, 6, 30)
      },
      {
        id: 'milk_today_pm',
        _id: 'milk_today_pm',
        userId: INITIAL_DEMO_USER_ID,
        date: formatDate(isoToday),
        session: 'Evening',
        litersProduced: 13.0,
        ratePerLiter: 38,
        soldAmount: 494,
        fatPercentage: 4.5,
        snfPercentage: 8.7,
        notes: 'Evening milking session completed',
        createdAt: daysAgo(0, 18, 0)
      },
      {
        id: 'milk_yest_am',
        _id: 'milk_yest_am',
        userId: INITIAL_DEMO_USER_ID,
        date: formatDate(daysAgo(1)),
        session: 'Morning',
        litersProduced: 16.0,
        ratePerLiter: 38,
        soldAmount: 608,
        fatPercentage: 4.3,
        snfPercentage: 8.6,
        createdAt: daysAgo(1, 6, 30)
      },
      {
        id: 'milk_yest_pm',
        _id: 'milk_yest_pm',
        userId: INITIAL_DEMO_USER_ID,
        date: formatDate(daysAgo(1)),
        session: 'Evening',
        litersProduced: 12.5,
        ratePerLiter: 38,
        soldAmount: 475,
        fatPercentage: 4.5,
        snfPercentage: 8.7,
        createdAt: daysAgo(1, 18, 0)
      }
    ],

    farm_feed: [
      {
        id: 'feed_pellets_01',
        _id: 'feed_pellets_01',
        userId: INITIAL_DEMO_USER_ID,
        item: 'Supreme Cattle Feed Balanced Concentrate',
        quantity: '5 Bags (250 kg)',
        amount: 3750,
        supplier: 'Farmer Cooperative Depot',
        date: daysAgo(5),
        createdAt: daysAgo(5)
      },
      {
        id: 'feed_mineral_02',
        _id: 'feed_mineral_02',
        userId: INITIAL_DEMO_USER_ID,
        item: 'Chelated Mineral Mixture with Calcium & Vitamin E',
        quantity: '10 kg Pack',
        amount: 850,
        supplier: 'Veterinary Pharma Store',
        date: daysAgo(12),
        createdAt: daysAgo(12)
      }
    ],

    dairy_vet_records: [
      {
        id: 'vet_fmd_booster',
        _id: 'vet_fmd_booster',
        userId: INITIAL_DEMO_USER_ID,
        cowId: 'cow_ganga_01',
        tagNumber: 'HF-101',
        treatment: 'FMD Vaccination Booster & General Health Check',
        doctorName: 'Dr. Senthil Kumar (Veterinary Surgeon)',
        cost: 650,
        date: daysAgo(15),
        nextFollowUp: daysFromNow(165),
        notes: 'Cattle healthy, no symptoms of mastitis or fever',
        createdAt: daysAgo(15)
      }
    ],

    dairy_breeding: [
      {
        id: 'brd_ganga_01',
        _id: 'brd_ganga_01',
        userId: INITIAL_DEMO_USER_ID,
        cowId: 'cow_ganga_01',
        tagNumber: 'HF-101',
        inseminationDate: daysAgo(75),
        expectedCalvingDate: daysFromNow(208), // ~283 days gestation
        sireId: 'BULL-HF-ELITE-99',
        technician: 'National Dairy Development Officer',
        status: 'confirmed_pregnant',
        notes: 'Ultrasonography pregnancy confirmation completed at 60 days',
        createdAt: daysAgo(75)
      }
    ],

    // -------------------------------------------------------------
    // 10. VEHICLE MANAGER (Fleet, Fuel Mileage, Maintenance)
    // -------------------------------------------------------------
    vehicles: [
      {
        id: 'veh_honda_01',
        _id: 'veh_honda_01',
        userId: INITIAL_DEMO_USER_ID,
        name: 'Honda City 1.5 i-VTEC V-Grade',
        type: 'Car',
        regNumber: 'TN 09 BX 4589',
        make: 'Honda',
        model: 'City i-VTEC',
        year: 2021,
        odometer: 38450,
        fuelType: 'Petrol',
        insuranceProvider: 'ICICI Lombard Motor Insurance',
        insurancePolicyNumber: 'MOT-ICICI-881290',
        insuranceExpiry: daysFromNow(18), // Expiring soon alert!
        pucExpiry: daysFromNow(22),
        serviceDueKm: 40000,
        createdAt: daysAgo(300)
      },
      {
        id: 'veh_re_02',
        _id: 'veh_re_02',
        userId: INITIAL_DEMO_USER_ID,
        name: 'Royal Enfield Classic 350',
        type: 'Bike',
        regNumber: 'TN 09 CS 1204',
        make: 'Royal Enfield',
        model: 'Classic 350 Stealth Black',
        year: 2022,
        odometer: 14200,
        fuelType: 'Petrol',
        insuranceProvider: 'HDFC ERGO Two Wheeler Policy',
        insurancePolicyNumber: '2W-HDFC-551092',
        insuranceExpiry: daysFromNow(140),
        pucExpiry: daysFromNow(95),
        serviceDueKm: 15000,
        createdAt: daysAgo(280)
      },
      {
        id: 'veh_tractor_03',
        _id: 'veh_tractor_03',
        userId: INITIAL_DEMO_USER_ID,
        name: 'Mahindra 575 DI Farm Mechanization Tractor',
        type: 'Tractor',
        regNumber: 'TN 09 AG 7712',
        make: 'Mahindra & Mahindra',
        model: '575 DI Bhoomiputra 45 HP',
        year: 2023,
        odometer: 820, // Operating Hours
        fuelType: 'Diesel',
        insuranceProvider: 'United India Agri Insurance',
        insurancePolicyNumber: 'UIIC-AGRI-44912',
        insuranceExpiry: daysFromNow(210),
        pucExpiry: daysFromNow(180),
        serviceDueKm: 1000,
        createdAt: daysAgo(250)
      }
    ],

    vehicle_fuel_logs: [
      {
        id: 'fuel_honda_curr',
        _id: 'fuel_honda_curr',
        userId: INITIAL_DEMO_USER_ID,
        vehicleId: 'veh_honda_01',
        vehicleName: 'Honda City 1.5 i-VTEC V-Grade',
        date: daysAgo(6),
        liters: 38.5,
        cost: 3946,
        ratePerLiter: 102.5,
        odometer: 38450,
        calculatedMileage: 15.4, // km/L
        fuelStation: 'Shell Fuel Outlet - Outer Ring Road',
        createdAt: daysAgo(6)
      },
      {
        id: 'fuel_honda_prev',
        _id: 'fuel_honda_prev',
        userId: INITIAL_DEMO_USER_ID,
        vehicleId: 'veh_honda_01',
        vehicleName: 'Honda City 1.5 i-VTEC V-Grade',
        date: daysAgo(20),
        liters: 37.0,
        cost: 3792,
        ratePerLiter: 102.5,
        odometer: 37880,
        calculatedMileage: 15.1, // km/L
        fuelStation: 'Indian Oil Swagat Outlet',
        createdAt: daysAgo(20)
      }
    ],

    vehicle_service_logs: [
      {
        id: 'srv_honda_30k',
        _id: 'srv_honda_30k',
        userId: INITIAL_DEMO_USER_ID,
        vehicleId: 'veh_honda_01',
        serviceType: 'Periodic Major Service (30,000 km)',
        workshop: 'Capital Honda Authorized Service Facility',
        date: daysAgo(110),
        odometer: 30120,
        cost: 6850,
        tasksDone: 'Engine oil flushed, synthetic oil filled, oil filter, air filter renewed, wheel alignment',
        createdAt: daysAgo(110)
      },
      {
        id: 'srv_re_10k',
        _id: 'srv_re_10k',
        userId: INITIAL_DEMO_USER_ID,
        vehicleId: 'veh_re_02',
        serviceType: 'General Service & Chain Overhaul',
        workshop: 'Royal Enfield Authorized Garage',
        date: daysAgo(70),
        odometer: 10250,
        cost: 2150,
        tasksDone: 'Semi-synthetic 15W-50 oil, spark plug cleaned, drive chain tensioned and lubed',
        createdAt: daysAgo(70)
      }
    ],

    vehicle_documents: [
      {
        id: 'vdoc_rc_honda',
        _id: 'vdoc_rc_honda',
        userId: INITIAL_DEMO_USER_ID,
        vehicleId: 'veh_honda_01',
        title: 'RC Smart Card - Honda City',
        docType: 'Registration Certificate',
        expiryDate: '2036-07-20',
        fileUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
        createdAt: daysAgo(200)
      }
    ],

    // -------------------------------------------------------------
    // 11. STUDENT PLANNER (Courses, Assignments, Exams, Timetable)
    // -------------------------------------------------------------
    student_items: [
      // Courses
      {
        id: 'crs_cs601',
        _id: 'crs_cs601',
        userId: INITIAL_DEMO_USER_ID,
        type: 'course',
        title: 'CS-601: Advanced Cloud Architecture & Kubernetes',
        code: 'CS-601',
        instructor: 'Prof. K. Venkatesh, Ph.D.',
        credits: 4,
        room: 'Lecture Hall Block C-302',
        schedule: 'Mon, Wed 10:00 AM - 11:30 AM',
        color: '#00f2fe',
        createdAt: daysAgo(60)
      },
      {
        id: 'crs_cs603',
        _id: 'crs_cs603',
        userId: INITIAL_DEMO_USER_ID,
        type: 'course',
        title: 'CS-603: Distributed Systems & Consensus Algorithms',
        code: 'CS-603',
        instructor: 'Dr. M. Priya',
        credits: 4,
        room: 'Auditorium Lab 102',
        schedule: 'Tue, Thu 02:00 PM - 03:30 PM',
        color: '#a855f7',
        createdAt: daysAgo(60)
      },
      {
        id: 'crs_ds502',
        _id: 'crs_ds502',
        userId: INITIAL_DEMO_USER_ID,
        type: 'course',
        title: 'DS-502: Machine Learning for Real-World Systems',
        code: 'DS-502',
        instructor: 'Dr. A. Raman',
        credits: 3,
        room: 'Data Science Lab 204',
        schedule: 'Fri 09:00 AM - 12:00 PM',
        color: '#10b981',
        createdAt: daysAgo(60)
      },
      // Assignments
      {
        id: 'asg_raft_go',
        _id: 'asg_raft_go',
        userId: INITIAL_DEMO_USER_ID,
        type: 'assignment',
        title: 'Raft Distributed Consensus Implementation in Go',
        courseId: 'crs_cs603',
        courseName: 'CS-603: Distributed Systems',
        dueDate: daysFromNow(5),
        priority: 'high',
        status: 'in-progress',
        maxMarks: 100,
        instructions: 'Implement leader election, log replication, and persistence against network partitions.',
        createdAt: daysAgo(7)
      },
      {
        id: 'asg_k8s_helm',
        _id: 'asg_k8s_helm',
        userId: INITIAL_DEMO_USER_ID,
        type: 'assignment',
        title: 'Production Kubernetes Microservices Deployment Chart',
        courseId: 'crs_cs601',
        courseName: 'CS-601: Advanced Cloud Architecture',
        dueDate: daysFromNow(12),
        priority: 'medium',
        status: 'todo',
        maxMarks: 50,
        instructions: 'Author a production Helm chart with HPA autoscaling, ingress, and secret encryption.',
        createdAt: daysAgo(4)
      },
      // Exams
      {
        id: 'exm_dist_sys',
        _id: 'exm_dist_sys',
        userId: INITIAL_DEMO_USER_ID,
        type: 'exam',
        title: 'Distributed Systems Comprehensive Mid-Semester Exam',
        courseId: 'crs_cs603',
        courseName: 'CS-603: Distributed Systems',
        examDate: daysFromNow(16),
        durationMinutes: 180,
        venue: 'Examination Hall Block B-204',
        syllabus: 'Clock synchronization, Vector clocks, Paxos, Raft, Byzantine fault tolerance',
        createdAt: daysAgo(20)
      },
      // Timetable Slots
      {
        id: 'tt_mon_cs601',
        _id: 'tt_mon_cs601',
        userId: INITIAL_DEMO_USER_ID,
        type: 'timetable',
        day: 'Monday',
        startTime: '10:00',
        endTime: '11:30',
        courseTitle: 'CS-601: Advanced Cloud Architecture',
        room: 'Block C-302',
        createdAt: daysAgo(50)
      },
      {
        id: 'tt_tue_cs603',
        _id: 'tt_tue_cs603',
        userId: INITIAL_DEMO_USER_ID,
        type: 'timetable',
        day: 'Tuesday',
        startTime: '14:00',
        endTime: '15:30',
        courseTitle: 'CS-603: Distributed Systems',
        room: 'Auditorium Lab 102',
        createdAt: daysAgo(50)
      },
      {
        id: 'tt_wed_cs601',
        _id: 'tt_wed_cs601',
        userId: INITIAL_DEMO_USER_ID,
        type: 'timetable',
        day: 'Wednesday',
        startTime: '10:00',
        endTime: '11:30',
        courseTitle: 'CS-601: Advanced Cloud Architecture',
        room: 'Block C-302',
        createdAt: daysAgo(50)
      },
      {
        id: 'tt_thu_cs603',
        _id: 'tt_thu_cs603',
        userId: INITIAL_DEMO_USER_ID,
        type: 'timetable',
        day: 'Thursday',
        startTime: '14:00',
        endTime: '15:30',
        courseTitle: 'CS-603: Distributed Systems',
        room: 'Auditorium Lab 102',
        createdAt: daysAgo(50)
      },
      {
        id: 'tt_fri_ds502',
        _id: 'tt_fri_ds502',
        userId: INITIAL_DEMO_USER_ID,
        type: 'timetable',
        day: 'Friday',
        startTime: '09:00',
        endTime: '12:00',
        courseTitle: 'DS-502: Machine Learning Lab',
        room: 'Data Science Lab 204',
        createdAt: daysAgo(50)
      }
    ],

    // -------------------------------------------------------------
    // 12. HOME INVENTORY (Household Assets, Warranty, Valuation)
    // -------------------------------------------------------------
    inventory_items: [
      {
        id: 'inv_samsung_tv',
        _id: 'inv_samsung_tv',
        userId: INITIAL_DEMO_USER_ID,
        name: 'Samsung Neo QLED 65" 4K Smart TV',
        category: 'Electronics',
        room: 'Living Room',
        purchasePrice: 115000,
        estimatedValue: 92000,
        brand: 'Samsung',
        model: 'QN90B Neo QLED',
        serialNumber: 'SN-SAMS-99210-4K',
        purchaseDate: daysAgo(360),
        warrantyExpiry: daysFromNow(365),
        condition: 'Mint',
        notes: 'Includes extended 2-year panel warranty',
        createdAt: daysAgo(360)
      },
      {
        id: 'inv_sony_soundbar',
        _id: 'inv_sony_soundbar',
        userId: INITIAL_DEMO_USER_ID,
        name: 'Sony HT-A5000 Dolby Atmos Soundbar with Subwoofer',
        category: 'Electronics',
        room: 'Living Room',
        purchasePrice: 24990,
        estimatedValue: 21000,
        brand: 'Sony',
        model: 'HT-A5000 5.1.2ch',
        serialNumber: 'SN-SONY-77124',
        purchaseDate: daysAgo(240),
        warrantyExpiry: daysFromNow(125),
        condition: 'Mint',
        notes: 'High-resolution wireless audio setup',
        createdAt: daysAgo(240)
      },
      {
        id: 'inv_lg_fridge',
        _id: 'inv_lg_fridge',
        userId: INITIAL_DEMO_USER_ID,
        name: 'LG 360L Double Door Smart Inverter Refrigerator',
        category: 'Appliances',
        room: 'Kitchen',
        purchasePrice: 42500,
        estimatedValue: 36000,
        brand: 'LG',
        model: 'GL-T402VPZ3',
        serialNumber: 'SN-LG-INV-4410',
        purchaseDate: daysAgo(500),
        warrantyExpiry: daysFromNow(230),
        condition: 'Good',
        notes: '10-year compressor warranty certificate saved in locker',
        createdAt: daysAgo(500)
      },
      {
        id: 'inv_herman_chair',
        _id: 'inv_herman_chair',
        userId: INITIAL_DEMO_USER_ID,
        name: 'Herman Miller Aeron Ergonomic Office Task Chair',
        category: 'Furniture',
        room: 'Office',
        purchasePrice: 78000,
        estimatedValue: 70000,
        brand: 'Herman Miller',
        model: 'Aeron Size B Graphite PostureFit SL',
        serialNumber: 'SN-HM-AER-1189',
        purchaseDate: daysAgo(180),
        warrantyExpiry: daysFromNow(3400), // 12-year manufacturer warranty
        condition: 'Mint',
        notes: 'Fully adjustable ergonomic work chair',
        createdAt: daysAgo(180)
      },
      {
        id: 'inv_bosch_washer',
        _id: 'inv_bosch_washer',
        userId: INITIAL_DEMO_USER_ID,
        name: 'Bosch Serie 6 Front Load 7.5kg Washing Machine',
        category: 'Appliances',
        room: 'Garage',
        purchasePrice: 36000,
        estimatedValue: 30000,
        brand: 'Bosch',
        model: 'WAJ2846SIN',
        serialNumber: 'SN-BOSH-6621',
        purchaseDate: daysAgo(300),
        warrantyExpiry: daysFromNow(65),
        condition: 'Good',
        notes: 'Anti-tangle eco-silence drive',
        createdAt: daysAgo(300)
      }
    ],

    // -------------------------------------------------------------
    // 13. PASSWORD VAULT (Encrypted Fictional Credentials)
    // -------------------------------------------------------------
    passwords: [
      {
        id: 'vault_github',
        _id: 'vault_github',
        userId: INITIAL_DEMO_USER_ID,
        title: 'GitHub Developer Organization Portal',
        username: 'alex.morgan.vynora',
        encryptedPassword: '{"iv":"mYFj7vA8s0K2l1p=","data":"DemoPasswordProtected2026!"}',
        url: 'https://github.com',
        category: 'Developer',
        notes: 'Primary developer repository and CI/CD pipelines',
        createdAt: daysAgo(180),
        updatedAt: daysAgo(10)
      },
      {
        id: 'vault_aws',
        _id: 'vault_aws',
        userId: INITIAL_DEMO_USER_ID,
        title: 'AWS Production Cloud Console',
        username: 'alex-root-admin',
        encryptedPassword: '{"iv":"zKp9s3D8v1L4m2q=","data":"AwsSecureCloudPass2026#"}',
        url: 'https://aws.amazon.com/console',
        category: 'Cloud',
        notes: 'Multi-factor authentication key enrolled on YubiKey',
        createdAt: daysAgo(150),
        updatedAt: daysAgo(15)
      },
      {
        id: 'vault_zerodha',
        _id: 'vault_zerodha',
        userId: INITIAL_DEMO_USER_ID,
        title: 'Zerodha Kite Trading & Demat Account',
        username: 'ZM8841',
        encryptedPassword: '{"iv":"qW91n5V2b7C3x8z=","data":"TradeWealthActive99@"}',
        url: 'https://kite.zerodha.com',
        category: 'Finance',
        notes: 'Securities trading and sovereign gold bonds',
        createdAt: daysAgo(210),
        updatedAt: daysAgo(20)
      },
      {
        id: 'vault_google_admin',
        _id: 'vault_google_admin',
        userId: INITIAL_DEMO_USER_ID,
        title: 'Google Workspace Domain Administration',
        username: 'admin@vynora.ai',
        encryptedPassword: '{"iv":"pL02m4N7v8X1c9r=","data":"GoogleWorkspaceSafe2026$"}',
        url: 'https://admin.google.com',
        category: 'Work',
        notes: 'Corporate email routing and domain security controls',
        createdAt: daysAgo(190),
        updatedAt: daysAgo(5)
      }
    ],

    // -------------------------------------------------------------
    // 14. FAMILY DASHBOARD (Members, Chores, Announcements, Events)
    // -------------------------------------------------------------
    family_members: [
      {
        id: 'fam_alex_self',
        _id: 'fam_alex_self',
        userId: INITIAL_DEMO_USER_ID,
        name: 'Alex Morgan',
        relationship: 'Self',
        role: 'Administrator',
        dateOfBirth: '1988-05-14',
        bloodGroup: 'O+',
        phone: '+1 (555) 234-5678',
        email: 'alex.morgan@vynora.demo',
        avatarColor: '#00f2fe',
        createdAt: daysAgo(400)
      },
      {
        id: 'fam_ananya_spouse',
        _id: 'fam_ananya_spouse',
        userId: INITIAL_DEMO_USER_ID,
        name: 'Dr. Ananya Sharma',
        relationship: 'Spouse',
        role: 'Co-Admin',
        dateOfBirth: '1990-12-12',
        bloodGroup: 'O+',
        phone: '+91 98402 34567',
        email: 'ananya.sharma@health.demo',
        avatarColor: '#ec4899',
        createdAt: daysAgo(400)
      },
      {
        id: 'fam_rohan_son',
        _id: 'fam_rohan_son',
        userId: INITIAL_DEMO_USER_ID,
        name: 'Rohan Morgan',
        relationship: 'Son',
        role: 'Member',
        dateOfBirth: '2014-07-22',
        bloodGroup: 'O+',
        phone: 'School Bus Contact Active',
        avatarColor: '#3b82f6',
        createdAt: daysAgo(400)
      },
      {
        id: 'fam_sunita_mother',
        _id: 'fam_sunita_mother',
        userId: INITIAL_DEMO_USER_ID,
        name: 'Sunita Sharma',
        relationship: 'Mother',
        role: 'Senior',
        dateOfBirth: '1962-09-18',
        bloodGroup: 'B+',
        phone: '+91 98405 67890',
        avatarColor: '#10b981',
        createdAt: daysAgo(400)
      }
    ],

    family_announcements: [
      {
        id: 'fann_trip_coorg',
        _id: 'fann_trip_coorg',
        userId: INITIAL_DEMO_USER_ID,
        title: 'Family Weekend Getaway to Farmhouse Estate',
        content: 'Packing bags for Friday afternoon departure. Farmhouse solar heating and water filtration have been verified.',
        author: 'Alex Morgan',
        priority: 'Important',
        createdAt: daysAgo(1)
      },
      {
        id: 'fann_sports_day',
        _id: 'fann_sports_day',
        userId: INITIAL_DEMO_USER_ID,
        title: "Rohan's Annual School Track & Field Sports Meet",
        content: 'Rohan participating in the 100m sprint and relay races on Saturday 8:30 AM at the stadium.',
        author: 'Dr. Ananya Sharma',
        priority: 'Normal',
        createdAt: daysAgo(3)
      }
    ],

    family_chores: [
      {
        id: 'fchr_solar_wash',
        _id: 'fchr_solar_wash',
        userId: INITIAL_DEMO_USER_ID,
        title: 'Inspect & clean rooftop solar PV array panels',
        assignedTo: 'Alex Morgan',
        frequency: 'Weekly',
        dueDate: daysFromNow(2),
        completed: false,
        createdAt: daysAgo(4)
      },
      {
        id: 'fchr_softener_salt',
        _id: 'fchr_softener_salt',
        userId: INITIAL_DEMO_USER_ID,
        title: 'Refill automated water softener brine tank with food-grade pellets',
        assignedTo: 'Alex Morgan',
        frequency: 'Monthly',
        dueDate: daysFromNow(7),
        completed: true,
        createdAt: daysAgo(10)
      },
      {
        id: 'fchr_desk_organize',
        _id: 'fchr_desk_organize',
        userId: INITIAL_DEMO_USER_ID,
        title: 'Organize study desk, library books, and science kit',
        assignedTo: 'Rohan Morgan',
        frequency: 'Daily',
        dueDate: daysFromNow(1),
        completed: false,
        createdAt: daysAgo(2)
      }
    ],

    family_events: [
      {
        id: 'fevt_ananya_bday',
        _id: 'fevt_ananya_bday',
        userId: INITIAL_DEMO_USER_ID,
        title: "Ananya's Birthday Celebration",
        eventDate: '2026-12-12',
        eventType: 'Birthday',
        notes: 'Family dinner and surprise gift',
        createdAt: daysAgo(100)
      },
      {
        id: 'fevt_anniv',
        _id: 'fevt_anniv',
        userId: INITIAL_DEMO_USER_ID,
        title: 'Wedding Anniversary Milestone',
        eventDate: '2027-01-24',
        eventType: 'Anniversary',
        notes: '12th Wedding Anniversary',
        createdAt: daysAgo(150)
      }
    ],

    family_expenses: [
      {
        id: 'fexp_grocery',
        _id: 'fexp_grocery',
        userId: INITIAL_DEMO_USER_ID,
        description: 'Supermarket Wholesale Monthly Provisions',
        amount: 8650,
        paidBy: 'Alex Morgan',
        date: daysAgo(7),
        category: 'Groceries',
        splitWith: 'Shared Family Household',
        createdAt: daysAgo(7)
      }
    ],

    // -------------------------------------------------------------
    // 15. HEALTH RECORDS (Profile, Vitals History, Consultations)
    // -------------------------------------------------------------
    health_profile: {
      id: 'hlth_prof_01',
      _id: 'hlth_prof_01',
      userId: INITIAL_DEMO_USER_ID,
      fullName: 'Alex Morgan',
      bloodGroup: 'O+',
      heightCm: 178,
      baselineWeightKg: 74,
      allergies: 'Penicillin (mild rash), Dust Pollen',
      chronicConditions: 'Mild pre-hypertension (well managed via diet & lifestyle)',
      emergencyContactName: 'Dr. Ananya Sharma (+91 98402 34567)',
      insuranceProvider: 'HDFC ERGO Comprehensive Health Shield',
      insuranceNumber: 'POL-HLT-992104',
      createdAt: daysAgo(300),
      updatedAt: daysAgo(2)
    },

    health_vitals: [
      {
        id: 'vit_today',
        _id: 'vit_today',
        userId: INITIAL_DEMO_USER_ID,
        date: formatDate(isoToday),
        systolic: 118,
        diastolic: 78,
        pulse: 72,
        bloodSugarFasting: 92,
        bloodSugarPP: 128,
        weightKg: 74.0,
        stage: 'Optimal Blood Pressure',
        notes: 'Morning measurement post 30-minute cardio walk',
        createdAt: daysAgo(0, 8, 0)
      },
      {
        id: 'vit_3days_ago',
        _id: 'vit_3days_ago',
        userId: INITIAL_DEMO_USER_ID,
        date: formatDate(daysAgo(3)),
        systolic: 120,
        diastolic: 80,
        pulse: 74,
        bloodSugarFasting: 95,
        bloodSugarPP: 132,
        weightKg: 74.2,
        stage: 'Normal',
        notes: 'Evening reading before dinner',
        createdAt: daysAgo(3, 19, 0)
      },
      {
        id: 'vit_10days_ago',
        _id: 'vit_10days_ago',
        userId: INITIAL_DEMO_USER_ID,
        date: formatDate(daysAgo(10)),
        systolic: 122,
        diastolic: 81,
        pulse: 75,
        bloodSugarFasting: 94,
        weightKg: 74.5,
        stage: 'Normal',
        createdAt: daysAgo(10, 8, 30)
      },
      {
        id: 'vit_20days_ago',
        _id: 'vit_20days_ago',
        userId: INITIAL_DEMO_USER_ID,
        date: formatDate(daysAgo(20)),
        systolic: 119,
        diastolic: 77,
        pulse: 71,
        bloodSugarFasting: 91,
        weightKg: 74.8,
        stage: 'Optimal Blood Pressure',
        createdAt: daysAgo(20, 8, 0)
      }
    ],

    health_consultations: [
      {
        id: 'hc_annual_checkup',
        _id: 'hc_annual_checkup',
        userId: INITIAL_DEMO_USER_ID,
        doctorName: 'Dr. K. Ramesh (Consultant Diabetologist & Internist)',
        specialty: 'Internal Medicine & Preventive Cardiology',
        hospital: 'Apollo Executive Health Clinic',
        date: daysAgo(45),
        diagnosis: 'Annual Comprehensive Executive Health Review - All markers optimal',
        advice: 'Continue 150 minutes weekly aerobic exercise. Vitamin D3 booster course prescribed.',
        followUpDate: daysFromNow(135),
        prescriptionUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
        createdAt: daysAgo(45)
      },
      {
        id: 'hc_dental_cleaning',
        _id: 'hc_dental_cleaning',
        userId: INITIAL_DEMO_USER_ID,
        doctorName: 'Dr. Swaminathan (Senior Dental Surgeon)',
        specialty: 'Dental & Oral Health',
        hospital: 'Smile Care Dental Specialty Clinic',
        date: daysAgo(110),
        diagnosis: 'Routine 6-Month Dental Prophylaxis & Scaling',
        advice: 'Gingival health excellent, zero dental caries detected.',
        followUpDate: daysFromNow(70),
        createdAt: daysAgo(110)
      }
    ],

    // -------------------------------------------------------------
    // 16. GOAL TRACKER (Measurable Targets & Milestone Checklists)
    // -------------------------------------------------------------
    goals: [
      {
        id: 'goal_emergency_reserve',
        _id: 'goal_emergency_reserve',
        userId: INITIAL_DEMO_USER_ID,
        title: 'Build 12-Month Emergency Liquid Cash Reserve',
        category: 'Financial',
        targetType: 'Currency',
        targetValue: 600000,
        currentValue: 420000,
        unit: '₹',
        deadline: daysFromNow(120),
        status: 'In Progress',
        milestones: [
          { id: 'gm_1', title: 'Accumulate ₹2,00,000 baseline reserve', completed: true },
          { id: 'gm_2', title: 'Reach ₹4,00,000 threshold in high-yield savings', completed: true },
          { id: 'gm_3', title: 'Complete full ₹6,00,000 reserve milestone', completed: false }
        ],
        createdAt: daysAgo(150),
        updatedAt: daysAgo(5)
      },
      {
        id: 'goal_aws_cert',
        _id: 'goal_aws_cert',
        userId: INITIAL_DEMO_USER_ID,
        title: 'Attain AWS Certified Solutions Architect Professional',
        category: 'Career',
        targetType: 'Percentage',
        targetValue: 100,
        currentValue: 85,
        unit: '%',
        deadline: daysFromNow(25),
        status: 'In Progress',
        milestones: [
          { id: 'gm_aws1', title: 'Complete advanced VPC and networking modules', completed: true },
          { id: 'gm_aws2', title: 'Score > 85% on 4 full-length practice exams', completed: true },
          { id: 'gm_aws3', title: 'Schedule and pass final proctored examination', completed: false }
        ],
        createdAt: daysAgo(60),
        updatedAt: daysAgo(2)
      },
      {
        id: 'goal_solar_drip',
        _id: 'goal_solar_drip',
        userId: INITIAL_DEMO_USER_ID,
        title: 'Deploy Automated Solar Drip Irrigation on North Parcel',
        category: 'Agriculture',
        targetType: 'Currency',
        targetValue: 150000,
        currentValue: 150000,
        unit: '₹',
        deadline: daysAgo(10),
        status: 'Achieved',
        milestones: [
          { id: 'gm_s1', title: 'Complete soil topography mapping', completed: true },
          { id: 'gm_s2', title: 'Procure solar DC submersibles & controllers', completed: true },
          { id: 'gm_s3', title: 'Install venturi fertigation unit & pressure test', completed: true }
        ],
        createdAt: daysAgo(120),
        updatedAt: daysAgo(10)
      },
      {
        id: 'goal_half_marathon',
        _id: 'goal_half_marathon',
        userId: INITIAL_DEMO_USER_ID,
        title: 'Train for City Half Marathon (21.1 km in < 2 Hours)',
        category: 'Health',
        targetType: 'Numeric Count',
        targetValue: 21,
        currentValue: 15,
        unit: 'km',
        deadline: daysFromNow(40),
        status: 'In Progress',
        milestones: [
          { id: 'gm_hm1', title: 'Consistent 10 km weekend runs under 58 minutes', completed: true },
          { id: 'gm_hm2', title: 'Complete 15 km long run comfortably', completed: true },
          { id: 'gm_hm3', title: 'Achieve 21.1 km race day pace (5:40 min/km)', completed: false }
        ],
        createdAt: daysAgo(50),
        updatedAt: daysAgo(3)
      }
    ],

    // -------------------------------------------------------------
    // 17. USER PROFILE & SETTINGS
    // -------------------------------------------------------------
    user_profile: {
      userId: INITIAL_DEMO_USER_ID,
      fullName: 'Alex Morgan',
      email: 'alex.morgan@vynora.demo',
      phone: '+1 (555) 234-5678',
      location: 'San Francisco, CA / Bengaluru, IN',
      avatarUrl: '/vynora_icon_circle.png',
      is2FAEnabled: true,
      emailNotifications: true,
      pushNotifications: false,
      securityAlerts: true,
      theme: 'dark',
      accentColor: '#00f2fe',
      createdAt: daysAgo(400),
      updatedAt: daysAgo(1)
    }
  };
}

