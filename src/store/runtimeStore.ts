import { useSyncExternalStore} from "react";

export type HistoryItem = {
    name:string;
    path:string;
    at:string;
};

type State = {
    tab: "number" | "file";
    dir:string;
    exts:string;
    picked:string;
    history:HistoryItem[]
};

let state: State = {
    tab: "file",
    dir: "",
    exts: ".jpg,.png",
    picked: "",
    history: [],
};

const listeners = new Set<() => void>();
const emit = () => listeners.forEach(l => l());

export function useStore<T>(selector: (S: State) => T): T{
    return useSyncExternalStore(
        (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
        () => selector(state),
        () => selector(state)
    );
}

export function getState() {
    return state;
}

export function setState(patch:Partial<State>) {
    state = { ...state, ...patch };
    emit();
}

export function pushHistory(item: HistoryItem) {
    const next = [item, ...state.history.filter(h => h.path !== item.path)].slice(0, 5);
    state = { ...state, history: next };
    emit();
}