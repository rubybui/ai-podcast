export const getCharacterLimit = (speed: number = 0.95) => {
  if (speed <= 0) {
    speed = 0.95;
  }
  const NORMAL_LENGTH = 9000;
  return Math.floor(speed * NORMAL_LENGTH);
};

/**
 *
 * @param originalContent original content
 * @param characterLimit characters limit of a part
 * @returns Array of parts
 */
export const splitContentToParts = (
  originalContent: string,
  characterLimit = 9000
): string[] => {
  // Split part by limit
  const getPart = (content: string, characterLimit = 9000) => {
    let part = content.slice(0, characterLimit);
    content = content.slice(part.length);
    const dotIndex = part.split("").lastIndexOf(".");
    if (dotIndex >= 0) {
      content = `${part.slice(dotIndex + 1)}${content}`;
      part = part.slice(0, dotIndex + 1);
    }
    return [part, content];
  };

  let content = originalContent;
  const contentArray = [];
  while (content) {
    const [part, remainContent] = getPart(content, characterLimit);
    contentArray.push(part);
    content = remainContent;
  }
  return contentArray;
};

export const ticksToMs = (value: number) => value / 10000;

export const escapeXml = (unsafe) => {
  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
    }
  });
};
