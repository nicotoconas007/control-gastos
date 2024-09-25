import { categories } from '../data/categories';
import type { DraftExpense, Value } from '../types';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import ErrorMessage from './ErrorMessage';
import { useBudget } from '../hooks/useBudget';


export default function ExpenseForm() {

    const [expense, setExpense] = useState<DraftExpense>({
        amount: 0,
        expenseName:"",
        category: "",
        date: new Date()
    })

    const [error, setError] = useState('')
    const [previousAmount, setPreviousAmount] = useState(0)
    const { dispatch, state, remainingBudget } = useBudget()


    useEffect(() => {
        if(state.editingId) {
            const editingExpense = state.expenses.filter( currentExpense => currentExpense.id === state.editingId )[0]
            setExpense(editingExpense)
            setPreviousAmount(editingExpense.amount)
        }
    }, [state.editingId])

    const handleChangeDate = (value : Value) => {
        setExpense({
            ...expense,
            date: value
        })
    }

    const handleChange = (e : ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target
        const isAmountField = ['amount'].includes(name)
        setExpense({
            ...expense,
            [name] : isAmountField ? +value : value // + para convertir en number
        })
    }

    const handleSubmit = (e : FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        //Validar
        if(Object.values(expense).includes('') || Object.values(expense).includes(null)) { //Buscar vacios. && errorMessage equivale a ?? || ErrorMessage es children.
            setError("Todos los campos son obligatorios")
            return
        }

        //Validar q no se pase del presupuesto
        if((expense.amount - previousAmount) > remainingBudget) { //Buscar vacios. && errorMessage equivale a ?? || ErrorMessage es children.
            setError("Ese gasto es superior al presupuesto")
            return
        }

        //Agregar o editar nuevo gasto
        if(state.editingId) {
            dispatch({type: "update-expense", payload: {expense : {id: state.editingId, ...expense}}})
        } else {
            dispatch({type: "add-expense", payload: {expense}})
        }

        setExpense({
            amount: 0,
            expenseName: "",
            category: "",
            date: new Date()
        })

        setPreviousAmount(0)
    }

  return (
    <form className='space-y-5' onSubmit={handleSubmit}>
        <legend className='uppercase text-center text-2xl font-black border-b-4 py-2 border-blue-500'>
           {!state.editingId ? "Nuevo Gasto" : "Editar Gasto"} 
        </legend>

        {error && <ErrorMessage> {error} </ErrorMessage>}

        <div className='flex flex-col gap-2'>
            <label htmlFor="expenseName" className='text-xl'>
                Nombre Gasto: 
            </label>
            <input 
                type="text" 
                id='expenseName'
                placeholder='Añade el nombre del gasto'
                className='bg-slate-100 p-2'
                name='expenseName'
                value={expense.expenseName}
                onChange={handleChange}
            />
        </div>
        <div className='flex flex-col gap-2'>
            <label htmlFor="amount" className='text-xl'>
                Cantidad: 
            </label>
            <input 
                type="number" 
                id='amount'
                placeholder='Añade la cantidad del gasto: ej. 300'
                className='bg-slate-100 p-2'
                name='amount'
                value={expense.amount}
                onChange={handleChange}
            />
        </div>
        <div className='flex flex-col gap-2'>
            <label htmlFor="amount" className='text-xl'>
                Cantidad: 
            </label>
            <select
                id='category'
                className='bg-slate-100 p-2'
                name='category'
                value={expense.category}
                onChange={handleChange}
            >
                <option value="">-- Seleccione --</option>
                {categories.map(category => (
                    <option
                        key={category.id}
                        value={category.id}
                    >
                        {category.name}
                    </option>
                ))}
            </select>
        </div>

        <div className='flex flex-col gap-2'>
            <label htmlFor="expenseName" className='text-xl'>
                Fecha Gasto: 
            </label>
            <DatePicker 
                className="bg-slate-100 p-2 border-0"
                value={expense.date}
                onChange={handleChangeDate}    
            />
        </div>

        <input 
            type="submit" 
            className='bg-blue-400 cursor-pointer w-full p-2 text-white uppercase font-bold rounded-lg'
            value={state.editingId ? "Editar Gasto" : "Registrar gasto"}
        />
    </form>
  )
}
