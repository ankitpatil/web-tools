"use client";
import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";

const xmlToJson = (xml: string): object => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "text/xml");
  
  const convert = (node: Element): any => {
    const obj: any = {};
    
    if (node.attributes?.length) {
      obj["@attributes"] = {};
      for (let i = 0; i < node.attributes.length; i++) {
        const attr = node.attributes[i];
        obj["@attributes"][attr.name] = attr.value;
      }
    }
    
    for (let i = 0; i < node.childNodes.length; i++) {
      const child = node.childNodes[i];
      if (child.nodeType === 1) { // Element
        const childEl = child as Element;
        const key = childEl.nodeName;
        const value = convert(childEl);
        
        if (obj[key]) {
          if (!Array.isArray(obj[key])) obj[key] = [obj[key]];
          obj[key].push(value);
        } else {
          obj[key] = value;
        }
      } else if (child.nodeType === 3 && child.textContent?.trim()) {
        return child.textContent.trim();
      }
    }
    
    return obj;
  };
  
  return convert(doc.documentElement);
};

export default function XmlToJson() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState(2);

  const convert = () => {
    try {
      const result = xmlToJson(input);
      setOutput(JSON.stringify(result, null, indent));
      setError("");
    } catch (e: any) {
      setError(e.message);
      setOutput("");
    }
  };

  return (
    <div className="tool-page">
      <h1>XML to JSON</h1>
      <p className="desc">Convert XML to JSON format.</p>
      
      <label>Input XML</label>
      <textarea className="tool-input font-mono text-sm" value={input} onChange={(e) => setInput(e.target.value)} placeholder="<root><item>...</item></root>" rows={8} />
      
      <div className="btn-group">
        <button className="btn btn-primary" onClick={convert}>🔄 Convert to JSON</button>
        <button className="btn" onClick={() => { setInput(""); setOutput(""); setError(""); }}>Clear</button>
        <select value={indent} onChange={(e) => setIndent(Number(e.target.value))} className="btn">
          <option value={2}>2 spaces</option>
          <option value={4}>4 spaces</option>
        </select>
      </div>

      {error && <p className="error-text">❌ {error}</p>}
      {output && <div className="output-box">{output}</div>}
      {output && <div className="btn-group mt-3"><CopyButton text={output} /></div>}
    </div>
  );
}
