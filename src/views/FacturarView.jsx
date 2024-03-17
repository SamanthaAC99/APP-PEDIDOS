import { useState, useEffect, useRef } from "react";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
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
import { useSelector,useDispatch} from 'react-redux';
import { setLoading } from "../features/menu/menuSlice";
import { updateNumberBill } from "../features/auth/userSlice";
import { v4 as uuidv4 } from 'uuid';
import { generarFacturaPDF,generarClavedeAcceso } from "../scripts/generar-factura";
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { generarFacturaXML } from "../scripts/generar-xml";

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
  





export default function FacturasView() {
    const userState = useSelector(state => state.auth);
    console.log("USE",userState)
    const [value, setValue] = useState(dayjs(new Date()));
    const [productos, setProductos] = useState([])
    const [modalCliente, setModalCliente] = useState(false);
    let consumidor_final = {
        ci: userState.ruc,
        nombre:userState.razon,
        correos:[userState.email],
        phone:userState.phone,
        direccion:userState.direcciones[0].direccion,
        email:userState.email,
        observaciones:"Ninguna"
        
    }
    const [currentCliente, setCurrentCliente] = useState(consumidor_final);
    console.log("CC",currentCliente)
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
    const [subQuince,setSubQuince] = useState(0.00);
    const [subIva,setSubIva] = useState(0.00);
    const [ice,setIce] = useState(0.00)
    const allproducts = useRef([{}]);
    const allClientes = useRef([{}]);
    const allItems = useRef([{}]);
    const [modalServicio,setModalServicio] = useState(false);
    const [servicios,setServicios] = useState([]);
    const dispatch = useDispatch();
    const allservices = useRef([{}]);
    const [pago,setPago] = useState(1);
    const [currentEstablecimiento ,setCurrentEstablecimiento] = useState(userState.direcciones[0]);
  

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
    const handlePago = (event)=>{
        setPago(event.target.value);
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
        let aux_iva= 0.0
        let const_iva = 0.12
        let aux_zero = 0.0
        let aux_quince = 0.0
        let aux_trece = 0.0
        aux_data.forEach((item)=>{
            aux_subtotal = (parseFloat(item.valor_unitario)*parseFloat(item['cantidad'])) + aux_subtotal
            if(item.tarifa_iva === 1){
                const_iva = 0.13
                aux_trece = (parseFloat(item.valor_unitario)*parseFloat(item['cantidad'])) + aux_trece
            }else if(item.tarifa_iva === 2){
                const_iva = 0.15
                aux_quince =  (parseFloat(item.valor_unitario)*parseFloat(item['cantidad'])) + aux_quince
            }else{
                const_iva = 0.00
                aux_zero =  (parseFloat(item.valor_unitario)*parseFloat(item['cantidad'])) + aux_zero
            }
            aux_iva = ((parseFloat(item.valor_unitario)*parseFloat(item['cantidad']))*const_iva) + aux_iva;
            console.log(aux_iva)
        })
        setIva(aux_iva);
        setSubTotal(aux_subtotal)
        setSubZero(aux_zero)
        setSubQuince(aux_quince)
        setSubIva(aux_trece)
        setTotal(aux_iva+aux_subtotal)

        setProductos(aux_data)


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
        numero++;
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
    const handleCurrentClient = (event)=>{
        const { name, value } = event.target;
        const nuevoObjeto = { ...currentCliente };
        nuevoObjeto[name] = value;
        setCurrentCliente(nuevoObjeto);
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
        let aux_subtotal = 0.0
        let aux_iva= 0.0
        let const_iva = 0.12
        let aux_zero = 0.0
        let aux_quince = 0.0
        let aux_trece = 0.0
        seleccionados.forEach((item)=>{
                aux_subtotal = parseFloat(item.valor_unitario) + aux_subtotal
                if(item.tarifa_iva === 1){
                    const_iva = 0.13
                    aux_trece = parseFloat(item.valor_unitario) + aux_trece
                }else if(item.tarifa_iva === 2){
                    const_iva = 0.15
                    aux_quince =  parseFloat(item.valor_unitario) + aux_quince
                } else {
                    const_iva = 0
                    aux_zero= parseFloat(item.valor_unitario) + aux_zero
                }
                aux_iva = (parseFloat(item.valor_unitario)*const_iva) + aux_iva;
                console.log(aux_iva)
            })
            setIva(aux_iva.toFixed(2));
            setSubTotal(aux_subtotal.toFixed(2));
            setSubZero(aux_zero.toFixed(2));
            setSubQuince(aux_quince.toFixed(2));
            setSubIva(aux_trece.toFixed(2));
            let aux_total1 =aux_iva+aux_subtotal
            setTotal(aux_total1.toFixed(2))
            setProductos(seleccionados);
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
        setIva(aux_iva.toFixed(2));
        setSubTotal(aux_subtotal.toFixed(2))
        setSubZero(aux_zero.toFixed(2))
        setSubQuince(aux_noiva.toFixed(2))
        setSubIva(aux_totaliva.toFixed(2))
        let aux_total1 =aux_iva+aux_subtotal
        setTotal(aux_total1.toFixed(2))
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
    
    const agregarFactura = async(_case)=>{
        dispatch(setLoading(true));
        let aux_productos =  JSON.parse(JSON.stringify(productos));
        let user_copy = JSON.parse(JSON.stringify(userState))
        // let factura_data = {}
        // let id = uuidv4();
        // console.log(id)
        const user_ref = doc(db, "usuarios", userState.id);
        let impuestos_data = []
        if(aux_productos.length >0){
            let products_formated = aux_productos.map((item)=>{
                return {
                        codigo:item.codigo_principal,
                        descripcion:item.descripcion,
                        cantidad:item.cantidad,
                        valor_unitario:item.valor_unitario,
                        descuento:0,
                        precio_total:parseFloat(item.valor_unitario)*parseFloat(item.cantidad),
                        tipo_impuesto:item.tipo_impuesto,
                        ice:item.ice,
                        tarifa_iva:item.tarifa_iva
                    }
            })
            let twelve = 0
            let zero = 0
            aux_productos.forEach((item)=>{
                if(item.tipo_impuesto === 2 ){
                    if(item.tarifa_iva === 1){
                        twelve += parseFloat(item.valor_unitario)
                    }
                }else if(item.tipo_impuesto === 3 ){
                    zero += parseFloat(item.valor_unitario)
                }
            })
            if(twelve !== 0 ){
                impuestos_data.push({
                    codigo:2,
                    tipo_impuesto:2,
                    base: twelve,
                    valor: twelve * 0.12

                })
            }
            if(zero !== 0){
                impuestos_data.push({
                    codigo:2,
                    tipo_impuesto:0,
                    base: zero,
                    valor: zero * 0.12

                })
            }
        
            console.log("lista de impuestos: ",impuestos_data);


            let fecha_formated = new Date(value);
        
            var dia = fecha_formated.getDate().toString();
            var mes = fecha_formated.getMonth() + 1; 
            var año = fecha_formated.getFullYear().toString();
            mes = mes.toString()
            if(dia<9){
                dia = '0'+dia
            }
            if(mes<9){
                mes = '0'+mes
            }
            
            let data_clave = {
                fecha:dia+mes+año,
                tipo:'01',
                ruc:currentCliente.ruc+'001',
                tipo_ambiente:1,
                serie:userState.bill_code1+userState.bill_code2,
                comprobante:userState.bill_code3,
                tipo_emision:1,
                
            }
            var fechaFormateada = dia + '/' + mes + '/' + año;
            let number_proforma =  `${userState.bill_code1}-${userState.bill_code2}-${userState.bill_code3}`
            let contabilidad_txt = userState.contabilidad ?  "SI":"NO"
            let factura_data = {
                products: products_formated,
                // profile: userState.profile,
                // profile_url: userState.profile_url,  
                nombre: currentCliente.nombre,
                ci:currentCliente.ci,
                fecha: fechaFormateada,
                sub_quince:subQuince,
                sub_iva:subIva,
                sub_total:subtotal,
                sub_zero:subZero,
                total:total,
                iva:iva,
                descuento:0,
                ice:0,
                matriz:currentEstablecimiento.direccion,
                sucursal:currentEstablecimiento.direccion,
                codigo_establecimiento:currentEstablecimiento.codigo,
                contabilidad: contabilidad_txt,
                contribuyente_especial: "120231",
                estado:"pendiente",
                // id:id,
                numero_proforma:number_proforma,
                secuencial:userState.bill_code3,
                metodo_pago:pago,
                estado:1,
                correos:currentCliente.correos,
                // email:currentCliente.email,
                phone:currentCliente.phone,
                direccion:currentCliente.direccion,
                // observaciones:currentCliente.observaciones,
                razon:currentCliente.nombre,
                nombre_facturador:userState.razon,
                punto_emision: userState.bill_code2,
                nombre_comercial:currentEstablecimiento.nombreComercial
                
            }
            
            try {
                const id = uuidv4();
                factura_data.id = id;
                Swal.fire({
                    title: 'Confirmación de Cliente',
                    // html: clienteInfo,
                    icon: 'info',
                    showCancelButton: true,
                    confirmButtonText: 'Aceptar',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        setDoc(doc(db, "facturas", id), factura_data);
                        console.log("Factura agregada correctamente con el ID:", id);
                        Swal.fire({
                            title: 'Pedido agregado',
                            html: '<i class="fas fa-check-circle" style="color:green;"></i>',
                            icon: 'success'
                        });
                    } else {
                     console.log("El usuario canceló")
                    }
                });
            } catch (error) {
                console.error("Error al agregar la factura:", error);
            }

            
            // console.log(id)
            console.log(factura_data)
            dispatch(setLoading(false));
        }
       
    }

    //const seleccionar

    useEffect(() => {
        dispatch(setLoading(false));
        getData();
    }, []);

    return (
        <>
            <Container maxWidth="xl">
                <Grid container spacing={2}>
                    {/* <Grid item xs={12}>
                        <div className="header-dash">
                            Sistema de generación de facturas.
                        </div>
                    </Grid> */}
                    <Grid item xs={12}>
                        <div className="proforma-container">
                            <div>
                                <p className="proforma-titulo" style={{ margin: 0 }}> <strong>PEDIDOS DE VENTAS</strong></p>
                            </div>
                            <div>
                                <p style={{ margin: 0 }} className="proforma-datos">CONORQUE CIA LTDA <strong>RUC:01903862</strong> </p>
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
                    <Grid item xs={12} md={2}>
                        <FormControl fullWidth variant="filled">
                            <InputLabel htmlFor="filled-adornment-password">Metodo de pago</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    value={pago}
                                    name="tipo_identificacion"
                                    onChange={handlePago}
                                    label="Tipo de Persona">
                                        <MenuItem value={1}>EFECTIVO</MenuItem>
                                        <MenuItem value={2}>TRANSFERENCIA</MenuItem>
                                        <MenuItem value={3}>TARJETA DE CREDITO</MenuItem>
                                        <MenuItem value={4}>TARJETA DE DEBITO</MenuItem>
                                </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    fullWidth
                                    options={userState.direcciones}
                                    onChange={(event, newValue) => {
                                    setCurrentEstablecimiento(newValue);
                                    }}
                                    getOptionLabel={(option) => option.direccion}
                                    defaultValue={userState.direcciones[0]}
                                    renderInput={(params) => <TextField {...params} label="Establecimiento" />}
                                />
                    </Grid>
                    <Grid item xs={12} md={2}>

                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Button sx={{ width: 190 }} variant="contained" onClick={() => { abrirModalProductos() }} >Agregar Producto</Button>
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
                                            Iva
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
                                                       <p style={{display:row.tarifa_iva===1?"block":"none"}}>13%</p>
                                                       <p style={{display:row.tarifa_iva===2?"block":"none"}}>15%</p>
                                                       <p style={{display:row.tarifa_iva===0?"block":"none"}}>0%</p>
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
                        <TableContainer component={Paper}>
                            <Table  aria-label="customized table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>Nombre</StyledTableCell>
                                        <StyledTableCell align="left">Valor</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <StyledTableRow >
                                        <StyledTableCell align="left">Direccion</StyledTableCell>
                                        <StyledTableCell align="left"><input type="text" id="fname" style={{width:"100%"}} name="direccion"  value={currentCliente.direccion} onChange={handleCurrentClient}/></StyledTableCell>
                                    </StyledTableRow>
                                    <StyledTableRow >
                                        <StyledTableCell align="left">Teléfonos</StyledTableCell>
                                        <StyledTableCell align="left"> <input type="text" id="fname" style={{width:"100%"}}   name="phone"  value={currentCliente.phone} onChange={handleCurrentClient} /></StyledTableCell>
                                    </StyledTableRow>
                                    <StyledTableRow >
                                        <StyledTableCell align="left">Email</StyledTableCell>
                                        <StyledTableCell align="left"> <input type="text" id="fname" style={{width:"100%"}}  name="email"  value={currentCliente.email} onChange={handleCurrentClient} /></StyledTableCell>
                                    </StyledTableRow>
                                    <StyledTableRow >
                                        <StyledTableCell align="left">Observaciones</StyledTableCell>
                                        <StyledTableCell align="left"><input type="text" id="fname" style={{width:"100%"}}  name="observaciones"  value={currentCliente.observaciones} onChange={handleCurrentClient} /></StyledTableCell>
                                    </StyledTableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    <Grid item xs={12} md={1}>
                    </Grid>
                    <Grid item xs={12} md={4.5}>
                        <Stack spacing={1}>
                            <div className="proforma-item">
                                 <p className="proforma-item-p" >Subtotal sin impuestos: ${subtotal}</p>
                            </div>
                            <div className="proforma-item">
                                 <p className="proforma-item-p" >Subtotal 0%: ${subZero}</p>
                            </div>
                            <div className="proforma-item">
                                 <p className="proforma-item-p" >Subtotal 13%: ${subIva}</p>
                            </div>
                            <div className="proforma-item">
                                 <p className="proforma-item-p" >Subtotal 15%: ${subQuince}</p>
                            </div>
                            <div className="proforma-item">
                                 <p className="proforma-item-p" >IVA: ${iva}</p>
                            </div>
                            <div className="proforma-total">
                                 <p className="proforma-total-p" >${total}</p>
                            </div>
                        </Stack>

                    </Grid>
                   
                    {/* <Grid item xs={12} md={0.5}>
                    
                    </Grid> */}
                    <Grid item xs={12} md={8}>
                        
                        </Grid>
                        {/* <Grid item xs={6} md={2}>
                        <Button color="rojo" variant="contained" onClick={()=>{agregarFactura(2)}} >
                                Generar PDF
                            </Button>
                        </Grid> */}
                        <Grid item xs={6} md={2}>
                            <Button color="success" variant="contained" onClick={()=>{agregarFactura(1)}} >
                                Generar Factura
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
            
            <img style={{display:"none"}} id="barcode"/>
        </>
    );

}
