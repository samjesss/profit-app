import { Target, Calendar, TrendingUp, Edit2, Trash2 } from 'lucide-react';
import { differenceInDays, format } from 'date-fns';

function GoalsList({ goals, onEdit, onDelete }) {
    if (goals.length === 0) {
        return (
            <div className="text-center py-16 bg-slate-900 rounded-lg border border-slate-800">
                <div className="bg-slate-800/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="text-slate-500 w-8 h-8" />
                </div>
                <p className="text-slate-400">No hay metas de ahorro registradas.</p>
            </div>
        );
    }

    return (
        <div className="grid gap-4">
            {goals.map((goal) => {
                const progress = (goal.monto_actual / goal.monto_objetivo) * 100;
                const daysRemaining = differenceInDays(new Date(goal.fecha_objetivo), new Date());
                const isCompleted = progress >= 100;
                const isOverdue = daysRemaining < 0 && !isCompleted;

                return (
                    <div key={goal.id} className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-slate-700 transition-colors group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-white mb-1">{goal.nombre}</h3>
                                {goal.descripcion && (
                                    <p className="text-sm text-slate-400">{goal.descripcion}</p>
                                )}
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => onEdit(goal)}
                                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                                    title="Editar"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => onDelete(goal.id)}
                                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                                    title="Eliminar"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {/* Progress Bar */}
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-slate-400">Progreso</span>
                                    <span className={`font-medium ${isCompleted ? 'text-emerald-400' : 'text-white'}`}>
                                        {progress.toFixed(1)}%
                                    </span>
                                </div>
                                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                                    <div
                                        className={`h-full transition-all ${isCompleted ? 'bg-emerald-500' : 'bg-slate-600'
                                            }`}
                                        style={{ width: `${Math.min(progress, 100)}%` }}
                                    />
                                </div>
                            </div>

                            {/* Amounts */}
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-slate-400">Ahorrado</p>
                                    <p className="text-lg font-semibold text-white">C$ {goal.monto_actual.toFixed(2)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-slate-400">Objetivo</p>
                                    <p className="text-lg font-semibold text-white">C$ {goal.monto_objetivo.toFixed(2)}</p>
                                </div>
                            </div>

                            {/* Dates */}
                            <div className="flex items-center justify-between text-sm pt-2 border-t border-slate-800">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Calendar size={14} />
                                    <span>{format(new Date(goal.fecha_inicio), 'dd/MM/yyyy')} - {format(new Date(goal.fecha_objetivo), 'dd/MM/yyyy')}</span>
                                </div>
                                {!isCompleted && (
                                    <span className={`font-medium ${isOverdue ? 'text-rose-400' : 'text-slate-300'}`}>
                                        {isOverdue ? `${Math.abs(daysRemaining)} días vencido` : `${daysRemaining} días restantes`}
                                    </span>
                                )}
                                {isCompleted && (
                                    <span className="text-emerald-400 font-medium">¡Meta alcanzada!</span>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default GoalsList;
