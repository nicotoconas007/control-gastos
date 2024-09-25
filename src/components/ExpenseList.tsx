import { useBudget } from "../hooks/useBudget"
import { useMemo } from "react"
import ExpenseDetail from "./ExpenseDetail"
import { categories } from "../data/categories"


export default function ExpenseList() {

    const{ state } = useBudget()
    const filteredExpenses = state.currentCategory ? state.expenses.filter( expense => expense.category === state.currentCategory) : state.expenses // Filtrar expensas por category y luego map
    const isEmpty = useMemo(() => filteredExpenses.length === 0, [filteredExpenses])
    const categoryName = useMemo(() => {
        if (!state.currentCategory) return "Listado de Gastos"; 
        const category = categories.find((cat) => cat.id === state.currentCategory);
        return category ? category.name : "Categoría no encontrada";
      }, [state.currentCategory]);

    return (
        <div className="mt-10 bg-white shadow-lg rounded-lg p-10">
            {isEmpty ? <p className="text-gray-600 text-2xl font-bold">No hay gastos</p> : (
                <>
                    <p className="text-gray-600 text-2xl font-bold my-5">{categoryName}</p>
                    {filteredExpenses.map( expense => (
                        <ExpenseDetail 
                            key={expense.id}
                            expense={expense}
                        />
                    ))}             
                </>
            )}
        </div>
    )
}
