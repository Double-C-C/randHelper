import { useSyncExternalStore} from "react";

export type HistoryItem = {
    id:string;
    name:string;
    path:string;
    at:string;
};

type State = {
    tab: "number" | "file";
    dir:string;
    exts:string;
    picked:string;
    history:History
};

