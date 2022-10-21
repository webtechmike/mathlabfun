export function useFocus(id: string): () => void {
    return () => document.getElementById(id)?.focus();
}

export default useFocus;
