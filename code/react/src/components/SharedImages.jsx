import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import queries from '../queries';
import Add from './Add';
import EditSharedImageModal from './EditSharedImageModal';
import DeleteSharedImageModal from './DeleteSharedImageModal';
import Navigation from './Navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase-src';

export default function SharedImages() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editImage, setEditImage] = useState(null);
  const [deleteImage, setDeleteImage] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Main query for shared images
  const { loading, error, data } = useQuery(queries.GET_SHARED_IMAGES, {
      fetchPolicy: 'cache-and-network',
  });
    
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
    navigate("/SharedImages");
  };

  const getUser = (users, userId) => {
    if(users){
      let user = users.find((user) => user._id === userId);
      if(user)
        return user;
      else
        return undefined;
    }
  };

  const renderUserEmail= (users, userId) => {
    let user = getUser(users, userId);
    if(user && user.email)
      return user.email;
    else
      return undefined;
  };

  //if (loading || userLoading) return <div>Loading...</div>;
  //if (error || userError) return <div>Error: {error ? error.message : userError.message}</div>;
  //if (!data) return <div>No data found.</div>;

  if(data && usersData && usersData.data && usersData.data.users){
    const { sharedImages } = data;
    const users = usersData.data.users;
    return (
      <div>
        <h1>Welcome to the Shared Images Page!</h1>
        <h3>Here you can upload images and edit images.</h3>
        <Navigation />
        <button className='button' onClick={() => setShowAddForm(!showAddForm)}>Upload Shared Image</button>
        {showAddForm && <Add type='sharedImage' closeAddFormState={closeAddFormState} />}
        <br /><br />
        {sharedImages.map((sharedImage) => (
          <div className='card' key={sharedImage._id}>
            <div className='card-body'>
              <h2 className='card-title'>User posted by: {renderUserEmail(users, sharedImage.userId)}</h2>
              
              <img src={sharedImage.image} alt="Shared" width="500" />
              <p>Description: {sharedImage.description}</p>
              <button className='button' onClick={() => handleOpenEditModal(sharedImage)}>Edit</button>
              <button className='button' onClick={() => handleOpenDeleteModal(sharedImage)}>Delete</button>
            </div>
          </div>
        ))}
        {showEditModal && <EditSharedImageModal isOpen={showEditModal} sharedImage={editImage} handleClose={handleCloseModals} />}
        {showDeleteModal && <DeleteSharedImageModal isOpen={showDeleteModal} handleClose={handleCloseModals} deleteImage={deleteImage} />}
      </div>
    );
  }
  else {return <div>No data found.</div>;}
}
