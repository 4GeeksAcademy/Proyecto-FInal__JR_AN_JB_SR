import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../login.css';

export const UserProfile = () => {
    const [user, setUser] = useState({ nombre: '', email: '' });
    const [profilePic, setProfilePic] = useState(null);
    const [loading, setLoading] = useState(true);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [newUserName, setNewUserName] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);


    const CLOUDINARY_NAME = 'dbzf7l6fd';
    const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_NAME}/upload`;
    const CLOUDINARY_UPLOAD_PRESET = 'BecerraJD';


    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('jwt_token');
                if (!token) {
                    navigate('/login');
                    return;
                }
                
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}profile`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });

                if (!response.ok) {
                    throw new Error('Error al obtener los datos del perfil');
                }

                const data = await response.json();
                setUser({ nombre: data.nombre, email: data.email });
                setProfilePic(data.foto_usuario);
                setNewUserName(data.nombre);
            } catch (error) {
                console.error("Error al cargar el perfil del usuario:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [navigate]);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleSaveChanges = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('jwt_token');
            if (!token) {
                navigate('/login');
                throw new Error('No se encontró el token de usuario.');
            }

            let photoUrl = profilePic;

            if (selectedFile) {
                const formData = new FormData();
                formData.append('file', selectedFile);
                formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

                const cloudinaryResponse = await fetch(CLOUDINARY_URL, {
                    method: 'POST',
                    body: formData,
                });

                if (!cloudinaryResponse.ok) {
                    throw new Error('Error al subir la imagen a Cloudinary.');
                }
                const cloudinaryData = await cloudinaryResponse.json();
                photoUrl = cloudinaryData.secure_url;
            }

            const updateData = {
                nombre: newUserName,
                foto_usuario: photoUrl
            };
            
            const backendResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}user/update-profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updateData),
            });

            if (!backendResponse.ok) {
                const errorData = await backendResponse.json();
                throw new Error(errorData.msg || 'Error al actualizar el perfil en el backend.');
            }

            const updatedUser = await backendResponse.json();
            setUser({ nombre: updatedUser.user.nombre, email: updatedUser.user.email });
            setProfilePic(updatedUser.user.foto_usuario);
            setNewUserName(updatedUser.user.nombre);
            
            setIsEditing(false);
        } catch (error) {
            console.error("Error en la actualización del perfil:", error);
        } finally {
            setLoading(false);
            setSelectedFile(null);
        }
    };
    
    const handleCancelEdit = () => {
        setIsEditing(false);
        setNewUserName(user.nombre);
        setSelectedFile(null);
    };

    const handleShowDeleteModal = () => {
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
    };

    const handleConfirmDeletePic = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('jwt_token');
            if (!token) {
                navigate('/login');
                throw new Error('No se encontró el token de usuario.');
            }

            const updateData = {
                foto_usuario: null 
            };
            
            const backendResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}user/update-profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updateData),
            });

            if (!backendResponse.ok) {
                const errorData = await backendResponse.json();
                throw new Error(errorData.msg || 'Error al eliminar la foto del perfil.');
            }

            const updatedUser = await backendResponse.json();
            setProfilePic(updatedUser.user.foto_usuario);
            setNewUserName(updatedUser.user.nombre);
            
            setIsEditing(false);
        } catch (error) {
            console.error("Error al eliminar la foto de perfil:", error);
        } finally {
            setLoading(false);
            handleCloseDeleteModal();
        }
    };


    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="d-flex justify-content-center align-items-center">
            {isEditing ? (
                <div className="card w-50 h-50 bg-white align-items-center text-center p-4">
                    <div className="mb-3">
                        <label htmlFor="fileInput" className="fs-4 form-label">Cambiar foto de perfil</label>
                        <input
                            type="file"
                            id="fileInput"
                            className="form-control"
                            onChange={handleFileChange}
                            accept="image/*"
                        />
                    </div>
                    <div className="profile-avatar mb-3">
                        {profilePic ? (
                            <>
                                <img src={profilePic} alt="Foto de perfil" className="profile-pic-img" />
                                <button type="button" className="btn btn-sm btn-danger profile-delete-btn" onClick={handleShowDeleteModal} title="Eliminar foto de perfil">
                                    <i className="fas fa-trash-alt"></i>
                                </button>
                            </>
                        ) : (
                            <i className="fas fa-user-circle"></i>
                        )}
                    </div>
                    
                    <div className="mb-3">
                        <label htmlFor="nameInput" className="fs-4 form-label">Nombre</label>
                        <input
                            type="text"
                            id="nameInput"
                            className="form-control text-center"
                            value={newUserName}
                            onChange={(e) => setNewUserName(e.target.value)}
                        />
                    </div>
                    
                    <div className="d-flex justify-content-between w-100">
                        <button className="btn btn-success me-2" onClick={handleSaveChanges}>
                            Guardar cambios
                        </button>
                        <button className="btn btn-secondary" onClick={handleCancelEdit}>
                            Cancelar
                        </button>
                    </div>
                </div>
            ) : (
                <div className="card w-50 h-50 bg-white align-items-center text-center p-4">
                    <div className="profile-avatar my-5">
                        {profilePic ? (
                            <img src={profilePic} alt="Foto de perfil" className="profile-pic-img" />
                        ) : (
                            <i className="fas fa-user-circle"></i>
                        )}
                    </div>
                    <h2 className="fw-bold">{user.nombre}</h2>
                    <h5 className="text-secondary fs-5 text mb-4">{user.email}</h5>
                    <div>
                        <button className="text-white btn btn-info mb-3" onClick={() => setIsEditing(true)}>
                            Editar perfil
                        </button>
                    </div>
                </div>
            )}
            <div className={`modal fade ${showDeleteModal ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Confirmar Eliminación</h5>
                            <button type="button" className="btn-close" onClick={handleCloseDeleteModal} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>¿Estás seguro de que quieres eliminar tu foto de perfil?</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger" onClick={handleConfirmDeletePic}>
                                Sí, eliminar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};