import './App.css';
import { useState } from "react";
import { initialData, categories } from "../public/data.js";

// Utility button component
function Button({ children, onClick }) {
    return (
        <button onClick={onClick} className="button">{children}</button>
    );
}

function ListOnClick({ onClick, className, children }) {
    return (
        <li
            onClick={onClick}
            className={className}
        >
            { children }
        </li>
    )
}

// Renders the list of expense names
function NameTable({ expenses, onSelected, selectedItem }) {
    return (
        <div>
            <p className="SectionTitle">Name</p>
            <ul className="MainTable">
                {expenses.map(expense => (
                    <ListOnClick
                        key={expense.id}
                        onClick={() => onSelected(expense)}
                        className={`Item ${selectedItem.id === expense.id ? 'selected' : ''}`}
                    >
                        {expense.id} : {expense.name}
                    </ListOnClick>
                ))}
            </ul>
        </div>
    );
}

// Renders detailed view of selected expense
function Detail({ selectedItem, onDelete, onSetView }) {
    return (
        <div className="Detail">
            <p className="SectionTitle">Detail</p>
            <ul>
                {Object.entries(selectedItem).map(([key, value]) => (
                    <li key={key}>{key}: {value}</li>
                ))}
            </ul>
            <Button onClick={() => onSetView('update')}>Update</Button>
            <Button onClick={() => onDelete(selectedItem.id)}>Delete</Button>
        </div>
    );
}

// Renders a summary by category
function CountByCategory({ expenses, categories, onSelected, selectedItem }) {
    const [selectedCategory, setSelectedCategory] = useState(null);

    const handleClose = () => setSelectedCategory(null);

    return (
        <div>
            <p className="SectionTitle">{selectedCategory ? "DetailByCategory" : "CountByCategory"}</p>
            {!selectedCategory ? (
                <ul className="CountByCategory">
                    {categories.map(category => (
                        <ListOnClick
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className="Item"
                        >
                            {category}: {expenses
                            .filter(expense => expense.category === category)
                            .reduce((sum, expense) => sum + expense.amount, 0)}$
                        </ListOnClick>
                    ))}
                </ul>
            ) : (
                <FilterByCategory
                    selectedCategory={selectedCategory}
                    expenses={expenses}
                    onClose={handleClose}
                    onSelected={onSelected}
                    selectedItem={selectedItem}
                />
            )}
        </div>
    );
}

// Filtered view by selected category
function FilterByCategory({ onSelected, selectedCategory, expenses, onClose, selectedItem }) {
    const filteredExpenses = expenses.filter(expense => expense.category === selectedCategory);

    return (
        <div>
            {/*<div className="MainTable">
                <ul>
                    {filteredExpenses.map(expense => (
                        <li key={expense.id}>
                            {expense.name} : {expense.amount}
                        </li>
                    ))}
                </ul>
            </div>*/}

            <NameTable
                onSelected={onSelected}
                expenses={filteredExpenses}
                selectedItem={selectedItem}
            />
            <Button onClick={() => onClose(null)}>Close</Button>
        </div>
    );
}

// Form to add a new expense
function AddForm({ categories, onAddItem, nextId }) {
    const [newName, setNewName] = useState('');
    const [newAmount, setNewAmount] = useState('');
    const [newCategory, setNewCategory] = useState('Food');

    function handleSubmit(e) {
        e.preventDefault();
        if (!newName || !newAmount) return;

        onAddItem({
            id: nextId,
            name: newName,
            amount: Number(newAmount),
            category: newCategory,
        });
    }

    return (
        <div>
            <p className="SectionTitle">Add</p>
            <form onSubmit={handleSubmit} className="AddForm">
                <div>
                    <label>Name</label>
                    <input type="text" value={newName} onChange={e => setNewName(e.target.value)} className="Input" />
                </div>
                <div>
                    <label>Amount</label>
                    <input type="number" value={newAmount} onChange={e => setNewAmount(e.target.value)} className="Input" />
                </div>
                <div>
                    <label>Category</label>
                    <select value={newCategory} onChange={e => setNewCategory(e.target.value)} className="Input">
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                </div>
                <Button>Add</Button>
            </form>
        </div>
    );
}

// Form to update an expense
function UpdateForm({ selectedItem, onUpdate, onCancel }) {
    const [name, setName] = useState(selectedItem.name);
    const [amount, setAmount] = useState(selectedItem.amount);
    const [category, setCategory] = useState(selectedItem.category);

    function handleSubmit(e) {
        e.preventDefault();
        onUpdate({ ...selectedItem, name, amount: Number(amount), category });
    }

    return (
        <div>
            <p className="SectionTitle">Update</p>
            <form onSubmit={handleSubmit} className="AddForm">
                <div>
                    <label>Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="Input" />
                </div>
                <div>
                    <label>Amount</label>
                    <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="Input" />
                </div>
                <div>
                    <label>Category</label>
                    <select value={category} onChange={e => setCategory(e.target.value)} className="Input">
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                <Button>Update</Button>
            </form>
            <Button onClick={onCancel}>Cancel</Button>
        </div>
    );
}

function App() {
    const [view, setView] = useState('detail');
    const [expenses, setExpenses] = useState(initialData);
    const [selectedItem, setSelectedItem] = useState(expenses[0]);

    const nextId = expenses.length + 1;

    function handleAddExpense(newExpense) {
        setExpenses([...expenses, newExpense]);
        setSelectedItem(newExpense);
        setView('detail');
    }

    function handleDeleteExpense(id) {
        const updatedExpenses = expenses.filter(expense => expense.id !== id);
        setExpenses(updatedExpenses);
        setSelectedItem(updatedExpenses[0] || null);
    }

    function handleUpdateExpense(updatedExpense) {
        setExpenses(expenses.map(exp => (exp.id === updatedExpense.id ? updatedExpense : exp)));
        setView('detail');
    }

    return (
        <div className="App">
            <div className="MainTableContainer">
                <NameTable selectedItem={selectedItem} expenses={expenses} onSelected={setSelectedItem} />
                <Button onClick={() => setView(view === 'add' ? 'detail' : 'add')}>{view === 'add' ? 'Close' : 'Add'}</Button>
            </div>

            <div className="DetailContainer">
                {view === 'detail' && selectedItem && (
                    <Detail selectedItem={selectedItem} onDelete={handleDeleteExpense} onSetView={setView} />
                )}
                {view === 'add' && <AddForm categories={categories} onAddItem={handleAddExpense} nextId={nextId} />}
                {view === 'update' && selectedItem && (
                    <UpdateForm selectedItem={selectedItem} onUpdate={handleUpdateExpense} onCancel={() => setView('detail')} />
                )}
            </div>

            <div className="CountByCategoryContainer">
                <CountByCategory
                    onSelected={setSelectedItem}
                    expenses={expenses}
                    categories={categories}
                    selectedItem={selectedItem}
                />
            </div>
        </div>
    );
}

export default App;
