import { ArrowRight, Plus, Target } from 'lucide-react';

function Onboarding({ onDismiss, onStartTransaction, onStartGoal }) {
    return (
        <div className="max-w-2xl mx-auto py-12 px-4">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">¡Bienvenido a Profit! 🚀</h2>
                <p className="text-slate-400 text-lg">
                    Tu herramienta personal para tomar el control de tus finanzas.
                    Aquí tienes una guía rápida para empezar.
                </p>
            </div>

            <div className="grid gap-6">
                {/* Step 1: Transactions */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors">
                    <div className="flex items-start gap-4">
                        <div className="bg-indigo-500/10 p-3 rounded-lg text-indigo-400">
                            <Plus size={24} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-semibold text-white mb-2">Registra tu primer movimiento</h3>
                            <p className="text-slate-400 mb-4">
                                Comienza registrando tus ingresos o gastos. Puedes especificar la moneda (C$ o $) y Profit se encargará del resto.
                            </p>
                            <button
                                onClick={onStartTransaction}
                                className="flex items-center gap-2 text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors font-medium"
                            >
                                Crear Transacción <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Step 2: Goals */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors">
                    <div className="flex items-start gap-4">
                        <div className="bg-emerald-500/10 p-3 rounded-lg text-emerald-400">
                            <Target size={24} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-semibold text-white mb-2">Define una meta de ahorro</h3>
                            <p className="text-slate-400 mb-4">
                                ¿Quieres comprar algo especial? Crea una meta, establece un monto objetivo y sigue tu progreso visualmente.
                            </p>
                            <button
                                onClick={onStartGoal}
                                className="flex items-center gap-2 text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg transition-colors font-medium"
                            >
                                Crear Meta <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-12 text-center">
                <button
                    onClick={onDismiss}
                    className="text-slate-500 hover:text-white transition-colors text-sm underline decoration-slate-700 hover:decoration-white underline-offset-4"
                >
                    Saltar introducción e ir al Dashboard
                </button>
            </div>
        </div>
    );
}

export default Onboarding;
