"use client";
import Link from "next/link";
import { Search, BarChart2, Heart, ShoppingCart, Menu, ShieldCheck } from "lucide-react";
import { useStore } from "@/context/StoreContext";

export default function Header({ onSearch }: { onSearch?: (q: string) => void }) {
  const { cart, favorites, compare } = useStore();
  const totalCartItems = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="bg-gray-100 text-xs text-gray-600 py-1.5 border-b">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex gap-4">
            <span>Город: <strong className="text-black">Москва</strong></span>
            <span>Магазины</span>
            <span>Доставка</span>
            <span>Юрлицам</span>
          </div>
          <Link href="/admin" className="flex items-center gap-1 text-orange-600 font-bold hover:underline">
            <ShieldCheck size={14} /> Панель администратора
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-6">
        <Link href="/" className="text-2xl font-black tracking-tight text-orange-500">
          САНТЕХ<span className="text-gray-900">DNS</span>
        </Link>

        <Link href="/" className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-lg transition">
          <Menu size={20} />
          <span>Каталог</span>
        </Link>

        <div className="flex-1 relative">
          <input
            type="text"
            onChange={(e) => onSearch && onSearch(e.target.value)}
            placeholder="Поиск по сайту (смесители Grohe, ванны, унитазы...)"
            className="w-full bg-gray-100 focus:bg-white border border-transparent focus:border-orange-500 rounded-lg py-2.5 px-4 outline-none transition"
          />
          <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
        </div>

        <div className="flex items-center gap-5 text-sm text-gray-700">
          <Link href="/compare" className="flex flex-col items-center hover:text-orange-500 relative">
            <BarChart2 size={22} />
            <span className="text-xs mt-1">Сравнение</span>
            {compare.length > 0 && <span className="absolute -top-1 -right-2 bg-orange-500 text-white text-[10px] px-1.5 rounded-full">{compare.length}</span>}
          </Link>
          <div className="flex flex-col items-center hover:text-orange-500 relative cursor-pointer">
            <Heart size={22} />
            <span className="text-xs mt-1">Избранное</span>
            {favorites.length > 0 && <span className="absolute -top-1 -right-2 bg-orange-500 text-white text-[10px] px-1.5 rounded-full">{favorites.length}</span>}
          </div>
          <Link href="/cart" className="flex flex-col items-center hover:text-orange-500 relative">
            <ShoppingCart size={22} />
            <span className="text-xs mt-1">Корзина</span>
            {totalCartItems > 0 && <span className="absolute -top-1 -right-2 bg-orange-500 text-white text-[10px] px-1.5 rounded-full">{totalCartItems}</span>}
          </Link>
        </div>
      </div>
    </header>
  );
}
