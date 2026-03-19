import { format, formatDistanceToNow, parseISO } from "date-fns";

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "No date";
  try {
    return format(parseISO(dateString), "MMM d, yyyy");
  } catch (e) {
    return dateString;
  }
}

export function formatRelative(dateString: string | null | undefined): string {
  if (!dateString) return "";
  try {
    return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
  } catch (e) {
    return dateString;
  }
}
