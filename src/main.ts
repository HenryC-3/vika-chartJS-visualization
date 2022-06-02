import "./style.css";
import { Vika } from "@vikadata/vika";
import { adapter } from "./dataAdapter";
import { render } from "./render";
import { colors } from "./color";

const { VITE_VIKA_TOKEN, VITE_TABLE_ID, VITE_VIEW_ID } = import.meta.env;
const vika = new Vika({ token: VITE_VIKA_TOKEN });
const datasheet = vika.datasheet(VITE_TABLE_ID);

// 获取数据
datasheet.records.query({ viewId: VITE_VIEW_ID }).then((response) => {
  if (response.success) {
    const data = adapter(response.data.records);
    const ctx = document.querySelector<HTMLCanvasElement>("#app")!;
    render(ctx, data, colors);
  } else {
    console.error(response);
  }
});
