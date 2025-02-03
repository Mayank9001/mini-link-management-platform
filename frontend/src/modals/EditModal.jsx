import React, { useRef, useState, useEffect } from 'react';
import styles from './CreateModal.module.css';
import { FaStarOfLife } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { IoCalendarOutline } from "react-icons/io5";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { editLink, getLink } from '../services/link.services';
import { toast } from 'react-toastify';

const EditModal = ({ id, onClose}) => {
    const modalRef = useRef();
    const [selectedDate, setSelectedDate] = useState(null);
    const [isToggle, setIsToggle] = useState(false);
    const [errors, setErrors] = useState({
        originalLink:false,
        remarks:false,
    });
    const closeModal = (e) => {
        if(modalRef.current === e.target){
            onClose();
        }
    };
    const [linkData, setLinkData] = useState({
        newOriginalLink:"",
        newRemarks:"",
        newExpirationDate:"",
    });
    const getData = async () =>{
        if(!id)
        {
            return;
        }
        try {
            const res = await getLink(id);
            const data = await res.json();
            const hasExpirationDate = !!data.link.expirationDate;
            setLinkData({
                newOriginalLink:data.link.originalLink,
                newRemarks:data.link.remarks,
                newExpirationDate:data.link.expirationDate?new Date(data.link.expirationDate):null,
            });
            setIsToggle(hasExpirationDate);
            setSelectedDate(data.link.expirationDate?new Date(data.link.expirationDate) : "");
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(()=>{
        getData();
    }, [id]);

    const handleInputChange = (field, value) => {
        setLinkData(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: false })); 
    };
    const handleUpdateLink = async (e) => {
        e.preventDefault();
        if (!linkData.newOriginalLink.trim()) {
            setErrors(prev => ({ ...prev, originalLink: true }));
            return;
        }
        if (!linkData.newRemarks.trim()) {
            setErrors(prev => ({ ...prev, remarks: true }));
            return;
        }
        try {
            const updatedData = {
                ...linkData,
                newExpirationDate: isToggle ? selectedDate : null, 
            };
            const res = await editLink(id, updatedData);
            const data = await res.json();
            if(res.status === 200)
            {
                toast.success(data.message);
                onClose();
            }
            else{
                toast.error(data.message);
            }
            onClose();
        } catch (error) {
            console.log(error);
        }
    };
  return (
    <>
        <div className={styles.main} ref={modalRef} onClick={closeModal}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h4 className={styles.title}>Edit Link</h4>
                    <div className={styles.crsicon} onClick={onClose}>
                        <RxCross2 color="white" size={25} />             
                    </div>
                </div>
                <div className={styles.destination}>
                    <h5>Destination Url
                        <span>
                            <FaStarOfLife color="red" size={5} />
                        </span>
                    </h5>
                    <input type='text' 
                        value={linkData.newOriginalLink}
                        onChange={(e)=>handleInputChange("newOriginalLink", e.target.value)} placeholder='https://web.whatsapp.com/' 
                        style={errors.originalLink ? { border: "1px solid red" } : {}} 
                        />
                    <p style={{ visibility : errors.originalLink ? "visible" : "hidden" }}>
                        {errors.originalLink && "This field is mandatory" }
                    </p>
                </div>
                <div className={styles.remarks}>
                    <h5>Remarks
                        <span>
                            <FaStarOfLife color="red" size={5} />
                        </span>
                    </h5>
                    <textarea 
                        value={linkData.newRemarks}
                        onChange={(e)=> handleInputChange("newRemarks",e.target.value)} placeholder='Add remarks' 
                        style={errors.remarks ? { border: "1px solid red" } : {}} 
                    />
                    <p style={{ visibility : errors.remarks ? "visible" : "hidden" }}>
                        {errors.remarks && "This field is mandatory" }
                    </p>
                </div>
                <div className={styles.expiration}>
                    <div className={styles.exptitle}>
                        <h5>Expiration Date</h5>
                        <span className={styles.toggle}>
                            <input type='checkbox' id='toggle' checked={isToggle} name='checkbox'onChange={()=>setIsToggle(prev => !prev)}/>
                            <label htmlFor='toggle'></label>
                        </span>
                    </div>
                    <div className={styles.date}>
                        <DatePicker
                            disabled={!isToggle}
                            className={styles.datepicker}
                            id="date-input"
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            showTimeInput
                            dateFormat="MMM d, yyyy, hh:mm aa"
                            placeholderText={selectedDate}
                            style={{width: "100%"}}
                        />
                        <span>
                            <IoCalendarOutline color="#000000"/>
                        </span>
                    </div>
                </div>
                <div className={styles.footer}>
                    <button className={styles.clear} onClick={()=>setLinkData({ originalLink: "", remarks: "", expirationDate: "" })}>Clear</button>
                    <button className={styles.createbtn} onClick={handleUpdateLink}>Save</button>
                </div>
            </div>
        </div>
    </>
  )
};

export default EditModal