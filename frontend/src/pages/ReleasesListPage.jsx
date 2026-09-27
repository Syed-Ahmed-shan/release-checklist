import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_RELEASES } from "../graphql/queries";

const STATUS_LABELS = {
  PLANNED: "Planned",
  ONGOING: "Ongoing",
  DONE: "Done",
};

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function ReleasesListPage() {
  const { data, loading, error } = useQuery(GET_RELEASES);

  if (loading) return <p className="status-text">Loading releases...</p>;
  if (error) return <p className="status-text error">Failed to load releases: {error.message}</p>;

  const releases = data.releases;

  return (
    <div className="card">
      <div className="card-header">
        <span className="breadcrumb-current">All releases</span>
        <Link to="/releases/new" className="btn btn-primary">
          New release
        </Link>
      </div>

      {releases.length === 0 ? (
        <p className="status-text">No releases yet. Create your first one above.</p>
      ) : (
        <table className="releases-table">
          <thead>
            <tr>
              <th>Release</th>
              <th>Date</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {releases.map((release) => (
              <tr key={release.id}>
                <td>{release.name}</td>
                <td>{formatDate(release.date)}</td>
                <td>{STATUS_LABELS[release.status]}</td>
                <td className="table-actions">
                  <Link to={`/releases/${release.id}`}>View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ReleasesListPage;