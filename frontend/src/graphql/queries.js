import { gql } from "@apollo/client";

// Used on the list page. We only fetch what the table actually
// displays — steps and additionalInfo aren't needed until someone
// opens a specific release.
export const GET_RELEASES = gql`
  query GetReleases {
    releases {
      id
      name
      date
      status
    }
  }
`;

export const GET_RELEASE = gql`
  query GetRelease($id: ID!) {
    release(id: $id) {
      id
      name
      date
      status
      additionalInfo
      steps {
        key
        label
        completed
      }
    }
  }
`;