var XMLWriter = require('xml-writer');


function generarFacturaXML(datos_factura){

    let xw = new XMLWriter;
    xw.startDocument();
    xw.startElement('factura');
    xw.writeAttribute('id', 'comprobante')
    xw.writeAttribute('version', '1.0.1')
    xw.startElement('infoTributaria',)
    xw.writeElement('ambiente',1) //2 para produccion 1 para pruebas
    xw.writeElement('tipoEmision',1)
    xw.writeElement('razonSocial',datos_factura.nombre_facturador)
    xw.writeElement('nombreComercial',datos_factura.nombre_comercial)
    xw.writeElement('ruc',datos_factura.ci)
    xw.writeElement('claveAcceso',datos_factura.clave_acceso) // pendiente a determinar como se obtiene
    xw.writeElement('codDoc',"01")
    xw.writeElement('estab',datos_factura.codigo_establecimiento)
    xw.writeElement('ptoEmi',datos_factura.punto_emision)
    xw.writeElement('secuencial',datos_factura.secuencial)
    xw.writeElement('dirMatriz',datos_factura.matriz)
    xw.endElement()
    xw.startElement('infoFactura',)
    xw.writeElement('fechaEmision',datos_factura.fecha)
    xw.writeElement('dirEstablecimiento',datos_factura.sucursal)
    xw.writeElement('contribuyenteEspecial',"5368")
    xw.writeElement('obligadoContabilidad',datos_factura.contabilidad)
    xw.writeElement('tipoIdentificacionComprador',"04")
    xw.writeElement('guiaRemision',datos_factura.numero_proforma)
    xw.writeElement('razonSocialComprador',datos_factura.razon)
    xw.writeElement('identificacionComprador',datos_factura.ci)
    xw.writeElement('direccionComprador',datos_factura.direccion)
    xw.writeElement('totalSinImpuestos',datos_factura.total)
    xw.writeElement('totalDescuento',datos_factura.descuento)
    xw.startElement('totalConImpuestos')
        for(let i = 0; i <datos_factura.products.length ;i++){
            var item = datos_factura.products[i]
            var valor = item.valor_unitario;
          
            var numeroFlotante = parseFloat(valor);
            var numeroRedondeado = numeroFlotante.toFixed(2);
           
            if(item.tipo_impuesto === 2){
                var valor_iva = numeroFlotante *0.12;
                var iva_formateado = valor_iva.toFixed(2);
                xw.startElement('totalImpuesto')
                xw.writeElement('codigo',"2")
                xw.writeElement('codigoPorcentaje',item.tarifa_iva)
                xw.writeElement('baseImponible',numeroRedondeado)
                xw.writeElement('valor',iva_formateado)
                xw.endElement()
            }else{
                xw.startElement('totalImpuesto')
                xw.writeElement('codigo',"3")
                xw.writeElement('codigoPorcentaje',"1213")
                xw.writeElement('baseImponible',numeroRedondeado)
                xw.writeElement('valor',valor_iva)
                xw.endElement()
            }
        }
        // xw.startElement('totalImpuesto')
        // xw.writeElement('codigo',"3")
        // xw.writeElement('codigoPorcentaje',"3072")
        // xw.writeElement('baseImponible',"295000")
        // xw.writeElement('valor',"14750.00")
        // xw.endElement()
        // xw.startElement('totalImpuesto')
        // xw.writeElement('codigo',"2")
        // xw.writeElement('codigoPorcentaje',"2")
        // xw.writeElement('descuentoAdicional',"5.00")
        // xw.writeElement('baseImponible',"12.00")
        // xw.writeElement('valor',"14750.00")
        // xw.endElement()
        // xw.startElement('totalImpuesto')
        // xw.writeElement('codigo',"5")
        // xw.writeElement('codigoPorcentaje',"2")
        // xw.writeElement('baseImponible',"2")
        // xw.writeElement('valor',"2")
        // xw.endElement()
    xw.endElement()
    // termina la seccion de los impuestos
    xw.writeElement('propina',"0.00")
    xw.writeElement('importeTotal',"0.00")
    xw.writeElement('moneda',"DOLAR")
    //metodo de pago
    xw.startElement('pagos')
    xw.startElement('pago')
    xw.writeElement('formaPago',"0.1")
    xw.writeElement('total',"347159")
    xw.writeElement('plazo',"30")
    xw.writeElement('unidadTiempo',"dias")
    xw.endElement()
    xw.endElement()
    //etiqueta info tributaria
    xw.endElement()
    xw.startElement('detalles')
    for(let i =0 ; i< datos_factura.products.length ;i++){
            xw.startElement('detalle')
            xw.writeElement('codigoPrincipal',datos_factura.products[i].codigo)
            xw.writeElement('codigoAuxiliar',datos_factura.products[i].codigo)
            xw.writeElement('descripcion',datos_factura.products[i].descripcion)
            xw.writeElement('cantidad',datos_factura.products[i].cantidad)
            xw.writeElement('precioUnitario',datos_factura.products[i].valor_unitario)
            xw.writeElement('descuento',datos_factura.products[i].descuento)
            xw.writeElement('precioTotalSinImpuesto',datos_factura.products[i].precio_total)
            xw.startElement('impuestos')
                xw.startElement('impuesto')
                xw.writeElement('codigo',"3")
                xw.writeElement('codigoPorcentaje',"3072")
                xw.writeElement('tarifa',"5")
                xw.writeElement('baseImponible',"295000")
                xw.writeElement('valor',"14750.5")
                xw.endElement()
                xw.startElement('impuesto')
                xw.writeElement('codigo',"5")
                xw.writeElement('codigoPorcentaje',"5001")
                xw.writeElement('tarifa',"0.02")
                xw.writeElement('baseImponible',"12000")
                xw.writeElement('valor',"240.5")
                xw.endElement()
            xw.endElement()

            xw.endElement()
    }
    xw.endElement()
    xw.endElement()
    xw.endDocument();
  
    console.log(xw.toString())

}

export {generarFacturaXML}