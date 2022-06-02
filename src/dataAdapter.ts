import { type IRecord } from "@vikadata/vika";
import { type ChartData } from "chart.js";

type proxyObj = {
  [index: string]: any[];
};

// FEAT: 自定义样式
// FEAT: 过滤数据
// type Option = {
//   filter: (obj: proxyObj) => proxyObj;
// };

/**
 *
 * @param {*} data vika 表数据
 * @param {*} requiredColumnName vika 表中的固定字段，默认值为 “日期”
 * @param {*} option chart js 折线图配置选项
 * @returns chart js payload
 */
export function adapter(
  data: IRecord[],
  requiredColumnName = "日期"
): ChartData {
  const { columnName, lineName } = getColumnAndLineName(
    data,
    requiredColumnName
  );

  // 数据填充
  const obj = getProxyObj(columnName, data);
  // 初始化 chart js 数据结构
  const payload: ChartData = {
    labels: [],
    datasets: [],
  };
  // 填充 labels
  payload.labels = obj[requiredColumnName];
  // 填充 label 和 data，合并选项
  lineName.forEach((name) => {
    payload.datasets.push({ label: name, data: obj[name] });
  });

  return payload;
}

function getProxyObj(columnName: string[], data: IRecord[]) {
  const obj: proxyObj = {};
  columnName.forEach((name) => {
    obj[name] = [];
  });

  // 将 vika 返回的数据转移到 obj 中
  data.forEach((record) => {
    columnName.forEach((name) => {
      const value = record.fields[name] as string | number;
      if (typeof value === "string") {
        obj[name].push(toNumber(value));
      } else {
        obj[name].push(toDate(value));
      }
    });
  });
  return obj;
}

function toNumber(value: string): number {
  // 假设 value 形式为 "1: 选项 1"，使用 split 将 : 后的文本移除
  const source = value.split(":")[0];
  if (typeof source === "string") {
    return Number(source);
  } else {
    return 0;
  }
}

function toDate(timestamp: number) {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function getColumnAndLineName(data: IRecord[], requiredColumnName: string) {
  const lineFiled = Object.assign({}, data[0].fields);
  const columnFiled = Object.assign({}, lineFiled);
  delete lineFiled[requiredColumnName];
  return {
    columnName: Object.keys(columnFiled),
    lineName: Object.keys(lineFiled),
  };
}
