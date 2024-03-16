import { useState, useEffect, useRef } from "react";
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
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
import { collection, query, onSnapshot, doc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import InputLabel from '@mui/material/InputLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useSelector, useDispatch } from 'react-redux';
import Autocomplete from '@mui/material/Autocomplete';
import { v4 as uuidv4 } from 'uuid';
import { setLoading } from "../features/menu/menuSlice";
import FilledInput from '@mui/material/FilledInput';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import CardService from "../components/card-service";
export default function ServiciosView(){
    const [servicios,setServicios] = useState([{establecimiento:{direccion:""}}]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalServices,setTotalServices] = useState();
    const [modalEditar,setModalEditar] = useState(false);
    const [modalServicio,setModalServicio] = useState(false);
    const [modalOpciones,setModalOpciones] = useState(false);
    const [formService,setFormService] = useState(service_defect);
    const [establecimiento, setEstablecimiento] = useState('');
    const [establecimientos, setEstablecimientos] = useState({});
    const [value, setValue] = useState(0);
    const dispatch = useDispatch();
    const allServicios = useRef([]);
    const userState = useSelector(state => state.auth);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const eliminarProducto = ()=>{

    }
    const abrirModalEditar=(item)=>{
        setModalEditar(true);
        setFormService(item)
        setEstablecimiento(item.establecimiento)
    }
    const handleChangeTab = (event, newValue) => {
        setValue(newValue);
    };
    const agregarServicio = async()=>{
        dispatch(setLoading(true));
        let aux_data =  JSON.parse(JSON.stringify(formService));
        let id = uuidv4()
        aux_data['id'] = id
        aux_data['id_origin'] = userState.id
        aux_data['establecimiento'] = establecimiento
        console.log(aux_data)
        await setDoc(doc(db, "servicios", id),aux_data);
        setModalServicio(false)
        dispatch(setLoading(false));
    };
    const actualizarDatos = async()=>{
        dispatch(setLoading(true));
        let aux_data =  JSON.parse(JSON.stringify(formService));
        aux_data['establecimiento'] = establecimiento;
        const ref = doc(db, "servicios", aux_data['id']);
        await updateDoc(ref, aux_data);
        setModalEditar(false);
        dispatch(setLoading(false));
    }

    const handleFormService =(event)=>{
        const { name, value } = event.target;
        const nuevoObjeto = { ...formService };
        nuevoObjeto[name] = value;
        setFormService(nuevoObjeto);
    };
    const handleSearch=(event)=>{

    
        let textoMinusculas = event.target.value.toLowerCase();
        const filtrados = allServicios.current.filter((elemento) => {
            // Convertir el nombre del elemento a minúsculas para la comparación
            const nombreMinusculas = elemento.descripcion.toLowerCase();
        
            // Verificar si el nombre del elemento incluye el texto de búsqueda
            return nombreMinusculas.includes(textoMinusculas);
          });

          setServicios(filtrados);
    }

    const getData = () => {
        const q = query(collection(db, "servicios"));
        onSnapshot(q, (querySnapshot) => {
            const servicios_aux = [];
            querySnapshot.forEach((doc) => {
                servicios_aux.push(doc.data());
            });
            setServicios(servicios_aux);
            allServicios.current = servicios_aux;
            setTotalServices(servicios_aux.length)
        });
        setEstablecimientos(userState.direcciones);
        


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
                            Listado de servicios habilitados
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                            <div className="proforma-container">
                                <div>
                                    <p className="proforma-titulo" style={{ margin: 0 }}> <strong>TABLAS DE SERVICIOS</strong></p>
                                </div>
                                <div>
                                    <p style={{ margin: 0 }} className="proforma-datos">Joan David Encarnacion Diaz <strong>1104595671 .- MECDEVS SAS</strong> </p>
                                </div>
                            </div>
                        </Grid>
                    <Grid item xs={6} md={3} >
                        <CardService value={totalServices} />
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
                    <Grid item xs={6} md={2}>
                        <Button fullWidth variant="contained" onClick={() => { setModalServicio(true) }} startIcon={<AddIcon />} >Agregar Servicio</Button>
                    </Grid>
                    <Grid item xs={6} md={2}>
                        <Button fullWidth variant="contained" startIcon={<SettingsIcon />} color="gris" onClick={()=>{setModalOpciones(true)}} >Opciones</Button>
                    </Grid>
                    <Grid item xs={12}>
                        <div style={{ height: 10 }}></div>
                    </Grid>
                    <Grid item  xs={12}>
                        <TableContainer sx={{ maxHeight: 440 }}>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align={'left'}>
                                                Item
                                            </TableCell>
                                            <TableCell align={'center'}>
                                                Descripción
                                            </TableCell>
                                            <TableCell align={'center'}>
                                                Valor unitario
                                            </TableCell>
                                            <TableCell align={'center'}>
                                                Codigo
                                            </TableCell>
                                            <TableCell align={'center'}>
                                                Establecimiento
                                            </TableCell>
                                            <TableCell align={'center'}>
                                                Acciones
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {servicios.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((row, index) => {
                                                return (
                                                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                                        <TableCell align={"left"}>
                                                            {index + 1}
                                                        </TableCell>
                                                        <TableCell align={"center"}>
                                                            {row.descripcion}
                                                        </TableCell>
                                                        <TableCell align={"center"}>
                                                            {row.valor_unitario}
                                                        </TableCell>
                                                        <TableCell align={"center"}>
                                                            {row.codigo_principal}
                                                        </TableCell>
                                                        <TableCell align={"center"}>
                                                            {row.establecimiento.direccion}
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
                                count={servicios.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                    </Grid>  
                </Grid>         
            </Container>

            <Modal isOpen={modalServicio} >
                    <ModalHeader >Registrar Servicio<ShoppingBagIcon /> </ModalHeader>
                        <ModalBody>
                        <Box sx={{ width: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={value} onChange={handleChangeTab} aria-label="basic tabs example">
                                <Tab label="Datos Generales" {...a11yProps(0)} />
                                <Tab label="Datos Adicionales" {...a11yProps(1)} />
                            </Tabs>
                        </Box>
                        <CustomTabPanel value={value} index={0}>
                            <Grid container spacing={2}>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        id="outlined-required"
                                        label="Código principal"
                                        value={formService.codigo_principal}
                                        name="codigo_principal"
                                        onChange={handleFormService}
                                        fullWidth  
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        id="outlined-required"
                                        label="Código auxiliar (Opcional)"
                                        value={formService.codigo_aux}
                                        name="codigo_aux"
                                        onChange={handleFormService}
                                        fullWidth  
                                    />
                                </Grid>
                                <Grid item md={12} xs={12}>
                                    <TextField
                                            id="outlined-required"
                                            label="Descripción"
                                            value={formService.descripcion}
                                            name="descripcion"
                                            onChange={handleFormService}
                                            fullWidth  
                                        />
                                </Grid>
                                <Grid item md={4} xs={12}>
                                        <TextField
                                            id="outlined-required"
                                            label="Valor unitario"
                                            value={formService.valor_unitario}
                                            name="valor_unitario"
                                            onChange={handleFormService}
                                            fullWidth  
                                        />
                                </Grid>
                                <Grid item md={4} xs={12}>
                                <FormControl fullWidth variant="filled">
                                        <InputLabel htmlFor="filled-adornment-password">Tarifador IVA</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            label="Tipo de Persona"
                                            value={formService.tarifa}
                                            name="tarifa"
                                            onChange={handleFormService}
                                        >
                                            <MenuItem value={1}>0%</MenuItem>
                                            <MenuItem value={2}>12%</MenuItem>
                                            <MenuItem value={3}>No Objeto de impuesto</MenuItem>
                                            <MenuItem value={4}>Extento de IVA</MenuItem>
                                            <MenuItem value={5}>8%</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12}>
                                    <FormControl>
                                        <FormLabel id="demo-controlled-radio-buttons-group">¿Activo?</FormLabel>
                                            <RadioGroup
                                                aria-labelledby="demo-controlled-radio-buttons-group"
                                                name="activo"
                                                value={formService.activo}
                                                onChange={handleFormService}
                                                row
                                            >
                                            <FormControlLabel value={true} control={<Radio />} label="Si" />
                                            <FormControlLabel value={false} control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </CustomTabPanel>
                        <CustomTabPanel value={value} index={1}>
                        <Grid container spacing={2}>
                                <Grid item xs={12}>
                                <Autocomplete
                                        disablePortal
                                        id="combo-box-demo"
                                        value={establecimiento}
                                        options={establecimientos}
                                        getOptionLabel={(option) =>
                                            option.direccion
                                        }
                                        onChange={(event, newValue) => {
                                            setEstablecimiento(newValue);
                                        }}
                                        fullWidth
                                        renderInput={(params) => <TextField {...params} label="Establecimiento" />}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <h6 style={{ color: "#616A6B" }}>Datos Adicionales</h6>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        id="outlined-required"
                                        label="Nombre"
                                        fullWidth
                                        value={formService.param1}
                                        name="param1"
                                        onChange={handleFormService}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        id="outlined-required"
                                        label="Valor"
                                        fullWidth
                                        value={formService.value1}
                                        name="value1"
                                        onChange={handleFormService}

                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        id="outlined-required"
                                        label="Nombre"
                                        fullWidth
                                        value={formService.param2}
                                        name="param2"
                                        onChange={handleFormService}

                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        id="outlined-required"
                                        label="Valor"
                                        fullWidth
                                        value={formService.value2}
                                        name="value2"
                                        onChange={handleFormService}

                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        id="outlined-required"
                                        label="Nombre"
                                        fullWidth
                                        value={formService.param3}
                                        name="param3"
                                        onChange={handleFormService}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        id="outlined-required"
                                        label="Valor"
                                        fullWidth
                                        value={formService.value3}
                                        name="value3"
                                        onChange={handleFormService}
                                    />
                                </Grid>

                            </Grid>
                        </CustomTabPanel>

                    </Box>
                        </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={agregarServicio}>
                            Agregar
                        </Button>
                        <Button color="secondary" onClick={() => { setModalServicio(false) }} >
                            Cancelar
                        </Button>
                    </ModalFooter>
                </Modal>


                <Modal isOpen={modalEditar} >
                    <ModalHeader  >Editar Servicio <ShoppingBagIcon /> </ModalHeader>
                        <ModalBody>
                        <Box sx={{ width: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={value} onChange={handleChangeTab} aria-label="basic tabs example">
                                <Tab label="Datos Generales" {...a11yProps(0)} />
                                <Tab label="Datos Adicionales" {...a11yProps(1)} />
                            </Tabs>
                        </Box>
                        <CustomTabPanel value={value} index={0}>
                            <Grid container spacing={2}>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        id="outlined-required"
                                        label="Código principal"
                                        value={formService.codigo_principal}
                                        name="codigo_principal"
                                        onChange={handleFormService}
                                        fullWidth  
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        id="outlined-required"
                                        label="Código auxiliar (Opcional)"
                                        value={formService.codigo_aux}
                                        name="codigo_aux"
                                        onChange={handleFormService}
                                        fullWidth  
                                    />
                                </Grid>
                                <Grid item md={12} xs={12}>
                                    <TextField
                                            id="outlined-required"
                                            label="Descripción"
                                            value={formService.descripcion}
                                            name="descripcion"
                                            onChange={handleFormService}
                                            fullWidth  
                                        />
                                </Grid>
                                <Grid item md={4} xs={12}>
                                        <TextField
                                            id="outlined-required"
                                            label="Valor unitario"
                                            value={formService.valor_unitario}
                                            name="valor_unitario"
                                            onChange={handleFormService}
                                            fullWidth  
                                        />
                                </Grid>
                                <Grid item md={4} xs={12}>
                                <FormControl fullWidth variant="filled">
                                        <InputLabel htmlFor="filled-adornment-password">Tarifador IVA</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            label="Tipo de Persona"
                                            value={formService.tarifa}
                                            name="tarifa"
                                            onChange={handleFormService}
                                        >
                                            <MenuItem value={1}>0%</MenuItem>
                                            <MenuItem value={2}>12%</MenuItem>
                                            <MenuItem value={3}>No Objeto de impuesto</MenuItem>
                                            <MenuItem value={4}>Extento de IVA</MenuItem>
                                            <MenuItem value={5}>8%</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12}>
                                    <FormControl>
                                        <FormLabel id="demo-controlled-radio-buttons-group">¿Activo?</FormLabel>
                                            <RadioGroup
                                                aria-labelledby="demo-controlled-radio-buttons-group"
                                                name="activo"
                                                value={formService.activo}
                                                onChange={handleFormService}
                                                row
                                            >
                                            <FormControlLabel value={true} control={<Radio />} label="Si" />
                                            <FormControlLabel value={false} control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </CustomTabPanel>
                        <CustomTabPanel value={value} index={1}>
                        <Grid container spacing={2}>
                                <Grid item xs={12}>
                                <Autocomplete
                                        disablePortal
                                        id="combo-box-demo"
                                        value={establecimiento}
                                        options={establecimientos}
                                        getOptionLabel={(option) =>
                                            option.direccion
                                        }
                                        onChange={(event, newValue) => {
                                            setEstablecimiento(newValue);
                                        }}
                                        fullWidth
                                        renderInput={(params) => <TextField {...params} label="Establecimiento" />}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <h6 style={{ color: "#616A6B" }}>Datos Adicionales</h6>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        id="outlined-required"
                                        label="Nombre"
                                        fullWidth
                                        value={formService.param1}
                                        name="param1"
                                        onChange={handleFormService}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        id="outlined-required"
                                        label="Valor"
                                        fullWidth
                                        value={formService.value1}
                                        name="value1"
                                        onChange={handleFormService}

                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        id="outlined-required"
                                        label="Nombre"
                                        fullWidth
                                        value={formService.param2}
                                        name="param2"
                                        onChange={handleFormService}

                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        id="outlined-required"
                                        label="Valor"
                                        fullWidth
                                        value={formService.value2}
                                        name="value2"
                                        onChange={handleFormService}

                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        id="outlined-required"
                                        label="Nombre"
                                        fullWidth
                                        value={formService.param3}
                                        name="param3"
                                        onChange={handleFormService}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        id="outlined-required"
                                        label="Valor"
                                        fullWidth
                                        value={formService.value3}
                                        name="value3"
                                        onChange={handleFormService}
                                    />
                                </Grid>

                            </Grid>
                        </CustomTabPanel>

                    </Box>
                        </ModalBody>
                    <ModalFooter>
                    <Button color="primary" onClick={actualizarDatos} >
                        Actualizar
                    </Button>
                    <Button color="secondary" onClick={() => { setModalEditar(false) }} >
                        Cancelar
                    </Button>
                    </ModalFooter>
                </Modal>
        </>
    );

}
function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};
const service_defect =   {
    codigo_principal:"",
    codigo_aux:"",
    descripcion:"",
    valor_unitario:0,
    tarifa:"",
    activo:false,
    venta:false,
    compra:false,
    producto:false,
    establecimiento:{direccion:""},
    categoria:"",
    param1:"",
    value1:"",
    param2:"",
    value2:"",
    param3:"",
    value3:""
}