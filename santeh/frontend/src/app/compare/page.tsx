"use client";
import Header from "@/components/Header";
import { useStore } from "@/context/StoreContext";

export default function ComparePage() {
  const { compare } = useStore();
  const allSpecKeys = Array.from(new Set(compare.flatMap((p) => Object.keys(p.specs))));

  return (
    <div>
      <Header />
      <main className="max-w-7xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Сравнение товаров ({compare.length})</h1>
        {compare.length === 0 ? (
          <div className="bg-white p-8 rounded-xl text-gray-500">Добавьте товары для сравнения из каталога</div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="p-4 w-48 text-gray-400">Характеристика</th>
                  {compare.map((p) => (
                    <th key={p.id} className="p-4 min-w-[220px]">
                      <div className="font-bold">{p.name}</div>
                      <div className="text-orange-500 text-lg mt-1">{p.price.toLocaleString()} ₽</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-4 text-gray-500">Бренд</td>
                  {compare.map((p) => <td key={p.id} className="p-4 font-medium">{p.brand}</td>)}
                </tr>
                {allSpecKeys.map((key) => (
                  <tr key={key} className="border-b">
                    <td className="p-4 text-gray-500">{key}</td>
                    {compare.map((p) => <td key={p.id} className="p-4">{p.specs[key] || "—"}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
