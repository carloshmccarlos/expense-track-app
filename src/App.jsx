import './App.css';
import {useState} from "react";
import {initialData, categories} from "../public/data.js";

function NameTable({ expenses, onSelected, selectedItem }) {

    return (
        <div>
            <p className="SectionTitle">Name</p>
            <ul className="MainTable">
                {expenses.map(expense => (
                    <li onClick={() => onSelected(expense)} key={expense.id}
                        className={`Item ${selectedItem.id === expense.id ? 'selected' : ''}`}>
                        {expense.id} : {expense.name}

                    </li>
                ))}
            </ul>
        </div>
    )
}

function Button({children, onClick}) {
    return (
        <button onClick={onClick} className="Button">{children}</button>
    )
}

function Detail({selectedItem, onDelete, onSetWhichIsToShow }) {
    return (
        <div className="Detail">
            <p className="SectionTitle">Detail</p>
            <ul>
            <li>id: {selectedItem.id}</li>
                <li>name: {selectedItem.name}</li>
                <li>amount: {selectedItem.amount}</li>
                <li>category: {selectedItem.category}</li>
            </ul>
            <Button onClick={() => onSetWhichIsToShow('update')}>Update</Button>
            <Button onClick={() => onDelete(selectedItem.id)}>Delete</Button>
        </div>
    )
}

function CountByCateGory({expenses, categories }) {
    const [selectedCategory, setSelectedCategory] = useState(null);

    return (
        <div>
            {!selectedCategory ?
                <p className="SectionTitle">CountByCategory</p>:
                <p className="SectionTitle">DetailByCategory</p>
            }

            {
                    !selectedCategory ?
                        <ul className="CountByCategory">
                            {categories.map(category => (
                                <li onClick={() => setSelectedCategory(category)} value={category} key={category}
                                    className={'Item'}>
                                    {category}: {
                                    expenses.filter(expense => expense.category === category)
                                        .reduce((count, expense) => count + expense.amount, 0)
                                }
                                    $
                                </li>
                            ))}
                        </ul> :
                        <FilterByCategory
                            selectedCategory={selectedCategory}
                            expenses={expenses}
                            onClose={setSelectedCategory}
                        />
            }
        </div>
    )
}

function FilterByCategory({selectedCategory, expenses, onClose}) {
    const expensesFiltered = expenses.filter(expense => expense.category === selectedCategory);

    return (
        <div>
            <div className="MainTable">
                <ul>
                    {expensesFiltered.map(expense => (
                        <li key={expense.id}>
                            {expense.name} : {expense.amount}
                        </li>
                    ))}
                </ul>

            </div>
            <Button onClick={() => onClose(null)}>Close</Button>
        </div>
    )
}

function AddForm({categories, onAddItem}) {
    const [newName, setNewName] = useState('');
    const [newCount, setNewCount] = useState('');
    const [newCategory, setNewCategory] = useState('Food');

    function handleSubmit(e) {
        e.preventDefault();

        if (!newName || !newCategory || !newCount) {
            return null;
        }

        const newExpense = {
            id: crypto.randomUUID(),
            name: newName,
            amount: Number(newCount),
            category: newCategory,
        }

        onAddItem(newExpense);
    }

    return (
        <div>
            <p className="SectionTitle">Add</p>
            <form onSubmit={handleSubmit} className="AddForm">
                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        onChange={e => setNewName(e.target.value)}
                        value={newName}
                        className="Input"
                    />
                </div>

                <div>
                    <label>Count</label>
                    <input onChange={e => setNewCount(e.target.value)}
                           type="text"
                           value={newCount}
                           className="Input"
                    />
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
    )
}

function UpdateForm({ selectedItem, onUpdate }) {
    const [newName, setNewName] = useState(selectedItem.name);
    const [newCount, setNewCount] = useState(selectedItem.amount);
    const [newCategory, setNewCategory] = useState(selectedItem.category);

    function handleSubmit(e) {
        e.preventDefault();

        if (!newName || !newCount || !newCategory) {
            return null;
        }

        const newExpense = {
            id: selectedItem.id,
            name: newName,
            amount: Number(newCount),
            category: newCategory,
        }

        onUpdate(newExpense);
    }

    return (
        <div>
            <p className="SectionTitle">Update</p>
            <form onSubmit={handleSubmit} className="AddForm">
                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        onChange={e => setNewName(e.target.value)}
                        value={newName}
                        className="Input"
                    />
                </div>

                <div>
                    <label>Count</label>
                    <input onChange={e => setNewCount(e.target.value)}
                           type="text"
                           value={newCount}
                           className="Input"
                    />
                </div>

                <div>
                    <label>Category</label>
                    <select value={newCategory} onChange={e => setNewCategory(e.target.value)} className="Input">
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                </div>

                <Button>Update</Button>
            </form>
        </div>
    )
}

function App() {
    const [whichIsToShow, setWhichIsToShow] = useState('detail');
    const [expenses, setExpenses] = useState(initialData);
    const [selectedItem, setSelectedItem] = useState(expenses[0]);

    function handleSelected(expense) {
        setSelectedItem(expense);
        setWhichIsToShow('detail');
    }


    function handleAddToShow() {
        if (whichIsToShow === 'add') {
            setWhichIsToShow('detail');
            return;
        }

        setWhichIsToShow('add');
    }

    function handleDeleteExpense(id) {
        const updatedExpense = expenses.filter(expense => expense.id !== id);

        setExpenses(updatedExpense);
        setSelectedItem(updatedExpense[0]);

    }

    function handleAddItem(newExpense) {
        const updatedExpense = [...expenses, newExpense];

        setExpenses(updatedExpense);
        setSelectedItem(updatedExpense[updatedExpense.length - 1]);

        setWhichIsToShow('detail');
    }

    function handleUpdate(newExpense) {
        const updatedExpense = [...expenses];

        const selectedExpense = updatedExpense.find(
            expense => expense.id === newExpense.id
        );

        selectedExpense.name = newExpense.name;
        selectedExpense.amount = Number(newExpense.amount);
        selectedExpense.category = newExpense.category;

        setExpenses(updatedExpense);

        setWhichIsToShow('detail');
    }

    return (
        <div className="App">
            <div className="MainTableContainer">

                <NameTable
                    selectedItem={selectedItem}
                    expenses={expenses}
                    onSelected={handleSelected}
                />
                <Button onClick={handleAddToShow}>
                    { whichIsToShow === 'add' && 'Close'}
                    { whichIsToShow === 'detail' && 'Add'}
                    { whichIsToShow === 'update' && 'Update'}
                </Button>
            </div>

            <div className="DetailContainer">

                { whichIsToShow === 'detail' &&
                    <Detail
                        selectedItem={selectedItem}
                        onDelete={handleDeleteExpense}
                        onSetWhichIsToShow={setWhichIsToShow}
                    /> }
                { whichIsToShow === 'add' &&
                    <AddForm
                        categories={categories}
                        onAddItem={handleAddItem}
                    /> }

                { whichIsToShow === 'update' &&
                    <UpdateForm
                        selectedItem={selectedItem}
                        onUpdate={handleUpdate}
                    /> }
            </div>

            <div className="CountByCategoryContainer">

                <CountByCateGory
                    expenses={expenses}
                    categories={categories}
                />
            </div>
        </div>
    )
}

export default App;
