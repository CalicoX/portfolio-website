import { useEffect, useCallback } from 'react';

// Secret shortcut: Ctrl+Shift+A (or Cmd+Shift+A on Mac)
export const useAdminShortcut = (onSuccess: () => void) => {
    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            // Check for Ctrl+Shift+A or Cmd+Shift+A
            if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 'a') {
                event.preventDefault();
                onSuccess();
            }
        },
        [onSuccess]
    );

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
};

export default useAdminShortcut;

