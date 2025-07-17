import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../Hooks/useAuth'

const VerifyAccount = () => {
    const {token} = useParams()
    const {verifyAccount, verifyingAccount, verificationData} = useAuth();
    useEffect(()=>{
      verifyAccount(token)
    },[token, verifyAccount])

    // console.log(verificationData)
    
  return (
    <div>
  
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <h1>Verify Account</h1>
        {verifyingAccount ? (
          <p style={{ fontSize: "1.2rem" }}>Verifying account...</p>
        ) : (
          <p style={{
            fontSize: "1.2rem",
            color: verificationData?.status === "error" ? "red" : "green"
          }}>
            {verificationData?.message}
          </p>
        )}
      </div>

    </div>
  )
}

export default VerifyAccount