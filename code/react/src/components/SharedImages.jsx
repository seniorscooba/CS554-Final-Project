import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import queries from '../queries';
import Add from './Add';
import EditSharedImageModal from './EditSharedImageModal';
import DeleteSharedImageModal from './DeleteSharedImageModal';
import Navigation from './Navigation';
import './SharedImages.css'
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase-src';
import * as userHelper from "./UserHelpers.js";

export default function SharedImages() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editImage, setEditImage] = useState(null);
  const [deleteImage, setDeleteImage] = useState(null);
  const [user, setUser] = useState(null);
  const [sortOrder, setSortOrder] = useState('descending');

  // Main query for shared images
  const { loading, error, data } = useQuery(queries.GET_SHARED_IMAGES);
    
  const usersData = useQuery(queries.GET_USERS);

  // Collect user data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);  
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleOpenEditModal = (image) => {
    setShowEditModal(true);
    setEditImage(image);
  };

  const handleOpenDeleteModal = (image) => {
    setShowDeleteModal(true);
    setDeleteImage(image);
  };

  const closeAddFormState = () => {
    setShowAddForm(false);
  };

  const handleCloseModals = () => {
    setShowEditModal(false);
    setShowDeleteModal(false);
  };



  // if (loading || userLoading) return <div>Loading...</div>;
  // if (error || userError) return <div>Error: {error ? error.message : userError.message}</div>;
  // if (!data) return <div>No data found.</div>;

  if(data && usersData && usersData.data && usersData.data.users && user){
    const sharedImages = [...data.sharedImages];
    sharedImages.sort((a, b) => {
      const dateA = new Date(a.dateFormed);
      const dateB = new Date(b.dateFormed);
      return sortOrder === 'ascending' ? dateA - dateB : dateB - dateA;
    });
    const users = usersData.data.users;
    return (
      <div className='sharedImagesPage'>
        <Navigation />
        <h1>Welcome to the Shared Images Page!</h1>
        <h3>Here you can upload images and edit images if you are signed up and logged in.</h3>
        <div>
          <label htmlFor='sortOrder'>Sort by:</label>
          <select
            id='sortOrder'
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value='ascending'>Oldest to Newest</option>
            <option value='descending'>Newest to Oldest</option>
          </select>
        </div>
        {user ? <button className='button' onClick={() => setShowAddForm(!showAddForm)}>Upload Shared Image</button> : <h3>You must be signed in to upload or edit images!</h3>}

        {user && showAddForm && <Add type='sharedImage' closeAddFormState={closeAddFormState} />}

        <br /><br />
        {sharedImages && sharedImages.map((sharedImage) => (
          <div className='card' key={sharedImage._id}>
            <div className='card-body'>
              <img src={sharedImage.image} alt="Shared" width="500" />
              <p>Created on {new Date(sharedImage.dateFormed).toLocaleDateString()} at {new Date(sharedImage.dateFormed).toLocaleTimeString()} by {userHelper.renderUserEmail(users, sharedImage.userId)}</p>
              <p>Description: {sharedImage.description}</p>
              {sharedImage.contributors && sharedImage.contributors.length > 0 ?
              <>
                <p>Modified By:</p>
                <ul>
                  {sharedImage.contributors.map((contributor) => <li key={contributor}>{userHelper.renderUserEmail(users,contributor)}</li>)}
                </ul>
              </>
              : <></>}
              {user ? 
              <>
                <button className='button' onClick={() => handleOpenEditModal(sharedImage)}>Edit</button>
                {user.uid === sharedImage.userId ? <button className='button' onClick={() => handleOpenDeleteModal(sharedImage)}>Delete</button> : <></>}
              </>
              : <></>}
            </div>
          </div>
        ))}
        {showEditModal && <EditSharedImageModal isOpen={showEditModal} user={user} sharedImage={editImage} handleClose={handleCloseModals} />}
        {showDeleteModal && <DeleteSharedImageModal isOpen={showDeleteModal} handleClose={handleCloseModals} deleteImage={deleteImage} />}
      </div>
    );
  }
  else {return <div>No data found.</div>;}
}
