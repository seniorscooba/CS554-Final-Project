import {gql} from '@apollo/client';

const GET_SHARED_IMAGES = gql`
  query {
    sharedImages {
      _id
      image
      comments
      userId
      dateFormed
      description
    }
  }
`;

const ADD_SHARED_IMAGE = gql`
  mutation createSharedImage(
    $userId: String!
    $image: String!
    $dateFormed: Date!
    $description: String
  ) {
    addSharedImage(
      userId: $userId
      image: $image
      dateFormed: $dateFormed
      description: $description
    ) {
        _id
        userId
        image
        dateFormed
        description
        comments
      }
    }
`;

const DELETE_SHARED_IMAGE = gql`
  mutation removeSharedImage($id: String!) {
    removeSharedImage(_id: $id) {
      _id
    }
  }
`;

const GET_CREATED_IMAGES = gql`
  query {
    createdImage {
      _id
      image
      comments
      solvedBy
      userId
      dateFormed
      description
    }
  }
`;

const ADD_CREATED_IMAGE = gql`
  mutation createCreatedImage(
    $userId: String!
    $image: String!
    $dateFormed: Date!
    $description: String
  ) {
    addCreatedImage(
      userId: $userId
      image: $image
      dateFormed: $dateFormed
      description: $description
    ) {
        _id
        userId
        image
        dateFormed
        description
        comments
      }
    }
`;

const DELETE_CREATED_IMAGE = gql`
  mutation removeCreatedImage($id: String!) {
    removeCreatedImage(_id: $id) {
      _id
    }
  }
`;


let exported = {
  ADD_SHARED_IMAGE,
  GET_SHARED_IMAGES,
  DELETE_SHARED_IMAGE,
  ADD_CREATED_IMAGE,
  GET_CREATED_IMAGES,
  DELETE_CREATED_IMAGE
};

export default exported;
