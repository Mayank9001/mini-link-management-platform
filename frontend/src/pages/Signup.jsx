import { React, useState } from 'react'
import cuvette from '../assets/cuvette.png';
import m_image from '../assets/m_image.png';
import styles from './Signup.module.css';
import { useNavigate } from 'react-router-dom';
import { userRegister } from '../services/user.services';
import { toast } from 'react-toastify';

const Signup = () => {
  const navigate = useNavigate();
  
      const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobileNo: "",
        password: "",
        confirmPassword: "",
      });
      const [error, setError] = useState({});
      const validateInput = () => {
        const newError = {};
          if(!formData.name.trim()){newError.name="Name Required!"}
          if(!formData.email.trim()){newError.email="Email Required!"}
          if(!formData.mobileNo.trim()){newError.mobileNo="Mobile Number Required!"}
          if(!formData.password.trim()){newError.password="Password Required!"}
          if(formData.password !== formData.confirmPassword){newError.confirmPassword="Passwords do not match!"}
          setError(newError);
          return Object.keys(error).length === 0;
      };
      const handleSubmit = async (e) => {
          e.preventDefault();
          if(!validateInput()){
            toast.info("All Fields Required!!");  
            return;
          }
          try {
              const res = await userRegister(formData);
              const data = await res.json();
              if(res.status === 200)
              {
                toast.success(data.message);
                navigate("/login");
              }
              else if(res.status === 400){
                toast.error(data.message);
            }
            else{
                toast.info(data.message);
              }
          } catch (error) {
              console.log(error);
          }
          setFormData({
            name: "",
            email: "",
            mobileNo: "",
            password: "",
            confirmPassword: "",
          });
      };
  return (
    <>
      <div className={styles.main}>
          <div className={styles.image}>
              <img src={cuvette} alt="cuvette" className={styles.logo}/>  
              <img src={m_image} alt="m_image" className={styles.landscape} />
          </div>
          <div className={styles.buttons}>
              <button onClick={() => navigate('/signup')} className={styles.signup}>SignUp</button>
              <button onClick={() => navigate("/login")} className={styles.login}>Login</button>
          </div> 
          <p className={styles.signup1}>Join us Today!</p>
          <div className={styles.form}>
              <form onSubmit={handleSubmit}>
                  <div className={styles.name}>
                      <input type='text' value={formData.name} placeholder='Name'
                      onChange={(e) => setFormData({...formData, name:e.target.value})} required/>
                  </div>
                  <div className={styles.email}>
                      <input type='text' value={formData.email} placeholder='Email id'
                      onChange={(e) => setFormData({...formData, email:e.target.value})} required/>
                  </div>
                  <div className={styles.mobileNo}>
                      <input type='text' value={formData.mobileNo} placeholder='Mobile no.'
                      onChange={(e) => setFormData({...formData, mobileNo:e.target.value})} required/>
                  </div>
                  <div className={styles.pass}>
                      <input 
                          type='password' value={formData.password} placeholder='Password' 
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                          required/>
                  </div>
                  <div className={styles.cnfpass}>
                      <input type='password' value={formData.confirmPassword} placeholder='Confirm Password'
                      onChange={(e) => setFormData({...formData, confirmPassword:e.target.value})} required/>
                  </div>
                  <div className={styles.registerbtn}>
                      <button type='submit'>Register</button>
                  </div>
                  <div className={styles.footer}>
                      <p>Already have an account ? <a onClick={()=>navigate("/login")}>Login</a>
                      </p>
                  </div>
              </form>
          </div>
      </div>
    </>
  )
}

export default Signup