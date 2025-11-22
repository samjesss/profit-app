import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

function GoalForm({ initialData, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        nombre: '',
        monto_objetivo: '',
        monto_actual: '0',
        fecha_inicio: new Date().toISOString().split('T')[0],
        fecha_objetivo: '',
        descripcion: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                nombre: initialData.nombre,
                monto_objetivo: initialData.monto_objetivo.toString(),
                monto_actual: initialData.monto_actual.toString(),
                fecha_inicio: initialData.fecha_inicio,
                fecha_objetivo: initialData.fecha_objetivo,
                descripcion: initialData.descripcion || ''
            });
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...formData,
            monto_objetivo: parseFloat(formData.monto_objetivo),
            monto_actual: parseFloat(formData.monto_actual)
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
                    {initialData ? 'Editar Meta' : 'Nueva Meta de Ahorro'}
                </h3>
                <button onClick={onCancel} className="text-slate-400 hover:text-white transition-colors">
                    <X size={20} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Nombre de la Meta</label>
                    <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        placeholder="Ej: Vacaciones 2025"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:ring-2 focus:ring-slate-700 focus:border-transparent outline-none text-white placeholder-slate-600"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Monto Objetivo</label>
                        <input
                            type="number"
                            name="monto_objetivo"
                            value={formData.monto_objetivo}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:ring-2 focus:ring-slate-700 focus:border-transparent outline-none text-white placeholder-slate-600"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Monto Actual</label>
                        <input
                            type="number"
                            name="monto_actual"
                            value={formData.monto_actual}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:ring-2 focus:ring-slate-700 focus:border-transparent outline-none text-white placeholder-slate-600"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Fecha Inicio</label>
                        <input
                            type="date"
                            name="fecha_inicio"
                            value={formData.fecha_inicio}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:ring-2 focus:ring-slate-700 focus:border-transparent outline-none text-white"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Fecha Objetivo</label>
                        <input
                            type="date"
                            name="fecha_objetivo"
                            value={formData.fecha_objetivo}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:ring-2 focus:ring-slate-700 focus:border-transparent outline-none text-white"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Descripción (opcional)</label>
                    <textarea
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleChange}
                        placeholder="Detalles adicionales..."
                        rows={3}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:ring-2 focus:ring-slate-700 focus:border-transparent outline-none text-white placeholder-slate-600 resize-none"
                    />
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

export default GoalForm;
