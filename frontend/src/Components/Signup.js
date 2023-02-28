import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/Signup.css";
const Signup = () => {
  const history = useNavigate();
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const sendRequest = async () => {
    const res = await axios
      .post("http://localhost:5000/api/signup", {
        name: inputs.name,
        email: inputs.email,
        password: inputs.password,
      })
      .catch((err) => console.log(err));
    const data = await res.data;
    if (data.message === "user already exists") {
      alert("user already exists!! please login");
      history("/login");
    } else {
      history("/login");
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // send http request
    sendRequest();
  };
  return (
    <div>
      <div className="bg-img">
        <div className="signup">
          <form onSubmit={handleSubmit}>
            <Box
              marginLeft="auto"
              marginRight="auto"
              width={300}
              display="flex"
              flexDirection={"column"}
              justifyContent="center"
              alignItems="center"
              height={350}
            >
              <Typography variant="h4">Signup</Typography>

              <TextField
                name="name"
                onChange={handleChange}
                value={inputs.name}
                variant="outlined"
                placeholder="Name"
                margin="normal"
                border={1}
                style={{ color: "black" }}
              />
              <TextField
                name="email"
                onChange={handleChange}
                type={"email"}
                value={inputs.email}
                variant="outlined"
                placeholder="Email"
                margin="normal"
              />
              <TextField
                name="password"
                onChange={handleChange}
                type="password"
                value={inputs.password}
                variant="outlined"
                placeholder="Password"
                margin="normal"
              />
              <Button variant="contained" type="submit">
                Signup
              </Button>
            </Box>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
