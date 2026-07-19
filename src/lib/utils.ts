import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Platform } from 'react-native';

dayjs.extend(relativeTime);

export function timeAgo(date: string): string {
  return dayjs(date).fromNow();
}

export function imageUrl(path: string | undefined | null): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `https://social.sykmm.site/${path}`;
}

export function fullName(first: string, last: string): string {
  return `${first} ${last}`;
}

export function isOnline(online: string): boolean {
  if (!online || online === '0') return false;
  const ts = parseInt(online, 10);
  return Date.now() / 1000 - ts < 120;
}

export function stripHtml(text: string): string {
  return text.replace(/<[^>]*>/g, '');
}
