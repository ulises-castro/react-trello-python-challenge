import { clsx, type ClassValue } from "clsx"
import { ErrorInfo } from "react";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const logErrorToSentry = (error: Error, info: ErrorInfo) => {
	console.error(error, info)
};
