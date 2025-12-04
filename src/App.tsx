import React, { useState } from "react";
import Sidebar from "./components/sidebar/Sidebar";
import { Routes, Route, useNavigate } from "react-router-dom";
import Introduction from "./components/introduction/Introduction";
import AimsAndObjectives from "./components/aims/AimsAndObjectives";
import Discussion from "./components/discussion/Discussion";
import Summary from "./components/summary/Summary";
import Conclusion from "./components/conclusion/Conclusion";
import References from "./components/references/References";
import Merged from "./components/merged/Merged";
import Results from "./components/results/Results";
import ListOfTables from "./components/listOfTables/ListOfTables";
import ListOfFigures from "./components/listOfFigures/ListOfFigures"; // ✅ added
import TableOfContents from "./components/tableOfContents/TableOfContents";


// ✅ Define interfaces
interface TableItem {
  number: string;
  title: string;
  page: string;
}

interface FigureItem {
  number: string;
  caption: string;
  page: string;
}

const App: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState("Introduction");
  const [tableList, setTableList] = useState<TableItem[]>([]);
  const [figureList, setFigureList] = useState<FigureItem[]>([]);

  const navigate = useNavigate();

  const handleSelect = (feature: string) => {
    setActiveFeature(feature);
    switch (feature) {
      case "Introduction":
        navigate("/");
        break;
      case "AimsAndObjectives":
        navigate("/aims");
        break;
      case "Discussion":
        navigate("/discussion");
        break;
      case "Summary":
        navigate("/summary");
        break;
      case "Conclusion":
        navigate("/conclusion");
        break;
      case "References":
        navigate("/references");
        break;
      case "Results":
        navigate("/results");
        break;
      case "List of Tables":
        navigate("/list-of-tables");
        break;
      case "List of Figures":
        navigate("/list-of-figures");
        break;
      case "Merged":
        navigate("/merged");
        break;
      case "Table of Contents":
        navigate("/table-of-contents");
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar active={activeFeature} onSelect={handleSelect} />

      <div className="flex-1 p-4 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Introduction />} />
          <Route path="/aims" element={<AimsAndObjectives />} />
          <Route path="/discussion" element={<Discussion />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/conclusion" element={<Conclusion />} />
          <Route path="/references" element={<References />} />
          <Route path="/table-of-contents" element={<TableOfContents />} />

          {/* ✅ Results route now sends both table + figure data */}
          <Route
            path="/results"
            element={
              <Results
                onTablesExtracted={setTableList}
                onFiguresExtracted={setFigureList}
              />
            }
          />

          {/* ✅ List of Tables and Figures */}
          <Route
            path="/list-of-tables"
            element={<ListOfTables tables={tableList} />}
          />
          <Route
            path="/list-of-figures"
            element={<ListOfFigures figures={figureList} />}
          />

          <Route path="/merged" element={<Merged />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
