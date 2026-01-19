/**
 * Converts points with tension (Cardinal Spline) to an SVG Path string using Cubic Beziers.
 * @param {Array} points - Array of {x, y} objects.
 * @param {number} tension - Konva-style tension (0 to 1).
 * @param {boolean} closed - Whether the path is closed.
 */
export const cardinalToCubicBezier = (points, tension = 0.5, closed = true) => {
  if (points.length < 2) return "";
  
  const size = points.length;
  // let path = `M ${points[0].x},${points[0].y} `;
  let path = '';

  for (let i = 0; i < (closed ? size : size - 1); i++) {
    // Get the four points surrounding the current segment
    const p0 = points[closed ? (i - 1 + size) % size : Math.max(0, i - 1)]; // Previous point
    const p1 = points[closed ? i % size : i];                               // Current start
    const p2 = points[closed ? (i + 1) % size : Math.min(size - 1, i + 1)]; // Current end
    const p3 = points[closed ? (i + 2) % size : Math.min(size - 1, i + 2)]; // Next point

    // Calculate Cubic Bezier control points
    const cp1x = p1.x + (p2.x - p0.x) * tension / 6;
    const cp1y = p1.y + (p2.y - p0.y) * tension / 6;
    
    const cp2x = p2.x - (p3.x - p1.x) * tension / 6;
    const cp2y = p2.y - (p3.y - p1.y) * tension / 6;

    path += `C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y} `;
  }

  return closed ? path + "Z" : path;
};
