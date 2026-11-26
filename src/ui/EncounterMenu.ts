import Phaser from "phaser";

export interface EncounterCommandItem {
  label: string;
  subtitle: string;
  muted?: boolean;
}

export interface EncounterCommandRowOptions {
  centerX?: number;
  centerY?: number;
  cardWidth?: number;
  cardHeight?: number;
  gap?: number;
  depth?: number;
}

/**
 * A shared keyboard-first visual row for the four encounter commands.
 * Each encounter supplies its own contextual subtitles and resolution logic.
 */
export function drawEncounterCommandRow(
  scene: Phaser.Scene,
  items: EncounterCommandItem[],
  selectedIndex: number,
  onSelect: (index: number) => void,
  options: EncounterCommandRowOptions = {},
): Phaser.GameObjects.GameObject[] {
  const centerX = options.centerX ?? 465;
  const centerY = options.centerY ?? 450;
  const cardWidth = options.cardWidth ?? 184;
  const cardHeight = options.cardHeight ?? 58;
  const gap = options.gap ?? 34;
  const depth = options.depth ?? 35;
  const totalWidth = items.length * cardWidth + Math.max(0, items.length - 1) * gap;
  const firstCenter = centerX - totalWidth / 2 + cardWidth / 2;
  const objects: Phaser.GameObjects.GameObject[] = [];

  items.forEach((item, index) => {
    const x = firstCenter + index * (cardWidth + gap);
    const selected = index === selectedIndex;
    const card = scene.add.rectangle(
      x,
      centerY,
      cardWidth,
      cardHeight,
      selected ? 0x3c5148 : 0x17282e,
      selected ? 0.98 : 0.94,
    )
      .setStrokeStyle(
        selected ? 2 : 1,
        selected ? 0xe1c68d : 0x65766d,
        selected ? 1 : 0.82,
      )
      .setDepth(depth)
      .setInteractive({ useHandCursor: true });

    const title = scene.add.text(x, centerY - 9, item.label, {
      fontFamily: "Georgia, serif",
      fontSize: "16px",
      fontStyle: "bold",
      color: selected ? "#f4e5bf" : (item.muted ? "#78847e" : "#c5c9bd"),
      letterSpacing: 1,
    }).setOrigin(0.5).setDepth(depth + 1);

    const subtitle = scene.add.text(x, centerY + 13, item.subtitle, {
      fontFamily: "'Noto Sans KR', sans-serif",
      fontSize: "10px",
      color: selected ? "#e0d2b4" : (item.muted ? "#6e7d76" : "#98a79a"),
    }).setOrigin(0.5).setDepth(depth + 1);

    card.on("pointerdown", () => onSelect(index));
    title.setInteractive({ useHandCursor: true }).on("pointerdown", () => onSelect(index));
    subtitle.setInteractive({ useHandCursor: true }).on("pointerdown", () => onSelect(index));
    objects.push(card, title, subtitle);
  });

  return objects;
}


export interface EncounterChoiceListOptions {
  left?: number;
  top?: number;
  width?: number;
  rowHeight?: number;
  fontSize?: string;
  depth?: number;
}

/**
 * Shared, keyboard-first choice rows for ACT and item submenus.
 * The owning Scene keeps control of selection state and action resolution.
 */
export function drawEncounterChoiceList(
  scene: Phaser.Scene,
  labels: readonly string[],
  selectedIndex: number,
  onSelect: (index: number) => void,
  options: EncounterChoiceListOptions = {},
): Phaser.GameObjects.GameObject[] {
  const left = options.left ?? 90;
  const top = options.top ?? 380;
  const width = options.width ?? 780;
  const rowHeight = options.rowHeight ?? 28;
  const fontSize = options.fontSize ?? "14px";
  const depth = options.depth ?? 35;
  const objects: Phaser.GameObjects.GameObject[] = [];

  labels.forEach((label, index) => {
    const selected = index === selectedIndex;
    const centerY = top + index * rowHeight + rowHeight / 2;
    const row = scene.add.rectangle(
      left + width / 2,
      centerY,
      width,
      Math.max(20, rowHeight - 3),
      selected ? 0x263f3a : 0x10212a,
      selected ? 0.92 : 0.4,
    )
      .setStrokeStyle(
        selected ? 1 : 0,
        selected ? 0xdcc187 : 0x53665f,
        selected ? 0.95 : 0,
      )
      .setDepth(depth)
      .setInteractive({ useHandCursor: true });

    const text = scene.add.text(
      left + 16,
      centerY,
      `${selected ? "▶" : " "}  ${label}`,
      {
        fontFamily: "'Noto Sans KR', sans-serif",
        fontSize,
        color: selected ? "#f0d58f" : "#c5cbbf",
        wordWrap: { width: width - 34 },
      },
    )
      .setOrigin(0, 0.5)
      .setDepth(depth + 1)
      .setInteractive({ useHandCursor: true });

    const choose = (): void => onSelect(index);
    row.on("pointerdown", choose);
    text.on("pointerdown", choose);
    objects.push(row, text);
  });

  return objects;
}
