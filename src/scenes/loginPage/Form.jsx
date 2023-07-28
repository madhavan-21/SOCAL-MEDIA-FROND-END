import { useState } from "react";
import {
    Box,
    Button,
    TextField,
    useMediaQuery,
    Typography,
    useTheme
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from 'yup';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";

const registerSchema = yup.object().shape({
    firstName: yup.string().required("required"),
    lastName: yup.string().required("required"),
    email: yup.string().email("invalied email").required("required"),
    password: yup.string().required("required"),
    location: yup.string().required("required"),
    occupation: yup.string().required("required"),
    picture: yup.string().required("required"),

})

const loginSchema = yup.object().shape({
    email: yup.string().email("invalied email").required("required"),
    password: yup.string().required("required"),
})

const intialValueRegister = {
    firstName: "",
    lastname: "",
    email: "",
    password: "",
    location: "",
    occupation: "",
    picture: "",
}

const intialValueLogin = {
    email: "",
    password: "",
}

const Form = () => {
    const [pageType, setPageType] = useState("login");
    const { palette } = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const isLogin = pageType === "login";
    const isRegister = pageType === "register";

    const register = async (values, onSubmitprops) => {
        //this 
        const formData = new FormData();
        for (let value in values) {
            formData.append(value, values[value])
        }
        formData.append("picturePath", values.picture.name)
        const  savedUserResponse = await fetch(
            "https://sm-backend-i34e.onrender.com/auth/register",
            {
                method:"POST",
                body:formData,
    
            }
    
        );
        const savedUser = await savedUserResponse.json();
        onSubmitprops.resetForm();

        if(savedUser){
            setPageType("login");
        }



    }
        const login = async(values,onSubmitprops)=>{
            const  loggedInResponse = await fetch(
                "https://sm-backend-i34e.onrender.com/auth/login",
                {
                    method:"POST",
                    headers:{"Content-Type":"application/json"},
                    body:JSON.stringify(values)
        
                }
        
            );
            const loggedIn = await loggedInResponse.json();
            onSubmitprops.resetForm();
            if(loggedIn){
                dispatch(
                    setLogin({
                        user:loggedIn.user,
                        token:loggedIn.token,
                    })
                )
                navigate("/home")
            }

        }
   

    const handleFormSubmit = async (values, onSubmitprops) => {
        if (isLogin) await login(values, onSubmitprops);
        if (isRegister) await register(values, onSubmitprops)
    };

    return (
        <Formik
            onSubmit={handleFormSubmit}
            initialValues={isLogin ? intialValueLogin : intialValueRegister}
            validationSchema={isLogin ? loginSchema : registerSchema}
        >
            {({
                values,
                errors,
                touched,
                handleBlur,
                handleChange,
                handleSubmit,
                setFieldValue,
                resetForm,
            }) => (
                <form onSubmit={handleSubmit}>
                    <Box
                        display="grid"
                        gap="30px"
                        gridTemplateColumns="repeat(4,minmax(0,1fr))"
                        sx={{
                            "&>div": { gridColumn: isNonMobile ? undefined : "span 4" }
                        }}
                    >
                        {isRegister && (
                            <>
                                <TextField
                                    label="First Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.firstName}
                                    name='firstName'
                                    error={Boolean(touched.firstName) && (errors.firstName)}
                                    helperText={touched.firstName && errors.firstName}
                                    sx={{ gridColumn: "span 2" }}
                                />
                                <TextField
                                    label="last Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.lastName}
                                    name='lastName'
                                    error={Boolean(touched.lastName) && (errors.lastName)}
                                    helperText={touched.lastName && errors.lastName}
                                    sx={{ gridColumn: "span 2" }}
                                />
                                <TextField
                                    label="Location"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.location}
                                    name='location'
                                    error={Boolean(touched.location) && (errors.location)}
                                    helperText={touched.location && errors.location}
                                    sx={{ gridColumn: "span 2" }}
                                />
                                <TextField
                                    label="Occupation"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.occupation}
                                    name='occupation'
                                    error={Boolean(touched.occupation) && (errors.occupation)}
                                    helperText={touched.occupation && errors.occupation}
                                    sx={{ gridColumn: "span 2" }}
                                />
                                <Box
                                    gridColumn="span 4"
                                    border={`1px solid ${palette.neutral.medium}`}
                                    borderRadious="5px"
                                    p="1rem"
                                >
                                    <Dropzone
                                        acceptedFiles=".jpg,.jpeg,.png"
                                        multiple={false}
                                        onDrop={(acceptedFiles) =>
                                            setFieldValue("picture", acceptedFiles[0])
                                        }
                                    >
                                        {({ getRootProps, getInputProps }) => (
                                            <Box {...getRootProps()}
                                                border={`2px dashed ${palette.primary.main}`}
                                                p="1rem"
                                                sx={{ "&:hover": { cursor: "pointer" } }}
                                            >
                                                <input{...getInputProps()} />
                                                {!values.picture ? (<p>Add picture here</p>) : (<FlexBetween>
                                                    <Typography>{values.picture.name}</Typography>
                                                    <EditOutlinedIcon />
                                                </FlexBetween>
                                                )}
                                            </Box>
                                        )}
                                    </Dropzone>

                                </Box>
                            </>
                        )}
                        <TextField
                            label="Email"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.email}
                            name='email'
                            error={Boolean(touched.email) && (errors.email)}
                            helperText={touched.email && errors.email}
                            sx={{ gridColumn: "span 4" }}
                        />
                        <TextField
                            label="PassWord"
                            type="password"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.password}
                            name='password'
                            error={Boolean(touched.password) && Boolean(errors.password)}
                            helperText={touched.password && errors.password}
                            sx={{ gridColumn: "span 4" }}
                        />

                    </Box>

                    {/*buttons */}
                    <Box>
                        <Button
                            fullWidth
                            type="submit"
                            sx={{
                                m: "2rem 0",
                                p: "1rem",
                                backgroundColor: palette.primary.main,
                                color: palette.background.alt,
                                "&hover": { color: palette.primary.main },
                            }}
                        >
                            {isLogin ? "LOGIN" : "REGISTER"}
                        </Button>
                        <Typography
                            onClick={() => {
                                setPageType(isLogin ? "register" : "login");
                                resetForm();
                            }}
                            sx={{
                                textDecoration: "underline",
                                color: palette.primary.main,
                                "&hover": {
                                    cursor: "pointer",
                                    color: palette.primary.light
                                },
                            }}
                        >
                            {isLogin ? "Don't have an account? Sign Up here." : "Already have account? Login here."}
                        </Typography>
                    </Box>
                </form>
            )}

        </Formik>
    )
}

export default Form;