"use client";


import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";

type DisplayMode = "flex" | "grid";

export default function FlexboxGenerator() {
  const [mode, setMode] = useState<DisplayMode>("flex");
  const [flexProps, setFlexProps] = useState({
    direction: "row",
    wrap: "nowrap",
    justify: "flex-start",
    alignItems: "stretch",
    alignContent: "stretch",
    gap: "10",
  });
  const [gridProps, setGridProps] = useState({
    columns: "3",
    rows: "auto",
    gap: "10",
    columnGap: "10",
    rowGap: "10",
    justifyItems: "stretch",
    alignItems: "stretch",
  });

  const generateCSS = () => {
    if (mode === "flex") {
      return `.container {
  display: flex;
  flex-direction: ${flexProps.direction};
  flex-wrap: ${flexProps.wrap};
  justify-content: ${flexProps.justify};
  align-items: ${flexProps.alignItems};
  align-content: ${flexProps.alignContent};
  gap: ${flexProps.gap}px;
}`;
    } else {
      return `.container {
  display: grid;
  grid-template-columns: repeat(${gridProps.columns}, 1fr);
  grid-template-rows: ${gridProps.rows};
  gap: ${gridProps.gap}px;
  column-gap: ${gridProps.columnGap}px;
  row-gap: ${gridProps.rowGap}px;
  justify-items: ${gridProps.justifyItems};
  align-items: ${gridProps.alignItems};
}`;
    }
  };

  const getContainerStyle = () => {
    if (mode === "flex") {
      return {
        display: "flex" as const,
        flexDirection: flexProps.direction as any,
        flexWrap: flexProps.wrap as any,
        justifyContent: flexProps.justify as any,
        alignItems: flexProps.alignItems as any,
        alignContent: flexProps.alignContent as any,
        gap: `${flexProps.gap}px`,
        minHeight: "200px",
        padding: "10px",
        border: "2px dashed #ccc",
      };
    } else {
      return {
        display: "grid" as const,
        gridTemplateColumns: `repeat(${parseInt(gridProps.columns)}, 1fr)`,
        gridTemplateRows: gridProps.rows,
        gap: `${gridProps.gap}px`,
        columnGap: `${gridProps.columnGap}px`,
        rowGap: `${gridProps.rowGap}px`,
        justifyItems: gridProps.justifyItems as any,
        alignItems: gridProps.alignItems as any,
        minHeight: "200px",
        padding: "10px",
        border: "2px dashed #ccc",
      };
    }
  };

  const boxStyle = mode === "flex" 
    ? { minWidth: "60px", minHeight: "60px", padding: "10px", background: "var(--accent)", color: "white", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center" }
    : { padding: "20px", background: "var(--accent)", color: "white", borderRadius: "4px" };

  return (
    <div className="tool-page">
      <h1>CSS Layout Generator</h1>
      <p className="desc">Generate Flexbox or CSS Grid layouts visually.</p>

      <div className="btn-group mb-6">
        <button className={`btn ${mode === "flex" ? "btn-primary" : ""}`} onClick={() => setMode("flex")}>Flexbox</button>
        <button className={`btn ${mode === "grid" ? "btn-primary" : ""}`} onClick={() => setMode("grid")}>CSS Grid</button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-3">Properties</h3>
          {mode === "flex" ? (
            <div className="space-y-3">
              <label className="block">
                <span className="text-sm">flex-direction</span>
                <select value={flexProps.direction} onChange={(e) => setFlexProps({...flexProps, direction: e.target.value})} className="tool-input">
                  <option value="row">row</option>
                  <option value="row-reverse">row-reverse</option>
                  <option value="column">column</option>
                  <option value="column-reverse">column-reverse</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm">flex-wrap</span>
                <select value={flexProps.wrap} onChange={(e) => setFlexProps({...flexProps, wrap: e.target.value})} className="tool-input">
                  <option value="nowrap">nowrap</option>
                  <option value="wrap">wrap</option>
                  <option value="wrap-reverse">wrap-reverse</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm">justify-content</span>
                <select value={flexProps.justify} onChange={(e) => setFlexProps({...flexProps, justify: e.target.value})} className="tool-input">
                  <option value="flex-start">flex-start</option>
                  <option value="flex-end">flex-end</option>
                  <option value="center">center</option>
                  <option value="space-between">space-between</option>
                  <option value="space-around">space-around</option>
                  <option value="space-evenly">space-evenly</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm">align-items</span>
                <select value={flexProps.alignItems} onChange={(e) => setFlexProps({...flexProps, alignItems: e.target.value})} className="tool-input">
                  <option value="stretch">stretch</option>
                  <option value="flex-start">flex-start</option>
                  <option value="flex-end">flex-end</option>
                  <option value="center">center</option>
                  <option value="baseline">baseline</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm">gap (px)</span>
                <input type="number" value={flexProps.gap} onChange={(e) => setFlexProps({...flexProps, gap: e.target.value})} className="tool-input" min="0" />
              </label>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="block">
                <span className="text-sm">grid-template-columns</span>
                <input type="number" value={gridProps.columns} onChange={(e) => setGridProps({...gridProps, columns: e.target.value})} className="tool-input" min="1" max="12" />
              </label>
              <label className="block">
                <span className="text-sm">gap (px)</span>
                <input type="number" value={gridProps.gap} onChange={(e) => setGridProps({...gridProps, gap: e.target.value, columnGap: e.target.value, rowGap: e.target.value})} className="tool-input" min="0" />
              </label>
              <label className="block">
                <span className="text-sm">justify-items</span>
                <select value={gridProps.justifyItems} onChange={(e) => setGridProps({...gridProps, justifyItems: e.target.value})} className="tool-input">
                  <option value="stretch">stretch</option>
                  <option value="start">start</option>
                  <option value="end">end</option>
                  <option value="center">center</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm">align-items</span>
                <select value={gridProps.alignItems} onChange={(e) => setGridProps({...gridProps, alignItems: e.target.value})} className="tool-input">
                  <option value="stretch">stretch</option>
                  <option value="start">start</option>
                  <option value="end">end</option>
                  <option value="center">center</option>
                </select>
              </label>
            </div>
          )}
        </div>

        <div>
          <h3 className="font-semibold mb-3">Preview</h3>
          <div style={getContainerStyle()}>
            {[1,2,3,4,5,6].slice(0, mode === "grid" ? parseInt(gridProps.columns) * 2 : 6).map(i => (
              <div key={i} style={boxStyle}>{i}</div>
            ))}
          </div>
          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2">Generated CSS</h4>
            <pre className="output-box text-sm">{generateCSS()}</pre>
            <div className="btn-group mt-2">
              <CopyButton text={generateCSS()} />
            </div>
          </div>
        </div>
      </div>

      <section className="tool-prose">
        <h2>About the CSS Layout Generator</h2>
        <p>The CSS Layout Generator creates Flexbox and CSS Grid code visually with a live preview. Select your layout model, adjust direction, alignment, gaps, and wrapping, and get production-ready CSS in one click. Perfect for learning layout fundamentals or quickly generating boilerplate for a new component.</p>
        <p>Flexbox and CSS Grid are the two primary layout systems in modern CSS. Flexbox is best for one-dimensional layouts — arranging items in a row or column. Grid is best for two-dimensional layouts — placing items across both rows and columns simultaneously. Both are supported in all modern browsers and replace older techniques like floats and inline-block positioning.</p>
        <p>All layout code is generated locally in your browser. The generated CSS is minimal and production-ready — no vendor prefixes needed for Flexbox or Grid in modern browsers. Paste it directly into your stylesheet.</p>
      </section>
    </div>
  );
}
