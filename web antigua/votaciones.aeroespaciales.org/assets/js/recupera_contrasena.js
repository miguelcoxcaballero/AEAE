/*#############################################################################################################################################################
###############################################################################################################################################################
###                                                                                                                                                         ###
###                                                     DEMOKRATIAN   http://demokratian.org                                                                ###
###                                                   Copyright (C) 2020 CARLOS SALGADO WERNER                                                              ###
###                              Este programa ha sido creado por Carlos Salgado Werner (http://carlos-salgado.es)                                          ###
###                                                                                                                                                         ###
### Este programa es software libre. Puede redistribuirlo y/o modificarlo bajo los términos de la Licencia GNU Affero General Public License según es       ###
### publicada por la Free Software Foundation, bien de la versión 3 de dicha Licencia o bien de cualquier versión posterior.                                ###
### Este programa se distribuye con la esperanza de que sea útil, pero SIN NINGUNA GARANTÍA, incluso sin la garantía MERCANTIL implícita o sin garantizar   ###
### la CONVENIENCIA PARA UN PROPÓSITO PARTICULAR. Véase la Licencia GNU Affero General Public License para más detalles.                                    ###
### Debería haber recibido una copia de la Licencia GNU Affero General Public License. Si no ha sido así, puede encontrarla en https://www.gnu.org/licenses ###
###                                             -------------  English Version  --------------                                                              ###
### This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the    ###
### Free Software Foundation, either version 3 of the License, or (at your option) any later version.                                                       ###
###                                                                                                                                                         ###
### This program is distributed in the hope that it will be useful,but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or        ###
### FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero        ###
### General Public License along with this program.  If not, see https://www.gnu.org/licenses/.                                                             ###
###                                             -----------------------------------------------                                                             ###
### Si quieres participar en la mejora de este software ,eres libre de hacerlo,                                                                             ###
### También puedes contactar con migo en el correo info@demokratian.org para trabajar en el desarrollo de forma colaborativa                                ###
###                                                                                                                                                         ###
###                                                 No puedes eliminar este aviso de licencia,                                                              ###
###                  ni el enlace con el copy que se ve al ejecutar el programa en el pie de las páginas index.php y resto de páginas.                      ###
###                                                                                                                                                         ###
###############################################################################################################################################################
#############################################################################################################################################################*/

// JavaScript Document
$(document).ready(function () {
    $("#contrasenaForm").bind("submit",function(){
        // Capturamnos el boton de envío
        var btnEnviar = $("#btnEnviar");
        $.ajax({
            type: "POST",
            //url: $(this).attr("action"),
            url: "aux_blog.php?a=procesar/procesar",
            data:$(this).serialize(),
            cache: false,
            beforeSend: function(){
                /*
                * Esta función se ejecuta durante el envió de la petición al
                * servidor.
                * */
                // btnEnviar.text("Enviando"); Para button
                //btnEnviar.val("Enviando"); // Para input de tipo button
                //btnEnviar.attr("disabled","disabled");
            },
            complete:function(data){
                /*
                * Se ejecuta al termino de la petición
                * */
                //btnEnviar.val("Enviar formulario");
                //btnEnviar.removeAttr("disabled");
            },
            success: function(data){
                /*
                * Se ejecuta cuando termina la petición y esta ha sido
                * correcta
                * */
                var result = data.trim().split("##");
                if (result[0] == 'OK') {
                    $("#divcontrasenaForm").hide("slow");
                    $('#success').html(result[1]);
                    $('#success').show();
                    $('#contactForm').trigger("reset");
                } else if (result[0] == 'ERROR') {

                    $("#success").show();
                    $('#success').html(result[1]);
                } else{
                  $("#success").show();
                  $('#success').html(data);
                }
            },
            error: function(data){
                /*
                * Se ejecuta si la peticón ha sido erronea
                * */
                $('#success').html("<div class='alert alert-danger'>");
                $('#success > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                        .append(" " +contrasenaForm+ " , hay un error</button>");
            }
        });
        // Nos permite cancelar el envio del formulario
        return false;
    });
});




/*When clicking on Full hide fail/success boxes */
$('#name').focus(function() {
    $('#success').html('');
});
