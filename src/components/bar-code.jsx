import Barcode from 'react-barcode';

export default function BarcodeView(props){
    return (
        <>
         <Barcode value={props.value} format="CODE128"/>
        </>
    )
};