import { signInWithEmailAndPassword } from 'firebase/auth'
import React,{useState} from 'react'
import { useNavigate} from 'react-router-dom'
import { auth } from '../firebase.jsx'
import { NavLink } from 'react-router-dom'

function Login(){
  const navigate = useNavigate()
    const [user,setUser] = useState({
        
        email:"",
        password:"",  
        
    })

    const [errorMess, setErrorMess] = useState("")
    const handelChange = (e)=>
    {
        
        const {name, value} = e.target
        
        setUser({
          ...user,
          [name]:value
        })
    }
    const login = async()=>{

        const { email, password} = user
        
        if(email && password && password.length>=6)
        {
            await signInWithEmailAndPassword(auth, email, password)
            .then(async(res)=>{
              
              navigate("/dashboard")
            })
            .catch((err)=>{setErrorMess(err.message)})
            
        }
        else if(password.length<6){
            setErrorMess("password size required more than 6")
        }
        else
        {
           setErrorMess("Fill all fild")
           return
        }
    }
  return (
    <section className="vh-100 " style={{color: "#d3d3d3"}}>
      
      <div className="container py-5 h-100">
        <div className="row d-flex align-items-center justify-content-center h-100">
          <div className="col-md-8 col-lg-7 col-xl-6">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
              className="img-fluid"
              alt="Phone image"
            />
          </div>
          <div className="col-md-7 col-lg-5 col-xl-5 offset-xl-1 text-black">
            <form>
              {/* Email input */}
              <div className="form-outline mb-4 ">
                <input
                  type="email"
                  name="email" 
                  id="form1Example13"
                  className="form-control form-control-lg"
                  value={user.email} onChange={handelChange}
                />
                <label className="form-label" htmlFor="form1Example13">
                  Email address
                </label>
              </div>

              {/* Password input */}
              <div className="form-outline mb-4">
                <input
                  type="password"
                  name="password" 
                  id="form1Example23"
                  className="form-control form-control-lg"
                  value={user.password} onChange={handelChange}
                />
                <label className="form-label" htmlFor="form1Example23">
                  Password
                </label>
              </div>

              <div className="d-flex justify-content-around align-items-center mb-4">                
                <label className=" fw-bold text-danger">{errorMess}</label>
              </div>

              {/* Submit button */}
              <div className="position-relative p-sm-2">
                <a
                  type="button"
                  
                  onClick={login}
                  className="position-absolute start-0 btn btn-primary btn-lg btn-block"
                >
                  Sign in
                </a>
                <NavLink
                  type="button"
                  to='/register'
                  className="position-absolute end-0 btn btn-outline-secondary btn-lg btn-block "
                >
                  Sign up
                </NavLink>
              </div>

              
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Login