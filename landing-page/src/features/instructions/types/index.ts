/**
 * Instruction Step - Represents a step in the usage guide
 */
export interface InstructionStep {
    id: string;
    step: number;
    title: string;
    description: string;
    imageAlt: string;
}

/**
 * Keyboard Shortcut
 */
export interface KeyboardShortcut {
    key: string;
    description: string;
    global: boolean;
}
