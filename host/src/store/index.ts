import { create } from 'zustand'

interface Store {
    count: number
    increment: () => void
}

const useStore = create<Store>((set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
    clear: () => set({ count: 0 }),
}))

export default useStore;

