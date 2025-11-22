import { useState, useEffect, useRef } from 'react';
import { Edit2, Trash2, TrendingUp, TrendingDown, MoreVertical } from 'lucide-react';

function TransactionList({ transactions, onEdit, onDelete }) {
    const [openMenuId, setOpenMenuId] = useState(null);
    const menuRef = useRef(null);

    // Sort transactions: newest first
    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenuId(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (transactions.length === 0) {
        return (
            <div className="text-center py-16 bg-slate-900 rounded-lg border border-slate-800">
                <p className="text-slate-400">No hay transacciones registradas.</p>
            </div>
        );
    }

    return (
        <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-visible">
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
                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider w-10">

                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    {sortedTransactions.map((t) => (
                        <tr key={t.id} className="hover:bg-slate-800/50 transition-colors">
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
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm relative">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenMenuId(openMenuId === t.id ? null : t.id);
                                    }}
                                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
                                >
                                    <MoreVertical size={16} />
                                </button>

                                {openMenuId === t.id && (
                                    <div
                                        ref={menuRef}
                                        className="absolute right-8 top-8 w-32 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden"
                                    >
                                        <button
                                            onClick={() => {
                                                onEdit(t);
                                                setOpenMenuId(null);
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-2"
                                        >
                                            <Edit2 size={14} /> Editar
                                        </button>
                                        <button
                                            onClick={() => {
                                                onDelete(t.id);
                                                setOpenMenuId(null);
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
                                        >
                                            <Trash2 size={14} /> Eliminar
                                        </button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TransactionList;
