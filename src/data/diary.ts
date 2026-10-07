export type DiaryEntry = {
  date: string; // YYYY-MM-DD
  text: string;
  place?: string;
  weather?: string;
};

/** 日记便签：不发成博文的碎片记录 */
export const diaryEntries: DiaryEntry[] = [
  { date: "2026-09-28", text: "整理硬盘，把夏天的照片都洗了出来。祁连山那卷居然有三十六张天空。", place: "家", weather: "晴" },
  { date: "2026-09-15", text: "路过邮局，给自己寄了一张空白明信片。收到的时候要在上面写今年最想说的一句话。", place: "成都", weather: "阴" },
  { date: "2026-09-03", text: "下雨了。把窗台上的明信片收进来，发现冰岛那张的邮戳被潮气晕开了一点，反而更好看了。", place: "家", weather: "雨" },
  { date: "2026-08-20", text: "在塔公草原躺了一下午。云走得很慢，我也是。", place: "四川 · 塔公", weather: "晴" },
  { date: "2026-08-12", text: "折多山垭口，风大得站不稳。但今天拍到了今年最满意的一张照片。", place: "四川 · 川西", weather: "多云" },
  { date: "2026-08-05", text: "出发前夜，给相机换了新卷，把三脚架的螺丝又紧了一遍。仪式感要有。", place: "成都", weather: "晴" },
  { date: "2026-07-16", text: "回程的绿皮火车上，对面的大爷看我修图，说他年轻时也有一台海鸥。", place: "火车上", weather: "晴" },
  { date: "2026-07-03", text: "丹霞的日落只有四十分钟，我等了三个小时。值。", place: "甘肃 · 张掖", weather: "晴" },
  { date: "2026-06-25", text: "青海湖边买的明信片，邮票是藏羚羊。舍不得寄出去了。", place: "青海", weather: "晴" },
  { date: "2026-06-18", text: "湖边的风把三脚架吹倒了一次，镜头没事，心有事。", place: "青海 · 青海湖", weather: "大风" },
  { date: "2026-05-21", text: "整理春季的底片，发现雪山的照片全都过曝了一档。失误也是旅程的一部分。", place: "家", weather: "阴" },
  { date: "2026-04-09", text: "雪线之上，手指冻得按不动快门。但马特洪峰值得。", place: "瑞士 · 采尔马特", weather: "雪" },
  { date: "2026-03-14", text: "在旧货市场淘到一盒八十年代的明信片，寄信人叫「阿珍」。她现在在哪里呢。", place: "成都", weather: "晴" },
  { date: "2026-02-21", text: "冰岛的瀑布把我淋透了。防水壳就在包里，我忘了装。", place: "冰岛 · 南岸", weather: "雨夹雪" },
  { date: "2026-01-30", text: "新年第一天，把去年的明信片按日期排好，贴满了半面墙。", place: "家", weather: "晴" },
  { date: "2025-11-30", text: "怒江清晨的雾，是山在呼吸。", place: "云南 · 怒江", weather: "雾" },
  { date: "2025-10-14", text: "大兴安岭的落叶松，下了一场金色的雨。", place: "黑龙江", weather: "晴" },
  { date: "2025-09-19", text: "北方的秋天短得像一声快门。", place: "哈尔滨", weather: "晴" },
  { date: "2025-08-26", text: "峡湾的水深一千三百米。我站在甲板上，被这个数字震得说不出话。", place: "挪威 · 松恩峡湾", weather: "阴" },
];

export function diaryByDate(date: string) {
  return diaryEntries.find((d) => d.date === date);
}
