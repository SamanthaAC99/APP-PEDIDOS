import { useState, useEffect, useRef } from "react";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FilledInput from '@mui/material/FilledInput';
import TextField from '@mui/material/TextField';
import { collection, query, onSnapshot, doc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { db } from "../firebase/firebase-config";
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import PrintIcon from '@mui/icons-material/Print';
import Button from '@mui/material/Button';
import {generarPdf } from "../scripts/generar-pdf";
import Paper from '@mui/material/Paper';
export default function TablasFacturasView() {
    const [facturas, setFacturas] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [modalVisualizar, setModalVisualizar] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const [currentFactura,setCurrentFactura] = useState({products:[]})
    const allFacturas = useRef([{}]);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const abrirModalVisualizar = (_data) => {
        setCurrentFactura(_data);
        setModalVisualizar(false);
        generarPdf(_data);
    }
    // const actualizarProducto = async () => {
    //     const ref_data = doc(db, "facturas", setCurrentFactura.id);
    //     await updateDoc(ref_data, currentFactura);
    //     setModalEditar(false);
    // }
    const eliminarProducto = async (item) => {
        await deleteDoc(doc(db, "facturas", item.id));
    }
    const abrirModalEditar = (item) => {
        setCurrentFactura(item);
        setModalEditar(true);
        console.log(currentFactura)
    }
    const getData = () => {
        const q = query(collection(db, "facturas"));
        onSnapshot(q, (querySnapshot) => {
            const facturas_aux = [];
            querySnapshot.forEach((doc) => {
                facturas_aux.push(doc.data());
            });
            setFacturas(facturas_aux);
            allFacturas.current = facturas_aux;
        });
    }
    const handleCantidad = (event,_data)=>{
        let aux_data =  JSON.parse(JSON.stringify(currentFactura.productos));
        aux_data.map((item)=>{
            if(item.id === _data.id){
                if(event.target.value > 1){
                    item['cantidad'] = event.target.value;
                }else{
                    item['cantidad'] = 1;
                }
            }
        })
    }
    useEffect(() => {
        getData();
    }, []);

    return (
        <>
            <Container maxWidth="xl">
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <div className="proforma-container">
                            <div>
                                <p className="proforma-titulo" style={{ margin: 0 }}> <strong>TABLA PEDIDOS DE VENTAS</strong></p>
                            </div>
                            <div>
                                <p style={{ margin: 0 }} className="proforma-datos">CONORQUE CIA LTDA <strong>RUC:01903862</strong> </p>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <TableContainer sx={{ maxHeight: 440 }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ width: 100 }} align={'center'}>
                                            FECHA
                                        </TableCell>
                                        <TableCell sx={{ width: 160 }} align={'center'}>
                                            # FACTURA
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            PRECIO TOTAL
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            CLIENTE
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            RUC
                                        </TableCell>   
                                        <TableCell align={'center'}>
                                            ACCIONES
                                        </TableCell>                                                                           
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {facturas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => {
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                                    <TableCell align={"center"}>
                                                        {row.fecha}
                                                    </TableCell>
                                                    <TableCell align={"center"}>
                                                        {row.numero_proforma}
                                                    </TableCell>
                                                    <TableCell align={"center"}>
                                                        {row.total}
                                                    </TableCell>
                                                    <TableCell align={"center"}>
                                                        {row.nombre}
                                                    </TableCell>
                                                    <TableCell align={"center"}>
                                                        {row.ci}
                                                    </TableCell>
                                                    <TableCell align={"center"}>
                                                        <Stack direction="row" spacing={2}> 
                                                        <IconButton aria-label="editar" color="amarillo" onClick={() => { abrirModalEditar(row) }}>
                                                                <RemoveRedEyeIcon />
                                                            </IconButton>
                                                        <IconButton aria-label="delete" color="rojo" onClick={() => { eliminarProducto(row) }}>
                                                                <DeleteIcon />
                                                            </IconButton>
                                                            <IconButton aria-label="print" color="success" onClick={() => { abrirModalVisualizar(row) }} >
                                                                <PrintIcon />
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
                            count={facturas.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Grid>
                </Grid>
            </Container>
                <Modal isOpen={modalVisualizar} size="lg" >
                    <ModalHeader>Previsualizacion de la Factura</ModalHeader>
                    <ModalBody>
                    <div className="factura-container1">
    <div className="factura-imagen1">
        <img className="imagen1" src="https://firebasestorage.googleapis.com/v0/b/conorque-pedidos.appspot.com/o/profiles%2FWhatsApp%20Image%202024-03-17%20at%202.24.05%20AM.jpeg?alt=media&token=00bfd5a7-9d7f-4844-a686-93842b74b4ec" alt="Imagen de la factura" />
    </div>
                                <div className="factura-datos">
                                    <Stack spacing={2} direction={"column"}>
                                        <p className="texto_factura" ><strong>RUC:</strong> 1104595671001</p>
                                        <p className="texto_factura" ><strong>PROFORMA No:</strong> 001-001-000000002</p>
                                        <p className="texto_factura" ><strong>Matriz:</strong> Av Turuhuayco y Juan Estrobel</p>
                                        <p className="texto_factura" ><strong>Sucursal:</strong> Av Turuhuayco y Juan Estrobel</p>
                                        <p className="texto_factura" ><strong>Contribuyente Especial:</strong>--</p>
                                        <p className="texto_factura" ><strong>OBLIGADO A LLEVAR CONTABILIDAD:</strong>NO</p>
                                    </Stack>
                                </div>
                            </div>
                   
              
                        <div style={{borderRadius: 10, border: "2px solid black", padding: 18, margin:8}}>
                            <p className="texto_factura"><strong>Razon Social / Nombres y Apellidos:</strong> CONSUMIDOR FINAL</p>
                            <p className="texto_factura"><strong>RUC/CI:</strong> 9999999999999 <strong>Fecha Emisión:</strong> 27/11/2023</p> 
                        </div>
                        <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                            <TableHead>
                            <TableRow>
                                <TableCell align="right">Codigo</TableCell>
                                <TableCell align="right">Cant.</TableCell>
                                <TableCell align="right">Descripción</TableCell>
                                <TableCell align="right">Precio Unitario</TableCell>
                                <TableCell align="right">Precio Total</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {currentFactura.products.map((row,index) => (
                                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell align="right">{row.codigo}</TableCell>
                                    <TableCell align="right">{row.cantidad}</TableCell>
                                    <TableCell align="right">{row.descripcion}</TableCell>
                                    <TableCell align="right">{row.valor_unitario}</TableCell>
                                    <TableCell align="right">{row.precio_total}</TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                        </TableContainer>
                </ModalBody>
                <ModalFooter>
                    <Stack spacing={2} direction={"row"}>
                        <Button color="rojo" variant="contained">GENERAR PDF</Button>
                        <Button color="primary" variant="contained" onClick={() => { setModalVisualizar(false) }}>SALIR</Button>
                    </Stack>
                </ModalFooter>
            </Modal>
            <Modal isOpen={modalEditar}    >
                <ModalHeader  >Visualizacion Pedido </ModalHeader>
                <ModalBody>
                <Grid container spacing={2}>
                <Grid item md={6} xs={12}>
                                    <TextField
                                        id="outlined-required"
                                        label="RUC"
                                        fullWidth
                                        name="ci"
                                        value={currentFactura.ci}
                                        // onChange={handleInputChange}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                <TextField
                                        id="outlined-required"
                                        label="CLIENTE"
                                        fullWidth
                                        name="nombre"
                                        value={currentFactura.nombre}
                                        // onChange={handleInputChange}
                                    />
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
                                            P. Unitario
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            Total
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {currentFactura.products.map((row, index) => {
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
                                                        {row.precio_total}
                                                    </TableCell>                                        
                                                    {/* <TableCell align={"center"}>
                                                        <Stack direction="row" spacing={1}>
                                                            <IconButton aria-label="delete" color="rojo" onClick={() => { eliminarProducto(row) }}  >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </Stack>
                                                    </TableCell> */}
                                                </TableRow>
                                            );
                                        })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                     
                    </Grid>
                    </Grid>
                </ModalBody>
                <ModalFooter>
                {/* <Button color="primary" onClick={() => { actualizarProducto() }} >
                        Actualizar
                    </Button> */}
                    <Button color="secondary" onClick={() => { setModalEditar(false) }} >
                        Cancelar
                    </Button>
                </ModalFooter>
                </Modal>
        </>
        //tambien 
    );
}