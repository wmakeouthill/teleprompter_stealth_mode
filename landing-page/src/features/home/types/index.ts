/**
 * Use Case - Represents a teleprompter use case scenario
 */
export interface UseCase {
    id: string;
    icon: string;
    title: string;
    description: string;
}

/**
 * Feature - Represents an app feature
 */
export interface Feature {
    id: string;
    icon: string;
    title: string;
    description: string;
}

/**
 * Download Info
 */
export interface DownloadInfo {
    url: string;
    version: string;
    platform: string;
    requirements: string[];
}
