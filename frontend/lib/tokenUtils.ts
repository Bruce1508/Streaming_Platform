export const getValidToken = (): string | null => {
    // Try localStorage first
    const storageToken = localStorage.getItem("auth_token");
    if (storageToken && storageToken !== 'null' && storageToken !== 'undefined') {
        return typeof storageToken === 'string' ? storageToken : String(storageToken);
    }

    return null;
}



