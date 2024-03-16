
import { jsPDF} from "jspdf";
import autoTable from 'jspdf-autotable';
import { getStorage, ref, getDownloadURL, getBlob } from "firebase/storage";
import { db,storage } from "../firebase/firebase-config";
import no_logo from "../assets/no_logo.webp";
//import icono from "../assets/logo_arandano.png"

var JsBarcode = require('jsbarcode');


const generarFacturaPDF = async(proforma) => {

    var doc = new jsPDF({
        orientation: "portrait",
    })
    JsBarcode("#barcode", proforma.clave_acceso,{
        format: "CODE128",
        lineColor: "#212F3D",
        width:4,
        height:20,
        displayValue: false
      });
    const imgElement = document.querySelector("#barcode");
    if (imgElement && imgElement.src) {
      console.log("URL de la imagen:", imgElement.src);
    } else {
      console.error("Error al obtener la URL de la imagen.");
    }

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
            { content: 'Razon Social / Nombres y Apellidos:',styles: { halign: 'left',cellWidth:70,fontStyle:"bold",lineColor:10,lineWidth:{top: 0.3, right: 0, bottom: 0, left: 0.3}}},
            { content: `${proforma.nombre}`,colSpan: 3, styles: { halign: 'left',lineColor:10,lineWidth:{top: 0.3, right: 0.3, bottom: 0, left: 0} }},
        ],
        [
            { content: 'RUC / C.I.:', styles: { halign: 'left',fontStyle:"bold" ,lineColor:10,lineWidth:{top: 0, right: 0, bottom: 0.3, left: 0.3}  } },
            { content: `${proforma.ci}`, styles: { halign: 'center',lineColor:10,lineWidth:{top: 0, right: 0, bottom: 0.3, left: 0} } },
            { content: 'Fecha Emisión:', styles: { halign: 'left',fontStyle:"bold" ,lineColor:10,lineWidth:{top: 0, right: 0, bottom: 0.3, left: 0} } },
            { content: `${proforma.fecha}`, styles: { halign: 'center' ,lineColor:10,lineWidth:{top: 0, right: 0.3, bottom: 0.3, left: 0} } },
        ]
    ]
    
    // //
    let detalles_adicionales  = [
        [
            { content: 'Informacion Adicional',colSpan: 2,styles: { halign: 'center',fontStyle:"bold",lineColor:10,lineWidth:{top: 0.3, right: 0.3, bottom: 0, left: 0.3}}},
        ],
        [
            { content: 'Método de pago:', styles: { cellWidth:30,halign: 'left',fontStyle:"bold" ,lineColor:10,lineWidth:{top: 0, right: 0, bottom: 0, left: 0.3}} },
            { content: `${proforma.metodo_pago}`, styles: { halign: 'left' ,lineColor:10,lineWidth:{top: 0, right: 0.3, bottom: 0, left: 0}} },
        ],
        [
            { content: 'Dirección:', styles: { halign: 'left',fontStyle:"bold", lineColor:10,lineWidth:{top: 0, right: 0, bottom: 0, left: 0.3} } },
            { content: `${proforma.direccion}`, styles: { halign: 'left' , lineColor:10,lineWidth:{top: 0, right: 0.3, bottom: 0, left: 0} } },
        ],
        [
            { content: 'Teléfonos:', styles: { halign: 'left',fontStyle:"bold", lineColor:10,lineWidth:{top: 0, right: 0, bottom: 0, left: 0.3}  } },
            { content: `${proforma.phone}`, styles: { halign: 'left', lineColor:10,lineWidth:{top: 0, right: 0.3, bottom: 0, left: 0}  } },
        ],
        [
            { content: 'Email:', styles: { halign: 'left',fontStyle:"bold" , lineColor:10,lineWidth:{top: 0, right: 0, bottom: 0, left: 0.3} } },
            { content: `${proforma.email}`, styles: { halign: 'left', lineColor:10,lineWidth:{top: 0, right: 0.3, bottom: 0, left: 0}  } },
        ],
        [
            { content: 'Observaciones:', styles: { halign: 'left',fontStyle:"bold" , lineColor:10,lineWidth:{top: 0, right: 0, bottom: 0.3, left: 0.3}  } },
            { content: `${proforma.observaciones}`, styles: { halign: 'left', lineColor:10,lineWidth:{top: 0, right: 0.3, bottom: 0.3, left: 0}  } },
        ]
    ]
        // //
    // let detalles_adicionales  = [
    //     [
    //         { content: 'Informacion Adicional',colSpan: 2,styles: { halign: 'center',fontStyle:"bold"}},
    //     ],
    //     [
    //         { content: 'Método de pago:', styles: { cellWidth:30,halign: 'left',fontStyle:"bold" } },
    //         { content: `${proforma.metodo_pago}`, styles: { halign: 'left' } },
    //     ],
    //     [
    //         { content: 'Dirección:', styles: { halign: 'left',fontStyle:"bold"} },
    //         { content: `${proforma.direccion}`, styles: { halign: 'left' } },
    //     ],
    //     [
    //         { content: 'Teléfonos:', styles: { halign: 'left',fontStyle:"bold"} },
    //         { content: `${proforma.phone}`, styles: { halign: 'left' } },
    //     ],
    //     [
    //         { content: 'Email:', styles: { halign: 'left',fontStyle:"bold" } },
    //         { content: `${proforma.email}`, styles: { halign: 'left'} },
    //     ],
    //     [
    //         { content: 'Observaciones:', styles: { halign: 'left',fontStyle:"bold"  } },
    //         { content: `${proforma.observaciones}`, styles: { halign: 'left' } },
    //     ]
    // ]
 
    if(proforma.profile){     
        const httpsReference = ref(storage, proforma.profile_url); 
        await getDownloadURL(httpsReference)
            .then((url) => {
                const img = new Image();
                img.src = url;
                console.log("todo chato hasta aca");
                doc.addImage(img, 'PNG', 24, 14, 60, 60);
            })
            .catch((error) => {
                switch (error.code) {
                case 'storage/object-not-found':
                    break;
                case 'storage/unauthorized':
                    break;
                case 'storage/canceled':
                    break;
                case 'storage/unknown':
                    break;
                }
            });
        
    }else{
        doc.addImage(no_logo, 'webp', 24, 14, 60,60);
    }
    doc.setLineWidth(0.5);
    // rectangulo izquierdo 
    doc.roundedRect(20, 75, 75, 35, 5, 5); 
    doc.setFontSize(7)
    doc.text(`${proforma.nombre_facturador}`,28,80)
    doc.text(`Matriz: ${proforma.matriz}`,28,86)
    doc.text(`Sucursal: ${proforma.sucursal}`,28,92)
    doc.text(`Contribuyente Especial Nro: ${proforma.contribuyente_especial}`,28,98)
    doc.text(`OBLIGADO LLEVAR CONTABILIDAD: ${proforma.contabilidad}`,28,104)
    //rectangulo derecho
    doc.roundedRect(102, 18, 88, 92, 5, 5); 
    doc.setFontSize(12)
    doc.text(`RUC.: ${proforma.ci}001`,105,24)
    doc.setFont("helvetica", "bold");
    doc.text("FACTURA",105,34)
    doc.setFontSize(8)
    doc.text(`No.: ${proforma.numero_proforma}`,105,40)
    doc.setFont("helvetica", "normal");
    doc.text(`NÚMERO DE AUTORIZACIÓN`,105,47)
    doc.text(`${proforma.clave_acceso}`,105,52)
    doc.text(`AMBIENTE: PRODUCCIÓN`,105,74)
    doc.text(`EMISIÓN: NORMAL`,105,80)
    doc.text(`CLAVE DE ACCESO`,105,83)
    doc.addImage(imgElement.src, 'webp', 104, 86, 84,20);
    doc.text(`${proforma.clave_acceso}`,105,105)
    autoTable(doc, {
        theme: 'plain',
        body: datos_cliente,
        styles: { fontSize:7 },
        margin:{ left: 20,right:20,top:0,bottom:0},
        startY:115,
    })
    autoTable(doc, {
        styles: { lineColor: [0, 0, 0], lineWidth: 0.3,fontSize:7 },
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
        margin:{ left: 20,right:20,top:0,bottom:0},
        body: proforma.products,
    })
    autoTable(doc, {
        styles: { lineColor: [0, 0, 0], lineWidth: 0.3,fontSize:7 },
        theme: 'grid',
        body: datos_factura,
        margin:{ left: 20,right:20,top:0,bottom:0},
       
    })
    autoTable(doc, {
        styles: {fontSize:7 },
        theme:"plain",
        body: detalles_adicionales,
        margin:{ left: 20,right:20,top:0,bottom:0},
    })
    doc.save(`factura_final.pdf`);
}

const generarClavedeAcceso =(_data) =>{
    //console.log(_data)

    let codigo_aleatorio = []
    let magic_number = 0
    let verificator = 2;
    let acum = 0;
    for(let i = 0; i<8;i++){
        magic_number = Math.floor(Math.random() * 10);
        codigo_aleatorio.push(magic_number)
    }
    let code = codigo_aleatorio.join('')
    for (let i = code.length - 1; i >= 0; i--) {
        let n = parseInt(code.substring(i, i + 1));
        acum = acum + n * verificator;
        verificator++;
    
        if (verificator > 7) {
            verificator = 2;
        }
    }
    let mod11 = acum % 11;
    let result = 11 - mod11;

    if (result === 10) {
        result = 1;
    }

    if (result === 11) {
        result = 0;
    }
    console.log(result)
    let acces_key = _data.fecha+_data.tipo+_data.ruc+_data.tipo_ambiente+_data.serie+_data.comprobante+code+_data.tipo_emision+result
    console.log(acces_key)
    return acces_key
}


export { generarFacturaPDF,generarClavedeAcceso }