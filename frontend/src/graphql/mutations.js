import { gql } from "@apollo/client";

export const CREATE_RELEASE = gql`
  mutation CreateRelease($name: String!, $date: String!, $additionalInfo: String) {
    createRelease(name: $name, date: $date, additionalInfo: $additionalInfo) {
      id
    }
  }
`;

export const UPDATE_RELEASE = gql`
  mutation UpdateRelease($id: ID!, $name: String, $date: String, $additionalInfo: String) {
    updateRelease(id: $id, name: $name, date: $date, additionalInfo: $additionalInfo) {
      id
      name
      date
      additionalInfo
    }
  }
`;

// Steps are back in the response now that the backend update is
// atomic — this keeps Apollo's cache accurate for this release.
export const TOGGLE_STEP = gql`
  mutation ToggleStep($id: ID!, $stepKey: String!, $completed: Boolean!) {
    toggleStep(id: $id, stepKey: $stepKey, completed: $completed) {
      id
      status
      steps {
        key
        completed
      }
    }
  }
`;

export const DELETE_RELEASE = gql`
  mutation DeleteRelease($id: ID!) {
    deleteRelease(id: $id)
  }
`;