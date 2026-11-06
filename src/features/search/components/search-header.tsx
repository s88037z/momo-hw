import Link from "next/link";
import type { FormEvent } from "react";

const departments = ["3C", "家電", "美妝個清", "保健/食品", "流行時尚", "精品配飾", "母嬰用品", "圖書文具", "傢寢運動", "日用生活", "旅遊戶外"];
const utilities = ["登入", "註冊", "會員中心", "查訂單", "追蹤清單", "折價券", "購物車(0)"];

interface SearchHeaderProps {
  query: string;
  onQueryChange?: (value: string) => void;
  onSearch?: () => void;
}

export function SearchHeader({ query, onQueryChange, onSearch }: SearchHeaderProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch?.();
  }

  return (
    <header>
      <div className="bg-[#ededed]">
        <div className="page-container flex min-h-12 items-center justify-between gap-5 py-2 lg:min-h-10 lg:py-1">
          <div className="flex min-w-0 flex-1 items-center gap-3 lg:max-w-[510px]">
            <Link href="/" className="flex shrink-0 items-center gap-1.5 text-sm font-bold text-black">
              <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 11 9-2 2-2-1.6V22h-5v-7h-4v7H5V11.4L3 13l-2-2L12 2Z" /></svg>
              回首頁
            </Link>
            <form role="search" className="flex min-w-0 flex-1 overflow-hidden rounded-full bg-white" onSubmit={handleSubmit}>
              <label htmlFor="site-search" className="sr-only">搜尋商品</label>
              <input id="site-search" type="search" value={query} onChange={(event) => onQueryChange?.(event.target.value)} disabled={!onQueryChange} className="min-w-0 flex-1 bg-white px-3 py-1.5 text-sm text-[#777] disabled:opacity-100" />
              <button type="submit" disabled={!onSearch} className="shrink-0 bg-[#999] px-5 py-1.5 text-sm font-bold text-white disabled:cursor-not-allowed">搜尋</button>
            </form>
          </div>
          <div className="hidden shrink-0 items-center text-xs xl:flex">
            {utilities.map((item) => <span key={item} className="border-r border-[#888] px-2 last:border-0">{item}</span>)}
          </div>
        </div>
      </div>
      <div className="page-container hidden h-6 items-center justify-end gap-6 overflow-hidden text-xs text-[#555] lg:flex" aria-hidden="true">
        {["moPro訂閱", "mo店+", "重磅新品", "樂公益", "保險館", "看看買", "芬火靚", "品牌旗艦", "綠色生活"].map((item) => <span key={item} className="shrink-0">{item}</span>)}
      </div>
      <div className="bg-[#505050] text-white">
        <div className="page-container overflow-x-auto py-2.5">
          <ul aria-label="商品分類" className="flex min-w-max items-center lg:min-w-0">
            {departments.map((department) => <li key={department} className="flex-1 border-r border-[#888] px-4 text-center text-sm whitespace-nowrap last:border-0 lg:px-2 lg:text-base">{department}</li>)}
          </ul>
        </div>
      </div>
    </header>
  );
}
