import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Wallet, Target } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';

function Dashboard({ transactions, goals }) {
    // Calculate summary metrics
    const totalIncome = transactions
        .filter(t => t.tipo === 'Ingreso')
        .reduce((sum, t) => sum + t.monto, 0);

    const totalExpenses = transactions
        .filter(t => t.tipo === 'Gasto')
        .reduce((sum, t) => sum + t.monto, 0);

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
            .reduce((sum, t) => sum + t.monto, 0);

        const expenses = monthTransactions
            .filter(t => t.tipo === 'Gasto')
            .reduce((sum, t) => sum + t.monto, 0);

        return { month: monthKey, Ingresos: income, Gastos: expenses };
    });

    // Expense distribution by concept (top 5)
    const expensesByConcepto = transactions
        .filter(t => t.tipo === 'Gasto')
        .reduce((acc, t) => {
            acc[t.concepto] = (acc[t.concepto] || 0) + t.monto;
            return acc;
        }, {});

    const expenseDistribution = Object.entries(expensesByConcepto)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, value]) => ({ name, value }));

    const COLORS = ['#64748b', '#475569', '#334155', '#1e293b', '#0f172a'];

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-400">Ingresos</span>
                        <TrendingUp className="text-emerald-400" size={20} />
                    </div>
                    <p className="text-2xl font-semibold text-white">C$ {totalIncome.toFixed(2)}</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-400">Gastos</span>
                        <TrendingDown className="text-rose-400" size={20} />
                    </div>
                    <p className="text-2xl font-semibold text-white">C$ {totalExpenses.toFixed(2)}</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-400">Balance</span>
                        <Wallet className={balance >= 0 ? "text-emerald-400" : "text-rose-400"} size={20} />
                    </div>
                    <p className={`text-2xl font-semibold ${balance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        C$ {balance.toFixed(2)}
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
                            />
                            <Legend />
                            <Bar dataKey="Ingresos" fill="#10b981" />
                            <Bar dataKey="Gastos" fill="#f43f5e" />
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
