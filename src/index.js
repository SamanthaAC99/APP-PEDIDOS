import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'simplebar-react/dist/simplebar.min.css';
import {  ThemeProvider } from '@mui/material/styles';
import {store,persistor} from './app/store'
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux'
import { createTheme } from './theme';
const theme = createTheme();
  const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<Provider store={store}>
     <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
     </PersistGate>
     </Provider>

);



reportWebVitals();