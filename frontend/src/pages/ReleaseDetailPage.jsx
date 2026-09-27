import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { GET_RELEASE, GET_RELEASES } from "../graphql/queries";
import {
  CREATE_RELEASE,
  UPDATE_RELEASE,
  TOGGLE_STEP,
  DELETE_RELEASE,
} from "../graphql/mutations";

function toDateInputValue(isoString) {
  if (!isoString) return "";
  return isoString.slice(0, 10);
}

function ReleaseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;

  const { data, loading, error } = useQuery(GET_RELEASE, {
    variables: { id },
    skip: isNew,
  });

  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  // The checklist lives in its own local state, separate from the
  // Apollo-cached query data. Checkbox clicks flip this instantly;
  // the mutation below persists the change in the background.
  const [localSteps, setLocalSteps] = useState([]);

  // Tracks which release id we've already copied server data from.
  // Without this guard, every mutation response (Save, toggling a
  // step) would re-run this effect and overwrite your latest clicks
  // with whatever was originally loaded. We only want the one-time
  // copy from server -> local state to happen once per release.
  const [initializedFor, setInitializedFor] = useState(null);

  useEffect(() => {
    if (data?.release && initializedFor !== id) {
      setName(data.release.name);
      setDate(toDateInputValue(data.release.date));
      setAdditionalInfo(data.release.additionalInfo || "");
      setLocalSteps(data.release.steps);
      setInitializedFor(id);
    }
  }, [data, id, initializedFor]);

  const [createRelease, { loading: creating }] = useMutation(CREATE_RELEASE, {
    refetchQueries: [{ query: GET_RELEASES }],
  });

  const [updateRelease, { loading: saving }] = useMutation(UPDATE_RELEASE);
  const [toggleStep] = useMutation(TOGGLE_STEP);
  const [deleteRelease] = useMutation(DELETE_RELEASE, {
    refetchQueries: [{ query: GET_RELEASES }],
  });

  async function handleSave() {
    if (!name.trim() || !date) {
      alert("Release name and date are required.");
      return;
    }

    const isoDate = new Date(date).toISOString();

    if (isNew) {
      const result = await createRelease({
        variables: { name, date: isoDate, additionalInfo },
      });
      navigate(`/releases/${result.data.createRelease.id}`);
    } else {
      await updateRelease({ variables: { id, name, date: isoDate, additionalInfo } });
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Delete "${name}"? This can't be undone.`)) return;
    await deleteRelease({ variables: { id } });
    navigate("/");
  }

  function handleStepToggle(stepKey, completed) {
    // Instant UI update — don't wait on the network for this.
    setLocalSteps((prev) =>
      prev.map((step) => (step.key === stepKey ? { ...step, completed } : step))
    );

    toggleStep({ variables: { id, stepKey, completed } }).catch(() => {
      // Roll back only if the save actually failed.
      setLocalSteps((prev) =>
        prev.map((step) => (step.key === stepKey ? { ...step, completed: !completed } : step))
      );
      alert("Couldn't save that step — please try again.");
    });
  }

  if (!isNew && loading) return <p className="status-text">Loading release...</p>;
  if (!isNew && error) return <p className="status-text error">Failed to load release: {error.message}</p>;

  return (
    <div className="card">
      <div className="card-header">
        <div className="breadcrumb">
          <Link to="/">All releases</Link>
          <span> &gt; </span>
          <span className="breadcrumb-current">{isNew ? "New release" : name}</span>
        </div>
        {!isNew && (
          <button className="btn btn-danger" onClick={handleDelete}>
            Delete
          </button>
        )}
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="release-name">Release</label>
          <input
            id="release-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Version 1.0.1"
          />
        </div>
        <div className="form-field">
          <label htmlFor="release-date">Date</label>
          <input
            id="release-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      {!isNew && (
        <div className="steps-list">
          {localSteps.map((step) => (
            <label key={step.key} className="step-item">
              <input
                type="checkbox"
                checked={step.completed}
                onChange={(e) => handleStepToggle(step.key, e.target.checked)}
              />
              {step.label}
            </label>
          ))}
        </div>
      )}

      <div className="form-field">
        <label htmlFor="additional-info">Additional remarks / tasks</label>
        <textarea
          id="additional-info"
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
          placeholder="Please enter any other important notes for the release"
          rows={6}
        />
      </div>

      <div className="form-footer">
        <button className="btn btn-primary" onClick={handleSave} disabled={creating || saving}>
          Save
        </button>
      </div>
    </div>
  );
}

export default ReleaseDetailPage;