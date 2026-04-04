# Financetro - Premium Financial Management Dashboard

Financetro is a state-of-the-art, feature-rich personal finance management application built with Next.js and Firebase. It provides users with a comprehensive view of their financial life, including real-time currency conversion, transaction tracking, debt management, and goal setting.

---

## 🎨 Design & Aesthetics

Financetro is designed with a **Premium Dark Glassmorphism** aesthetic.

- **Core Theme**: Deep Charcoal & Navy (#0F172A) with Glassmorphism effects.
- **Primary Gradient**: `from-primary to-orange-400` (Vibrant Indigo-to-Sunset Orange).
- **Typography**: Modern Sans-serif (Outfit/Inter).
- **Responsive Elements**:
  - Floating Action Button (FAB) for mobile quick-add.
  - Interactive Hover states and micro-animations.
  - Mobile Drawer with icon-based navigation.

---

## 🛠 Features & Scope

### 1. **Dynamic Multi-Currency System**

- **Real-time Rates**: Integrated with `ExchangeRate-API` for live global conversion.
- **Searchable Switcher**: A header dropdown with over 160 world currencies searchable by code or symbol.
- **Persistent Selection**: User preference is saved across sessions (Zustand persist).
- **Global Formatting**: All financial values (Charts, Wallets, Transactions) automatically convert and format based on the selected currency.

### 2. **Financial Overview (Dashboard)**

- **Net Worth Tracking**: Total balance across all accounts and assets.
- **Growth Analysis**: Percentage change in wealth since session start.
- **Cash Flow Charts**: Beautiful Recharts visualization of Income vs. Expense trends.
- **Recent Activity**: Quick view of latest financial movements.

### 3. **Wallets & Asset Management**

- **Account Types**: Support for Bank Accounts, Physical Cash, Crypto Wallets, and Investment Portfolios.
- **Crypto Support**: Store wallet addresses and track digital assets.
- **Categorization**: Visual indicators and icons for different account types.

### 4. **Transactions Ledger**

- **Income/Expense Tracking**: Fast entry with categories and notes.
- **Mobile Optimized**: Table view on desktop; Card-based list view on mobile.
- **CSV Export**: Ability to download full transaction history for external audit.

### 5. **Debt & Loans Tracker**

- **Lent vs. Borrowed**: Track who owes you and who you owe.
- **Status Management**: Mark debts as 'Active' or 'Paid'.
- **Due Dates**: Visual alerts for upcoming debt deadlines.

### 6. **Savings Goals & Schedules**

- **Goal Progress**: Progress bars for savings targets.
- **Recurring Payments**: Subscription and bill management with automated logic.
- **Upcoming Bills**: List view of future recurring expenses.

---

## ⚙️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS (plus `lucide-react` for icons)
- **State Management**: Zustand (with Persist middleware)
- **Database**: Firebase Firestore
- **Auth**: Firebase Auth (Email/Google)
- **Real-time Data**: ExchangeRate-API (V6)
- **Date Handling**: `date-fns`

---

## 🔑 Credentials & Environment

_Copy these to your `.env.local` for local development or React Native implementation._

### **Firebase Config**

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDzvVYmzkaB4jSW1uFg3z1-5pznlhMBAik
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=financetro.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://financetro-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=financetro
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=financetro.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=662862194800
NEXT_PUBLIC_FIREBASE_APP_ID=1:662862194800:web:becdcf1b579dc0ad7d6cb5
```

### **ExchangeRate-API**

```env
NEXT_PUBLIC_EXCHANGE_RATE_API_KEY=c420d2d7cb5754112a15f4ea
```

---

## 📱 Mobile App Scope (React Native Suggestions)

To achieve parity with this web app:

- **UI Components**: Use `react-native-reanimated` for the smooth gradients and hover-like feelings.
- **State**: Use `zustand` for shared logic between Web and Mobile.
- **Charts**: Use `react-native-wagmi-charts` or `victory-native` for high-performance financial graphs.
- **Auth**: Use `react-native-firebase` for native performance.

---

**Created with ❤️ for Financetro**
# web-financetro
