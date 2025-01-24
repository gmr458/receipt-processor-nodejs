export class Validator {
    private _errors: Record<string, string[]>;

    constructor() {
        this._errors = {};
    }

    get errors(): Record<string, string[]> {
        return this._errors;
    }

    get ok(): boolean {
        return Object.keys(this._errors).length === 0;
    }

    get errorsLength(): number {
        return Object.keys(this._errors).length;
    }

    public addError(cause: string, detail: string) {
        if (!this._errors[cause]) {
            this._errors[cause] = [detail];
        } else {
            this._errors[cause].push(detail);
        }
    }

    public check(cases: Case[]) {
        for (const c of cases) {
            if (typeof c.ok === "boolean" ? !c.ok : !c.ok()) {
                this.addError(c.cause, c.detail);
            }
        }
    }

    public reset(): void {
        this._errors = {};
    }

    printErrors() {
        for (const cause in this._errors) {
            const details = this.errors[cause];
            if (details) {
                for (const detail of details) {
                    console.log(`Error: ${detail}`);
                }
            }
        }
    }
}

export type Case = {
    ok: boolean | (() => boolean);
    cause: string;
    detail: string;
};

export function isAlphanumeric(char: string): boolean {
    if (char.length === 0 || char.length > 1) {
        throw new Error("Invalid char");
    }

    const code = char.charCodeAt(0);

    return (
        (code >= 48 && code <= 57) ||
        (code >= 65 && code <= 90) ||
        (code >= 97 && code <= 122)
    );
}

export function hasZeroDecimal(num: number): boolean {
    return num % 1 === 0;
}

export function xIsMultipleOfy(x: number, y: number): boolean {
    return x % y === 0;
}

export function isOdd(num: number): boolean {
    return num % 2 !== 0;
}

export function isNum(num: any) {
    if (typeof num === "number") {
        return num - num === 0;
    }
    if (typeof num === "string" && num.trim() !== "") {
        return Number.isFinite ? Number.isFinite(+num) : isFinite(+num);
    }
    return false;
}
