import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="mb-6 text-2xl font-bold">商品搜尋</h1>
      <Link className="text-momo underline" href="/search?q=iphone+17+pro">搜尋 iPhone 17 Pro</Link>
    </main>
  );
}
