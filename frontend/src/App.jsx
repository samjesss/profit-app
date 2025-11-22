import { useState, useEffect } from 'react';
import { Plus, User, LogOut, Wallet } from 'lucide-react';
import api from './api';
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';

function App() {
  const [user, setUser] = useState(localStorage.getItem('profit_user'));
  const [transactions, setTransactions] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/transactions');
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
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-sm animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="bg-indigo-500/20 p-4 rounded-full">
              <Wallet className="text-indigo-400 w-10 h-10" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2 text-center text-white">Profit</h1>
          <p className="text-slate-400 text-center mb-8">Gestión financiera compartida</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">¿Quién eres?</label>
              <input
                name="username"
                type="text"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-white placeholder-slate-500 transition-all"
                placeholder="Tu nombre"
                required
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3 rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all font-medium"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-slate-900/70 border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500/20 p-2 rounded-lg">
              <Wallet className="text-indigo-400 w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">Profit</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-300 bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
              <User size={14} className="text-indigo-400" />
              <span className="font-medium">{user}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
              title="Cerrar sesión"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8 animate-slide-up">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Transacciones</h2>
            <p className="text-slate-400">Historial reciente de movimientos</p>
          </div>
          <button
            onClick={() => {
              setEditingTransaction(null);
              setIsFormOpen(true);
            }}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-500/20 font-medium"
          >
            <Plus size={20} />
            Nueva Transacción
          </button>
        </div>

        <TransactionList
          transactions={transactions}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>

      {/* Modal Form */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="w-full max-w-md animate-slide-up">
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
