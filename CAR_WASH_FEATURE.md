# Car Wash Management System - Complete

## Overview
A comprehensive car wash management system with expense tracking and automatic profit/loss calculation.

## Features Implemented

### ✅ Core Operations
1. **Job Management**
   - Create new car wash jobs with customer details
   - Assign employees to jobs
   - Select services and calculate pricing
   - Track job status (pending → in_progress → completed)
   - Apply discounts

2. **Employee Management**
   - Add/edit/deactivate employees
   - Track commission earnings (fixed amount per service)
   - View unpaid commissions
   - Mark commissions as paid

3. **Service Management**
   - Create and manage service catalog
   - Set pricing and commission amounts
   - Activate/deactivate services

4. **Payment Processing**
   - Multiple payment methods (Cash, M-Pesa, Card)
   - M-Pesa reference tracking
   - Change calculation for cash payments
   - Professional receipt generation with print functionality

5. **Expense Tracking** ⭐ NEW
   - Record expenses by category (supplies, utilities, rent, equipment, maintenance, salaries, marketing, other)
   - Track payment methods
   - Filter by date range and category
   - Edit/delete expenses

6. **Profit & Loss Analytics** ⭐ NEW
   - Real-time profitability calculation
   - Revenue vs Expenses vs Commissions breakdown
   - Date range filtering (today, last 7 days, last 30 days, custom)
   - Expenses by category visualization
   - Profit margin percentage
   - Automated recommendations based on performance

## Database Schema

### Tables Created
1. `car_wash_employees` - Employee information
2. `car_wash_services` - Service catalog with pricing
3. `car_wash_jobs` - Job records with customer/vehicle info
4. `car_wash_payments` - Payment transactions
5. `car_wash_commissions` - Employee commission tracking
6. `car_wash_expenses` - Expense tracking ⭐ NEW

## Components

### Main Dashboard
- `SimpleCarWashDashboard.tsx` - Main dashboard with tabs and stats
  - 6 stat cards: Today's Jobs, Pending Jobs, Total Revenue, Active Employees, Monthly Expenses, Monthly Profit
  - 5 tabs: Jobs, Employees, Services, Expenses, Analytics

### Job Management
- `NewJobForm.tsx` - Create new wash jobs
- `JobsList.tsx` - View and manage all jobs
- `PaymentModal.tsx` - Process payments
- `ReceiptModal.tsx` - Print receipts

### Employee & Services
- `EmployeeManagement.tsx` - Manage employees and commissions
- `ServiceManagement.tsx` - Manage service catalog

### Financial Management ⭐ NEW
- `ExpenseManagement.tsx` - Track and manage expenses
- `ProfitLossAnalytics.tsx` - View profitability and analytics

## How It Works

### Workflow
1. **Customer arrives** → Supervisor creates new job (customer details, vehicle info)
2. **Assign employee** → Select employee from dropdown
3. **Select services** → Choose services, system calculates total + creates commissions
4. **Update status** → Change from pending → in_progress → completed
5. **Process payment** → Enter payment details, generate receipt
6. **Track expenses** → Record business expenses
7. **View analytics** → Automatic profit/loss calculation

### Financial Calculations
```
Revenue = Sum of all completed jobs
Expenses = Sum of all recorded expenses
Commissions = Sum of employee commissions
Net Profit = Revenue - Expenses - Commissions
```

## Dashboard Stats

### Real-time Metrics
- **Today's Jobs**: Count of jobs created today
- **Pending Jobs**: Jobs not yet completed (pending/in_progress)
- **Total Revenue**: All-time revenue from completed jobs
- **Active Employees**: Currently active employee count
- **Monthly Expenses**: This month's total expenses ⭐
- **Monthly Profit**: This month's net profit (green if positive, red if negative) ⭐

## Usage

### To Run the Database Migration
```sql
-- Run the contents of supabase-schema.sql in your Supabase SQL editor
-- This creates all 6 tables with sample data
```

### Access the System
1. Navigate to admin dashboard
2. Click "Car Wash" tab
3. Use the 5 tabs to manage different aspects:
   - **Jobs**: Create and manage wash jobs
   - **Employees**: Manage staff and commissions
   - **Services**: Configure service offerings
   - **Expenses**: Track business expenses ⭐
   - **Analytics**: View profit/loss reports ⭐

## Key Features

### Expense Management
- 8 expense categories
- Date-based filtering
- Payment method tracking
- Receipt reference storage
- Quick add/edit/delete

### Profit/Loss Analytics
- Automatic calculation (no manual input needed)
- Multiple date ranges
- Visual breakdown by category
- Profit margin percentage
- Performance recommendations:
  - ⚠️ Loss warnings with action items
  - 💡 Low profit optimization tips (<20% margin)
  - ✅ Healthy business confirmation (≥20% margin)

## Technical Details

### TypeScript Types
All new types added to `src/types/database.ts`:
- `CarWashExpense`
- `CarWashExpenseInsert`
- `CarWashExpenseUpdate`

### Supabase Integration
- Row Level Security (RLS) enabled on all tables
- Automatic timestamps
- Foreign key relationships
- Sample data included

## Sample Data Included

### Employees
- John Washer (Employee #EMP001)
- Mary Cleaner (Employee #EMP002)

### Services
- Basic Wash - KSh 500 (Commission: KSh 100)
- Full Wash - KSh 1000 (Commission: KSh 200)
- Premium Detailing - KSh 2500 (Commission: KSh 500)

### Expenses
- Car Shampoo - KSh 2,500
- Water Bill - KSh 3,500
- Microfiber Towels - KSh 1,200
- Pressure Washer Maintenance - KSh 4,000

## Next Steps

The system is now fully functional with:
✅ Complete job workflow
✅ Payment processing with receipts
✅ Employee commission tracking
✅ Expense recording
✅ Automatic profit/loss calculation
✅ Analytics dashboard

You can now:
1. Start creating car wash jobs
2. Track expenses as they occur
3. Monitor profitability in real-time
4. Make data-driven business decisions

## Notes
- All prices in Kenyan Shillings (KSh)
- Commission amounts are fixed per service (not percentage)
- Profit calculations include commissions as expenses
- Monthly stats reset at the start of each month
- Historical data retained for all periods
