import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

function TransactionForm({ initialData, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        fecha: new Date().toISOString().split('T')[0],
        concepto: '',
        monto: '',
        moneda: 'NIO',
        tipo: 'Gasto'
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                monto: initialData.monto.toString()
            });
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...formData,
            monto: parseFloat(formData.monto)
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="bg-slate-800 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center bg-slate-900/50">
                <h3 className="text-xl font-bold text-white">
                    {initialData ? 'Editar Transacción' : 'Nueva Transacción'}
                </h3>
                <button onClick={onCancel} className="text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-lg">
                    <X size={20} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Fecha</label>
                    <input
                        type="date"
                        name="fecha"
                        value={formData.fecha}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-white transition-all"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Concepto</label>
                    <input
                        type="text"
                        name="concepto"
                        value={formData.concepto}
                        onChange={handleChange}
                        placeholder="Ej: Compra de supermercado"
                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-white placeholder-slate-600 transition-all"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Monto</label>
                        <input
                            type="number"
                            name="monto"
                            value={formData.monto}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-white placeholder-slate-600 transition-all"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Moneda</label>
                        <select
                            name="moneda"
                            value={formData.moneda}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-white transition-all appearance-none"
                        >
                            <option value="NIO">Córdobas (NIO)</option>
                            <option value="USD">Dólares (USD)</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Tipo</label>
                    <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-900/50 rounded-xl border border-slate-700">
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, tipo: 'Gasto' }))}
                            className={`py-2.5 rounded-lg text-sm font-medium transition-all ${formData.tipo === 'Gasto'
                                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                    : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            Gasto
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, tipo: 'Ingreso' }))}
                            className={`py-2.5 rounded-lg text-sm font-medium transition-all ${formData.tipo === 'Ingreso'
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                    : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            Ingreso
                        </button>
                    </div>
                </div>

                <div className="pt-4 flex gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 py-3 border border-slate-700 text-slate-300 rounded-xl hover:bg-slate-800 transition-colors font-medium"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="flex-1 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-colors font-medium shadow-lg shadow-indigo-500/20"
                    >
                        {initialData ? 'Actualizar' : 'Guardar'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default TransactionForm;
