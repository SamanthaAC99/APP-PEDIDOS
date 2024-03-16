import { useState, useEffect } from "react";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FilledInput from '@mui/material/FilledInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import PersonIcon from '@mui/icons-material/Person';
import { doc, updateDoc } from "firebase/firestore";
import { db, storage } from "../firebase/firebase-config";
import Button from '@mui/material/Button';
import { useSelector } from 'react-redux';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import Stack from '@mui/material/Stack';
import NumbersIcon from '@mui/icons-material/Numbers';
import Autocomplete from '@mui/material/Autocomplete';
import dataEcu from "../scripts/provincias.json";
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import DoneIcon from '@mui/icons-material/Done';
import FileUploadButton from "../components/fileUploadButton";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Chip from '@mui/material/Chip';
import ProfilePhoto from "../components/profile-phot";
import { useDispatch } from 'react-redux';
import { setUser } from "../features/auth/userSlice";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { setLoading } from "../features/menu/menuSlice";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from "sweetalert2";
export default function ConfigView() {
    
    const [showPassword, setShowPassword] = useState(false);
    const [ciudades, setCiudades] = useState([]);
    const [currentDireccion,setCurrentDireccion] = useState({});
    const [ciudad,setCiudad] = useState('');
    const [factura, setFactura] = useState(false)
    const [password, setPassword] = useState("");
    const [signatureFile, setSignatureFile] = useState(null);
    const [profileFile, setProfileFile] = useState(null);
    const [imagenURL, setImagenURL] = useState(null);
    const [contabilidad,setContabilidad] = useState(false);
    const [modalEditarDirecciones,setModalEditarDirecciones] = useState(false);
    const [direccionRuc,setDireccionRuc]  = useState("");
    const [nombreComercial,setNombreComercial]  = useState("");
    const [modalDireccion,setModalDireccion] = useState(false);
    const [codeDireccion,setCodeDireccion] = useState("");
 
    const [code1,setCode1] = useState("001")
    const [code2,setCode2] = useState("001")
    const [code3,setCode3] = useState("000000001")
    const dispatch = useDispatch();
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const [direcciones,setDirecciones] = useState([{}])
    const userState = useSelector(state => state.auth);
    const [defectDirection,setDefectDirection] = useState(userState.defect_direction);
    const getData = () => {

        let final_data = []
        for (let i = 1; i <= 23; i++) {
            let canton_code = i * 100
            let cantones = dataEcu[i]['cantones']
            let provincia = dataEcu[i]['provincia']

            let counter = Object.keys(cantones).length;

            for (let j = 1; j <= counter; j++) {
                let dec = canton_code + j
                let canton = dataEcu[i]['cantones'][dec]['canton']
                let nombre = provincia + ' - ' + canton
                final_data.push(nombre)
            }

        }
        setCiudades(final_data)
        setCiudad(userState.ciudad)
        setContabilidad(userState.contabilidad)
        setFactura(userState.factura)
        setPassword(userState.firma_password)
        setDirecciones(userState.direcciones)
        setCode1(userState.bill_code1)
        setCode2(userState.bill_code2)
        setCode3(userState.bill_code3)
    }


    const handleChangeContabilidad = (event) => {
        setContabilidad(event.target.value);
    };
    
    const actualizarDatos = async () => {
        dispatch(setLoading(true));
        const user_ref = doc(db, "usuarios", userState.id);
        let user_copy = JSON.parse(JSON.stringify(userState))
        let url_profile = ''
        if (profileFile !== null) {
            const spaceRef = ref(storage, `profiles/${profileFile.name}`);
            await uploadBytes(spaceRef, profileFile).then(async (snapshot) => {
                console.log('Uploaded an array!');
                await getDownloadURL(snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    url_profile = downloadURL
                });
            });
            user_copy['profile'] = true
            user_copy['profile_url'] = url_profile
        } 
        if (signatureFile !== null) {
            const spaceRef = ref(storage, `firmas/${signatureFile.name}`);
            await uploadBytes(spaceRef, signatureFile).then(async (snapshot) => {
                console.log('Uploaded an array!');
                await getDownloadURL(snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    url_profile = downloadURL
                });
            });
            user_copy['signature'] = true
            user_copy['signature_url'] = url_profile
            user_copy['signature_name'] = signatureFile.name
        } 
        user_copy['contabilidad'] = contabilidad
        user_copy['ciudad'] = ciudad
        user_copy['direccion_ruc'] = direccionRuc
        user_copy['nombre_comercial'] = nombreComercial
        user_copy['factura'] = factura
        user_copy['firma_password'] = password
        user_copy['bill_code1'] = code1
        user_copy['bill_code2'] = code2
        user_copy['bill_code3'] = code3
        user_copy['defect_direction'] = defectDirection
        dispatch(setUser(user_copy));
        // Set the "capital" field of the city 'DC'
        await updateDoc(user_ref, user_copy);
        dispatch(setLoading(false));
    }



    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSignatureFile(file)
    };


    const handleFileUpload = (file) => {
        const url = URL.createObjectURL(file);
        setImagenURL(url);
        setProfileFile(file);
    };
    const abrirModalDirecciones = (__data)=>{
        setCurrentDireccion(__data);
        setModalDireccion(true);
    }
    const abrirModalEditarDirecciones = (__data)=>{
        setCurrentDireccion(__data)
        setDireccionRuc(__data.direccion);
        setCodeDireccion(__data.codigo);
        setNombreComercial(__data.nombreComercial);
        setModalEditarDirecciones(true);
    }
    const actualizarDirecciones = async()=>{
        dispatch(setLoading(true));
        let user_copy = JSON.parse(JSON.stringify(userState))
        const aux_directions = JSON.parse(JSON.stringify(direcciones));
        let data_modify = aux_directions.map((item)=> {
            if(item.direccion === currentDireccion.direccion){
                item.direccion = direccionRuc
                item.nombreComercial = nombreComercial
                item.codigo = codeDireccion
            }
            return item
        })
        const user_ref = doc(db, "usuarios", userState.id);

        await updateDoc(user_ref, {
            direcciones: data_modify
        });
        user_copy['direcciones'] = data_modify;
        dispatch(setUser(user_copy));
        setDirecciones(data_modify);
        setModalEditarDirecciones(false);
        dispatch(setLoading(false));
    }
    
    const eliminarDireccion = async(__data)=>{
        const aux_directions = JSON.parse(JSON.stringify(direcciones))
        if(defectDirection.direccion === __data.direccion){
            Swal.fire({
                icon: "error",
                title: "Ne se Elimino",
                text: "No se puede eliminar la direccion que esta por defecto!",
              });
        }else if(aux_directions < 2){
            Swal.fire({
                icon: "error",
                title: "Ne se Elimino",
                text: "Debe Existir Minimo 1 direccion!",
            });
        }
        else{
            dispatch(setLoading(true));
            let user_copy = JSON.parse(JSON.stringify(userState))
            const user_ref = doc(db, "usuarios", userState.id);
            let data_modify = aux_directions.filter(item=> item.direccion !== __data.direccion)
            await updateDoc(user_ref, {
                direcciones: data_modify
            });
            user_copy['direcciones'] = data_modify;
            dispatch(setUser(user_copy));
            setDirecciones(data_modify);
            dispatch(setLoading(false));
        }
    }

    const agregarDirecciones = async()=>{
        dispatch(setLoading(true));
        const user_ref = doc(db, "usuarios", userState.id);
        
        const aux_directions = JSON.parse(JSON.stringify(direcciones))
        let user_copy = JSON.parse(JSON.stringify(userState))

        let new_data = {
            direccion:direccionRuc,
            nombreComercial:nombreComercial,
            codigo:codeDireccion
        }
        aux_directions.push(new_data)
        await updateDoc(user_ref, {
            direcciones: aux_directions
        });
        user_copy['direcciones'] = aux_directions;
        dispatch(setUser(user_copy));
        setDirecciones(aux_directions);
        setModalDireccion(false);
        dispatch(setLoading(false));
  
    }
    useEffect(() => {
        //dispatch(setLoading(false));
        getData();
    }, []);
    return (
        <>
            <Container maxWidth="md">
                <Stack direction={{ xs: 'column', md: 'row' }} alignItems={"center"} spacing={2}>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <h5 style={{ textAlign: 'left', color: '#6C737F' }}>Configuración de datos personales</h5>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth variant="filled">
                                <InputLabel htmlFor="filled-adornment-password">Razon</InputLabel>
                                <FilledInput
                                    type="text"
                                    value={userState.razon}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton aria-label="toggle password visibility" edge="end">
                                                <PersonIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label="Razon"
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth variant="filled">
                                <InputLabel htmlFor="filled-adornment-password">Email</InputLabel>
                                <FilledInput
                                    type="text"
                                    value={userState.email}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton aria-label="toggle password visibility" edge="end">
                                                <AlternateEmailIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label="Email"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth variant="filled">
                                <InputLabel htmlFor="filled-adornment-password">Telefono</InputLabel>
                                <FilledInput
                                    type="text"
                                    value={userState.phone}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton aria-label="toggle password visibility" edge="end">
                                                <PhoneAndroidIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label="Telefono"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth variant="filled">
                                <InputLabel htmlFor="filled-adornment-password">Ruc</InputLabel>
                                <FilledInput
                                    type="text"
                                    value={userState.ruc}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton aria-label="toggle password visibility" edge="end">
                                                <NumbersIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label="Ruc"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Autocomplete
                                disablePortal
                                disableClearable
                                id="combo-box-demo"
                                fullWidth
                                onChange={(event, newValue) => {
                                    setCiudad(newValue);
                                }}
                                value={ciudad}
                                options={ciudades}
                                renderInput={(params) => <TextField {...params} label="Ciudad" />}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl>
                                <FormLabel id="demo-controlled-radio-buttons-group">Obligado a llevar contabilidad ?</FormLabel>
                                    <RadioGroup
                                        aria-labelledby="demo-controlled-radio-buttons-group"
                                        name="controlled-radio-buttons-group"
                                        value={contabilidad}
                                        row
                                        onChange={handleChangeContabilidad}
                                    >
                                    <FormControlLabel value={false} control={<Radio />} label="si" />
                                    <FormControlLabel value={true} control={<Radio />} label="no" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>

                    </Grid>
                    <Stack spacing={2}>

                        <ProfilePhoto condition={userState.profile} url={imagenURL !== null ? imagenURL : userState.profile_url} />
                        <FileUploadButton onFileUpload={handleFileUpload} />
                    </Stack>
                </Stack>
                <Grid container marginTop={4} spacing={1}>
                    <Grid item xs={12}>
                        <h5 style={{ textAlign: 'left', color: '#6C737F' }}>Configuración de facturación</h5>
                    </Grid>
                    <Grid item xs={12} md={9}>
                    <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                fullWidth
                                onChange={(event, newValue) => {
                                    setDefectDirection(newValue);
                                }}
                                disableClearable
                                value={defectDirection}
                                options={direcciones}
                                getOptionLabel={(option) => option.direccion}
                                renderInput={(params) => <TextField {...params} label="Direccion Por defecto" />}
                            />
                    </Grid>
                    <Grid item  xs={12} md={3} >
                        <Button variant="contained" sx={{height:"100%"}} onClick={()=>{abrirModalDirecciones({})}}>Agregar Dirección</Button>
                    </Grid>
                    <Grid item xs={12} >
                        <TableContainer >
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                <TableRow>
                                    <TableCell align="left">DIRECCIÓN</TableCell>
                                    <TableCell align="left">Nombre Comercial</TableCell>
                                    <TableCell align="left">CÓDIGO</TableCell>
                                    <TableCell align="left"></TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                {direcciones.map((row,index) => (
                                    <TableRow key={index}>
                                        <TableCell align="left">{row.direccion}</TableCell>
                                        <TableCell align="left">{row.nombreComercial}</TableCell>
                                        <TableCell align="left">{row.codigo}</TableCell>
                                        <TableCell align="center">
                                            <Stack direction={"row"} spacing={2}>
                                                <IconButton aria-label="fingerprint" onClick={()=>{abrirModalEditarDirecciones(row)}}  color="warning">
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton aria-label="fingerprint" onClick={()=>{eliminarDireccion(row)}} color="rojo">
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                   
                    {/* <Grid item xs={12} md={6}>
                        <FormControl fullWidth variant="filled">
                            <InputLabel htmlFor="filled-adornment-password">Ha emitido facturas?</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={factura}
                                label="Has emitido facturas anteriormente"
                                onChange={handleFactura}
                            >
                                <MenuItem value={false}> No, mi ruc es nuevo</MenuItem>
                                <MenuItem value={true}>  Si, He emitido facturas anteriormente.</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid> */}
                    <Grid item xs={12} md={4}>
                    <h5 style={{textAlign:"left",color:'#6C737F'}}>Número de factura actual: </h5>
                        <Stack direction="row" alignItems={"center"} spacing={1}>
                            <input type="text" id="fname" name="code_1" style={{width:40}} value={code1} onChange={(event)=>{setCode1(event.target.value)}} ></input>
                            <strong>-</strong>
                            <input type="text" id="fname" name="code_2" style={{width:40}} value={code2} onChange={(event)=>{setCode2(event.target.value)}} ></input>
                            <strong>-</strong>
                            <input type="text" id="fname" name="code_3" style={{width:"100%"}} value={code3} onChange={(event)=>{setCode3(event.target.value)}} ></input>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={8}>

                    </Grid>
                    <Grid item xs={12}>
                        <h5 style={{ textAlign: 'left', color: '#6C737F', marginTop: 7 }}>Configuración de la firma electronica</h5>
                    </Grid>
                    <Grid item xs={12}>
                        <Stack direction="column" spacing={3}>

                                <p style={{ textAlign: "left" }}>Registre o actualice su firma Electronica para validar las facturas en el sistema del SRI.</p>
                                <stack direction="row" spacing={2}>
                                    <input type="file" disabled={userState.signature} width={200} onChange={handleFileChange} />
                                    <Chip label={userState.signature_name} variant="outlined" color="success" icon={<DoneIcon/>}/>  
                                </stack> 
                            <FormControl fullWidth variant="filled">
                                <InputLabel htmlFor="filled-adornment-password">Contraseña de la firma</InputLabel>
                                <FilledInput
                                    onChange={(event) => {
                                        setPassword(event.target.value);
                                    }}
                                    value={password}

                                    type={showPassword ? 'text' : 'password'}
                                    style={{ width: 240 }}
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
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <Button sx={{ marginTop: 5 }} onClick={actualizarDatos} variant="contained">GUARDAR CAMBIOS</Button>
                    </Grid>
                </Grid>

            </Container>
      

            <Modal isOpen={modalDireccion} size="sm"  >
                <ModalHeader>Registrar Nueva Direccion  </ModalHeader>
                <ModalBody>
                <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <TextField
                                id="outlined-password-input"
                                label="Direccion Registrada"
                                type="text"
                                autoComplete="current-password"
                                onChange={(event) => {
                                    setDireccionRuc(event.target.value);
                                }}
                                fullWidth
                                />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="outlined-password-input"
                                label="Nombre Comercial"
                                type="text"
                                autoComplete="current-password"
                                onChange={(event) => {
                                    setNombreComercial(event.target.value);
                                }}
                                fullWidth
                                />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="outlined-password-input"
                                label="Codigo de Establecimiento"
                                type="text"
                                autoComplete="current-password"
                                onChange={(event) => {
                                    setCodeDireccion(event.target.value);
                                }}
                                fullWidth
                                />
                        </Grid>
                        
                </Grid>
                </ModalBody>
                <ModalFooter>
                <Stack direction="row" spacing={2}>
                    <Button sx={{ marginTop: 5 }} onClick={agregarDirecciones}  variant="contained">Agregar</Button>
                    <Button sx={{ marginTop: 5 }} onClick={()=>{setModalDireccion(false)}} color="rojo" variant="contained">Cancelar</Button>
                </Stack>
                </ModalFooter>
            </Modal>
            
            <Modal isOpen={modalEditarDirecciones}  size="sm" >
                <ModalHeader>Editar Dirección</ModalHeader>
                <ModalBody>
                <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <TextField
                                id="outlined-password-input"
                                label="Direccion Registrada"
                                type="text"
                                autoComplete="current-password"
                                value={direccionRuc}
                                onChange={(event) => {
                                    setDireccionRuc(event.target.value);
                                }}
                                fullWidth
                                />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="outlined-password-input"
                                label="Nombre Comercial"
                                type="text"
                                autoComplete="current-password"
                                value={nombreComercial}
                                onChange={(event) => {
                                    setNombreComercial(event.target.value);
                                }}
                                fullWidth
                                />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="outlined-password-input"
                                label="Codigo de Establecimiento"
                                type="text"
                                autoComplete="current-password"
                                value={codeDireccion}
                                onChange={(event) => {
                                      setCodeDireccion(event.target.value);
                                }}
                                fullWidth
                                />
                        </Grid>
                        
                </Grid>
                </ModalBody>
                <ModalFooter>
                    <Stack direction="row" style={{width:"100%"}} spacing={2}>
                        <Button fullWidth sx={{ marginTop: 5 }}  onClick={actualizarDirecciones} variant="contained">Guardar</Button>
                        <Button fullWidth sx={{ marginTop: 5 }} onClick={()=>{setModalEditarDirecciones(false)}} color="rojo" variant="contained">Cancelar</Button>
                    </Stack>
                </ModalFooter>
            </Modal>
        </>
    );
}


















