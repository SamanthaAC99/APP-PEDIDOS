
import { jsPDF} from "jspdf";
import autoTable from 'jspdf-autotable';
import { getStorage, ref, getDownloadURL, getBlob } from "firebase/storage";
import { db,storage } from "../firebase/firebase-config";
import no_logo from "../assets/no_logo.webp";
//import icono from "../assets/logo_arandano.png"



const generarPdf = async(proforma) => {

    var doc = new jsPDF({
        orientation: "portrait",
    })
  
   
    let custom_padding = 0.5
    

    doc.setLineWidth(0.5);
 

    let datos_factura = [
        [
            { content: ``, styles: { halign: 'left',lineWidth:0 } },
            { content: 'SUBTOTAL IVA',styles: { halign: 'left',cellWidth:40 ,fontSize:8 ,fontStyle:"bold"} },
            { content: `${proforma.sub_iva}`, styles: { halign: 'left',cellWidth:20 ,fontSize:8 } },
        ],
        [
            { content: ``, styles: { halign: 'left',lineWidth:0  } },
            { content: 'SUBTOTAL 0%',styles: { halign: 'left',cellWidth:40 ,fontSize:8 ,fontStyle:"bold"} },
            { content: `${proforma.sub_zero}`, styles: { halign: 'left',cellWidth:20,fontSize:8 } },
        ],
        [
            { content: ``, styles: { halign: 'left',lineWidth:0  } },
            { content: 'SUBTOTAL No sujeto IVA',styles: { halign: 'left',cellWidth:40 ,fontSize:8 ,fontStyle:"bold"} },
            { content: `${proforma.sub_total}`, styles: { halign: 'left',cellWidth:20 ,fontSize:8 } },
        ],
        [
            { content: ``, styles: { halign: 'left',lineWidth:0  } },
            { content: 'SUBTOTAL SIN IMPUESTOS',styles: { halign: 'left',cellWidth:40 ,fontSize:8 ,fontStyle:"bold"} },
            { content: `${proforma.sub_siniva}`, styles: { halign: 'left',cellWidth:20 ,fontSize:8  } },
        ],
        [
            { content: ``, styles: { halign: 'left',lineWidth:0  } },
            { content: 'DESCUENTO',styles: { halign: 'left',cellWidth:40 ,fontSize:8 ,fontStyle:"bold"} },
            { content: `${proforma.descuento}`, styles: { halign: 'left',cellWidth:20,fontSize:8 } },
        ],
        [
            { content: ``, styles: { halign: 'left',lineWidth:0  } },
            { content: 'ICE',styles: { halign: 'left',cellWidth:40,fontSize:8 ,fontStyle:"bold"} },
            { content: `${proforma.ice}`, styles: { halign: 'left',cellWidth:20,fontSize:8  } },
        ],
        [
            { content: ``, styles: { halign: 'left',lineWidth:0  } },
            { content: 'IVA',styles: { halign: 'left',cellWidth:40,fontSize:8 ,fontStyle:"bold"} },
            { content: `${proforma.iva}`, styles: { halign: 'left' ,cellWidth:20,fontSize:8 } },
        ],
        [
            { content: ``, styles: { halign: 'left',lineWidth:0  } },
            { content: 'VALOR TOTAL',styles: { halign: 'left',cellWidth:40,fontSize:8 ,fontStyle:"bold"} },
            { content: `${proforma.total}`, styles: { halign: 'left',cellWidth:20,fontSize:8  } },
        ],
    ]

    let datos_cliente  = [
        [
            { content: 'Razon Social / Nombres y Apellidos:',styles: { halign: 'left',cellWidth:70,fontStyle:"bold"} },
            { content: `${proforma.nombre}`,colSpan: 3, styles: { halign: 'left' } },
        ],
        [
            { content: 'RUC / C.I.:', styles: { halign: 'left',fontStyle:"bold" } },
            { content: `${proforma.ci}`, styles: { halign: 'center' } },
            { content: 'Fecha Emisión:', styles: { halign: 'left',fontStyle:"bold" } },
            { content: `${proforma.fecha}`, styles: { halign: 'center' } },
        ]
    ]
    
    doc.setLineWidth(0.5);
    doc.roundedRect(100, 18, 85, 57, 5, 5); 
    doc.setFontSize(12)
    doc.text(`RUC.: ${proforma.ci}001`,103,24)
    doc.setFont("helvetica", "bold");
    doc.text("PROFORMA",103,34)
    doc.setFontSize(8)
    doc.text(`No.: ${proforma.numero_proforma}`,103,40)
    doc.setFont("helvetica", "normal");
    doc.text(`Matriz: ${proforma.matriz}`,103,47)
    doc.text(`Sucursal: ${proforma.sucursal}`,103,54)
    doc.text(`Contribuyente Especial Nro: ${proforma.contribuyente_especial}`,103,61)
    doc.text(`OBLIGADO LLEVAR CONTABILIDAD: ${proforma.contabilidad}`,103,68)
    autoTable(doc, {
        theme: 'plain',
        body: datos_cliente,
        startY:80,
        margin:25
    })
    autoTable(doc, {
        styles: { lineColor: [0, 0, 0], lineWidth: 0.3,fontSize:8 },
        theme: 'grid',
        headStyles:{fillColor:"white",textColor:"black"},
        columns: [
            { header: 'Codigo Principal', dataKey: 'codigo'},
            { header: 'Cant.', dataKey: 'cantidad'},
            { header: 'Descripción', dataKey: 'descripcion'},
            { header: 'Precio Unitario', dataKey: 'precio_unitario'},
            { header: 'Descuento', dataKey: 'descuento'},
            { header: 'Precio Total', dataKey: 'precio_total'}
          ],
        margin:25,
        body: proforma.products,
    })

    autoTable(doc, {
        styles: { lineColor: [0, 0, 0], lineWidth: 0.3,fontSize:8 },
        theme: 'grid',
        body: datos_factura,
        margin:25,
       
    })
    doc.rect(25, 80, 160, 15); 
    if(proforma.profile){
      
  
       
    const httpsReference = ref(storage, proforma.profile_url); 
    await getDownloadURL(httpsReference)
        .then((url) => {
      
            const img = new Image()
            img.src = url
            console.log("todo chato hasta aca")
      
          
            doc.addImage(img, 'PNG', 24, 14, 60, 60);
         
        })
        .catch((error) => {
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
            case 'storage/object-not-found':
                // File doesn't exist
                break;
            case 'storage/unauthorized':
                // User doesn't have permission to access the object
                break;
            case 'storage/canceled':
                // User canceled the upload
                break;

            // ...

            case 'storage/unknown':
                // Unknown error occurred, inspect the server response
                break;
            }
            

        });
        
    }else{
        doc.addImage(no_logo, 'webp', 24, 14, 60,60);
    }
    
    doc.save(`proforma.pdf`);
}




export { generarPdf }