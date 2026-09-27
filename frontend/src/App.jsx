import { Routes, Route } from "react-router-dom";
import ReleasesListPage from "./pages/ReleasesListPage";
import ReleaseDetailPage from "./pages/ReleaseDetailPage";

function App() {
  return (
    <div className="app">
      {/* Header is shared across both views, matching the mockup
          where "ReleaseCheck" appears identically on both screens. */}
      <header className="app-header">
        <h1>ReleaseCheck</h1>
        <p>Your all-in-one release checklist tool</p>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<ReleasesListPage />} />
          <Route path="/releases/new" element={<ReleaseDetailPage />} />
          <Route path="/releases/:id" element={<ReleaseDetailPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;