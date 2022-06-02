//@ts-nocheck
import { type ChartData, type ChartItem } from "chart.js";
import * as ChartJs from "chart.js";
// FIX: 只导入与 line 相关的内容
// https://github.com/chartjs/Chart.js/issues/8105#issuecomment-733663821
ChartJs.Chart.register.apply(
  {},
  Object.values(ChartJs).filter((chartClass) => chartClass.id)
);

ChartJs.defaults.font.size = 18;
ChartJs.defaults.aspectRatio = 2; //宽高比

export function render(ctx: ChartItem, payload: ChartData, color: string[]) {
  payload.datasets.forEach((dataset, index) => {
    dataset.borderColor = color[index];
  });

  new ChartJs.Chart(ctx, {
    type: "line",
    data: payload,
  });
}
