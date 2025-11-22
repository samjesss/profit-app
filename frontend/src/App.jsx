import { useState, useEffect } from 'react';
import { Plus, User, LogOut, LayoutDashboard, Receipt } from 'lucide-react';
import api from './api';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';

// TODO: Replace with your Power BI embed URL
const POWER_BI_URL = "https://app.powerbi.com/reportEmbed?reportId=148ed4d7-6026-47ca-a004-0085fbf702da&autoAuth=true&ctid=44d8c9e3-236e-4ca9-88e0-030a91805c44";

function App() {
  const [user, setUser] = useState(localStorage.getItem('profit_user'));
  const [transactions, setTransactions] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [activeView, setActiveView] = useState('dashboard'); // 'dashboard' or 'transactions'

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  const fetchTransactions = async () => {
    try {
      // Filter by current user
      const response = await api.get('/transactions', {
        params: { usuario: user }
      });
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const name = e.target.username.value.trim();
    if (name) {
      localStorage.setItem('profit_user', name);
      setUser(name);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('profit_user');
    setUser(null);
    setTransactions([]);
  };

  const handleSave = async (data) => {
    try {
      const payload = { ...data, usuario: user };
      if (editingTransaction) {
        await api.put(`/transactions/${editingTransaction.id}`, payload);
      } else {
        await api.post('/transactions', payload);
      }
      fetchTransactions();
      setIsFormOpen(false);
      setEditingTransaction(null);
    } catch (error) {
      console.error("Error saving transaction:", error);
      alert("Error al guardar la transacción");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("¿Estás seguro de eliminar esta transacción?")) {
      try {
        await api.delete(`/transactions/${id}`);
        fetchTransactions();
      } catch (error) {
        console.error("Error deleting transaction:", error);
      }
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-lg shadow-xl w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-white mb-1">Profit</h1>
            <p className="text-slate-400 text-sm">Gestión financiera</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Usuario</label>
              <input
                name="username"
                type="text"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg focus:ring-2 focus:ring-slate-700 focus:border-transparent outline-none text-white placeholder-slate-600"
                placeholder="Tu nombre"
                required
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="w-full bg-slate-800 hover:bg-slate-700 text-white py-2.5 rounded-lg transition-colors font-medium"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <h1 className="text-lg font-semibold text-white">Profit</h1>

            {/* Navigation */}
            <nav className="flex gap-1">
              <button
                onClick={() => setActiveView('dashboard')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeView === 'dashboard'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
              >
                <LayoutDashboard size={16} />
                Dashboard
              </button>
              <button
                onClick={() => setActiveView('transactions')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeView === 'transactions'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
              >
                <Receipt size={16} />
                Transacciones
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-lg">
              <User size={14} />
              <span>{user}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Cerrar sesión"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeView === 'dashboard' ? (
          <Dashboard powerBiUrl={POWER_BI_URL} />
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-white">Tus Transacciones</h2>
                <p className="text-sm text-slate-400 mt-1">Gestiona tus movimientos financieros</p>
              </div>
              <button
                onClick={() => {
                  setEditingTransaction(null);
                  setIsFormOpen(true);
                }}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                <Plus size={18} />
                Nueva Transacción
              </button>
            </div>

            <TransactionList
              transactions={transactions}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </>
        )}
      </main>

      {/* Modal Form */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md">
            <TransactionForm
              initialData={editingTransaction}
              onSave={handleSave}
              onCancel={() => setIsFormOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
