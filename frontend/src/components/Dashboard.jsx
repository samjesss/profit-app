import { BarChart3 } from 'lucide-react';

function Dashboard({ powerBiUrl }) {
    if (!powerBiUrl) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] text-center px-4">
                <div className="bg-slate-900 p-6 rounded-lg mb-4">
                    <BarChart3 className="w-16 h-16 text-slate-600 mx-auto" />
                </div>
                <h2 className="text-2xl font-semibold text-slate-300 mb-2">Dashboard de Power BI</h2>
                <p className="text-slate-500 max-w-md">
                    Configura tu URL de Power BI en el código para ver el dashboard aquí.
                </p>
                <p className="text-sm text-slate-600 mt-4">
                    Edita <code className="bg-slate-900 px-2 py-1 rounded">App.jsx</code> y actualiza la variable <code className="bg-slate-900 px-2 py-1 rounded">POWER_BI_URL</code>
                </p>
            </div>
        );
    }

    return (
        <div className="w-full h-[calc(100vh-8rem)]">
            <iframe
                title="Power BI Dashboard"
                src={powerBiUrl}
                className="w-full h-full border-0 rounded-lg"
                allowFullScreen
            />
        </div>
    );
}

export default Dashboard;
