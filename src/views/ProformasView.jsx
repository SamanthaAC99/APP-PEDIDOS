import { useState, useEffect, useRef } from "react";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { collection, query, onSnapshot, doc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FilledInput from '@mui/material/FilledInput';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import PanToolAltIcon from '@mui/icons-material/PanToolAlt';
import Checkbox from '@mui/material/Checkbox';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { generarPdf } from "../scripts/generar-pdf";
import { useSelector,useDispatch} from 'react-redux';
import { setLoading } from "../features/menu/menuSlice";
import { updateNumberBill } from "../features/auth/userSlice";
import { v4 as uuidv4 } from 'uuid';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#6366F1",
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));
  





export default function ProformasView() {
    const userState = useSelector(state => state.auth);
    const [value, setValue] = useState(dayjs(new Date()));
    const [productos, setProductos] = useState([])
    const [modalCliente, setModalCliente] = useState(false);
    let consumidor_final = {
        ci: 999999999999,
        nombre:"CONSUMIDOR FINAL",
        correos:[userState.email],
        phone:userState.phone,
        direccion:userState.direcciones[0].direccion
    
    }
    const [currentCliente, setCurrentCliente] = useState(consumidor_final);
    const [modalProducto, setModalProducto] = useState(false);
    const [items, setItems] = useState([{}]);
    const [page, setPage] = useState(0);
    const [busqueda, setBusqueda] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [clientes, setClientes] = useState([]);
    const [subtotal,setSubTotal] = useState(0.00);
    const [iva,setIva] = useState(0.00);
    const [total,setTotal] = useState(0.00);
    const [subZero,setSubZero] = useState(0.00);
    const [subNoIva,setSubNoIva] = useState(0.00);
    const [subIva,setSubIva] = useState(0.00);
    const [ice,setIce] = useState(0.00)
    const allproducts = useRef([{}]);
    const allClientes = useRef([{}]);
    const allItems = useRef([{}]);
    const [modalServicio,setModalServicio] = useState(false);
    const [servicios,setServicios] = useState([]);
    const dispatch = useDispatch();
    const allservices = useRef([{}])

  

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const servicioSeleccionado = (_data)=>{
        let aux_servicios = allservices.current.map((item)=>{
            if(item.id === _data.id){
                item['select'] = !item['select']
            }
            return item;
        })
        allservices.current = aux_servicios;
        setServicios(aux_servicios);
        
    };

    const handleSearchProduct = (event)=>{
        let textoMinusculas = event.target.value.toLowerCase();
        const filtrados = allItems.current.filter((elemento) => {
            const nombreMinusculas = elemento.descripcion.toLowerCase();
            return nombreMinusculas.includes(textoMinusculas);
        });
        setItems(filtrados);

    }
    const productoSeleccionado = (data) => {
        console.log(data)
        const items_selected = allItems.current.map((item)=>{
            if(item.id === data.id){
                item['select'] = !item['select']
            }
            return item;
        })
        allItems.current = items_selected
        setItems(items_selected)
       
        
    }
    const handleCantidad = (event,_data)=>{
        let aux_data =  JSON.parse(JSON.stringify(productos));
        aux_data.map((item)=>{
            if(item.id === _data.id){
                if(event.target.value > 1){
                    item['cantidad'] = event.target.value;
                }else{
                    item['cantidad'] = 1;
                }
            }
        })
   
        let aux_subtotal = 0.0
        let aux_iva = 0.0
        let const_iva = 0.12
        let aux_zero = 0.0
        let aux_noiva = 0.0
        let aux_totaliva = 0.0
        aux_data.forEach((item)=>{
            aux_subtotal = (parseFloat(item.valor_unitario)*parseFloat(item['cantidad'])) + aux_subtotal
            if(item.tarifa_iva === 1){
                const_iva = 0.00
                aux_zero = (parseFloat(item.valor_unitario)*parseFloat(item['cantidad'])) + aux_zero
            }else if(item.tarifa_iva === 2){
                const_iva = 0.12
                aux_totaliva =  (parseFloat(item.valor_unitario)*parseFloat(item['cantidad'])) + aux_totaliva
            }else if(item.tarifa_iva === 3){
                const_iva = 0.00
            }else if(item.tarifa_iva === 4){
                const_iva = 0.00
                aux_noiva = (parseFloat(item.valor_unitario)*parseFloat(item['cantidad'])) + aux_noiva
            }else{
                const_iva = 0.08
                aux_totaliva =  (parseFloat(item.valor_unitario)*parseFloat(item['cantidad'])) + aux_totaliva
            }
            aux_iva = ((parseFloat(item.valor_unitario)*parseFloat(item['cantidad']))*const_iva) + aux_iva;
            console.log(aux_iva)
        })
        setIva(aux_iva);
        setSubTotal(aux_subtotal)
        setSubZero(aux_zero)
        setSubNoIva(aux_noiva)
        setSubIva(aux_totaliva)
        setTotal(aux_iva+aux_subtotal)

        setProductos(aux_data)


    }

    const generarProformaPdf =()=>{
        dispatch(setLoading(true));
        let aux_productos =  JSON.parse(JSON.stringify(productos));
        let number_proforma =  `${userState.bill_code1}-${userState.bill_code2}-${userState.bill_code3}`
        if(aux_productos.length >0){
            let products_formated = aux_productos.map((item)=>{
                return {
                        codigo:item.codigo_principal,
                        descripcion:item.descripcion,
                        cantidad:item.cantidad,
                        precio_unitario:item.valor_unitario,
                        descuento:0,
                        precio_total:parseFloat(item.valor_unitario)*parseFloat(item.cantidad)
                    }
            })
           
            let fecha_formated = new Date(value)
            var dia = fecha_formated.getDate();
            var mes = fecha_formated.getMonth() + 1; // Los meses en JavaScript van de 0 a 11, por lo que sumamos 1
            var año = fecha_formated.getFullYear();
            var fechaFormateada = dia + '/' + mes + '/' + año;
            let contabilidad_txt = userState.contabilidad ?  "si":"no"
            let proforma_data = {
                products: products_formated,
                profile: userState.profile,
                profile_url: userState.profile_url,  
                nombre: currentCliente.nombre,
                fecha: fechaFormateada,
                sub_siniva:subNoIva,
                sub_iva:subIva,
                sub_total:subtotal,
                sub_zero:subZero,
                total:total,
                iva:iva,
                ci:currentCliente.ci,
                descuento:0,
                ice:0,
                matriz:userState.direcciones[0].direccion,
                sucursal:userState.direcciones[0].direccion,
                contabilidad: contabilidad_txt,
                contribuyente_especial: "120231",
                numero_proforma:number_proforma,
                
            }
          
            generarPdf(proforma_data);
        }
        dispatch(setLoading(false));
    }
    const abrirModalServicios = ()=>{
        let items_formated = []
        if(productos.length === 0){

            items_formated = allservices.current.map((item)=>{
               item['select']= false;
               item['cantidad'] = 1;
               return item;
           });
       }else{
           items_formated = allservices.current.map((item)=>{
               let aux_target = productos.filter(param => param.id === item.id)
               if(aux_target.length === 1){
                   item['select']= true;
                   item['cantidad'] = 1;
               }else{
                   item['select'] = false;
                   item['cantidad'] = 1;
               }
             
               return item;
           });
       }
        setModalServicio(true);
        setServicios(items_formated)

    }
    const incrementarContador = (str)=>{

        let numero = parseInt(str, 10);

        // Incrementar el número
        numero++;
      
        // Convertir el número de nuevo a un string y añadir ceros a la izquierda
        let nuevoStr = String(numero).padStart(str.length, '0');
        return nuevoStr;
    }

    const abrirModalProductos = ()=>{
        let items_formated = []
        if(productos.length === 0){

             items_formated = allItems.current.map((item)=>{
                item['select']= false;
                item['cantidad'] = 1;
                return item;
            });
        }else{
            items_formated = allItems.current.map((item)=>{
                let aux_target = productos.filter(param => param.id === item.id)
                if(aux_target.length === 1){
                    item['select']= true;
                    item['cantidad'] = 1;
                }else{
                    item['select']= false;
                    item['cantidad'] = 1;
                }
              
                return item;
            });
        }
        allItems.current = items_formated

        setItems(items_formated)
        setModalProducto(true);
   
    }
    const handleSearchClient = (event) => {
        let textoMinusculas = event.target.value.toLowerCase();
        let filtrados = []
        if(busqueda){
            filtrados = allClientes.current.filter((elemento) => {
                const nombreMinusculas = elemento.nombre.toLowerCase();
                return nombreMinusculas.includes(textoMinusculas);
            });
        }else{
            filtrados = allClientes.current.filter((elemento) => {
                const cedula = elemento.ci;
                return cedula.includes(textoMinusculas);
            });
        }
       

        setClientes(filtrados);
    }
    const handleBusqueda = (event) => {
        setBusqueda(event.target.value);
    };

    const agregarProductos =()=>{
        const seleccionados = allItems.current.filter(item => item['select'] === true);
        const servicios = allservices.current.filter(item => item['select'] === true);
        const datos_unidos = seleccionados.concat(servicios)
        let aux_subtotal = 0.0
        let aux_iva = 0.0
        let const_iva = 0.12
        let aux_zero = 0.0
        let aux_noiva = 0.0
        let aux_totaliva = 0.0
            datos_unidos.forEach((item)=>{
                aux_subtotal = parseFloat(item.valor_unitario) + aux_subtotal
                if(item.tarifa_iva === 1){
                    const_iva = 0.00
                    aux_zero = parseFloat(item.valor_unitario) + aux_zero
                }else if(item.tarifa_iva === 2){
                    const_iva = 0.12
                    aux_totaliva =  parseFloat(item.valor_unitario) + aux_totaliva
                }else if(item.tarifa_iva === 3){
                    const_iva = 0.00
                }else if(item.tarifa_iva === 4){
                    const_iva = 0.00;
                    aux_noiva = parseFloat(item.valor_unitario) + aux_noiva;
                }else{
                    const_iva = 0.08
                    aux_totaliva =  parseFloat(item.valor_unitario) + aux_totaliva
                }
                aux_iva = (parseFloat(item.valor_unitario)*const_iva) + aux_iva;
                console.log(aux_iva)
            })
            setIva(aux_iva);
            setSubTotal(aux_subtotal);
            setSubZero(aux_zero);
            setSubNoIva(aux_noiva);
            setSubIva(aux_totaliva);
            setTotal(aux_iva+aux_subtotal);
            setProductos(datos_unidos);
            setModalProducto(false);
        }
    const eliminarProducto = async (_data) => {
        let aux_data =  JSON.parse(JSON.stringify(productos));
        let datos_filtrados = aux_data.filter(item=> item.id !== _data.id);
        let aux_subtotal = 0.0
        let aux_iva = 0.0
        let const_iva = 0.12
        let aux_zero = 0.0
        let aux_noiva = 0.0
        let aux_totaliva = 0.0
        datos_filtrados.forEach((item)=>{
            aux_subtotal = (parseFloat(item.valor_unitario)*parseFloat(item['cantidad'])) + aux_subtotal
            if(item.tarifa_iva === 1){
                const_iva = 0.00
                aux_zero = (parseFloat(item.valor_unitario)*parseFloat(item['cantidad'])) + aux_zero
            }else if(item.tarifa_iva === 2){
                const_iva = 0.12
                aux_totaliva =  (parseFloat(item.valor_unitario)*parseFloat(item['cantidad'])) + aux_totaliva
            }else if(item.tarifa_iva === 3){
                const_iva = 0.00
            }else if(item.tarifa_iva === 4){
                const_iva = 0.00
                aux_noiva = (parseFloat(item.valor_unitario)*parseFloat(item['cantidad'])) + aux_noiva
            }else{
                const_iva = 0.08
                aux_totaliva =  (parseFloat(item.valor_unitario)*parseFloat(item['cantidad'])) + aux_totaliva
            }
            aux_iva = ((parseFloat(item.valor_unitario)*parseFloat(item['cantidad']))*const_iva) + aux_iva;
            console.log(aux_iva)
        })
        setIva(aux_iva);
        setSubTotal(aux_subtotal)
        setSubZero(aux_zero)
        setSubNoIva(aux_noiva)
        setSubIva(aux_totaliva)
        setTotal(aux_iva+aux_subtotal)
        setProductos(datos_filtrados);
    }
    const getData = () => {
        const q = query(collection(db, "productos"));
        onSnapshot(q, (querySnapshot) => {
            const products_aux = [];
            querySnapshot.forEach((doc) => {
                products_aux.push(doc.data());
            });
            setItems(products_aux);
            allItems.current = products_aux;
        });

        const q2 = query(collection(db, "clientes"));
        onSnapshot(q2, (querySnapshot) => {
            const clientes_aux = [];
            querySnapshot.forEach((doc) => {
                clientes_aux.push(doc.data());
            });
            setClientes(clientes_aux);
            allClientes.current = clientes_aux;
        });
        const q3 = query(collection(db,"servicios"))
        onSnapshot(q3,(querySnapshot)=>{
            const servicios_aux = [];
            querySnapshot.forEach((doc)=> {
                servicios_aux.push(doc.data());
            })
            setServicios(servicios_aux);
            allservices.current = servicios_aux;
        })
      
    }
    const seleccionarEmpleado =(_data)=>{
        setCurrentCliente(_data)
        setModalCliente(false)
    }
    const agregarServicios = ()=>{
        let seleccionados = allItems.current.filter(item => item['select'] === true);
        let servicios_seleccionado = allservices.current.filter(item => item['select'] === true);
        let datos_unidos = seleccionados.concat(servicios_seleccionado);
        let aux_subtotal = 0.0;
        let aux_iva = 0.0;
        let const_iva = 0.12;
        let aux_zero = 0.0;
        let aux_noiva = 0.0;
        let aux_totaliva = 0.0;
        datos_unidos.forEach((item)=>{
            aux_subtotal = parseFloat(item.valor_unitario) + aux_subtotal;
            if(item.tarifa_iva === 1){
                const_iva = 0.00;
                aux_zero = parseFloat(item.valor_unitario) + aux_zero;
            }else if(item.tarifa_iva === 2){
                const_iva = 0.12;
                aux_totaliva =  parseFloat(item.valor_unitario) + aux_totaliva;
            }else if(item.tarifa_iva === 3){
                const_iva = 0.00; 
                
            }else if(item.tarifa_iva === 4){
                const_iva = 0.00;
                aux_noiva = parseFloat(item.valor_unitario) + aux_noiva;
            }else{
                const_iva = 0.08;
                aux_totaliva =  parseFloat(item.valor_unitario) + aux_totaliva;
            }
            aux_iva = (parseFloat(item.valor_unitario)*const_iva) + aux_iva;
        })
        setIva(aux_iva);
        setSubTotal(aux_subtotal);
        setSubZero(aux_zero);
        setSubNoIva(aux_noiva);
        setSubIva(aux_totaliva);
        setTotal(aux_iva+aux_subtotal);
        setProductos(datos_unidos);
        setModalServicio(false);
    }
    const agregarProforma = async()=>{
        dispatch(setLoading(true));
        let aux_productos =  JSON.parse(JSON.stringify(productos));
        let user_copy = JSON.parse(JSON.stringify(userState))
        let proforma_data = {}
        let id = uuidv4();
        const user_ref = doc(db, "usuarios", userState.id);
        if(aux_productos.length >0){
            let products_formated = aux_productos.map((item)=>{
                return {
                        codigo:item.codigo_principal,
                        descripcion:item.descripcion,
                        cantidad:item.cantidad,
                        precio_unitario:item.valor_unitario,
                        descuento:0,
                        precio_total:parseFloat(item.valor_unitario)*parseFloat(item.cantidad)
                    }
            })
         
            let fecha_formated = new Date(value)
            var dia = fecha_formated.getDate();
            var mes = fecha_formated.getMonth() + 1; // Los meses en JavaScript van de 0 a 11, por lo que sumamos 1
            var año = fecha_formated.getFullYear();
            var fechaFormateada = dia + '/' + mes + '/' + año;
            let number_proforma =  `${userState.bill_code1}-${userState.bill_code2}-${userState.bill_code3}`
            let contabilidad_txt = userState.contabilidad ?  "si":"no"
                proforma_data = {
                products: products_formated,
                profile: userState.profile,
                profile_url: userState.profile_url,  
                nombre: currentCliente.nombre,
                fecha: fechaFormateada,
                sub_siniva:subNoIva,
                sub_iva:subIva,
                sub_total:subtotal,
                sub_zero:subZero,
                total:total,
                iva:iva,
                ci:currentCliente.ci,
                descuento:0,
                ice:0,
                matriz:userState.direcciones[0].direccion,
                sucursal:userState.direcciones[0].direccion,
                contabilidad: contabilidad_txt,
                contribuyente_especial: "120231",
                estado:"pendiente",
                id:id,
                numero_proforma:number_proforma,
                
            }
        }
        let new_code = incrementarContador(user_copy['bill_code3']);
        user_copy['bill_code3'] = new_code;
        await setDoc(doc(db, "proformas", id), proforma_data);
        dispatch(updateNumberBill(new_code))
        await updateDoc(user_ref, user_copy);
        setProductos([]);
        setCurrentCliente(consumidor_final);
        dispatch(setLoading(false));
    }

    //const seleccionar

    useEffect(() => {
        getData();
    }, []);

    return (
        <>
            <Container maxWidth="xl">
                <Grid container spacing={2}>
                    {/* <Grid item xs={12}>
                        <p>{billNumber}</p>
                        <button onClick={incrementarContador}> click</button>
                    </Grid> */}
                    <Grid item xs={12}>
                        <div className="header-dash">
                            Sistema de generacion de proformas.
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <div className="proforma-container">
                            <div>
                                <p className="proforma-titulo" style={{ margin: 0 }}> <strong>PROFORMA</strong></p>
                            </div>
                            <div>
                                <p style={{ margin: 0 }} className="proforma-datos">Joan David Encarnacion Diaz <strong>1104595671 .- MECDEVS SAS</strong> </p>
                            </div>
                        </div>

                    </Grid>
                    <Grid item xs={12} md={6}>
                        <div className="proforma-info">
                            <Stack direction="column" justifyContent={"space-between"} spacing={2}>
                                <Button sx={{ width: 190 }} variant="contained" onClick={() => { setModalCliente(true) }}  >Buscar Cliente</Button>
                                <Stack direction="row" spacing={2}>
                                    <p ><strong>Cédula de Identidad:</strong></p>  <p>{currentCliente.ci}</p>
                                </Stack>
                                <Stack direction="row" spacing={2}>
                                    <p><strong>Nombres:</strong></p>
                                    <p>{currentCliente.nombre}</p>
                                </Stack>
                            </Stack>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <div className="proforma-info">
                            <Stack direction="column" justifyContent={"space-between"} spacing={2}>
                                <Stack direction="row" spacing={2}>
                                    <strong>Doc.# :</strong> <p>{userState.bill_code1}-{userState.bill_code2}-{userState.bill_code3}</p>
                                </Stack>
                                <Stack direction="row" alignItems={"start"} spacing={2}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={['DatePicker', 'DatePicker']}>
                                            <DatePicker
                                                label="Fecha de Emision"
                                                value={value}
                                                onChange={(newValue) => setValue(newValue)}
                                            />
                                        </DemoContainer>
                                    </LocalizationProvider>
                                </Stack>
                            </Stack>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={8}>

                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Button sx={{ width: 190 }} variant="contained" onClick={() => { abrirModalProductos() }} >Agregar Producto</Button>
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Button sx={{ width: 190 }} variant="contained" onClick={() => { abrirModalServicios() }} >Agregar Servicio</Button>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <TableContainer sx={{ maxHeight: 440 }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{width:60}} align={'center'}>
                                            Item
                                        </TableCell>
                                        <TableCell  sx={{width:60}} align={'center'}>
                                            Cantidad
                                        </TableCell>
                                        <TableCell align={'left'}>
                                            Detalle
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            Precio
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            Desc
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            Total
                                        </TableCell>
                                        <TableCell align={'left'}>

                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {productos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => {
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                                    <TableCell align={"center"}>
                                                        {index + 1}
                                                    </TableCell>
                                                    <TableCell align={"center"}>
                                                        <FilledInput
                                                            hiddenLabel
                                                            id="filled-adornment-password"
                                                            type="number"
                                                            size="small"
                                                            onChange={(event)=>{handleCantidad(event,row)}}
                                                            value={row.cantidad}
                                                            sx={{width:60}}
                                                            disabled={!row.producto}
                                                        />
                                                    </TableCell>
                                                    <TableCell align={"left"}>
                                                        {row.descripcion}
                                                    </TableCell>
                                                    <TableCell align={"center"}>
                                                        {parseFloat(row.valor_unitario)}
                                                    </TableCell>
                                                    <TableCell align={"center"}>
                                                        {0}%
                                                    </TableCell>
                                                    <TableCell align={"center"}>
                                                        {parseFloat(row.valor_unitario)*parseFloat(row.cantidad)}
                                                    </TableCell>
                                                    <TableCell align={"center"}>
                                                        <Stack direction="row" spacing={1}>
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
                            count={productos.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                       
                    </Grid>
                    <Grid item xs={12} md={1}>
                    </Grid>
                    <Grid item xs={12} md={4.5}>
                        <Stack spacing={1}>
                            <div className="proforma-item">
                                 <p className="proforma-item-p" >Subtotal sin impuestos: ${subtotal}</p>
                            </div>
                            <div className="proforma-item">
                                 <p className="proforma-item-p" >Subtotal IVA: ${subIva}</p>
                            </div>
                            <div className="proforma-item">
                                 <p className="proforma-item-p" >Subtotal 0%: ${subZero}</p>
                            </div>
                            <div className="proforma-item">
                                 <p className="proforma-item-p" >Subtotal no objeto de IVA: ${subNoIva}</p>
                            </div>
                            <div className="proforma-item">
                                 <p className="proforma-item-p" >Total descuento: $0.00</p>
                            </div>
                            <div className="proforma-item">
                                 <p className="proforma-item-p" >ICE: $0.00</p>
                            </div>
                            <div className="proforma-item">
                                 <p className="proforma-item-p" >IVA: ${iva}</p>
                            </div>
                            <div className="proforma-total">
                                 <p className="proforma-total-p" >${total}</p>
                            </div>
                        </Stack>

                    </Grid>
                   
                    <Grid item xs={12} md={0.5}>
                    
                    </Grid>
                    <Grid item xs={12} md={8}>
                        
                        </Grid>
                        <Grid item xs={6} md={2}>
                        <Button color="rojo" variant="contained" onClick={generarProformaPdf} >
                                Generar PDF
                            </Button>
                        </Grid>
                        <Grid item xs={6} md={2}>
                        <Button color="success" variant="contained" onClick={agregarProforma} >
                                Guardar Proforma
                            </Button>
                        </Grid>
                </Grid>
            </Container>
            <Modal isOpen={modalProducto} size="lg" >
                <ModalHeader>Agregar Producto</ModalHeader>
                <ModalBody>
                    <Grid container spacing={2}>
                        <Grid item xs={8}>
                            <FormControl fullWidth variant="filled">
                                <FilledInput
                                    hiddenLabel
                                    id="filled-adornment-password"
                                    type="text"
                                    size="small"
                                    onChange={handleSearchProduct}
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
                        <Grid item xs={4}>
                           
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
                                                Descripcion
                                            </TableCell>
                                            <TableCell align={'center'}>
                                                Precio
                                            </TableCell>
                                            <TableCell align={'left'}>

                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
                                                            <Stack direction="row" spacing={1}>
                                                                <Checkbox
                                                                    checked={row['select']}
                                                                    onClick={()=>{productoSeleccionado(row)}}
                                                                    inputProps={{ 'aria-label': 'controlled' }}
                                                                />
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
                                count={items.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Grid>
                       
                    </Grid>
                </ModalBody>
                <ModalFooter>
                    <Stack direction="row" spacing={2}>
                        <Button color="primary" variant="contained" onClick={agregarProductos}  >
                            terminar seleccion
                        </Button>
                        <Button color="rojo" variant="contained" onClick={() => { setModalProducto(false) }} >
                            Cancelar
                        </Button>
                    </Stack>
                </ModalFooter>
            </Modal>
            <Modal isOpen={modalCliente} size="lg">
                <ModalHeader>Agregar Cliente</ModalHeader>
                <ModalBody>
                    <Grid container spacing={2}>
                        <Grid item xs={8}>
                            <FormControl fullWidth variant="filled">
                                <FilledInput
                                    hiddenLabel
                                    id="filled-adornment-password"
                                    type="text"
                                    size="small"
                                    onChange={handleSearchClient}
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
                        <Grid item xs={4}>
                            <FormControl>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                    value={busqueda}
                                    onChange={handleBusqueda}
                                >
                                    <FormControlLabel value={true} control={<Radio />} label="Nombre" />
                                    <FormControlLabel value={false} control={<Radio />} label="Cedula" />
                                </RadioGroup>
                            </FormControl>
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
                                            <TableCell align={'left'}>

                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {clientes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
                                                            <Stack direction="row" spacing={1}>
                                                                <Button sx={{ width: 190 }} variant="contained" startIcon={<PanToolAltIcon />} onClick={()=>{seleccionarEmpleado(row)}} >Seleccionar</Button>
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
                                count={clientes.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Grid>
                    </Grid>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={() => { setModalCliente(false) }} >
                        Salir
                    </Button>
                </ModalFooter>
            </Modal>
            <Modal isOpen={modalServicio} size="lg" >
                <ModalHeader>Agregar Servicio</ModalHeader>
                <ModalBody>
                <Grid item xs={12}>
                    <TableContainer sx={{ maxHeight: 440 }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                        <TableCell align={'left'}>
                                            Item
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            Descripcion
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            Precio
                                        </TableCell>
                                        <TableCell align={'left'}>

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
                                                            <Stack direction="row" spacing={1}>
                                                                <Checkbox
                                                                    checked={row['select']}
                                                                    onClick={()=>{servicioSeleccionado(row)}}
                                                                    inputProps={{ 'aria-label': 'controlled' }}
                                                                />
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
                                count={items.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Grid>
                </ModalBody>
                <ModalFooter>
                <Stack direction="row" spacing={2}>
                        <Button color="primary" variant="contained" onClick={agregarServicios}>
                            terminar seleccion
                        </Button>
                        <Button color="rojo" variant="contained" onClick={() => { setModalServicio(false) }} >
                            Cancelar
                        </Button>
                    </Stack>
                </ModalFooter>
            </Modal>
        </>
    );

}
