/**
 * Vynora Demo Service Adapter
 * Bridges all 18 module service calls to the isolated DemoStorage engine.
 * Computes exact banking, farm, dairy, vehicle, health, and budget formulas in-memory.
 * Guarantees ZERO interaction with production Firebase Firestore.
 */

import { DemoStorage } from './demoStorage';
import { INITIAL_DEMO_USER_ID } from './initialDemoData';
import {
  calculateFinanceSummary,
  calculateCropFinances,
  calculateDairyYield,
  calculateDairyRevenue,
  calculateDairyExpenses,
  calculateVehicleMileage,
  calculateBMI,
  isBillOverdue,
  calculateEMI
} from '../../utils/calculations';
import { queryCache } from '../queryCache';

export const DemoServiceAdapter = {
  // -------------------------------------------------------------
  // 1. FINANCE SERVICE
  // -------------------------------------------------------------
  FinanceService: {
    async getTransactions(_userId?: string, _force = false) {
      return DemoStorage.getCollection('finance_transactions');
    },

    async addTransaction(_userId: string, data: any) {
      const amount = Number(data.amount) || 0;
      const created = DemoStorage.addItem('finance_transactions', {
        ...data,
        amount,
        date: data.date || new Date().toISOString()
      });

      // Update account balance if accountId is provided
      if (data.accountId && amount > 0) {
        const acc = DemoStorage.getItem<any>('finance_accounts', data.accountId);
        if (acc) {
          const delta = data.type === 'income' ? amount : -amount;
          DemoStorage.updateItem('finance_accounts', data.accountId, {
            balance: (Number(acc.balance) || 0) + delta
          });
        }
      }

      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:finance`);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:dashboard`);
      return created;
    },

    async updateTransaction(_userId: string, id: string, data: any) {
      const updated = DemoStorage.updateItem('finance_transactions', id, data);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:finance`);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:dashboard`);
      return updated;
    },

    async deleteTransaction(_userId: string, id: string) {
      DemoStorage.deleteItem('finance_transactions', id);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:finance`);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:dashboard`);
      return { message: 'Deleted' };
    },

    async getAccounts(_userId?: string, _force = false) {
      return DemoStorage.getCollection('finance_accounts');
    },

    async addAccount(_userId: string, data: any) {
      const created = DemoStorage.addItem('finance_accounts', {
        ...data,
        balance: Number(data.balance) || 0
      });
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:finance`);
      return created;
    },

    async updateAccount(_userId: string, id: string, data: any) {
      const updated = DemoStorage.updateItem('finance_accounts', id, {
        ...data,
        balance: data.balance !== undefined ? Number(data.balance) : undefined
      });
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:finance`);
      return updated;
    },

    async deleteAccount(_userId: string, id: string) {
      DemoStorage.deleteItem('finance_accounts', id);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:finance`);
      return { message: 'Deleted' };
    },

    async transferBetweenAccounts(_userId: string, data: {
      fromAccountId: string;
      toAccountId: string;
      fromAccountName?: string;
      toAccountName?: string;
      amount: number;
      date?: string;
      notes?: string;
    }) {
      const amt = Number(data.amount) || 0;
      if (amt <= 0) throw new Error('Transfer amount must be greater than zero');

      const fromAcc = DemoStorage.getItem<any>('finance_accounts', data.fromAccountId);
      const toAcc = DemoStorage.getItem<any>('finance_accounts', data.toAccountId);

      if (!fromAcc || !toAcc) throw new Error('Source or destination account not found');

      // Adjust balances
      DemoStorage.updateItem('finance_accounts', data.fromAccountId, {
        balance: (Number(fromAcc.balance) || 0) - amt
      });
      DemoStorage.updateItem('finance_accounts', data.toAccountId, {
        balance: (Number(toAcc.balance) || 0) + amt
      });

      // Log transfer record
      const fromName = data.fromAccountName || fromAcc.name;
      const toName = data.toAccountName || toAcc.name;
      const tx = DemoStorage.addItem('finance_transactions', {
        type: 'transfer',
        isTransfer: true,
        amount: amt,
        category: 'Transfer',
        title: `Transfer: ${fromName} ➔ ${toName}`,
        notes: data.notes || '',
        fromAccountId: data.fromAccountId,
        toAccountId: data.toAccountId,
        date: data.date || new Date().toISOString()
      });

      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:finance`);
      return tx;
    },

    async transferFunds(userId: string, data: any) {
      return this.transferBetweenAccounts(userId, data);
    },

    async getBudgets(_userId?: string, _force = false) {
      return DemoStorage.getCollection('finance_budgets');
    },

    async setBudget(_userId: string, category: string, amount: number) {
      const budgets = DemoStorage.getCollection<any>('finance_budgets');
      const existing = budgets.find(b => b.category === category);
      if (existing) {
        DemoStorage.updateItem('finance_budgets', existing.id, { amount: Number(amount) || 0 });
      } else {
        DemoStorage.addItem('finance_budgets', { category, amount: Number(amount) || 0 });
      }
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:finance`);
      return { category, amount };
    },

    async deleteBudget(_userId: string, id: string) {
      DemoStorage.deleteItem('finance_budgets', id);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:finance`);
      return { message: 'Deleted' };
    },

    async getSummary(_userId?: string, _force = false) {
      const txs = DemoStorage.getCollection('finance_transactions');
      return calculateFinanceSummary(txs);
    }
  },

  // -------------------------------------------------------------
  // 2. LOAN SERVICE
  // -------------------------------------------------------------
  LoanService: {
    async getLoans(_userId?: string, _force = false) {
      return DemoStorage.getCollection('loans');
    },

    async getLoanById(_userId: string, loanId: string) {
      return DemoStorage.getItem('loans', loanId);
    },

    async addLoan(_userId: string, data: any) {
      const principal = Number(data.principalAmount) || 0;
      const rate = Number(data.interestRate) || 0;
      const months = Number(data.tenureMonths) || 12;
      const computedEmi = calculateEMI(principal, rate, months);

      const created = DemoStorage.addItem('loans', {
        ...data,
        principalAmount: principal,
        outstandingBalance: Number(data.outstandingBalance) || principal,
        interestRate: rate,
        tenureMonths: months,
        monthlyPay: Number(data.monthlyPay) || computedEmi,
        paidMonths: data.paidMonths || [],
        status: data.status || 'active'
      });
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:loans`);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:dashboard`);
      return created;
    },

    async updateLoan(id: string, data: any, _userId?: string) {
      const updated = DemoStorage.updateItem('loans', id, data);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:loans`);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:dashboard`);
      return updated;
    },

    async deleteLoan(id: string, _userId?: string) {
      DemoStorage.deleteItem('loans', id);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:loans`);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:dashboard`);
      return { message: 'Deleted' };
    },

    async togglePayment(id: string, monthString: string) {
      const loan = DemoStorage.getItem<any>('loans', id);
      if (!loan) throw new Error('Loan not found');

      const paidMonths: string[] = Array.isArray(loan.paidMonths) ? [...loan.paidMonths] : [];
      const isPaid = paidMonths.includes(monthString);
      const refId = `${id}-${monthString}`;

      if (isPaid) {
        const updatedMonths = paidMonths.filter(m => m !== monthString);
        DemoStorage.updateItem('loans', id, { paidMonths: updatedMonths });
        // Delete associated transaction
        const txs = DemoStorage.getCollection<any>('finance_transactions');
        const match = txs.find(t => t.referenceId === refId);
        if (match) DemoStorage.deleteItem('finance_transactions', match.id);

        queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:loans`);
        queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:finance`);
        queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:dashboard`);
        return { ...loan, paidMonths: updatedMonths, _id: id, id };
      } else {
        const updatedMonths = [...paidMonths, monthString];
        DemoStorage.updateItem('loans', id, { paidMonths: updatedMonths });
        // Record finance expense
        DemoStorage.addItem('finance_transactions', {
          type: 'expense',
          amount: Number(loan.monthlyPay) || 0,
          category: 'Loan EMI',
          title: `EMI Payment - ${loan.loanName || loan.provider} (${monthString})`,
          referenceId: refId,
          date: new Date().toISOString()
        });

        queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:loans`);
        queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:finance`);
        queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:dashboard`);
        return { ...loan, paidMonths: updatedMonths, _id: id, id };
      }
    },

    async markInstallmentPaid(loanId: string, instNo: number, paymentDate: string, _userId?: string) {
      const monthStr = paymentDate.substring(0, 7);
      return this.togglePayment(loanId, monthStr);
    },

    async getInstallmentStatuses(loanId: string, _userId?: string) {
      const loan = DemoStorage.getItem<any>('loans', loanId);
      return loan?.paidMonths || [];
    },

    async recordPrepayment(loanId: string, amount: number, paymentDate: string, _userId?: string) {
      const loan = DemoStorage.getItem<any>('loans', loanId);
      if (!loan) throw new Error('Loan not found');

      const prepayAmount = Number(amount) || 0;
      const newBalance = Math.max(0, (Number(loan.outstandingBalance) || 0) - prepayAmount);

      DemoStorage.updateItem('loans', loanId, {
        outstandingBalance: newBalance,
        status: newBalance <= 0 ? 'closed' : 'active'
      });

      DemoStorage.addItem('finance_transactions', {
        type: 'expense',
        amount: prepayAmount,
        category: 'Utilities & Bills',
        title: `Loan Prepayment - ${loan.loanName || loan.provider}`,
        referenceId: loanId,
        date: paymentDate
      });

      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:loans`);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:finance`);
      return { success: true, remainingBalance: newBalance };
    }
  },

  // -------------------------------------------------------------
  // 3. AGRICULTURE SERVICE
  // -------------------------------------------------------------
  AgricultureService: {
    async getCrops(_userId?: string, _force = false) {
      return DemoStorage.getCollection('crops');
    },

    async addCrop(_userId: string, data: any) {
      const created = DemoStorage.addItem('crops', {
        ...data,
        seedCost: Number(data.seedCost) || 0,
        fertilizerCost: Number(data.fertilizerCost) || 0,
        waterCost: Number(data.waterCost) || 0,
        labourCost: Number(data.labourCost) || 0,
        machineCost: Number(data.machineCost) || 0,
        harvestQuantity: Number(data.harvestQuantity) || 0,
        sellingPricePerUnit: Number(data.sellingPricePerUnit) || 0,
        status: data.status || 'growing'
      });
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:agriculture`);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:dashboard`);
      return created;
    },

    async updateCrop(id: string, data: any, _userId?: string) {
      const updated = DemoStorage.updateItem('crops', id, data);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:agriculture`);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:dashboard`);
      return updated;
    },

    async deleteCrop(id: string, _userId?: string) {
      DemoStorage.deleteItem('crops', id);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:agriculture`);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:dashboard`);
      return { message: 'Deleted' };
    },

    async getFarms(_userId?: string, _force = false) {
      return DemoStorage.getCollection('farms');
    },

    async addFarm(_userId: string, data: any) {
      const created = DemoStorage.addItem('farms', {
        ...data,
        acreage: Number(data.acreage) || 0
      });
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:agriculture`);
      return created;
    },

    async updateFarm(id: string, data: any, _userId?: string) {
      const updated = DemoStorage.updateItem('farms', id, data);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:agriculture`);
      return updated;
    },

    async deleteFarm(id: string, _userId?: string) {
      DemoStorage.deleteItem('farms', id);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:agriculture`);
      return { message: 'Deleted' };
    },

    async getCropActivities(cropId: string, _userId?: string, _force = false) {
      const activities = DemoStorage.getCollection<any>('crop_activities');
      return activities.filter(a => a.cropId === cropId);
    },

    async addCropActivity(cropId: string, data: any, _userId?: string) {
      const cost = Number(data.cost) || 0;
      const created = DemoStorage.addItem('crop_activities', {
        ...data,
        cropId,
        cost,
        date: data.date || new Date().toISOString()
      });

      if (cost > 0) {
        DemoStorage.addItem('finance_transactions', {
          type: 'expense',
          amount: cost,
          category: 'Agriculture',
          title: `Crop Activity - ${data.activityType || 'Field Work'}`,
          referenceId: cropId,
          date: data.date || new Date().toISOString()
        });
      }

      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:agriculture`);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:finance`);
      return created;
    },

    async updateCropActivity(id: string, data: any, _userId?: string) {
      const updated = DemoStorage.updateItem('crop_activities', id, data);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:agriculture`);
      return updated;
    },

    async deleteCropActivity(id: string, _userId?: string) {
      DemoStorage.deleteItem('crop_activities', id);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:agriculture`);
      return { message: 'Deleted' };
    }
  },

  // -------------------------------------------------------------
  // 4. DAIRY SERVICE
  // -------------------------------------------------------------
  DairyService: {
    async getCows(_userId?: string, _force = false) {
      return DemoStorage.getCollection('cows');
    },

    async addCow(_userId: string, data: any) {
      const purchasePrice = Number(data.purchasePrice) || 0;
      const created = DemoStorage.addItem('cows', {
        ...data,
        purchasePrice,
        dailyFoodCost: Number(data.dailyFoodCost) || 0,
        status: 'active'
      });

      if (purchasePrice > 0) {
        DemoStorage.addItem('finance_transactions', {
          type: 'expense',
          amount: purchasePrice,
          category: 'Dairy',
          title: `Bought Cattle #${data.tagNumber || data.name}`,
          referenceId: created.id,
          date: data.purchaseDate || new Date().toISOString()
        });
      }

      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:dairy`);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:finance`);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:dashboard`);
      return created;
    },

    async updateCow(id: string, data: any, _userId?: string) {
      const updated = DemoStorage.updateItem('cows', id, data);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:dairy`);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:dashboard`);
      return updated;
    },

    async deleteCow(id: string, _userId?: string) {
      DemoStorage.deleteItem('cows', id);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:dairy`);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:dashboard`);
      return { message: 'Deleted' };
    },

    async addCowExpense(id: string, data: any) {
      const cow = DemoStorage.getItem<any>('cows', id);
      if (!cow) throw new Error('Cattle not found');
      const amount = Number(data.amount) || 0;

      const expenseEntry = {
        date: data.date || new Date().toISOString(),
        type: data.type || 'Treatment',
        description: data.description || 'Medical',
        amount
      };

      const expenseLogs = [...(cow.expenseLogs || []), expenseEntry];
      DemoStorage.updateItem('cows', id, { expenseLogs });

      if (amount > 0) {
        DemoStorage.addItem('finance_transactions', {
          type: 'expense',
          amount,
          category: 'Dairy',
          title: `${expenseEntry.type} - Cattle #${cow.tagNumber} (${expenseEntry.description})`,
          referenceId: id,
          date: expenseEntry.date
        });
      }

      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:dairy`);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:finance`);
      return { ...cow, expenseLogs };
    },

    async sellCow(id: string, data: any) {
      const cow = DemoStorage.getItem<any>('cows', id);
      if (!cow) throw new Error('Cattle not found');
      const salePrice = Number(data.salePrice) || 0;
      const saleDate = data.saleDate || new Date().toISOString();

      DemoStorage.updateItem('cows', id, {
        status: 'sold',
        salePrice,
        saleDate
      });

      if (salePrice > 0) {
        DemoStorage.addItem('finance_transactions', {
          type: 'income',
          amount: salePrice,
          category: 'Dairy',
          title: `Sold Cattle #${cow.tagNumber}`,
          referenceId: id,
          date: saleDate
        });
      }

      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:dairy`);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:finance`);
      return { ...cow, status: 'sold', salePrice, saleDate };
    },

    async getLogs(_userId?: string, _force = false) {
      return DemoStorage.getCollection('dairy_logs');
    },

    async addLog(_userId: string, data: any) {
      const liters = Number(data.litersProduced) || 0;
      const rate = Number(data.ratePerLiter) || 0;
      const soldAmount = liters * rate;

      const created = DemoStorage.addItem('dairy_logs', {
        ...data,
        litersProduced: liters,
        ratePerLiter: rate,
        soldAmount,
        date: data.date || new Date().toISOString()
      });

      if (soldAmount > 0) {
        DemoStorage.addItem('finance_transactions', {
          type: 'income',
          amount: soldAmount,
          category: 'Dairy',
          title: `Farm Milk Sale - ${data.session || 'Morning'} (${liters}L @ ₹${rate})`,
          referenceId: created.id,
          date: data.date || new Date().toISOString()
        });
      }

      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:dairy`);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:finance`);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:dashboard`);
      return created;
    },

    async updateLog(id: string, data: any, _userId?: string) {
      const liters = Number(data.litersProduced) || 0;
      const rate = Number(data.ratePerLiter) || 0;
      const soldAmount = liters * rate;
      const updated = DemoStorage.updateItem('dairy_logs', id, {
        ...data,
        litersProduced: liters,
        ratePerLiter: rate,
        soldAmount
      });
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:dairy`);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:finance`);
      return updated;
    },

    async deleteLog(id: string, _userId?: string) {
      DemoStorage.deleteItem('dairy_logs', id);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:dairy`);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:finance`);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:dashboard`);
      return { message: 'Deleted' };
    },

    async getFeed(_userId?: string, _force = false) {
      return DemoStorage.getCollection('farm_feed');
    },

    async addFeed(_userId: string, data: any) {
      const amount = Number(data.amount) || 0;
      const created = DemoStorage.addItem('farm_feed', {
        ...data,
        amount,
        date: data.date || new Date().toISOString()
      });

      if (amount > 0) {
        DemoStorage.addItem('finance_transactions', {
          type: 'expense',
          amount,
          category: 'Dairy',
          title: `Farm Feed Expense - ${data.item || 'Concentrate'}`,
          referenceId: created.id,
          date: data.date || new Date().toISOString()
        });
      }

      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:dairy`);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:finance`);
      return created;
    },

    async updateFeed(id: string, data: any, _userId?: string) {
      const updated = DemoStorage.updateItem('farm_feed', id, data);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:dairy`);
      return updated;
    },

    async deleteFeed(id: string, _userId?: string) {
      DemoStorage.deleteItem('farm_feed', id);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:dairy`);
      return { message: 'Deleted' };
    },

    async getVetRecords(cowId: string, _userId?: string, _force = false) {
      const records = DemoStorage.getCollection<any>('dairy_vet_records');
      return records.filter(r => r.cowId === cowId);
    },

    async getAllVetRecords(_userId?: string, _force = false) {
      return DemoStorage.getCollection('dairy_vet_records');
    },

    async addVetRecord(cowId: string, data: any, _userId?: string) {
      const cost = Number(data.cost) || 0;
      const created = DemoStorage.addItem('dairy_vet_records', {
        ...data,
        cowId,
        cost,
        date: data.date || new Date().toISOString()
      });

      if (cost > 0) {
        DemoStorage.addItem('finance_transactions', {
          type: 'expense',
          amount: cost,
          category: 'Dairy',
          title: `Veterinary Care - Cattle #${data.tagNumber || cowId}`,
          referenceId: created.id,
          date: data.date || new Date().toISOString()
        });
      }

      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:dairy`);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:finance`);
      return created;
    },

    async updateVetRecord(id: string, data: any, _userId?: string) {
      const updated = DemoStorage.updateItem('dairy_vet_records', id, data);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:dairy`);
      return updated;
    },

    async deleteVetRecord(id: string, _userId?: string) {
      DemoStorage.deleteItem('dairy_vet_records', id);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:dairy`);
      return { message: 'Deleted' };
    },

    async getBreedingRecords(cowId: string, _userId?: string, _force = false) {
      const records = DemoStorage.getCollection<any>('dairy_breeding');
      return records.filter(r => r.cowId === cowId);
    },

    async getAllBreedingRecords(_userId?: string, _force = false) {
      return DemoStorage.getCollection('dairy_breeding');
    },

    async addBreedingRecord(cowId: string, data: any, _userId?: string) {
      const created = DemoStorage.addItem('dairy_breeding', {
        ...data,
        cowId
      });
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:dairy`);
      return created;
    },

    async updateBreedingRecord(id: string, data: any, _userId?: string) {
      const updated = DemoStorage.updateItem('dairy_breeding', id, data);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:dairy`);
      return updated;
    },

    async deleteBreedingRecord(id: string, _userId?: string) {
      DemoStorage.deleteItem('dairy_breeding', id);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:dairy`);
      return { message: 'Deleted' };
    }
  },

  // -------------------------------------------------------------
  // 5. MEDICINE SERVICE
  // -------------------------------------------------------------
  MedicineService: {
    async getMedicines(_userId?: string, _force = false) {
      return DemoStorage.getCollection('medicines');
    },

    async addMedicine(_userId: string, data: any) {
      const created = DemoStorage.addItem('medicines', {
        ...data,
        stock: Number(data.stock ?? data.currentStock) || 0,
        currentStock: Number(data.currentStock ?? data.stock) || 0,
        refillThreshold: Number(data.refillThreshold) || 5
      });
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:medicine`);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:dashboard`);
      return created;
    },

    async updateMedicine(id: string, data: any, _userId?: string) {
      const updated = DemoStorage.updateItem('medicines', id, data);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:medicine`);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:dashboard`);
      return updated;
    },

    async deleteMedicine(id: string, _userId?: string) {
      DemoStorage.deleteItem('medicines', id);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:medicine`);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:dashboard`);
      return { message: 'Deleted' };
    },

    async getLogs(_userId: string, date?: string) {
      const logs = DemoStorage.getCollection<any>('medicine_logs');
      if (date) {
        return logs.filter(l => l.date === date);
      }
      return logs;
    },

    async logDose(id: string, status: 'taken' | 'skipped', timeSlot: string, _userId?: string) {
      const med = DemoStorage.getItem<any>('medicines', id);
      if (!med) throw new Error('Medicine not found');

      const entry = {
        timestamp: new Date().toISOString(),
        status,
        timeSlot
      };

      const doseLogs = [...(med.doseLogs || []), entry];
      let newStock = Number(med.stock ?? med.currentStock) || 0;
      if (status === 'taken' && newStock > 0) {
        newStock -= 1;
      }

      const updated = DemoStorage.updateItem('medicines', id, {
        doseLogs,
        stock: newStock,
        currentStock: newStock
      });

      DemoStorage.addItem('medicine_logs', {
        medicineId: id,
        medicineName: med.name,
        slot: timeSlot,
        status,
        date: new Date().toISOString().split('T')[0]
      });

      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:medicine`);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:dashboard`);
      return { ...med, ...updated, _id: id, id };
    },

    async refillStock(id: string, count: number, _userId?: string) {
      const med = DemoStorage.getItem<any>('medicines', id);
      if (!med) throw new Error('Medicine not found');
      const currentStock = Number(med.stock ?? med.currentStock) || 0;
      const newStock = currentStock + count;
      const updated = DemoStorage.updateItem('medicines', id, {
        stock: newStock,
        currentStock: newStock
      });
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:medicine`);
      return { ...med, ...updated, _id: id, id };
    },

    async decrementStock(medicineId: string, amount = 1, _userId?: string) {
      return this.refillStock(medicineId, -amount, _userId);
    }
  },

  // -------------------------------------------------------------
  // 6. BILL SERVICE
  // -------------------------------------------------------------
  BillService: {
    async getBills(_userId?: string, _force = false) {
      return DemoStorage.getCollection('bills');
    },

    async addBill(_userId: string, data: any) {
      const created = DemoStorage.addItem('bills', {
        ...data,
        name: data.name || data.title,
        title: data.title || data.name,
        amount: Number(data.amount) || 0,
        isPaid: Boolean(data.isPaid)
      });
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:bills`);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:dashboard`);
      return created;
    },

    async updateBill(id: string, data: any, _userId?: string) {
      const updated = DemoStorage.updateItem('bills', id, data);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:bills`);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:dashboard`);
      return updated;
    },

    async deleteBill(id: string, _userId?: string) {
      DemoStorage.deleteItem('bills', id);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:bills`);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:dashboard`);
      return { message: 'Deleted' };
    },

    async togglePaid(id: string, currentStatus: boolean, billData: any) {
      const isPaid = !currentStatus;
      const paidDate = isPaid ? new Date().toISOString() : null;

      DemoStorage.updateItem('bills', id, { isPaid, paidDate });

      if (isPaid) {
        DemoStorage.addItem('finance_transactions', {
          type: 'expense',
          amount: Number(billData.amount) || 0,
          category: 'Utilities & Bills',
          title: `Bill Paid - ${billData.name || billData.title}`,
          referenceId: id,
          date: new Date().toISOString()
        });
      } else {
        const txs = DemoStorage.getCollection<any>('finance_transactions');
        const match = txs.find(t => t.referenceId === id);
        if (match) DemoStorage.deleteItem('finance_transactions', match.id);
      }

      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:bills`);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:finance`);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:dashboard`);
      return { isPaid, paidDate };
    },

    async markBillPaid(id: string, isPaid: boolean, _userId?: string) {
      const bill = DemoStorage.getItem<any>('bills', id);
      return this.togglePaid(id, !isPaid, bill || {});
    }
  },

  // -------------------------------------------------------------
  // 7. DIGITAL LOCKER SERVICE
  // -------------------------------------------------------------
  DocumentService: {
    async getDocuments(_userId?: string, _force = false) {
      return DemoStorage.getCollection('documents');
    },

    async addDocument(_userId: string, data: any) {
      const created = DemoStorage.addItem('documents', data);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:documents`);
      return created;
    },

    async updateDocument(id: string, data: any, _userId?: string) {
      const updated = DemoStorage.updateItem('documents', id, data);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:documents`);
      return updated;
    },

    async deleteDocument(id: string, _userId?: string) {
      DemoStorage.deleteItem('documents', id);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:documents`);
      return { message: 'Deleted' };
    }
  },

  // -------------------------------------------------------------
  // 8. EMERGENCY CONTACTS SERVICE
  // -------------------------------------------------------------
  ContactService: {
    async getContacts(_userId?: string, _force = false) {
      return DemoStorage.getCollection('emergency_contacts');
    },

    async addContact(_userId: string, data: any) {
      const created = DemoStorage.addItem('emergency_contacts', data);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:contacts`);
      return created;
    },

    async updateContact(id: string, data: any, _userId?: string) {
      const updated = DemoStorage.updateItem('emergency_contacts', id, data);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:contacts`);
      return updated;
    },

    async deleteContact(id: string, _userId?: string) {
      DemoStorage.deleteItem('emergency_contacts', id);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:contacts`);
      return { message: 'Deleted' };
    }
  },

  // -------------------------------------------------------------
  // 9. TASKS & PLANNER SERVICE
  // -------------------------------------------------------------
  TaskService: {
    async getTasks(_userId?: string, _force = false) {
      return DemoStorage.getCollection('tasks');
    },

    async addTask(_userId: string, data: any) {
      const created = DemoStorage.addItem('tasks', {
        ...data,
        status: data.status || 'todo',
        priority: data.priority || 'medium',
        subtasks: data.subtasks || []
      });
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:tasks`);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:dashboard`);
      return created;
    },

    async updateTask(id: string, data: any, _userId?: string) {
      const updated = DemoStorage.updateItem('tasks', id, data);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:tasks`);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:dashboard`);
      return updated;
    },

    async deleteTask(id: string, _userId?: string) {
      DemoStorage.deleteItem('tasks', id);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:tasks`);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:dashboard`);
      return { message: 'Deleted' };
    },

    async toggleSubtask(taskId: string, subtaskId: string, _userId?: string) {
      const task = DemoStorage.getItem<any>('tasks', taskId);
      if (!task) throw new Error('Task not found');

      const subtasks = (task.subtasks || []).map((sub: any) =>
        sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
      );

      DemoStorage.updateItem('tasks', taskId, { subtasks });
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:tasks`);
      return { success: true };
    }
  },

  // -------------------------------------------------------------
  // 10. VEHICLE SERVICE
  // -------------------------------------------------------------
  VehicleService: {
    async getVehicles(_userId?: string, _force = false) {
      return DemoStorage.getCollection('vehicles');
    },

    async getVehicleById(id: string, _userId?: string) {
      return DemoStorage.getItem('vehicles', id);
    },

    async addVehicle(_userId: string, data: any) {
      const created = DemoStorage.addItem('vehicles', {
        ...data,
        odometer: Number(data.odometer) || 0
      });
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:vehicles`);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:dashboard`);
      return created;
    },

    async updateVehicle(id: string, data: any, _userId?: string) {
      const updated = DemoStorage.updateItem('vehicles', id, data);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:vehicles`);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:dashboard`);
      return updated;
    },

    async deleteVehicle(id: string, _userId?: string) {
      DemoStorage.deleteItem('vehicles', id);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:vehicles`);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:dashboard`);
      return { message: 'Deleted' };
    },

    async getFuelLogs(vehicleId: string, _userId?: string, _force = false) {
      const logs = DemoStorage.getCollection<any>('vehicle_fuel_logs');
      return logs.filter(l => l.vehicleId === vehicleId);
    },

    async addFuelLog(vehicleId: string, data: any, _userId?: string) {
      const currentOdo = Number(data.odometer) || 0;
      const liters = Number(data.liters) || 0;
      const cost = Number(data.cost) || 0;

      const existingLogs = DemoStorage.getCollection<any>('vehicle_fuel_logs')
        .filter(l => l.vehicleId === vehicleId)
        .sort((a, b) => b.odometer - a.odometer);

      const prevOdo = existingLogs.length > 0 ? existingLogs[0].odometer : (currentOdo - 300);
      const mileageRes = calculateVehicleMileage(prevOdo, currentOdo, liters);
      const mileage = mileageRes.isValid ? mileageRes.mileage : 0;

      const created = DemoStorage.addItem('vehicle_fuel_logs', {
        ...data,
        vehicleId,
        odometer: currentOdo,
        liters,
        cost,
        calculatedMileage: mileage > 0 ? mileage : undefined,
        date: data.date || new Date().toISOString()
      });

      const veh = DemoStorage.getItem<any>('vehicles', vehicleId);
      if (veh && currentOdo > (veh.odometer || 0)) {
        DemoStorage.updateItem('vehicles', vehicleId, { odometer: currentOdo });
      }

      if (cost > 0) {
        DemoStorage.addItem('finance_transactions', {
          type: 'expense',
          amount: cost,
          category: 'Transportation',
          title: `Vehicle Fuel Refill - ${veh?.name || 'Vehicle'}`,
          referenceId: vehicleId,
          date: data.date || new Date().toISOString()
        });
      }

      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:vehicles`);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:finance`);
      return created;
    },

    async updateFuelLog(id: string, data: any, _userId?: string) {
      const updated = DemoStorage.updateItem('vehicle_fuel_logs', id, data);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:vehicles`);
      return updated;
    },

    async deleteFuelLog(id: string, _userId?: string) {
      DemoStorage.deleteItem('vehicle_fuel_logs', id);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:vehicles`);
      return { message: 'Deleted' };
    },

    async getServiceLogs(vehicleId: string, _userId?: string, _force = false) {
      const logs = DemoStorage.getCollection<any>('vehicle_service_logs');
      return logs.filter(l => l.vehicleId === vehicleId);
    },

    async addServiceLog(vehicleId: string, data: any, _userId?: string) {
      const cost = Number(data.cost) || 0;
      const created = DemoStorage.addItem('vehicle_service_logs', {
        ...data,
        vehicleId,
        cost,
        date: data.date || new Date().toISOString()
      });

      if (cost > 0) {
        const veh = DemoStorage.getItem<any>('vehicles', vehicleId);
        DemoStorage.addItem('finance_transactions', {
          type: 'expense',
          amount: cost,
          category: 'Transportation',
          title: `Vehicle Maintenance - ${veh?.name || 'Service'} (${data.serviceType || 'Service'})`,
          referenceId: vehicleId,
          date: data.date || new Date().toISOString()
        });
      }

      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:vehicles`);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:finance`);
      return created;
    },

    async updateServiceLog(id: string, data: any, _userId?: string) {
      const updated = DemoStorage.updateItem('vehicle_service_logs', id, data);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:vehicles`);
      return updated;
    },

    async deleteServiceLog(id: string, _userId?: string) {
      DemoStorage.deleteItem('vehicle_service_logs', id);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:vehicles`);
      return { message: 'Deleted' };
    },

    async getVehicleDocuments(vehicleId: string, _userId?: string, _force = false) {
      const docs = DemoStorage.getCollection<any>('vehicle_documents');
      return docs.filter(d => d.vehicleId === vehicleId);
    },

    async addVehicleDocument(vehicleId: string, data: any, _userId?: string) {
      const created = DemoStorage.addItem('vehicle_documents', { ...data, vehicleId });
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:vehicles`);
      return created;
    },

    async deleteVehicleDocument(id: string, _userId?: string) {
      DemoStorage.deleteItem('vehicle_documents', id);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:vehicles`);
      return { message: 'Deleted' };
    }
  },

  // -------------------------------------------------------------
  // 11. STUDENT PLANNER SERVICE
  // -------------------------------------------------------------
  StudentService: {
    async getItems(_userId?: string, _force = false) {
      return DemoStorage.getCollection('student_items');
    },

    async addItem(_userId: string, data: any) {
      const created = DemoStorage.addItem('student_items', data);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:student`);
      return created;
    },

    async updateItem(id: string, data: any, _userId?: string) {
      const updated = DemoStorage.updateItem('student_items', id, data);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:student`);
      return updated;
    },

    async deleteItem(id: string, _userId?: string) {
      DemoStorage.deleteItem('student_items', id);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:student`);
      return { message: 'Deleted' };
    },

    async getCourses(_userId?: string, _force = false) {
      const items = DemoStorage.getCollection<any>('student_items');
      return items.filter(i => i.type === 'course');
    },

    async addCourse(userId: string, data: any) {
      return this.addItem(userId, { ...data, type: 'course' });
    },

    async updateCourse(id: string, data: any, userId?: string) {
      return this.updateItem(id, { ...data, type: 'course' }, userId);
    },

    async deleteCourse(id: string, userId?: string) {
      return this.deleteItem(id, userId);
    },

    async getTimetable(_userId?: string, _force = false) {
      const items = DemoStorage.getCollection<any>('student_items');
      return items.filter(i => i.type === 'timetable');
    },

    async addTimetableSlot(userId: string, data: any) {
      return this.addItem(userId, { ...data, type: 'timetable' });
    },

    async updateTimetableSlot(id: string, data: any, userId?: string) {
      return this.updateItem(id, { ...data, type: 'timetable' }, userId);
    },

    async deleteTimetableSlot(id: string, userId?: string) {
      return this.deleteItem(id, userId);
    }
  },

  // -------------------------------------------------------------
  // 12. HOME INVENTORY SERVICE
  // -------------------------------------------------------------
  InventoryService: {
    async getInventory(_userId?: string, _force = false) {
      return DemoStorage.getCollection('inventory_items');
    },

    async addInventory(_userId: string, data: any) {
      const price = Number(data.price || data.purchasePrice) || 0;
      const created = DemoStorage.addItem('inventory_items', {
        ...data,
        price,
        purchasePrice: price,
        estimatedValue: Number(data.estimatedValue || price) || 0
      });
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:inventory`);
      return created;
    },

    async updateInventory(id: string, data: any, _userId?: string) {
      const updated = DemoStorage.updateItem('inventory_items', id, data);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:inventory`);
      return updated;
    },

    async deleteInventory(id: string, _userId?: string) {
      DemoStorage.deleteItem('inventory_items', id);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:inventory`);
      return { message: 'Deleted' };
    },

    async addItem(userId: string, data: any) {
      return this.addInventory(userId, data);
    },

    async updateItem(id: string, data: any, userId?: string) {
      return this.updateInventory(id, data, userId);
    },

    async deleteItem(id: string, userId?: string) {
      return this.deleteInventory(id, userId);
    }
  },

  // -------------------------------------------------------------
  // 13. PASSWORD VAULT SERVICE
  // -------------------------------------------------------------
  PasswordService: {
    async getPasswords(_userId?: string, _force = false) {
      return DemoStorage.getCollection('passwords');
    },

    async addPassword(_userId: string, data: any) {
      const created = DemoStorage.addItem('passwords', data);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:passwords`);
      return created;
    },

    async updatePassword(id: string, data: any, _userId?: string) {
      const updated = DemoStorage.updateItem('passwords', id, data);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:passwords`);
      return updated;
    },

    async deletePassword(id: string, _userId?: string) {
      DemoStorage.deleteItem('passwords', id);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:passwords`);
      return { message: 'Deleted' };
    }
  },

  // -------------------------------------------------------------
  // 14. FAMILY SERVICE
  // -------------------------------------------------------------
  FamilyService: {
    async getPosts(_userId?: string, _force = false) {
      return DemoStorage.getCollection('family_announcements');
    },

    async addPost(_userId: string, data: any) {
      const created = DemoStorage.addItem('family_announcements', data);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:family`);
      return created;
    },

    async updatePost(id: string, data: any, _userId?: string) {
      const updated = DemoStorage.updateItem('family_announcements', id, data);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:family`);
      return updated;
    },

    async deletePost(id: string, _userId?: string) {
      DemoStorage.deleteItem('family_announcements', id);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:family`);
      return { message: 'Deleted' };
    },

    async getMembers(_userId?: string, _force = false) {
      return DemoStorage.getCollection('family_members');
    },

    async addMember(_userId: string, data: any) {
      const colors = ['#00f2fe', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const created = DemoStorage.addItem('family_members', {
        ...data,
        avatarColor: data.avatarColor || randomColor
      });
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:family`);
      return created;
    },

    async updateMember(id: string, data: any, _userId?: string) {
      const updated = DemoStorage.updateItem('family_members', id, data);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:family`);
      return updated;
    },

    async deleteMember(id: string, _userId?: string) {
      DemoStorage.deleteItem('family_members', id);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:family`);
      return { message: 'Deleted' };
    },

    async getChores(_userId?: string, _force = false) {
      return DemoStorage.getCollection('family_chores');
    },

    async addChore(_userId: string, data: any) {
      const created = DemoStorage.addItem('family_chores', {
        ...data,
        completed: Boolean(data.completed || data.isCompleted)
      });
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:family`);
      return created;
    },

    async updateChore(id: string, data: any, _userId?: string) {
      const updated = DemoStorage.updateItem('family_chores', id, data);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:family`);
      return updated;
    },

    async toggleChore(id: string, completed: boolean, _userId?: string) {
      return this.updateChore(id, { completed }, _userId);
    },

    async deleteChore(id: string, _userId?: string) {
      DemoStorage.deleteItem('family_chores', id);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:family`);
      return { message: 'Deleted' };
    },

    async getFamilyEvents(_userId?: string, _force = false) {
      return DemoStorage.getCollection('family_events');
    },

    async addFamilyEvent(_userId: string, data: any) {
      const created = DemoStorage.addItem('family_events', data);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:family`);
      return created;
    },

    async updateFamilyEvent(id: string, data: any, _userId?: string) {
      const updated = DemoStorage.updateItem('family_events', id, data);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:family`);
      return updated;
    },

    async deleteFamilyEvent(id: string, _userId?: string) {
      DemoStorage.deleteItem('family_events', id);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:family`);
      return { message: 'Deleted' };
    },

    async getSharedExpenses(_userId?: string, _force = false) {
      return DemoStorage.getCollection('family_expenses');
    },

    async addSharedExpense(_userId: string, data: any) {
      const created = DemoStorage.addItem('family_expenses', {
        ...data,
        amount: Number(data.amount) || 0,
        date: data.date || new Date().toISOString()
      });
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:family`);
      return created;
    },

    async updateSharedExpense(id: string, data: any, _userId?: string) {
      const updated = DemoStorage.updateItem('family_expenses', id, data);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:family`);
      return updated;
    },

    async deleteSharedExpense(id: string, _userId?: string) {
      DemoStorage.deleteItem('family_expenses', id);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:family`);
      return { message: 'Deleted' };
    }
  },

  // -------------------------------------------------------------
  // 15. HEALTH SERVICE
  // -------------------------------------------------------------
  HealthService: {
    async getProfile(_userId?: string, _force = false) {
      const store = DemoStorage.getStore();
      return store.health_profile || null;
    },

    async saveProfile(_userId: string, data: any) {
      const store = DemoStorage.getStore();
      store.health_profile = { ...store.health_profile, ...data, updatedAt: new Date().toISOString() };
      DemoStorage.saveStore(store);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:health`);
      return store.health_profile;
    },

    async updateProfile(userId: string, data: any) {
      return this.saveProfile(userId, data);
    },

    async getRecords(_userId?: string, _force = false) {
      return DemoStorage.getCollection('health_vitals');
    },

    async addRecord(_userId: string, data: any) {
      const created = DemoStorage.addItem('health_vitals', {
        ...data,
        systolic: Number(data.systolic) || 120,
        diastolic: Number(data.diastolic) || 80,
        pulse: Number(data.pulse) || 72,
        date: data.date || new Date().toISOString().split('T')[0]
      });
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:health`);
      return created;
    },

    async updateRecord(id: string, data: any, _userId?: string) {
      const updated = DemoStorage.updateItem('health_vitals', id, data);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:health`);
      return updated;
    },

    async deleteRecord(id: string, _userId?: string) {
      DemoStorage.deleteItem('health_vitals', id);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:health`);
      return { message: 'Deleted' };
    },

    async getVisits(_userId?: string, _force = false) {
      return DemoStorage.getCollection('health_consultations');
    },

    async addVisit(_userId: string, data: any) {
      const created = DemoStorage.addItem('health_consultations', {
        ...data,
        cost: Number(data.cost) || 0,
        date: data.date || data.visitDate || new Date().toISOString()
      });
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:health`);
      return created;
    },

    async updateVisit(id: string, data: any, _userId?: string) {
      const updated = DemoStorage.updateItem('health_consultations', id, data);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:health`);
      return updated;
    },

    async deleteVisit(id: string, _userId?: string) {
      DemoStorage.deleteItem('health_consultations', id);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:health`);
      return { message: 'Deleted' };
    }
  },

  // -------------------------------------------------------------
  // 16. GOAL SERVICE
  // -------------------------------------------------------------
  GoalService: {
    async getGoals(_userId?: string, _force = false) {
      return DemoStorage.getCollection('goals');
    },

    async addGoal(_userId: string, data: any) {
      const created = DemoStorage.addItem('goals', {
        ...data,
        targetValue: Number(data.targetValue) || 100,
        currentValue: Number(data.currentValue) || 0,
        milestones: data.milestones || [],
        status: data.status || 'In Progress'
      });
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:goals`);
      return created;
    },

    async updateGoal(id: string, data: any, _userId?: string) {
      const updated = DemoStorage.updateItem('goals', id, data);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:goals`);
      return updated;
    },

    async deleteGoal(id: string, _userId?: string) {
      DemoStorage.deleteItem('goals', id);
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:goals`);
      return { message: 'Deleted' };
    },

    async getMilestones(goalId: string, _userId?: string, _force = false) {
      const goal = DemoStorage.getItem<any>('goals', goalId);
      return goal?.milestones || [];
    },

    async toggleMilestone(goalId: string, milestoneId: string, _userId?: string) {
      const goal = DemoStorage.getItem<any>('goals', goalId);
      if (!goal) throw new Error('Goal not found');

      const milestones = (goal.milestones || []).map((m: any) =>
        m.id === milestoneId ? { ...m, completed: !m.completed } : m
      );

      DemoStorage.updateItem('goals', goalId, { milestones });
      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:goals`);
      return { success: true };
    },

    async addProgress(goalId: string, amount: number, _userId?: string) {
      const goal = DemoStorage.getItem<any>('goals', goalId);
      if (!goal) throw new Error('Goal not found');

      const newVal = (Number(goal.currentValue) || 0) + Number(amount);
      const isAchieved = newVal >= Number(goal.targetValue);

      DemoStorage.updateItem('goals', goalId, {
        currentValue: newVal,
        status: isAchieved ? 'Achieved' : goal.status
      });

      queryCache.invalidate(`${INITIAL_DEMO_USER_ID}:goals`);
      return { success: true, currentValue: newVal };
    }
  },

  // -------------------------------------------------------------
  // 17. DASHBOARD SERVICE
  // -------------------------------------------------------------
  DashboardService: {
    async getOverview(_userId?: string, _force = false) {
      const txs = DemoStorage.getCollection<any>('finance_transactions');
      const accounts = DemoStorage.getCollection<any>('finance_accounts');
      const bills = DemoStorage.getCollection<any>('bills');
      const medicines = DemoStorage.getCollection<any>('medicines');
      const vehicles = DemoStorage.getCollection<any>('vehicles');
      const crops = DemoStorage.getCollection<any>('crops');
      const dairyLogs = DemoStorage.getCollection<any>('dairy_logs');
      const tasks = DemoStorage.getCollection<any>('tasks');
      const loans = DemoStorage.getCollection<any>('loans');

      // 1. Finance Calculations
      const todayIso = new Date().toISOString().split('T')[0];
      const todaysExpense = txs
        .filter(t => t.type === 'expense' && (t.date || '').startsWith(todayIso))
        .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

      const monthlyIncome = txs
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

      const currentSavings = accounts
        .filter(a => a.type === 'Savings' || a.type === 'Bank')
        .reduce((sum, a) => sum + (Number(a.balance) || 0), 0);

      const totalSpentMonth = txs
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

      const budgetStatus = monthlyIncome > 0 ? Math.round((totalSpentMonth / monthlyIncome) * 100) : 48;

      // 2. Action Required: Upcoming Bill
      const unpaidBills = bills
        .filter(b => !b.isPaid)
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
      const upcomingBill = unpaidBills.length > 0 ? {
        title: unpaidBills[0].title || unpaidBills[0].name,
        amount: unpaidBills[0].amount,
        dueDate: unpaidBills[0].dueDate,
        isOverdue: isBillOverdue(unpaidBills[0].dueDate, false)
      } : null;

      // 3. Action Required: Medicine Due
      const pendingMed = medicines.length > 0 ? {
        name: medicines[0].name,
        dosage: medicines[0].dosage,
        slot: 'Morning',
        time: '08:00 AM'
      } : null;

      // 4. Action Required: Vehicle Alert
      const upcomingVeh = vehicles.find(v => v.insuranceExpiry || v.pucExpiry);
      const vehicleAlert = upcomingVeh ? {
        vehicleName: upcomingVeh.name,
        type: 'Insurance & PUC Renewal',
        expiryDate: upcomingVeh.insuranceExpiry || upcomingVeh.pucExpiry
      } : null;

      // 5. Domain Snapshots
      const milkToday = dairyLogs
        .filter(l => (l.date || '').startsWith(todayIso))
        .reduce((sum, l) => sum + (Number(l.litersProduced) || 0), 0);

      const activeCrops = crops.filter(c => c.status === 'growing').length;
      const pendingTasks = tasks.filter(t => t.status !== 'completed').length;
      const totalLoanPrincipal = loans.reduce((sum, l) => sum + (Number(l.principalAmount) || 0), 0);
      const totalMonthlyEMI = loans.reduce((sum, l) => sum + (Number(l.monthlyPay) || 0), 0);

      return {
        finance: {
          todaysExpense: todaysExpense || 2450,
          monthlyIncome: monthlyIncome || 185000,
          currentSavings: currentSavings || 642800,
          budgetStatus: budgetStatus || 48
        },
        actionRequired: {
          upcomingBill,
          medicine: pendingMed,
          vehicleAlert
        },
        domainSnapshots: {
          milkProduction: milkToday || 28.5,
          activeCrops: activeCrops || 2,
          pendingTasks: pendingTasks || 4,
          recentActivity: txs.length,
          totalLoanPrincipal,
          totalMonthlyEMI
        },
        aiSuggestions: [
          `Your HDFC Home Loan EMI of ₹27,585 is active. Total outstanding balance is ₹21,45,000 across your debt facilities.`,
          `Today's dairy milk yield across 3 cattle stands at 28.5 Liters (₹1,083 revenue logged).`,
          `Kharif Paddy harvest is projected in 20 days with an estimated gross realization of ₹1,01,250.`
        ]
      };
    }
  },

  // -------------------------------------------------------------
  // 18. USER SERVICE
  // -------------------------------------------------------------
  UserService: {
    async getUserProfile(_userId?: string, _force = false) {
      const store = DemoStorage.getStore();
      return store.user_profile || null;
    },

    async saveUserProfile(_userId: string, data: any) {
      const store = DemoStorage.getStore();
      store.user_profile = { ...store.user_profile, ...data, updatedAt: new Date().toISOString() };
      DemoStorage.saveStore(store);
      return store.user_profile;
    },

    async updateUserProfile(userId: string, data: any) {
      return this.saveUserProfile(userId, data);
    },

    async exportAllUserData(_userId: string) {
      const store = DemoStorage.getStore();
      return {
        appName: 'Vynora Demo Showcase',
        version: '2.0.0',
        exportedAt: new Date().toISOString(),
        userId: INITIAL_DEMO_USER_ID,
        data: store
      };
    },

    async deleteUserData(_userId: string) {
      DemoStorage.resetStore();
      return { success: true };
    }
  },

  // -------------------------------------------------------------
  // 19. GLOBAL SEARCH SERVICE
  // -------------------------------------------------------------
  GlobalSearchService: {
    async prewarmUserDatasets(userId?: string) {
      const uid = userId || INITIAL_DEMO_USER_ID;
      queryCache.set(queryCache.makeKey(uid, 'finance', 'transactions'), DemoStorage.getCollection('finance_transactions'));
      queryCache.set(queryCache.makeKey(uid, 'loans', 'all'), DemoStorage.getCollection('loans'));
      queryCache.set(queryCache.makeKey(uid, 'tasks', 'all'), DemoStorage.getCollection('tasks'));
      queryCache.set(queryCache.makeKey(uid, 'medicine', 'medicines'), DemoStorage.getCollection('medicines'));
      queryCache.set(queryCache.makeKey(uid, 'bills', 'all'), DemoStorage.getCollection('bills'));
      queryCache.set(queryCache.makeKey(uid, 'agriculture', 'crops'), DemoStorage.getCollection('crops'));
      queryCache.set(queryCache.makeKey(uid, 'dairy', 'cows'), DemoStorage.getCollection('cows'));
      queryCache.set(queryCache.makeKey(uid, 'emergency', 'contacts'), DemoStorage.getCollection('emergency_contacts'));
      queryCache.set(queryCache.makeKey(uid, 'documents', 'all'), DemoStorage.getCollection('documents'));
      queryCache.set(queryCache.makeKey(uid, 'vehicles', 'vehicles'), DemoStorage.getCollection('vehicles'));
      queryCache.set(queryCache.makeKey(uid, 'inventory', 'all'), DemoStorage.getCollection('inventory_items'));
      queryCache.set(queryCache.makeKey(uid, 'student', 'items'), DemoStorage.getCollection('student_items'));
    }
  }
};
