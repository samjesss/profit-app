import { Edit2, Trash2, TrendingUp, TrendingDown } from 'lucide-react';

function TransactionList({ transactions, onEdit, onDelete }) {
    if (transactions.length === 0) {
        return (
            <div className="text-center py-16 bg-slate-900 rounded-lg border border-slate-800">
                <p className="text-slate-400">No hay transacciones registradas.</p>
            </div>
        );
    }

    return (
        <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-slate-800">
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                            Fecha
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                            Concepto
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                            Tipo
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                            Monto
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    {transactions.map((t) => (
                        <tr key={t.id} className="hover:bg-slate-800/50 transition-colors group">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                                {t.fecha}
                            </td>
                            <td className="px-6 py-4 text-sm text-white">
                                {t.concepto}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${t.tipo === 'Ingreso'
                                    ? 'bg-emerald-500/10 text-emerald-400'
                                    : 'bg-rose-500/10 text-rose-400'
                                    }`}>
                                    {t.tipo === 'Ingreso' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                    {t.tipo}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-mono">
                                <span className={t.tipo === 'Ingreso' ? 'text-emerald-400' : 'text-white'}>
                                    {t.tipo === 'Gasto' && '-'}
                                    {t.moneda === 'Dólares' ? '$' : 'C$'} {t.monto.toFixed(2)}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => onEdit(t)}
                                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
                                        title="Editar"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(t.id)}
                                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
                                        title="Eliminar"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TransactionList;
