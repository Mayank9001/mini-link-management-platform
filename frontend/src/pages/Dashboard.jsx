import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import SideBar from '../components/SideBar'
import { jwtDecode } from 'jwt-decode';
import { userDashboard } from '../services/user.services'
import styles from './Dashboard.module.css'
import Loading from '../components/Loading';

const Dashboard = () => {
  const [user, setUser] = useState();
  const [totalClicks, setTotalClicls] = useState();
  const [deviceTypeClicks, setDeviceTypeClicks] = useState([]);
  const [dateWiseClicks, setDateWiseClicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const isActive = {
    dashboard :true,
    links :false,
    analytics : false,
    settings : false,
  };
  const getuser = () => {
    const token = localStorage.getItem("token");
    if(token)
    {
      try {
        const data = jwtDecode(token);
        setUser(data);
      } catch (error) {
        console.log(error);
      }
    }
  };
  const getdashboard = async () =>{
    setLoading(true);
    try {
      const res = await userDashboard();
      const temp = await res.json();
      setTotalClicls(temp.data.totalClicks);
      setDeviceTypeClicks(temp.data.deviceTypeClicks);
      setDateWiseClicks(temp.data.dateWiseClicks);
    }catch(error){
      console.log(error);
    }
    setLoading(false);
  };
  const sortedDateWiseClicks = dateWiseClicks.length > 0 ? [...dateWiseClicks].sort((a, b) => {
    const dateA = new Date(a._id.split("-").reverse().join("-"));
    const dateB = new Date(b._id.split("-").reverse().join("-"));
    return dateB - dateA;
  }) : [];
  const sortedDeviceClicks = deviceTypeClicks.length > 0 ? [...deviceTypeClicks].sort((a, b) => { return b.clicks - a.clicks}) : [];

  useEffect(()=>{
    getuser();
  }, []);

  useEffect(()=>{
    if(user)getdashboard();
  },[user]);

  return (
    <>
      <Navbar />  
      <SideBar isDashboard={isActive.dashboard} isSettings={isActive.settings} isLinks={isActive.links} isAnalytics={isActive.analytics} />
      {loading ? (
        <Loading />
      ) : (
        <div className={styles.main}>
          <div className={styles.clicks}>
            Total Clicks
            <span>{totalClicks? totalClicks : "0"}</span>
          </div>
          <div className={styles.chart}>
            <div className={styles.boxes}>
              <span className={styles.title}>
                Date-wise Clicks
              </span>
              <div className={styles.chartcontainer}>
                {sortedDateWiseClicks.map(({ _id, clicks }) => (
                  <div key={_id} className={styles.chartrow}>
                    <span className={styles.datelabel}>{_id}</span>
                    <div className={styles.barcontainer}>
                      <div
                        className={styles.bar}
                        style={{ width: `${(clicks / totalClicks) * 100}%` }}
                      ></div>
                    </div>
                    <span className={styles.clickcount}>{clicks}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.boxes}>
              <span className={styles.title}>
                  Click Devices
              </span>
              <div className={styles.chartcontainer}>
                {sortedDeviceClicks.map(({ _id, clicks }) => (
                  <div key={_id} className={styles.chartrow}>
                    <span className={styles.devicelabel}>{_id}</span>
                    <div className={styles.barcontainer}>
                      <div
                        className={styles.bar}
                        style={{ width: `${(clicks / totalClicks) * 100}%` }}
                      ></div>
                    </div>
                    <span className={styles.clickcount}>{clicks}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Dashboard