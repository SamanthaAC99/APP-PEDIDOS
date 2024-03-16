import {createSlice} from '@reduxjs/toolkit';



export const userSlice = createSlice({
    name: 'user',
    initialState: {
        email:'',
        password:'',
        phone:'',
        razon:'',
        ruc: '',
        tipo:'',
        usuario:'',
        id:'',
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
        bill_code2:"002",
        bill_code3:"000000001",
        defect_direction:{
            direccion:"",
            codigo:"",
            nombreComercial:""
        }
    },
    reducers: {
        setUser: (state,action)=>{
            state.email = action.payload.email;
            state.password = action.payload.password;
            state.phone = action.payload.phone;
            state.razon = action.payload.razon;
            state.ruc = action.payload.ruc;
            state.tipo = action.payload.tipo;
            state.usuario = action.payload.usuario;
            state.id = action.payload.id;
            state.profile = action.payload.profile;
            state.profile_url = action.payload.profile_url;
            state.signature = action.payload.signature;
            state.signature_url = action.payload.signature_url;
            state.signature_name = action.payload.signature_name;
            state.ciudad = action.payload.ciudad;
            state.contabilidad = action.payload.contabilidad;
            state.factura = action.payload.factura;
            state.direccion_ruc = action.payload.direccion_ruc;
            state.nombre_comercial = action.payload.nombre_comercial;
            state.firma_password = action.payload.firma_password;
            state.direcciones = action.payload.direcciones;
            state.categorias = action.payload.categorias;
            state.bill_code1 = action.payload.bill_code1;
            state.bill_code2 = action.payload.bill_code2;
            state.bill_code3 = action.payload.bill_code3;
            state.defect_direction = action.payload.defect_direction;
        },
        updateCategorias:(state,action)=>{
            state.categorias = action.payload;
        },
        updateNumberBill:(state,action)=>{
     
            state.bill_code3 = action.payload;
        }
        
    }
})
export const {setUser,updateCategorias,updateNumberBill} = userSlice.actions
export default userSlice.reducer