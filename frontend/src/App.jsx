import { useState, useEffect } from 'react';
import { Plus, User, LayoutDashboard, Receipt, Target } from 'lucide-react';
import api from './api';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';
import GoalsList from './components/GoalsList';
import GoalForm from './components/GoalForm';

function App() {
  const [currentUser, setCurrentUser] = useState(null); // { id, username }
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false);
  const [isGoalFormOpen, setIsGoalFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [editingGoal, setEditingGoal] = useState(null);
  const [activeView, setActiveView] = useState('dashboard'); // 'dashboard', 'transactions', 'goals'

  // Auto-login on mount
  useEffect(() => {
    const storedUsername = localStorage.getItem('profit_username');
    const storedUserId = localStorage.getItem('profit_user_id');

    if (storedUsername && storedUserId) {
      setCurrentUser({ id: parseInt(storedUserId), username: storedUsername });
    }
  }, []);

  // Fetch data when user is set
  useEffect(() => {
    if (currentUser) {
      fetchTransactions();
      fetchGoals();
    }
  }, [currentUser]);

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/transactions', {
        params: { user_id: currentUser.id }
      });
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const fetchGoals = async () => {
    try {
      const response = await api.get('/goals', {
        params: { user_id: currentUser.id }
      });
      setGoals(response.data);
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const username = e.target.username.value.trim();
    if (!username) return;

    try {
      // Create or get user
      const response = await api.post('/users', { username });
      const user = response.data;

      // Save to localStorage
      localStorage.setItem('profit_username', user.username);
      localStorage.setItem('profit_user_id', user.id.toString());

      setCurrentUser(user);
    } catch (error) {
      console.error("Error creating/getting user:", error);
      alert("Error al iniciar sesión");
    }
  };

  const handleSaveTransaction = async (data) => {
    try {
      const payload = { ...data, user_id: currentUser.id };
      if (editingTransaction) {
        await api.put(`/transactions/${editingTransaction.id}`, data);
      } else {
        await api.post('/transactions', payload);
      }
      fetchTransactions();
      setIsTransactionFormOpen(false);
      setEditingTransaction(null);
    } catch (error) {
      console.error("Error saving transaction:", error);
      alert("Error al guardar la transacción");
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (confirm("¿Estás seguro de eliminar esta transacción?")) {
      try {
        await api.delete(`/transactions/${id}`);
        fetchTransactions();
      } catch (error) {
        console.error("Error deleting transaction:", error);
      }
    }
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setIsTransactionFormOpen(true);
  };

  const handleSaveGoal = async (data) => {
    try {
      const payload = { ...data, user_id: currentUser.id };
      if (editingGoal) {
        await api.put(`/goals/${editingGoal.id}`, data);
      } else {
        await api.post('/goals', payload);
      }
      fetchGoals();
      setIsGoalFormOpen(false);
      setEditingGoal(null);
    } catch (error) {
      console.error("Error saving goal:", error);
      alert("Error al guardar la meta");
    }
  };

  const handleDeleteGoal = async (id) => {
    if (confirm("¿Estás seguro de eliminar esta meta?")) {
      try {
        await api.delete(`/goals/${id}`);
        fetchGoals();
      } catch (error) {
        console.error("Error deleting goal:", error);
      }
    }
  };

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setIsGoalFormOpen(true);
  };

  if (!currentUser) {
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
              <button
                onClick={() => setActiveView('goals')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeView === 'goals'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
              >
                <Target size={16} />
                Metas
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-lg">
            <User size={14} />
            <span>{currentUser.username}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeView === 'dashboard' && (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white">Dashboard</h2>
              <p className="text-sm text-slate-400 mt-1">Resumen de tu actividad financiera</p>
            </div>
            <Dashboard transactions={transactions} goals={goals} />
          </>
        )}

        {activeView === 'transactions' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-white">Tus Transacciones</h2>
                <p className="text-sm text-slate-400 mt-1">Gestiona tus movimientos financieros</p>
              </div>
              <button
                onClick={() => {
                  setEditingTransaction(null);
                  setIsTransactionFormOpen(true);
                }}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                <Plus size={18} />
                Nueva Transacción
              </button>
            </div>
            <TransactionList
              transactions={transactions}
              onEdit={handleEditTransaction}
              onDelete={handleDeleteTransaction}
            />
          </>
        )}

        {activeView === 'goals' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-white">Metas de Ahorro</h2>
                <p className="text-sm text-slate-400 mt-1">Planifica y alcanza tus objetivos</p>
              </div>
              <button
                onClick={() => {
                  setEditingGoal(null);
                  setIsGoalFormOpen(true);
                }}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                <Plus size={18} />
                Nueva Meta
              </button>
            </div>
            <GoalsList
              goals={goals}
              onEdit={handleEditGoal}
              onDelete={handleDeleteGoal}
            />
          </>
        )}
      </main>

      {/* Transaction Modal */}
      {isTransactionFormOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md">
            <TransactionForm
              initialData={editingTransaction}
              onSave={handleSaveTransaction}
              onCancel={() => setIsTransactionFormOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Goal Modal */}
      {isGoalFormOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md">
            <GoalForm
              initialData={editingGoal}
              onSave={handleSaveGoal}
              onCancel={() => setIsGoalFormOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
