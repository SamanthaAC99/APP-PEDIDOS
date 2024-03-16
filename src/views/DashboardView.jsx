
import SimpleBar from "simplebar-react";
import { Layout } from "../dashboard/layout";
import { Routes,Route } from "react-router";
import PersonasView from "./PersonasView";
import ProductosView from "./ProductosView";
import ProformasView from "./ProformasView";
import ConfigView from "./ConfigView";
import ServiciosView from "./ServiciosView";
import FacturarView from "./FacturarView";
import TablaProformasView from "./TablaProformasView";
import FilledInput from '@mui/material/FilledInput';
import InputAdornment from '@mui/material/InputAdornment';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import HomeView from "./HomeView";
import TablasFacturasView from "./TablasFacturasView";

export default function DashboardView(){



    return(
            <>
                <Layout>
                    <SimpleBar style={{ maxHeight: '90vh' }}>
                        <Routes>
                            <Route path="/"  element={<HomeView />} />
                            <Route path="/personas"  element={<PersonasView />} />
                            <Route path="/productos"  element={<ProductosView />} />
                            <Route path="/servicios"  element={<ServiciosView />} />
                            <Route path="/proformas"  element={<ProformasView />} />
                            <Route path="/facturador"  element={<FacturarView />} />
                            <Route path="/configuraciones"  element={<ConfigView />} />
                            <Route path="/tablas_proformas" element={<TablaProformasView/>}  />
                            <Route path="/tablas_facturas" element={<TablasFacturasView/>}  />
                        </Routes>
                    </SimpleBar>
                </Layout>
            </>
        );


}