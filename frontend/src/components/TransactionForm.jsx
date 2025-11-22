import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

function TransactionForm({ initialData, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        fecha: new Date().toISOString().split('T')[0],
        concepto: '',
        monto: '',
        moneda: 'Córdobas',
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
        <div className="bg-slate-900 border border-slate-800 rounded-lg shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">
                    {initialData ? 'Editar Transacción' : 'Nueva Transacción'}
                </h3>
                <button onClick={onCancel} className="text-slate-400 hover:text-white transition-colors">
                    <X size={20} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Fecha</label>
                    <input
                        type="date"
                        name="fecha"
                        value={formData.fecha}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:ring-2 focus:ring-slate-700 focus:border-transparent outline-none text-white"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Concepto</label>
                    <input
                        type="text"
                        name="concepto"
                        value={formData.concepto}
                        onChange={handleChange}
                        placeholder="Descripción de la transacción"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:ring-2 focus:ring-slate-700 focus:border-transparent outline-none text-white placeholder-slate-600"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Monto</label>
                        <input
                            type="number"
                            name="monto"
                            value={formData.monto}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:ring-2 focus:ring-slate-700 focus:border-transparent outline-none text-white placeholder-slate-600"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Moneda</label>
                        <select
                            name="moneda"
                            value={formData.moneda}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:ring-2 focus:ring-slate-700 focus:border-transparent outline-none text-white"
                        >
                            <option value="Córdobas">Córdobas</option>
                            <option value="Dólares">Dólares</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Tipo</label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, tipo: 'Gasto' }))}
                            className={`py-2 rounded-lg text-sm font-medium transition-colors ${formData.tipo === 'Gasto'
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
                                }`}
                        >
                            Gasto
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, tipo: 'Ingreso' }))}
                            className={`py-2 rounded-lg text-sm font-medium transition-colors ${formData.tipo === 'Ingreso'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
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
                        className="flex-1 py-2 border border-slate-800 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="flex-1 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
                    >
                        {initialData ? 'Actualizar' : 'Guardar'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default TransactionForm;
