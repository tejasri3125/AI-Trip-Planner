import React from "react";
import { DollarSign, Landmark, Utensils, Compass, Car, Sparkles } from "lucide-react";

export default function BudgetCard({ budgetBreakdown, totalCost, budgetCategory }) {
  if (!budgetBreakdown) return null;

  const { hotels, food, transport, activities, miscellaneous } = budgetBreakdown;

  const categories = [
    { name: "Hotels / Lodging", amount: hotels, icon: <Landmark className="h-4 w-4 text-amber-500" />, color: "bg-amber-500" },
    { name: "Food & Dining", amount: food, icon: <Utensils className="h-4 w-4 text-emerald-500" />, color: "bg-emerald-500" },
    { name: "Local Transport", amount: transport, icon: <Car className="h-4 w-4 text-blue-500" />, color: "bg-blue-500" },
    { name: "Activities & Entry Tickets", amount: activities, icon: <Compass className="h-4 w-4 text-purple-500" />, color: "bg-purple-500" },
    { name: "Miscellaneous", amount: miscellaneous, icon: <Sparkles className="h-4 w-4 text-slate-500" />, color: "bg-slate-500" }
  ];

  return (
    <div className="glass-card p-6 rounded-2xl glow-card relative overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full">
            Cost Estimator ({budgetCategory})
          </span>
          <h3 className="text-3xl font-extrabold text-slate-800 dark:text-white mt-3 flex items-center">
            <DollarSign className="h-7 w-7 text-emerald-500 -ml-1" />
            {totalCost.toLocaleString()}
          </h3>
        </div>
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-2xl font-bold text-sm">
          Total Est.
        </div>
      </div>

      <div className="space-y-4">
        {categories.map((cat, idx) => {
          const percentage = totalCost > 0 ? (cat.amount / totalCost) * 100 : 0;
          return (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between items-center text-sm font-semibold text-slate-700 dark:text-slate-200">
                <div className="flex items-center gap-2">
                  {cat.icon}
                  <span>{cat.name}</span>
                </div>
                <span>${cat.amount.toLocaleString()}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${cat.color}`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
