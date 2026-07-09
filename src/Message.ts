export interface Message {
  id: number;
  from: 'me' | 'them';
  text: string;
  ts: string;
}