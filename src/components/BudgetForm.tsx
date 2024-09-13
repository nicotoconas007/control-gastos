import { ChangeEvent, useMemo, useState } from "react"

export default function BudgetForm() {

    const [budget, setBudget] = useState(0)

    const handleChange = (e : ChangeEvent<HTMLInputElement>) => {
        setBudget(e.target.valueAsNumber)
    }

    const isValid = useMemo(() => {
        return isNaN(budget) || budget <= 0
    } , [budget])

    return (
        <form className="space-y-5"> 
            <div className="flex flex-col space-y-5">
                <label htmlFor="budget" className="text-4xl text-slate-700 font-bold text-center">
                    Definir presupuesto
                </label>
                <input 
                id="budget"
                type="number"
                className="w-full bg-white border border-gray-200 p-2"
                placeholder="Define tu presupuesto"
                name="budget"
                value={budget}
                onChange={handleChange}
                />
            </div> 

            <input 
                type="submit"
                className="bg-slate-600 hover:bg-slate-950 cursor-pointer w-full p-2 text-white font-black uppercase disabled:opacity-10"
                value="Definir Presupuesto"
                disabled={isValid}
                />  
        </form>
    )
}
