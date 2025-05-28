interface CapitalizeFunction {
    (str: string): string;
}

export const capitialize: CapitalizeFunction = (str) => str.charAt(0).toUpperCase() + str.slice(1);