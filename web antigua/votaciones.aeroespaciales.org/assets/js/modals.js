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

/////////////////  funciones para los modales de distinto tamaño ////////////////////////
$(document).ready(function($) {
//#########  extraLargeModal  #########//
  // para la carga remota del modal
    $('.openextraLargeModal').on('click',function(){
        var  dataURL = $(this).attr('data-href');
        $('#content-extraLargeModal').load(dataURL,function(){
            $('#extraLargeModal').modal({show:true});
        });
    });

    // limpiamos la carga de modal para que no vuelva a cargar lo mismo -->
            $('#extraLargeModal').on('hidden.bs.modal', function () {
                $(this).removeData('bs.modal');
            });

//#########  largeModal  #########//
// para la carga remota del modal
    $('.openlargeModal').on('click',function(){
        var dataURL = $(this).attr('data-href');
        $('#content-largeModal').load(dataURL,function(){
            $('#largeModal').modal({show:true});
        });
    });

    // limpiamos la carga de modal para que no vuelva a cargar lo mismo -->

        $('#largeModal').on('hidden.bs.modal', function () {
            $(this).removeData('bs.modal');
        });

//#########  normalModal  #########//
// para la carga remota del modal
    $('.opennormalModal').on('click',function(){
        var dataURL = $(this).attr('data-href');
        $('#content-normalModal').load(dataURL,function(){
            $('#normalModal').modal({show:true});
        });
    });

    // limpiamos la carga de modal para que no vuelva a cargar lo mismo -->

        $('#normalModal').on('hidden.bs.modal', function () {
            $(this).removeData('bs.modal');
        });

//#########  modalAdmin  #########//
// para la carga remota del modal
    $('.openmodalAdmin').on('click',function(){
        var dataURL = $(this).attr('data-href');
        $('#content-modalAdmin').load(dataURL,function(){
            $('#modalAdmin').modal({show:true});
        });
    });

    // limpiamos la carga de modal para que no vuelva a cargar lo mismo -->

        $('#modalAdmin').on('hidden.bs.modal', function () {
            $(this).removeData('bs.modal');
        });
});
