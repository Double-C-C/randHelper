import { File } from "lucide-react";

type HistoryItem = {
    id:string;
    name:string;
    path:string;
    at:string;
}

export default function RandomFileHistory() {

const items:HistoryItem[] = [
    {id:"1",name:"test1.png",path:"D:/draws/bag/test1.png",at:"now"},
    {id:"2",name:"test2.png",path:"D:/draws/bag/test2.png",at:"now"},
        {id:"3",name:"test3.png",path:"D:/draws/bag/test3.png",at:"now"}
];


    return(
        <section className="mt-5">
            <div className="mt-3 flex justify-between items-center">
                <h3 className="text-sm font-semibold text-gray-700 ">
                前五次随机历史
                </h3>
            <button className="rounded-2xl border border-slate-400 p-2 text-sm text-gray-500 bg-white">
                清空
            </button>
            </div>

<ul className="rounded-lg border border-slate-200 bg-white my-3">
    {items.length === 0 ? (
        <li className="p-4 text-sm text-slate-500 ">暂无历史</li>):
        (
            items.map((it) => (
                <li key={it.id} className="p-3 flex items-center gap-3">
                    <div className="w-8 h-8 shrink-0 grid place-items-center rounded bg-slate-100 text-slate-500"><File/></div>
                
                <div className="min-w-0 flex-1 flex-col ">
                    <div className="truncate font-medium text-slate-900">{it.name}</div>
                    <div className="truncate text-xs text-slate-500">{it.path}</div>
                </div>

                <div className="hidden md:block text-xs text-slate-400 mr-2 whitespace-nowrap">
                    {it.at}
                </div>

                <div className="flex gap-2">
                    <button className="px-2 py-1 text-xs rounded border border-sky-100 bg-white text-slate-500 hover:border-slate-300">
                        打开
                    </button>
                                        <button className="px-2 py-1 text-xs rounded border border-sky-100 bg-white text-slate-500 hover:border-slate-300">
                        位置
                    </button>
                </div>
                </li>
            ))
        )}
 
</ul>
            
        </section>
    )
}