# Expense Tracker App

This application is a simple, tiny, multilingual 
(English/Chinese) expense tracker, built using React + Vite,
It is for me to practice using the hook of 'useState',
and the hook used in this project is 'useState' only,
so it's very suitable for those React beginner who yet learn 
other intermediate hooks to practice with.
It provides users with the ability to add, update, 
and view expenses, as well as summarize them by 
category. The app maintains a structured UI with 
several interactive components, allowing for 
straightforward tracking and management of personal
finances.
Please do not pay your attention on the css, I made it with Chatgpt,
so the css class name is not standard like starting with a lowercase letter 
and being seperated with '-' between the words.I will improve it of course 
after I learn the tailwind css.
I am still learning, so I will improve this project in the future 
with some more powerful hooks and add the backend on it,but I keep this first version
which is with 'useState' only.

The demo link: https://www.carloshmccarlos.dynv6.net/

## Table of Contents
- [Features](#features)
- [Components](#components)
- [State Management](#state-management)
- [Localization](#localization)
- [Usage](#usage)

---

## Features

1. **Expense Listing**: Displays all expenses with details like name and amount.
2. **Detailed View**: Users can select an expense to view its detailed information.
3. **Add Expense**: Provides a form to add a new expense with fields for name, amount, and category.
4. **Update Expense**: Allows updating of existing expense details.
5. **Delete Expense**: Enables deletion of an expense.
6. **Summary by Category**: Summarizes total expenses by each category.
7. **Language Selection**: Supports English and Chinese language options.

## Components

1. **App**: Main application component managing the overall state.
2. **Button**: A reusable button component.
3. **LanguageChoice**: Dropdown for selecting language (English/Chinese).
4. **NameTable**: Lists all expense names with selectable items.
5. **Detail**: Displays detailed information for the selected expense.
6. **CountByCategory**: Displays a summary of expenses by category, showing total amounts for each.
7. **FilterByCategory**: Filters and displays expenses within a selected category.
8. **AddForm**: Form component for adding a new expense.
9. **UpdateForm**: Form component for updating an existing expense.

## State Management

The following state variables are used in the `App` component:

- `language`: Tracks the selected language.
- `view`: Controls the current view ("add", "update", or "detail").
- `expenses`: Stores the list of all expenses.
- `selectedItem`: Tracks the currently selected expense.
- `nextId`: Provides the next ID for new expenses.

## Localization

The `localeWords` object provides translations for text elements in English and Chinese. The `LanguageChoice` component allows users to switch between languages dynamically.

## Usage

1. **To Add an Expense**:
    - Click on the "Add" button to display the add form.
    - Fill in the details and submit the form.

2. **To Update an Expense**:
    - Select an expense from the list to view its details.
    - Click "Update" to modify details and submit.

3. **To Delete an Expense**:
    - Select an expense from the list to view its details.
    - Click "Delete" to remove it.

4. **To View Expenses by Category**:
    - Scroll to the "Count By Category" section.
    - Click on a category to filter and view expenses specific to that category.

5. **To Change Language**:
    - Select a language from the dropdown at the top of the application.

---

This app is designed to help users manage personal expenses in an 
intuitive, multilingual environment, with key functionalities 
such as adding, updating, and filtering by category.