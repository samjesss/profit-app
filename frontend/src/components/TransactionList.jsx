import { Edit2, Trash2, TrendingUp, TrendingDown, Calendar, User } from 'lucide-react';
import clsx from 'clsx';

function TransactionList({ transactions, onEdit, onDelete }) {
    if (transactions.length === 0) {
        return (
            <div className="text-center py-16 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                <div className="bg-slate-800/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="text-slate-500 w-8 h-8" />
                </div>
                <p className="text-slate-400 text-lg">No hay transacciones registradas.</p>
            </div>
        );
    }

    return (
        <div className="grid gap-4">
            {transactions.map((t) => (
                <div
                    key={t.id}
                    className="group bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/5 hover:border-white/10 p-5 rounded-2xl transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                    <div className="flex items-start gap-4">
                        <div className={clsx(
                            "p-3 rounded-xl flex-shrink-0",
                            t.tipo === 'Ingreso' ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                        )}>
                            {t.tipo === 'Ingreso' ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                        </div>

                        <div>
                            <h3 className="text-white font-semibold text-lg mb-1">{t.concepto}</h3>
                            <div className="flex items-center gap-4 text-sm text-slate-400">
                                <span className="flex items-center gap-1.5">
                                    <Calendar size={14} />
                                    {t.fecha}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <User size={14} />
                                    {t.usuario}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pl-16 sm:pl-0">
                        <div className="text-right">
                            <p className={clsx(
                                "text-xl font-bold font-mono",
                                t.tipo === 'Ingreso' ? "text-emerald-400" : "text-white"
                            )}>
                                {t.tipo === 'Gasto' && '-'}
                                {t.moneda === 'USD' ? '$' : 'C$'} {t.monto.toFixed(2)}
                            </p>
                            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">{t.moneda}</span>
                        </div>

                        <div className="flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => onEdit(t)}
                                className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                                title="Editar"
                            >
                                <Edit2 size={18} />
                            </button>
                            <button
                                onClick={() => onDelete(t.id)}
                                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                                title="Eliminar"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default TransactionList;
