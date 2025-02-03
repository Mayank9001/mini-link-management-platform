import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar';
import Loading from '../components/Loading';
import SideBar from '../components/SideBar';
import styles from './Settings.module.css'
import { jwtDecode } from 'jwt-decode'
import { userUpdate } from '../services/user.services'
import AccountModal from '../modals/AccountModal';
import { toast } from 'react-toastify'

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const isActive = {
    dashboard :false,
    links :false,
    analytics : false,
    settings : true,
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState();
  const [newData, setNewData] = useState({
    newEmail:"",
    newName:"",
    newMobileNo:"",
  })
  const getuser = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const data = jwtDecode(token);
          setUser(data);
          if(data){
            setNewData({
              newEmail:data?data.email:"",
              newName:data?data.name:"",
              newMobileNo:data?data.mobileNo:"",
            });
          }
        } catch (error) {
          console.log("Failed to decode token:", error);
        }
      }
    };
    
    const handleSaveChange = async () =>{
      try {
        const res = await userUpdate(newData);
        const data = await res.json();
        if(res.status===200)
        {
          toast.success(data.message);
        }
        else{
          toast.error(data.message);
        }
      } catch (error) {
        console.log(error);
      }
    };
    useEffect(() => {
      getuser();
    }, []);
    return (
    <>
      <Navbar />  
      <SideBar isDashboard={isActive.dashboard} isSettings={isActive.settings} isLinks={isActive.links} isAnalytics={isActive.analytics} />
      {loading ? (
        <Loading />
      ) : (
        <div className={styles.main}>
          <div className={styles.container}>
            <div className={styles.ipt}>
              <h3>Name</h3>
              <input type='text' defaultValue={user?user.name:""} onChange={(e)=>setNewData({...newData, newName:e.target.value})}/>
            </div>
            <div className={styles.ipt}>
              <h3>Email id</h3>
              <input type='text' defaultValue={user?user.email:""} onChange={(e)=>setNewData({...newData, newEmail:e.target.value})}/>
            </div>
            <div className={`${styles.ipt} ${styles.mno}`}>
              <h3>Mobile no.</h3>
              <input type='text' defaultValue={user?user.mobileNo:""} onChange={(e)=>setNewData({...newData, newMobileNo:e.target.value})}/>
            </div>
            <div className={styles.save}>
              <button onClick={handleSaveChange}>Save Changes</button>
            </div>
            <div className={styles.delete}>
              <button onClick={()=>setIsModalOpen(true)}>Delete Account</button>
            </div>
          </div>
        </div>
      )}
      {isModalOpen && <AccountModal onClose={()=>setIsModalOpen(false)} />}
    </>
  )
}

export default Settings