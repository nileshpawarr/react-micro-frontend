declare module 'host/store' {
    export interface StoreHook {
        count: number;
        increment: () => void;
        clear: () => void;
    }

    const useStore: () => StoreHook;
    export default useStore;
}