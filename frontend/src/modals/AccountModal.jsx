import React, { useRef } from 'react'
import { RxCross2 } from "react-icons/rx";
import styles from './AccountModal.module.css'
import { userDelete } from '../services/user.services'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AccountModal = ({onClose}) => {
    const modalRef = useRef();
    const navigate = useNavigate();
    const closeModal = (e)=>{
        if(modalRef.current === e.target)
        {
            onClose();
        }
    };
    const handleDelete = async () =>{
        try{
        const res = await userDelete();
        const data = await res.json();
        if(res.status===200)
        {
            localStorage.removeItem("token");
            toast.warn("Account Deleted SuccessFully😔!!");
            navigate('/login');
        }
        else{
            console.log(data.message);
        }
        }catch(error){
        console.log(error);
        }
    };
  return (
    <>
        <div className={styles.main} ref={modalRef} onClick={closeModal}>
            <div className={styles.container}>
                <div onClick={onClose} className={styles.cross}>
                    <RxCross2 size={25} className={styles.icon}/>             
                </div>
                <h3>Are you sure, you want to delete the account ?</h3>
                <div className={styles.buttons}>
                    <button className={styles.no} onClick={onClose}>NO</button>
                    <button className={styles.yes} onClick={handleDelete}>YES</button>
                </div>
            </div>
        </div>
    </>
  )
};

export default AccountModal