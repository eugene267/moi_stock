export interface KiwoomPriceItem {
  dt: string;
  open_pric: string;
  high_pric: string;
  low_pric: string;
  cur_prc: string;
}

export interface ChartData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}