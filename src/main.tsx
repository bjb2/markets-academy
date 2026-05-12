import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { MDXProvider } from "@mdx-js/react";
import App from "./App";
import { mdxComponents } from "./components/mdxComponents";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <MDXProvider components={mdxComponents}>
        <App />
      </MDXProvider>
    </HashRouter>
  </React.StrictMode>,
);
