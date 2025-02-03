import React, { useRef } from 'react'
import { RxCross2 } from "react-icons/rx";
import styles from './AccountModal.module.css'
import { deleteLink } from '../services/link.services'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const DeleteModal = ({id, onClose}) => {
    console.log(id);
    const modalRef = useRef();
    const navigate = useNavigate();
    const closeModal = (e)=>{
        if(modalRef.current === e.target)
        {
            onClose();
        }
    };
    const handleDelete = async () =>{
        try {
            const res = await deleteLink(id);
            if(res.status === 200)
            {
                toast.success('Link deleted successfully');
            }
            else
            {
                toast.error('Failed to delete link');
            }
        } catch (error) {
            console.log(error);
        }
        onClose();
    };
  return (
    <>
        <div className={styles.main} ref={modalRef} onClick={closeModal}>
            <div className={styles.container}>
                <div onClick={onClose} className={styles.cross}>
                    <RxCross2 size={25} className={styles.icon}/>             
                </div>
                <h3>Are you sure, you want to remove it ?</h3>
                <div className={styles.buttons}>
                    <button className={styles.no} onClick={onClose}>NO</button>
                    <button className={styles.yes} onClick={handleDelete}>YES</button>
                </div>
            </div>
        </div>
    </>
  )
};

export default DeleteModal