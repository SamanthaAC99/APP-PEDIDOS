import {createSlice} from '@reduxjs/toolkit'

export const menuSlice = createSlice({
    name: 'menu',
    initialState: {
        menu: 'Dashboard',
        loading: false
    },
    reducers: {
        setNameMenu: (state,action)=>{
            state.menu = action.payload;
        },
        setLoading: (state,action)=>{
            state.loading = action.payload;
        }
    }
})
export const {setNameMenu,setLoading} = menuSlice.actions
export default menuSlice.reducer