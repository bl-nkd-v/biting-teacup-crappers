import React from "react";

interface PetTraits {
  baseShape: number;
  eyes: number;
  mouth: number;
  accessory: number;
  colorScheme: number;
}

interface PetArtworkProps {
  traits: PetTraits;
  level: number;
}

const Colors = {
  Red: "#FF6B6B",
  Teal: "#4ECDC4",
  LightBlue: "#45B7D1",
  LightSalmon: "#FFA07A",
  Mint: "#98D8C8",
  Pink: "#F06292",
  LightGreen: "#AED581",
  Yellow: "#FFD54F",
  BluePurple: "#7986CB",
  Orange: "#FF8A65",
  Purple: "#BA68C8",
  Turquoise: "#4DB6AC",
};

const PetArtwork: React.FC<PetArtworkProps> = ({ traits, level }) => {
  const pixelSize = 8;
  const gridSize = 16;
  const size = pixelSize * gridSize;

  const colors = [
    Colors.Red,
    Colors.Teal,
    Colors.LightBlue,
    Colors.LightSalmon,
    Colors.Mint,
    Colors.Pink,
    Colors.LightGreen,
    Colors.Yellow,
    Colors.BluePurple,
    Colors.Orange,
    Colors.Purple,
    Colors.Turquoise,
  ];

  const getColor = (index: number) => colors[index % colors.length];

  const baseColor = getColor(traits.colorScheme);
  const secondaryColor = getColor(traits.colorScheme + 1);

  const renderPixel = (x: number, y: number, color: string) => (
    <rect
      key={`${x}-${y}`}
      x={x * pixelSize}
      y={y * pixelSize}
      width={pixelSize}
      height={pixelSize}
      fill={color}
    />
  );

  const renderBase = () => {
    const pixels = [];
    switch (traits.baseShape % 4) {
      case 0: // Square
        for (let y = 4; y < 12; y++) {
          for (let x = 4; x < 12; x++) {
            pixels.push(renderPixel(x, y, baseColor));
          }
        }
        break;
      case 1: // Circle
        for (let y = 3; y < 13; y++) {
          for (let x = 3; x < 13; x++) {
            if ((x - 7.5) ** 2 + (y - 7.5) ** 2 <= 5 ** 2) {
              pixels.push(renderPixel(x, y, baseColor));
            }
          }
        }
        break;
      case 2: // Equilateral Triangle
        for (let y = 3; y < 13; y++) {
          for (let x = 3; x < 13; x++) {
            const centerX = 7.5;
            const centerY = 8.5;
            const height = 9;
            const halfWidth = 5;

            if (
              y >= centerY - height / 2 &&
              y <= centerY + height / 2 &&
              x >=
                centerX - (y - (centerY - height / 2)) * (halfWidth / height) &&
              x <= centerX + (y - (centerY - height / 2)) * (halfWidth / height)
            ) {
              pixels.push(renderPixel(x, y, baseColor));
            }
          }
        }
        break;
      case 3: // Diamond
        for (let y = 3; y < 13; y++) {
          for (let x = 3; x < 13; x++) {
            if (Math.abs(x - 7.5) + Math.abs(y - 7.5) <= 5) {
              pixels.push(renderPixel(x, y, baseColor));
            }
          }
        }
        break;
    }
    return pixels;
  };

  const renderEyes = () => {
    if (level < 5) return null;
    const shape = traits.baseShape % 4;

    switch (shape) {
      case 0:
        return (
          <>
            {renderPixel(6, 6, "white")}
            {renderPixel(7, 6, "black")}
            {renderPixel(9, 6, "white")}
            {renderPixel(10, 6, "black")}
          </>
        );
      case 1:
        return (
          <>
            {renderPixel(6, 6, "white")}
            {renderPixel(7, 6, "black")}
            {renderPixel(9, 6, "white")}
            {renderPixel(10, 6, "black")}
          </>
        );
      case 2:
        return (
          <>
            {renderPixel(6, 8, "white")}
            {renderPixel(7, 8, "black")}
            {renderPixel(9, 8, "white")}
            {renderPixel(10, 8, "black")}
          </>
        );
      case 3:
        return (
          <>
            {renderPixel(6, 6, "white")}
            {renderPixel(7, 6, "black")}
            {renderPixel(9, 6, "white")}
            {renderPixel(10, 6, "black")}
          </>
        );
    }
  };

  const renderMouth = () => {
    if (level < 10) return null;
    const shape = traits.baseShape % 4;
    const mouthColor = "#333333";

    switch (shape) {
      case 0:
        return (
          <>
            {renderPixel(7, 9, mouthColor)}
            {renderPixel(8, 9, mouthColor)}
            {renderPixel(9, 9, mouthColor)}
          </>
        );
      case 1:
        return (
          <>
            {renderPixel(7, 9, mouthColor)}
            {renderPixel(8, 9, mouthColor)}
            {renderPixel(9, 9, mouthColor)}
          </>
        );
      case 2:
        return (
          <>
            {renderPixel(7, 11, mouthColor)}
            {renderPixel(8, 11, mouthColor)}
            {renderPixel(9, 11, mouthColor)}
          </>
        );
      case 3:
        return (
          <>
            {renderPixel(7, 9, mouthColor)}
            {renderPixel(8, 9, mouthColor)}
            {renderPixel(9, 9, mouthColor)}
          </>
        );
    }
  };

  const renderAccessory = () => {
    if (level < 15) return null;
    switch (traits.accessory % 3) {
      case 0:
        return (
          <>
            {renderPixel(7, 3, "gold")}
            {renderPixel(8, 3, "gold")}
            {renderPixel(9, 3, "gold")}
          </>
        );
      case 1:
        return (
          <>
            {renderPixel(7, 2, secondaryColor)}
            {renderPixel(8, 2, secondaryColor)}
            {renderPixel(9, 2, secondaryColor)}
          </>
        );
      case 2:
        return (
          <>
            {renderPixel(6, 3, secondaryColor)}
            {renderPixel(10, 3, secondaryColor)}
          </>
        );
    }
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {renderBase()}
      {renderEyes()}
      {renderMouth()}
      {renderAccessory()}
    </svg>
  );
};

export default PetArtwork;
