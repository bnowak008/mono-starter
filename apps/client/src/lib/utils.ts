import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import { formatDistanceToNow as dateFnsFormatDistanceToNow } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getThemeColor(color: string, shade: number = 500): string {
  const root = document.documentElement
  const value = getComputedStyle(root).getPropertyValue(`--${color}-${shade}`).trim()
  return `rgb(${value})`
}

export function isDarkMode(): boolean {
  if (typeof window === 'undefined') return false
  return document.documentElement.classList.contains('dark')
} 

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export function formatDateShort(date: string): string {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export const formatDistanceToNow = (date: string | Date) => {
  return dateFnsFormatDistanceToNow(new Date(date), { addSuffix: false });
};