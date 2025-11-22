import { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Wallet, Target, RefreshCw } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';

const EXCHANGE_RATE = 36.62; // 1 USD = 36.62 NIO

function Dashboard({ transactions, goals }) {
    const [currency, setCurrency] = useState('NIO'); // 'NIO' or 'USD'

    // Helper to convert amount based on selected currency
    const convert = (amount, originalCurrency) => {
        if (currency === 'NIO') {
            return originalCurrency === 'Dólares' ? amount * EXCHANGE_RATE : amount;
        } else {
            return originalCurrency === 'Dólares' ? amount : amount / EXCHANGE_RATE;
        }
    };

    // Calculate summary metrics
    const totalIncome = transactions
        .filter(t => t.tipo === 'Ingreso')
        .reduce((sum, t) => sum + convert(t.monto, t.moneda), 0);

    const totalExpenses = transactions
        .filter(t => t.tipo === 'Gasto')
        .reduce((sum, t) => sum + convert(t.monto, t.moneda), 0);

    const balance = totalIncome - totalExpenses;

    // Prepare monthly data (last 6 months)
    const sixMonthsAgo = subMonths(new Date(), 5);
    const months = eachMonthOfInterval({ start: sixMonthsAgo, end: new Date() });

    const monthlyData = months.map(month => {
        const monthStart = startOfMonth(month);
        const monthEnd = endOfMonth(month);
        const monthKey = format(month, 'MMM');

        const monthTransactions = transactions.filter(t => {
            const tDate = new Date(t.fecha);
            return tDate >= monthStart && tDate <= monthEnd;
        });

        const income = monthTransactions
            .filter(t => t.tipo === 'Ingreso')
            .reduce((sum, t) => sum + convert(t.monto, t.moneda), 0);

        const expenses = monthTransactions
            .filter(t => t.tipo === 'Gasto')
            .reduce((sum, t) => sum + convert(t.monto, t.moneda), 0);

        return { month: monthKey, Ingresos: income, Gastos: expenses };
    });

    // Expense distribution by concept (top 5)
    const expensesByConcepto = transactions
        .filter(t => t.tipo === 'Gasto')
        .reduce((acc, t) => {
            const amount = convert(t.monto, t.moneda);
            acc[t.concepto] = (acc[t.concepto] || 0) + amount;
            return acc;
        }, {});

    const expenseDistribution = Object.entries(expensesByConcepto)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, value]) => ({ name, value }));

    const COLORS = ['#64748b', '#475569', '#334155', '#1e293b', '#0f172a'];
    const currencySymbol = currency === 'NIO' ? 'C$' : '$';

    return (
        <div className="space-y-6">
            {/* Currency Toggle */}
            <div className="flex justify-end">
                <div className="bg-slate-900 p-1 rounded-lg border border-slate-800 flex items-center">
                    <button
                        onClick={() => setCurrency('NIO')}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${currency === 'NIO' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        Córdobas (C$)
                    </button>
                    <button
                        onClick={() => setCurrency('USD')}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${currency === 'USD' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        Dólares ($)
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-400">Ingresos</span>
                        <TrendingUp className="text-emerald-400" size={20} />
                    </div>
                    <p className="text-2xl font-semibold text-white">{currencySymbol} {totalIncome.toFixed(2)}</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-400">Gastos</span>
                        <TrendingDown className="text-rose-400" size={20} />
                    </div>
                    <p className="text-2xl font-semibold text-white">{currencySymbol} {totalExpenses.toFixed(2)}</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-400">Balance</span>
                        <Wallet className={balance >= 0 ? "text-emerald-400" : "text-rose-400"} size={20} />
                    </div>
                    <p className={`text-2xl font-semibold ${balance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {currencySymbol} {balance.toFixed(2)}
                    </p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Trends */}
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Tendencia Mensual</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="month" stroke="#64748b" />
                            <YAxis stroke="#64748b" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                                labelStyle={{ color: '#e2e8f0' }}
                                formatter={(value) => [`${currencySymbol} ${value.toFixed(2)}`, '']}
                            />
                            <Legend />
                            <Bar dataKey="Ingresos" fill="#10b981" name="Ingresos" />
                            <Bar dataKey="Gastos" fill="#f43f5e" name="Gastos" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Expense Distribution */}
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Distribución de Gastos</h3>
                    {expenseDistribution.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={expenseDistribution}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {expenseDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                                    formatter={(value) => [`${currencySymbol} ${value.toFixed(2)}`, 'Monto']}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-[250px] text-slate-500">
                            No hay gastos registrados
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
