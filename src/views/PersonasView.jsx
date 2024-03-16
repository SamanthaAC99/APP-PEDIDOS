import {useState,useEffect, useRef} from "react";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import { collection, query, onSnapshot, doc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import { db } from "../firebase/firebase-config";
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FilledInput from '@mui/material/FilledInput';
import ShareLocationIcon from '@mui/icons-material/ShareLocation';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import PersonIcon from '@mui/icons-material/Person';
import MenuItem from '@mui/material/MenuItem';
import BadgeIcon from '@mui/icons-material/Badge';
import InputAdornment from '@mui/material/InputAdornment';
import CloseIcon from '@mui/icons-material/Close';
import validator from 'validator';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import { v4 as uuidv4 } from 'uuid';
import { Paper } from "@mui/material";
import { useSelector, useDispatch } from 'react-redux';
import { setLoading } from "../features/menu/menuSlice";
import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search';
import ArticleIcon from '@mui/icons-material/Article';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CardClient from "../components/card-client";

export default function PersonasView(){
    const dispatch = useDispatch();
    const [personas,setPersonas] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [modalEditar, setModalEditar] = useState(false);
    const [totalClientes,setTotalClientes] = useState(0);
    const [modalCliente,setModalCliente] = useState();
    const [tipoIde,setTipoIde] = useState(1);
    const [correos,setCorreos] = useState([]);
    const [correo,setCorreo] = useState();
    const [modalOpciones,setModalOpciones] = useState(false);
    const userState = useSelector(state => state.auth);
    const allClientes = useRef([])
    const [formClient,setFormClient] = useState({
            ci:"",
            tipo_identificacion:1,
            nombre:"",
            direccion:"",
            phone:"",
            correos:[],            
    });
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const abrirModalEditar = (item) => {
        setModalEditar(true);
        setFormClient(item);
        setCorreos(item.correos)
    }
    const eliminarProducto = async (item) => {
        await deleteDoc(doc(db, "productos", item.id));
    }
    
    const agregarEmail = () => {
        if(  validator.isEmail(correo) ){
            let aux_emails =  JSON.parse(JSON.stringify(correos));
            aux_emails.push(correo);
            setCorreos(aux_emails);
            setCorreo("")
        }
    }
    const eliminarEmail =(index)=>{
        let aux_emails =  JSON.parse(JSON.stringify(correos));
        aux_emails.splice(index, 1);
        setCorreos(aux_emails);
    }
    const abrirModalCliente = ()=>{
        setModalCliente(true);
        setFormClient(client_defect);
        setCorreos([]);
    }


    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const handleChange = (event) => {
        setTipoIde(event.target.value);
    };
    
    const handleFormCliente =(event)=>{
        const { name, value } = event.target;
        const nuevoObjeto = { ...formClient };
        nuevoObjeto[name] = value;
        setFormClient(nuevoObjeto)
    };

    const crearUsuario = async ()=>{
        dispatch(setLoading(true));
        let aux_data =  JSON.parse(JSON.stringify(formClient));
        aux_data['correos'] = correos
      
        let id = uuidv4()
        aux_data['id'] = id
        aux_data['id_origin'] = userState.id
        console.log(aux_data)
        await setDoc(doc(db, "clientes", id),aux_data);
        setModalCliente(false)
        dispatch(setLoading(false));
    }
    const actualizarDatos = async()=>{
        dispatch(setLoading(true));
        let aux_data =  JSON.parse(JSON.stringify(formClient));
        aux_data['correos'] = correos
        const ref = doc(db, "clientes", aux_data['id']);
        
        await updateDoc(ref, aux_data);
        setModalEditar(false)
        dispatch(setLoading(false));

    }
    const getData = () => {
        const q = query(collection(db, "clientes"));
        onSnapshot(q, (querySnapshot) => {
            const clientes_aux  = [];
            querySnapshot.forEach((doc) => {
                clientes_aux.push(doc.data());
            });
            setPersonas(clientes_aux);
            allClientes.current = clientes_aux;
            setTotalClientes(clientes_aux.length);
        });
        
    }
    const handleSearch=(event)=>{
        let textoMinusculas = event.target.value.toLowerCase();
        const filtrados = allClientes.current.filter((elemento) => {
            // Convertir el nombre del elemento a minúsculas para la comparación
            const nombreMinusculas = elemento.nombre.toLowerCase();
        
            // Verificar si el nombre del elemento incluye el texto de búsqueda
            return nombreMinusculas.includes(textoMinusculas);
          });

          setPersonas(filtrados);
    }

    useEffect(() => {
        getData();
    }, []);

    return(
        <>
            <Container maxWidth="xl">
                <Grid container spacing={2}>
                    
                    <Grid item md={12} xs={12}>
                        <div className="header-dash">
                            Listado de clientes habilitados
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                            <div className="proforma-container">
                                <div>
                                    <p className="proforma-titulo" style={{ margin: 0 }}> <strong>TABLAS DE CLIENTES</strong></p>
                                </div>
                                <div>
                                    <p style={{ margin: 0 }} className="proforma-datos">Joan David Encarnacion Diaz <strong>1104595671 .- MECDEVS SAS</strong> </p>
                                </div>
                            </div>
                        </Grid>
                    <Grid item xs={6} md={3} >
                        <CardClient value={totalClientes} />
                    </Grid>
                    <Grid item xs={6} md={9}>

                    </Grid>
                    <Grid item md={3}>
                        <FormControl fullWidth variant="filled">
                                <FilledInput
                                    hiddenLabel
                                    id="filled-adornment-password"
                                    type="text"
                                    size="small"
                                    onChange={handleSearch}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                edge="end"
                                            >
                                                <SearchIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label="Password"
                                />
                        </FormControl>
                    </Grid>   
                    <Grid item md={5}>
                    </Grid>   
                    <Grid item md={2}>
                        <Button fullWidth variant="contained" startIcon={<AddIcon />} onClick={()=>{abrirModalCliente()}} >Agregar Cliente</Button>
                    </Grid>
                    <Grid item md={2}>
                        <Button fullWidth variant="contained" startIcon={<SettingsIcon />} color="gris" onClick={()=>{setModalOpciones(true)}} >Opciones</Button>
                    </Grid>
                    <Grid item xs={12}>
                    <TableContainer sx={{ maxHeight: 440 }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align={'left'}>
                                            Item
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            Nombre
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            Cedula
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            Direccion
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            Acciones
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {personas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => {
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                                    <TableCell align={"left"}>
                                                        {index + 1}
                                                    </TableCell>
                                                    <TableCell align={"center"}>
                                                        {row.nombre}
                                                    </TableCell>
                                                    <TableCell align={"center"}>
                                                        {row.ci}
                                                    </TableCell>
                                                    <TableCell align={"center"}>
                                                        {row.direccion}
                                                    </TableCell>
                                                   
                                                    <TableCell align={"center"}>
                                                        <Stack direction="row" justifyContent={"center"} spacing={1}>
                                                            <IconButton aria-label="delete" color="amarillo" onClick={() => { abrirModalEditar(row) }} >
                                                                <EditIcon />
                                                            </IconButton>
                                                            <IconButton aria-label="delete" color="rojo" onClick={() => { eliminarProducto(row) }}  >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </Stack>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 100]}
                            component="div"
                            count={personas.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Grid>
                    <Grid item xs={12}>
                    
                    </Grid>
                    <Grid item xs={12}>
                    
                    </Grid>
                </Grid>
            </Container>
         
            <Modal isOpen={modalCliente} >
                <ModalHeader >Registrar Nuevo cliente </ModalHeader>
                <ModalBody>
                    <Grid container spacing={2}>
                        <Grid item md={6} xs={12}>
                            <TextField
                                id="outlined-required"
                                label="Identificación"
                                value={formClient.ci}
                                name="ci"
                                onChange={handleFormCliente}
                                InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <BadgeIcon />
                                    </InputAdornment>
                                ),
                                }}
                               
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <FormControl fullWidth variant="filled">
                                        <InputLabel htmlFor="filled-adornment-password">Tipo de Identificación</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                value={formClient.tipo_identificacion}
                                                name="tipo_identificacion"
                                                onChange={handleFormCliente}
                                                label="Tipo de Persona"
                                            >
                                                <MenuItem value={'04'}>RUC</MenuItem>
                                                <MenuItem value={'05'}>Cedula</MenuItem>
                                                <MenuItem value={'06'}>Pasaporte</MenuItem>
                                                <MenuItem value={'08'}>Identificación del exterior</MenuItem>
                                            </Select>
                            </FormControl>
                        </Grid>
                        <Grid item md={12} xs={12}>
                            <TextField
                                id="outlined-required"
                                label="Razon Social o Nombre"
                                value={formClient.nombre}
                                name="nombre"
                                onChange={handleFormCliente}
                                fullWidth
                                InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonIcon />
                                    </InputAdornment>
                                ),
                                }}
                               
                            />
                        </Grid>
                        <Grid item md={12} xs={12}>
                            <TextField
                                    id="outlined-required"
                                    label="Dirección"
                                    fullWidth
                                    value={formClient.direccion}
                                    name="direccion"
                                    onChange={handleFormCliente}
                                    InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <ShareLocationIcon />
                                        </InputAdornment>
                                    ),
                                    }}
                                />
                        </Grid>
                        <Grid item md={12} xs={12}>
                            <TextField
                                    id="outlined-required"
                                    label="Telefono"
                                    fullWidth
                                    value={formClient.phone}
                                    name="phone"
                                    onChange={handleFormCliente}
                                    InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LocalPhoneIcon />
                                        </InputAdornment>
                                    ),
                                    }}
                                />
                        </Grid>
                        <Grid item md={8} xs={12}>
                            <TextField
                                    id="outlined-required"
                                    label="Email (Máximo 5 clientes)"
                                    fullWidth
                                    value={correo}
                                    onChange={(event) => {
                                        setCorreo(event.target.value);
                                    }}
                                    InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AlternateEmailIcon />
                                        </InputAdornment>
                                    ),
                                    }} 
                                />
                        </Grid>
                        <Grid item md={4} xs={12}>
                            <Button fullWidth sx={{height:"100%"}} variant="contained" startIcon={<AddIcon />} onClick={agregarEmail} >Correo</Button>
                        </Grid>
                        <Grid item md={12} xs={12}>
                            <TableContainer component={Paper}>
                                <Table aria-label="simple table">
                                    <TableHead>
                                    <TableRow>
                                        <TableCell>Correo</TableCell>
                                        <TableCell align="center"></TableCell>
                                    </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {correos.map((row,index) => (
                                        <TableRow
                                        key={row.name}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                 
                                        <TableCell align="left">{row}</TableCell>
                                        <TableCell align="center">
                                            <IconButton aria-label="delete" onClick={()=>{eliminarEmail(index)}}>
                                                <CloseIcon />
                                            </IconButton>
                                        </TableCell>
                                        </TableRow>
                                    ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
              
                </ModalBody>
                <ModalFooter>
                    <Stack spacing={2} direction={"row"}>
                        <Button fullWidth variant="contained" onClick={()=>{crearUsuario()}} >Crear</Button>
                        <Button fullWidth color="rojo" variant="contained" onClick={()=>{setModalCliente(false)}} >Cancelar</Button>
                    </Stack>
                </ModalFooter>
            </Modal>


            
            <Modal isOpen={modalEditar} >
                <ModalHeader >Editar Datos </ModalHeader>
                <ModalBody>
                    <Grid container spacing={2}>
                        <Grid item md={6} xs={12}>
                            <TextField
                                id="outlined-required"
                                label="Identificación"
                                value={formClient.ci}
                                name="ci"
                                onChange={handleFormCliente}
                                InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <BadgeIcon />
                                    </InputAdornment>
                                ),
                                }}
                               
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <FormControl fullWidth variant="filled">
                                        <InputLabel htmlFor="filled-adornment-password">Tipo de Identificación</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                value={formClient.tipo_identificacion}
                                                name="tipo_identificacion"
                                                onChange={handleFormCliente}
                                                label="Tipo de Persona"
                                            >
                                                <MenuItem value={'04'}>RUC</MenuItem>
                                                <MenuItem value={'05'}>Cedula de identidad</MenuItem>
                                                <MenuItem value={'06'}>Pasaporte</MenuItem>
                                                <MenuItem value={'08'}>Identificación del exterior</MenuItem>
                                            </Select>
                            </FormControl>
                        </Grid>
                        <Grid item md={12} xs={12}>
                            <TextField
                                id="outlined-required"
                                label="Razon Social o Nombre"
                                value={formClient.nombre}
                                name="nombre"
                                onChange={handleFormCliente}
                                fullWidth
                                InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonIcon />
                                    </InputAdornment>
                                ),
                                }}
                               
                            />
                        </Grid>
                        <Grid item md={12} xs={12}>
                            <TextField
                                    id="outlined-required"
                                    label="Dirección"
                                    fullWidth
                                    value={formClient.direccion}
                                    name="direccion"
                                    onChange={handleFormCliente}
                                    InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <ShareLocationIcon />
                                        </InputAdornment>
                                    ),
                                    }}
                                />
                        </Grid>
                        <Grid item md={12} xs={12}>
                            <TextField
                                    id="outlined-required"
                                    label="Telefono"
                                    fullWidth
                                    value={formClient.phone}
                                    name="phone"
                                    onChange={handleFormCliente}
                                    InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LocalPhoneIcon />
                                        </InputAdornment>
                                    ),
                                    }}
                                />
                        </Grid>
                        <Grid item md={8} xs={12}>
                            <TextField
                                    id="outlined-required"
                                    label="Email (Máximo 5 clientes)"
                                    fullWidth
                                    value={correo}
                                    onChange={(event) => {
                                        setCorreo(event.target.value);
                                    }}
                                    InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AlternateEmailIcon />
                                        </InputAdornment>
                                    ),
                                    }} 
                                />
                        </Grid>
                        <Grid item md={4} xs={12}>
                            <Button fullWidth sx={{height:"100%"}} variant="contained" startIcon={<AddIcon />} onClick={agregarEmail} >Correo</Button>
                        </Grid>
                        <Grid item md={12} xs={12}>
                            <TableContainer component={Paper}>
                                <Table aria-label="simple table">
                                    <TableHead>
                                    <TableRow>
                                        <TableCell>Correo</TableCell>
                                        <TableCell align="center"></TableCell>
                                    </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {correos.map((row,index) => (
                                        <TableRow
                                        key={row.name}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                 
                                        <TableCell align="left">{row}</TableCell>
                                        <TableCell align="center">
                                            <IconButton aria-label="delete" onClick={()=>{eliminarEmail(index)}}>
                                                <CloseIcon />
                                            </IconButton>
                                        </TableCell>
                                        </TableRow>
                                    ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
              
                </ModalBody>
                <ModalFooter>
                    <Stack spacing={2} direction={"row"}>
                        <Button  variant="contained" onClick={()=>{actualizarDatos()}} >Guardar Cambios</Button>
                        <Button  color="rojo" variant="contained" onClick={()=>{setModalEditar(false)}} >Cancelar</Button>
                    </Stack>
                </ModalFooter>
            </Modal>
            <Modal isOpen={modalOpciones}  size="sm"  >
                <ModalHeader>Menu de Opciones </ModalHeader>
                <ModalBody>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Button fullWidth variant="contained" startIcon={<ArticleIcon/>} color="gris" >Descargar Plantilla </Button>
                            </Grid>
                         
                            <Grid item xs={12}>
                                <Button fullWidth variant="contained" startIcon={<CloudUploadIcon />}  color="verde">Subir Productos </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Button fullWidth variant="contained" startIcon={<CloudDownloadIcon />} color="verde">Descargar Productos </Button>
                            </Grid>
                        </Grid>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={() => { setModalOpciones(false) }} >
                        Salir
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
}

const client_defect =   {
                            ci:"",
                            tipo_identificacion:1,
                            nombre:"",
                            direccion:"",
                            phone:"",
                            correos:[]  
                        }