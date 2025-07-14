import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import "./css/SignUp.css"
import authLogo from "../assets/eat-easy logo auth.png";
import authImage from "../assets/Auth-main.png";
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
const SignUp = () => {
   const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profilePicture: ""
  });
  const [signingUp, setSigningup] = useState(false)
  const baseUrl = import.meta.env.VITE_BASE_URL
  const navigate = useNavigate()




  // handle input
  const handleInput = (e) => {
    const {name, value} = e.target
    setFormData(prev => ({...prev, [name]: value}))
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fileInput = e.target.profilePicture;
    const file = fileInput.files[0];
    const form = new FormData();
    form.append("name", formData.name)
    form.append("email", formData.email)
    form.append("password", formData.password)

    if(file){
      form.append("profilePicture", file)
    }

    if(!formData.email || !formData.name || !formData.password){
      toast.error("Please fill all the form")
      return
    }
    setSigningup(true)
    try {
        const response = await fetch(`${baseUrl}/auth/signup`, {
            method: "POST",
            body: form
        })
        const data = await response.json();
        if(data.status === "success"){
            toast.success(data.message)
            navigate("/signin")
        }
    } catch (error) {
        console.log(error)
        toast.error("SignUp failed")
    } finally{
        setSigningup(false)
    }
    
  };
  return (
    <div className='container'>
        <div className='left'>
          <Link to="/">
            <img className='ath-logo' src={authLogo} alt="" />
          </Link>
          <h5>Sign Up and enjoy your order</h5>
          <p>Sign up now to Enjoy Fast and Endless Food Orders.</p>
          <img className='auth-main-img' src={authImage} alt="" />
        </div>
        <div className='right'>
          <div className="form-container">
            <p className='already'>already have an account <Link to='/signin'>Sign In</Link></p>
            <div className='top-text'>
              <h2>Welcome to EatEasy</h2>
              <p>Suggests convenience and hassle-free ordering</p>
              <h2>Create an account</h2>
              <p>Enter your info to sign up for this app</p>
            </div>
            <form onSubmit={handleSubmit} className='form'>
              <div className='input'>
                <label htmlFor="name">FullName</label>
                <input type="text" placeholder="FullName" name='name' id='name' onChange={handleInput} />
              </div>
              <div className='input'>
                <label htmlFor="email">Email</label>
                <input type="email" placeholder="Email" name='email' id='email' onChange={handleInput}/>
              </div>
              <div className='input'>
                <label htmlFor="password">Password</label>
                <input type="password" placeholder="Password" name='password' id='password' onChange={handleInput}/>
              </div>
              <div>
                <label htmlFor="ProfilePicture">ProfilePicture</label>
                <input type="file" accept='*/' name="profilePicture" id="profilePicture" />
              </div>
              <div className='signup'>
                <button  disabled={signingUp}>
                  {signingUp ? "signing up....." : "Sign Up"}
                </button>
              </div>
              <hr />
              <div>
                <p className='privacy-policy'>By clicking continue, you agree to our <span>Terms of Service</span> and <span>Privacy Policy</span></p>
              </div>
            </form>
          </div>
        </div>

    </div>
  )
}

export default SignUp