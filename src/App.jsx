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
function NameTable({ expenses, onSelected, selectedItem, children }) {
    return (
        <div>
            {children}
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
function Detail({ selectedItem, children }) {
    return (
        <div className="Detail">
            {children[0]}
            <ul>
                {Object.entries(selectedItem).map(([key, value]) => (
                    <li key={key}>{key}: {value}</li>
                ))}
            </ul>
            {children[1]}
            {children[2]}
        </div>
    );
}

// Renders a summary by category
function CountByCategory({ expenses, categories, onSelected, selectedItem, words }) {
    const [selectedCategory, setSelectedCategory] = useState(null);

    const handleClose = () => setSelectedCategory(null);

    return (
        <div>
            <p className="SectionTitle">{selectedCategory ? words.nameByCategory : words.countByCategory}</p>
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
                    onSelected={onSelected}
                    selectedItem={selectedItem}
                >
                    <Button onClick={() => handleClose(null)}>{words.close}</Button>
                </FilterByCategory>
            )}
        </div>
    );
}

// Filtered view by selected category
function FilterByCategory({ onSelected, selectedCategory, expenses, children, selectedItem }) {
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
            {children}
        </div>
    );
}

// Form to add a new expense
function AddForm({ categories, onAddItem, nextId, children }) {
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
                {children}
            </form>
        </div>
    );
}

// Form to update an expense
function UpdateForm({ selectedItem, onUpdate, children }) {
    const [name, setName] = useState(selectedItem.name);
    const [amount, setAmount] = useState(selectedItem.amount);
    const [category, setCategory] = useState(selectedItem.category);

    function handleSubmit(e) {
        e.preventDefault();
        const newExpense = {
            id: selectedItem.id,
            name: name,
            amount: amount,
            category: category,
        }

        onUpdate(newExpense);
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
                {children}
            </form>
        </div>
    );
}

function LanguageChoice({ onSetLanguage, language } ) {
    return (
        <select
            className={'language-choice'}
            onChange={e => onSetLanguage(e.target.value)}
            value={language}
        >
            <option value="english">English</option>
            <option value="chinese">中文</option>
        </select>
    )
}

const localeWords = {
    english: {
        name: 'Name',
        detail: 'Detail',
        countByCategory: 'CountByCategory',
        nameByCategory: 'NameByCategory',
        add: 'Add',
        update: 'Update',
        delete: 'Delete',
        close: 'Close',
        cancel: 'Cancel',
    },
    chinese: {
        name: "名称",
        detail: "详情",
        countByCategory: "按类别统计",
        nameByCategory: '按类别分类',
        add: "添加",
        update: "更新",
        delete: "删除",
        close: "关闭",
        cancel: "取消"
    }
}

function App() {
    const [language, setLanguage] = useState('english');
    const [view, setView] = useState('detail');
    const [expenses, setExpenses] = useState(initialData);
    const [selectedItem, setSelectedItem] = useState(expenses[0]);

    const nextId = expenses.length + 1;
    const words = localeWords[language];

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

    function handleUpdateExpense(newExpense) {
        // Create a new array with updated expense values
        const updateExpenses = expenses.map(expense =>
            expense.id === newExpense.id
                ? { ...expense, name: newExpense.name, amount: Number(newExpense.amount), category: newExpense.category }
                : expense
        );

        // Update the state with the modified expenses array
        setExpenses(updateExpenses);

        // Optionally set the view to 'detail'
        setView('detail');
        setSelectedItem(newExpense);
    }

    return (
        <div className="App">
            <LanguageChoice language={language} onSetLanguage={setLanguage}/>
            <div className="MainTableContainer">
                <NameTable
                    selectedItem={selectedItem}
                    expenses={expenses}
                    onSelected={setSelectedItem}
                >
                    <p className="SectionTitle">{words.name}</p>
                </NameTable>
                <Button onClick={() => setView(view === 'add' ? 'detail' : 'add')}>
                    {view === 'add' ? words.close : words.add}
                </Button>
            </div>

            <div className="DetailContainer">
                {view === 'detail' && selectedItem && (
                    <Detail selectedItem={selectedItem}>
                        <p className="SectionTitle">{words.detail}</p>
                        <Button onClick={() => setView('update')}>{words.update}</Button>
                        <Button onClick={() => handleDeleteExpense(selectedItem.id)}>{words.delete}</Button>
                    </Detail>
                )}
                {view === 'add' &&
                    <AddForm categories={categories} onAddItem={handleAddExpense} nextId={nextId}>
                        <Button>{words.add}</Button>
                    </AddForm>}
                {view === 'update' && selectedItem && (
                    <UpdateForm selectedItem={selectedItem} onUpdate={handleUpdateExpense}>
                        <Button>{words.update}</Button>
                        <Button onClick={() => setView('detail')}>{words.cancel}</Button>
                    </UpdateForm>
                )}
            </div>

            <div className="CountByCategoryContainer">
                <CountByCategory
                    onSelected={setSelectedItem}
                    expenses={expenses}
                    categories={categories}
                    selectedItem={selectedItem}
                    words={words}
                />
            </div>
        </div>
    );
}

export default App;
