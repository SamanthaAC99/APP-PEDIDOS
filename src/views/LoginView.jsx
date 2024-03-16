import { useState } from "react";
import Stack from '@mui/material/Stack';
import FilledInput from '@mui/material/FilledInput';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import PersonIcon from '@mui/icons-material/Person';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import logo from "../assets/logofinal.png";
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import {Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Grid from '@mui/material/Grid';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import NumbersIcon from '@mui/icons-material/Numbers';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import { db,auth } from "../firebase/firebase-config";
import validator from 'validator';
import Swal from "sweetalert2";
import { setUser } from "../features/auth/userSlice";
import { doc, setDoc,getDoc } from "firebase/firestore"; 
import {createUserWithEmailAndPassword,signInWithEmailAndPassword } from "firebase/auth";
import { useDispatch } from 'react-redux';

export default function LoginView(){
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [showPassword3, setShowPassword3] = useState(false);
    const [modalRegistro, setModalRegistro] = useState(false);
    const [ruc,setRuc] = useState("");
    const [telefono,setTelefono] = useState("");
    const [razon,setRazon] = useState("");
    const [tipo,setTipo] = useState(1);
    const [email,setEmail] = useState("");
    const [usuario,setUsuario] = useState("");
    const [password,setPassword] = useState("");
    const [password2,setPassword2] = useState("");
    const [open,setOpen] = useState(false);
    const dispatch = useDispatch();
    const [formFlags,setFormFlags] = useState({
        ruc:false,
        phone:false,
        razon:false,
        tipo:false,
        email:false,
        user:false,
        password:false,
    })
    const handleClickShowPassword = () => setShowPassword((show) => !show);  
    const handleClickShowPassword2 = () => setShowPassword2((show) => !show);  
    const handleClickShowPassword3 = () => setShowPassword3((show) => !show);  
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const handleMouseDownPassword2 = (event) => {
        event.preventDefault();
    };
    const handleMouseDownPassword3 = (event) => {
        event.preventDefault();
    };

    const registrarUsuario = async()=>{
        setOpen(true)
        let banderas = JSON.parse(JSON.stringify(formFlags))
        if(  validator.isEmail(email) ){
            banderas.email = false
        }else{
            banderas.email = true
        }
        if(validator.isNumeric(ruc)){
            banderas.ruc = false
        }else{
            banderas.ruc = true
        }
        if(validator.isNumeric(telefono)){
            banderas.phone = false
        }else{
            banderas.phone = true
        }
        
        let is_same = password === password2
        setFormFlags(banderas)
        if( banderas.email || banderas.ruc || banderas.phone || !is_same){
            Swal.fire({
                title: "Error",
                text: "Datos Invalidos!",
                icon: "error"
            });
            setOpen(false)
        }else{
        
            let new_user = {
                email:email,
                password:password,
                phone:telefono,
                razon:razon,
                ruc:ruc,
                tipo:tipo,
                usuario:usuario,
                id:"",
                profile:false,
                profile_url:'',
                signature:false,
                signature_url:'',
                signature_name:'',
                ciudad:'',
                contabilidad:true,
                factura:true,
                direccion_ruc:'',
                nombre_comercial:'',
                direcciones:[],
                firma_password:'',
                categorias:[],
                bill_code1:"001",
                bill_code2:"001",
                bill_code3:"000000001"
            }
            createUserWithEmailAndPassword(auth, email, password)
            .then(async(userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log(user)
                new_user.id = user.uid
                await setDoc(doc(db, "usuarios", user.uid), new_user);
                setOpen(false)
                Swal.fire({
                    title: "Felicidades",
                    text: "Cuenta Registrada Satisfactoriamente!",
                    icon: "success"
                });
                setModalRegistro(false)
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setOpen(false)
                // ..
            });
           
           
    }
  
    }
    const IniciarSesion = ()=>{
        setOpen(true)
        signInWithEmailAndPassword(auth, email, password)
        .then(async(userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log(user)
            const ref = doc(db, "usuarios",user.uid);
            const docSnap = await getDoc(ref);
            
            if (docSnap.exists()) {
              let data = docSnap.data();
              dispatch(setUser(data));
              navigate("/dashboard")
            }
           
            // ...
            setOpen(false)
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage)
            setOpen(false)
        });

    }
    const handleChange = (event) => {
      setTipo(event.target.value);
    };
  
    const navigate = useNavigate(); 
    const toggle = () => setModalRegistro(!modalRegistro);
 
    

    return(
            <>
                <div style={{background:"#2C3E50",height:"100vh",width:"100%",display:"flex",justifyContent:"center",alignItems:"center"}}>         
                        <div style={{height:"33em",width:"20em",padding:25,backgroundColor:"white",borderRadius:"10px"}}>
                            <Stack spacing={2} alignItems={"center"} justifyContent={"center"}>
                            <img src={logo} alt='logo de la empresa' height={180} width={200}/> 
                            <FormControl fullWidth variant="filled">
                                <InputLabel htmlFor="filled-adornment-password">Usuario</InputLabel>
                                <FilledInput
                                    id="filled-adornment-password"
                                        type="text"
                                        onChange={(event) => {
                                            setEmail(event.target.value);
                                        }}
                                        endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                            aria-label="toggle password visibility"
                                            edge="end"
                                            >
                                                <PersonIcon/>
                                            </IconButton>
                                        </InputAdornment>
                                        }
                                        label="Password"
                                    />
                                </FormControl>
                                <FormControl fullWidth  variant="filled">
                                <InputLabel htmlFor="filled-adornment-password">Contraseña</InputLabel>
                                <FilledInput
                                    id="filled-adornment-password"
                                    type={showPassword ? 'text' : 'password'}
                                    onChange={(event) => {
                                            setPassword(event.target.value);
                                        }}
                                    endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                        >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                    }
                                />
                                </FormControl>
                                <Button variant="contained" color="verde2" fullWidth onClick={IniciarSesion}>Iniciar Sesion</Button>
                                <Button variant="contained" fullWidth onClick={toggle}>Registrar</Button>
                            </Stack>
                        </div>
                 
                </div>
                <Modal isOpen={modalRegistro} toggle={toggle} >
                    <ModalHeader toggle={toggle} >Registrar Nueva Cuenta</ModalHeader>
                    <ModalBody>
                    
                        <Grid container spacing={2}>
                        <Grid item md={7} xs={12}>
                            <FormControl fullWidth variant="filled">
                                <InputLabel htmlFor="filled-adornment-password">Ruc</InputLabel>
                                <FilledInput
                   
                                        type="text"
                                        onChange={(event) => {
                                            setRuc(event.target.value);
                                        }}
                                        error={formFlags.ruc}
                                        endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                            aria-label="toggle password visibility"
                                            edge="end"
                                            >
                                                <NumbersIcon/>
                                            </IconButton>
                                        </InputAdornment>
                                        }
                                        label="Password"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={5} xs={12}>
                            <FormControl fullWidth variant="filled">
                                <InputLabel htmlFor="filled-adornment-password">Telefono</InputLabel>
                                <FilledInput
                     
                                        type="text"
                                        onChange={(event) => {
                                            setTelefono(event.target.value);
                                        }}
                                        error = {formFlags.phone}
                                        endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                            aria-label="toggle password visibility"
                                            
                                            edge="end"
                                            >
                                                <PhoneAndroidIcon/>
                                            </IconButton>
                                        </InputAdornment>
                                        }
                                        label="Password"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                            <FormControl fullWidth variant="filled">
                                <InputLabel htmlFor="filled-adornment-password">Razon Social</InputLabel>
                                <FilledInput
                                        onChange={(event) => {
                                            setRazon(event.target.value);
                                        }}
                                        error={false}
                                        type="text"
                                        endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                            aria-label="toggle password visibility"
                
                                            edge="end"
                                            >
                                                <DriveFileRenameOutlineIcon/>
                                            </IconButton>
                                        </InputAdornment>
                                        }
                                        label="Password"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                          
                            <FormControl fullWidth variant="filled">
                                <InputLabel htmlFor="filled-adornment-password">Tipo de Persona</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    error={formFlags.tipo}
                                    value={tipo}
                                    label="Tipo de Persona"
                                    onChange={handleChange}
                                >
                                    <MenuItem value={1}>Natural</MenuItem>
                                    <MenuItem value={2}>Juridica</MenuItem>
                                </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                            <FormControl fullWidth variant="filled">
                                <InputLabel htmlFor="filled-adornment-password">Email</InputLabel>
                                <FilledInput
                                        onChange={(event) => {
                                            setEmail(event.target.value);
                                        }}
                                        error={formFlags.email}
                                        type="text"
                                        endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton aria-label="toggle password visibility" edge="end"
                                                >
                                            <AlternateEmailIcon/>
                                            </IconButton>
                                        </InputAdornment>
                                        }
                                        label="Password"
                                    />
                                </FormControl>
                            </Grid>
                          
                            <Grid item xs={12}>
                            <FormControl fullWidth variant="filled">
                                <InputLabel htmlFor="filled-adornment-password">Usuario</InputLabel>
                                <FilledInput
                                        onChange={(event) => {
                                            setUsuario(event.target.value);
                                        }}
                                        error={formFlags.user}
                                        type="text"
                                        endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                            aria-label="toggle password visibility"
                
                                            edge="end"
                                            >
                                                <PersonIcon/>
                                            </IconButton>
                                        </InputAdornment>
                                        }
                                        label="Password"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                            <FormControl fullWidth  variant="filled">
                                <InputLabel htmlFor="filled-adornment-password">Contraseña</InputLabel>
                                <FilledInput
                                    onChange={(event) => {
                                        setPassword(event.target.value);
                                    }}
                                    error={formFlags.password}
                                    type={showPassword2 ? 'text' : 'password'}
                                    endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword2}
                                        onMouseDown={handleMouseDownPassword2}
                                        edge="end"
                                        >
                                        {showPassword2 ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                    }
                                />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                            <FormControl fullWidth  variant="filled">
                                <InputLabel htmlFor="filled-adornment-password">Repita Contraseña</InputLabel>
                                <FilledInput
                                    onChange={(event) => {
                                        setPassword2(event.target.value);
                                    }}
  
                                    type={showPassword3 ? 'text' : 'password'}
                                    endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword3}
                                        onMouseDown={handleMouseDownPassword3}
                                        edge="end"
                                        >
                                        {showPassword3 ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                    }
                                />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </ModalBody>
                    <ModalFooter>
                    <Button color="primary" onClick={registrarUsuario}>
                        Crear Cuenta
                    </Button>{' '}
                    <Button color="secondary" onClick={toggle}>
                        Cancelar
                    </Button>
                    </ModalFooter>
                </Modal>
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={open}
  
                    >
                    <CircularProgress color="inherit" />
                </Backdrop>
            </>
        );
}